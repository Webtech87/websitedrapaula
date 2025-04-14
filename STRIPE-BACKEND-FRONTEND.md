# Stripe Implementation - Backend (Django) and Frontend (React-Vite)

This documentation will help to set up a **Stripe Checkout Session** in the backend (Django) and call it in the frontend (React-Vite).  

## Backend (Django)

In your `backend/` folder create a new app called **payment**
```python
python manage.py startapp payment
```
  
This will create a new folder named `payment` with all the default Django files like `models.py`, `views.py`, etc.  
After that, don’t forget to add `payment`, to your `INSTALLED_APPS` list in your `settings.py`.  

Install `stripe`
```
pip install stripe
```

Inside your `payment/` folder, in `views.py`
```
import os
from dotenv import load_dotenv
import stripe

load_dotenv()

stripe.api_key = os.getenv('YOUR_TEST_OR_LIVE_STRIPE_KEY')
```

### Creating a Checkout Session and Stripe Webhook
Still in `views.py` create a function which will hold the **Checkout Session**  
As we are working with the possibility of the user buying **a single product** or **multiple products** through a cart, we have to retrieve all the data from the frontend and store them on a **list** (even if there is only one item in this list)
```
@csrf_exempt
def payment_test(request):
    if request.method == "POST":
        print("✅ Received POST request for checkout!")
        try:
            data = json.loads(request.body)
            cart_items = data.get("cartItems", [])  # expecting a list of items

            success_url = "https://your-frontend-url-or-custom-domain/payment-success"
            cancel_url = "https://your-frontend-url-or-custom-domain/payment-cancelled"

            line_items = []
            for item in cart_items:
                try:
                    title = item.get("title")
                    price = int(item.get("price", 0))
                    quantity = int(item.get("quantity", 1))
                    
                    if not title or price <= 0:
                        continue  # skip invalid items

                    line_items.append({
                        'price_data': {
                            'currency': 'eur',
                            'product_data': {'name': title},
                            'unit_amount': price,
                        },
                        'quantity': quantity,
                    })
                except Exception as e:
                    print("Skipping invalid cart item:", item, str(e))

            session_data = {
                'payment_method_types': ['card'],
                'line_items': line_items,
                'mode': 'payment',
                'payment_intent_data': {
                    'setup_future_usage': 'off_session'
                },
                'success_url': success_url,
                'cancel_url': cancel_url,
            }

            session = stripe.checkout.Session.create(**session_data)

            return JsonResponse({'checkout_url': session.url})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    print("❌ Invalid request method:", request.method)
    return JsonResponse({"error": "Invalid request method"}, status=400)
```

And another one to hold your **Stripe Webhook**
```
@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.headers.get("Stripe-Signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, os.getenv('STRIPE_ENDPOINT_SECRET')
        )
    except ValueError as e:
        print("ValueError occurred:", str(e))  # Logs about problems with parsing
        return JsonResponse({"error": "Invalid payload"}, status=400)
    except stripe.error.SignatureVerificationError as e:
        print("Stripe signature error:", str(e))  # Logs about incorrect signature
        return JsonResponse({"error": "Invalid signature"}, status=400)

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        customer_details = session.get("customer_details")
        customer_email = customer_details.get("email")
        payment_intent_id = session.get("payment_intent")

        if payment_intent_id:
            charges = stripe.Charge.list(payment_intent=payment_intent_id).get("data", [])
            if charges:
                receipt_url = charges[0].get("receipt_url")
                if customer_email and receipt_url:
                    subject = "Your Receipt from Our Site"
                    message = (f"Thanks for using our site. You can get your receipt clicking on link: \n {receipt_url}")
                    send_mail(
                        subject,
                        message,
                        os.getenv('EMAIL_HOST_USER'),
                        [customer_email])
    else:
        print(f"New evente: {event['type']}")

    return JsonResponse({"status": "success"}, status=200)
```
**Stripe itself** that triggers the webhook call after a successful payment.  
What connects them is:  
1. The Checkout Session you created with `stripe.checkout.Session.create(**session_data)`
2. The Stripe dashboard, where you set your webhook endpoint
3. The event type like `checkout.session.completed`

### Why using @csrf_exempt?
Django protects your site from **CSRF (Cross-Site Request Forgery)** attacks. It makes sure that any POST request coming from a browser has a special **CSRF token** to confirm it’s safe.  
When **Stripe** sends a request to your webhook (stripe_webhook), it's **not a browser** and it **doesn’t include a CSRF token**.  
So Django would block it by default.  
  
**DO NOT FORGET** to have all your environment variables stored in a `.env` file.

You can create simple `success` and `cancel` pages just for testing
```
def payment_completed(request):
    context = {
        'title': 'Pagamento concluido!',
        'success': True,
        'redirect_url': '/',
        'msg':f"Pagamento efetuado com sucesso!",
        'contact_Paula_Serrano':"paulaserranoeducacao@gmail.com"
    }
    return render(request, 'index.html', context)


def payment_canceled(request):
    context = {
        'title': 'Pagamento cancelado!',
        'redirect_url': '/',
        'msg': f"Pagamento cancelado!",
        'contact_Paula_Serrano': "paulaserranoeducacao@gmail.com"
    }

    return render(request, 'index.html', context)
```

