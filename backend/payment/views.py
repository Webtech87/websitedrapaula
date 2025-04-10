from django.shortcuts import render, HttpResponse, redirect
from django.http import JsonResponse
from django.urls import reverse
#from product.models import Product
import stripe
from django.conf import settings
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
import json




stripe.api_key = settings.STRIPE_LIVE_SECRET_KEY


@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.headers.get("Stripe-Signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_ENDPOINT_SECRET
        )
    except ValueError as e:
        print("Ошибка ValueError:", str(e))  # Логи о проблемах с парсингом
        return JsonResponse({"error": "Invalid payload"}, status=400)
    except stripe.error.SignatureVerificationError as e:
        print("Ошибка подписи Stripe:", str(e))  # Логи о неверной подписи
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
                        settings.EMAIL_HOST_USER,
                        [customer_email])
    else:
        print(f"New evente: {event['type']}")

    return JsonResponse({"status": "success"}, status=200)

@csrf_exempt
def payment_test(request):
    if request.method == "POST":
        print("✅ Received POST request for checkout!")
        try:
            data = json.loads(request.body)
            cart_items = data.get("cartItems", [])  # expecting a list of items

            success_url = "https://paulaserranoeducacao.pt/payment-success"
            cancel_url = "https://paulaserranoeducacao.pt/payment-cancel"

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