In your `urls.py`, add the newly created routes
```
# payment/urls.py
from django.urls import path, include
from .views import payment_test, payment_canceled, payment_completed, stripe_webhook

app_name = 'payment'

urlpatterns = [
    path('', payment_test , name='payment'),  
    path('payment_completed/', payment_completed , name='payment_completed'),  
    path('payment_canceled/', payment_canceled , name='payment_canceled'),
    path('stripe/webhook/', stripe_webhook, name='stripe-webhook'),
]
```

## Frontend (React-Vite)

Install `stripe`
```
npm install @stripe/stripe-js
```

If you have your objects' data stored in a `.js` or `.ts` file, for example if you have a file `bookData.ts` with the following
```
export interface Book {
  id: number;
  image: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: "impresso" | "ebook" | "audiobook" | "bundle";
  rating: number;
  reviews: number;
  featured?: boolean;
  author: string;
  publicationDate: string;
  publisher: string;
  language: string;
  pages?: number;
  isbn?: string;
  tags: string[];
  dimensions?: string;
  weight?: string;
  format?: string;
  fileSize?: string;
  duration?: string;
  previewLink?: string;
  availability: "in-stock" | "pre-order" | "out-of-stock" | "limited";
  stock?: number;
  recommendedAge?: string;
  relatedBooks?: number[];
  bestSeller?: boolean;
  newRelease?: boolean;
  downloadUrl?: string;
}

export const books: Book[] = [
  {
    id: 1,
    image: book1,
    title: "A Criança e a Motricidade Fina",
    description: "A motricidade fina é a maneira como usamos os nossos braços, mãos e dedos. Refere-se às competências necessárias para manipular um objeto, ou seja, como usar a mão e os dedos de forma precisa, de acordo com a exigência da atividade.O desenvolvimento da motricidade fina é essencial para a interação da criança com o meio e acontece quando a criança se relaciona com objetos e usa ferramentas, por exemplo nas atividades da vida diária. Este livro foca-se no desenvolvimento da motricidade fina, nas diversas faixas etárias da infância, ilustrando a sua relação com o dia a dia da criança. Para além do desenvolvimento, explora as competências necessárias para que a motricidade fina se desenvolva sem problemas.São ainda, aconselhados equipamentos e materiais, que podem ajudar as crianças que apresentam dificuldades nesta área.",
    price: 14,
    category: "impresso",
    rating: 5,
    reviews: 28,
    featured: true,
    author: "Paula Serrano",
    publicationDate: "2016-09-15",
    publisher: "Papa-Letras",
    language: "Português",
    pages: 120,
    isbn: "9789898214591",
    tags: ["desenvolvimento infantil", "educação", "motricidade", "habilidades manuais"],
    dimensions: "172 x 245 x 7 mm",
    weight: "320g",
    availability: "in-stock",
    stock: 45,
    recommendedAge: "Educadores e pais de crianças de 2-7 anos",
    relatedBooks: [4, 3],
    bestSeller: true,
    newRelease: false
  },
]
```

Then, in the page you want to call **Stripe's Checkout Session** (for example BookDetails.tsx or Cart.tsx), add the following   
For a **single product** (BookDetails.tsx)
```
import { loadStripe } from "@stripe/stripe-js";
 
const stripePublicKey = import.meta.env.VITE_STRIPE_LIVE_OR_TEST_PUBLISHABLE_KEY;

// Optional: check if key exists to avoid silent failure
if (!stripePublicKey) {
  throw new Error("Missing Stripe publishable key. Make sure VITE_STRIPE_LIVE_OR_TEST_PUBLISHABLE_KEY is defined in your .env file.");
}

export const stripePromise = loadStripe(stripePublicKey);


const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const book = id ? books.find((book: Book) => book.id === Number(id)) : undefined;

  const [loading, setLoading] = useState(false);

  const handleBuyNow = async () => {  
    if (book) {
      try {
        const response = await fetch("https://your-backend-url/payment/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            cartItems: [
              {
                bookId: id,
                title: book.title,
                price: book.price * 100, //Stripe requires price in cents
              }
            ]
          }),
        });
  
        const data = await response.json();
  
        if (data.checkout_url) {
          window.location.href = data.checkout_url;  // ✅ Redirect to Stripe
        } else {
          console.error("Failed to create Checkout Session:", data);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
  };
}  
```
In the submit button, which makes the post call, **do not forget** to add the function calling
```
<button className="buy-button" onClick={handleBuyNow} disabled={book.availability === 'out-of-stock'}>
```
In `"https://your-backend-url/payment/"`, make sure you have set everything in your `urls.py` so the frontend make the right call to the backend.  
  
Now, for **multipe products** (Cart.tsx), the checkout function changes slightly

First, we need to `map` each product in the cart (either books or courses, in this case), and then make the call for the backend
```
const handleCheckout = async () => {        
    const flattenedCart = cart.map(item => {
        if (item.type === 'book') {
        return {
            type: 'book',
            id: item.book.id,
            title: item.book.title,
            price: Number(item.book.price) * 100,
            quantity: item.quantity,
        };
        } else {
        return {
            type: 'course',
            id: item.course.id,
            title: item.course.title,
            price: Number(item.course.price) * 100,
            quantity: item.quantity,
        };
        }
    });
    
    try {
        const response = await fetch("https://your-backend-url/payment/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            cartItems: flattenedCart,
        }),
        });
    
        const data = await response.json();
    
        if (data.checkout_url) {
        window.location.href = data.checkout_url;
        } else {
        console.error("Failed to create Checkout Session:", data);
        }
    } catch (error) {
        console.error("Error during checkout:", error);
    }
};
```
Again, **do not forget** to add the function to the button which makes the call to the backend.