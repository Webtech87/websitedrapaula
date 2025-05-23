import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { books, Book } from '../../bookData';
import '../../styles/pages/bookDetails.css';
import { Star, ChevronLeft, ShoppingCart, Heart, AlertCircle, BookOpen, Check, X, ExternalLink } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useTranslation, Trans } from 'react-i18next';

import ptFlag from "../../assets/flag-pt.png"
import brFlag from "../../assets/flag-br.png"

//Stripe import
import { loadStripe } from "@stripe/stripe-js";
 
// Get the publishable key from Vite env variables
const stripePublicKey = import.meta.env.VITE_STRIPE_LIVE_PUBLISHABLE_KEY;

// Optional: check if key exists to avoid silent failure
if (!stripePublicKey) {
  throw new Error("Missing Stripe publishable key. Make sure VITE_STRIPE_LIVE_PUBLISHABLE_KEY is defined in your .env file.");
}

// Load Stripe with the publishable key
export const stripePromise = loadStripe(stripePublicKey);


const BookDetails = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [user, setUser] = useState<boolean>(true); // Replace with actual auth check
  
  const book = id ? books.find((book: Book) => book.id === Number(id)) : undefined;
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  
  // Toast notification states
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  
  const [imageLoaded, setImageLoaded] = useState(false);

  const [loading, setLoading] = useState(false); //for Stripe

  // ✅ Utility to store data with expiry
  const setWithExpiry = (key: string, value: any, ttl: number) => {
    const now = new Date();
    const item = {
      value,
      expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (book) {
      // Check if book is in wishlist with type 'book'
      setIsWishlisted(isInWishlist(book.id, 'book'));
    }
  }, [book, isInWishlist]);

  // Add effect to automatically hide toast after delay
  useEffect(() => {
    let timer: number;
    if (showToast) {
      timer = window.setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showToast]);

  // New function to show toast notifications
  const displayToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleWishlist = () => {
    if (!user) {
      navigate('/login');
      displayToast('Por favor, faça login para adicionar à lista de desejos', 'info');
      return;
    }

    if (book) {
      if (isWishlisted) {
        // Explicitly specify the type as 'book'
        removeFromWishlist(book.id, 'book');
        displayToast(t("remove_book_wishlist"), 'success');
      } else {
        // Explicitly specify the type as 'book'
        addToWishlist(book.id, 'book');
        displayToast(t("add_book_wishlist"), 'success');
      }
      setIsWishlisted(!isWishlisted);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      displayToast('Por favor, faça login para adicionar ao carrinho', 'info');
      return;
    }

    if (book) {
      // Use the updated addToCart with itemType parameter
      addToCart(book, 'book');
      setIsAddedToCart(true);
      displayToast(t("add_book_cart"), 'success');
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      navigate('/login');
      displayToast('Por favor, faça login para finalizar a compra', 'info');
      return;
    }

    if (book) {
      setWithExpiry("lastCheckedProduct", {
        bookId: id,
        title: book?.title,
        price: book?.price,
      }, 300000); // ✅ 5 minutes = 300000 ms

      console.log("Saved product to localStorage:", JSON.parse(localStorage.getItem("lastCheckedProduct") || 'null'));

      const currentLanguage = i18n.language;

      try {
        const response = await fetch("https://websitedrapaula-v2.onrender.com/payment/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            cartItems: [
              {
                bookId: id,
                title: book.title,
                price: book.price * 100,
                //subscription: true, for Stripe
              }
            ],
            language: currentLanguage,
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

  // Handle external purchase at Zamboni Books
  const handleExternalPurchase = () => {
    // Open zambonibooks in a new tab
    window.open('https://www.zambonibooks.com.br', '_blank');
    displayToast('Redirecionando para Zamboni Books...', 'info');
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!book) {
    return (
      <div className="book-details-container book-not-found">
        <div className="not-found-content">
          <AlertCircle size={48} className="not-found-icon" />
          <h1 className="text-2xl font-bold mb-2">Livro não encontrado</h1>
          <p className="text-muted-foreground mb-4">Desculpe, não conseguimos encontrar o livro que procura.</p>
          <Link to="/" className="back-button inline-flex items-center px-4 py-2 rounded-full bg-primary text-primary-foreground">
            <ChevronLeft size={16} />
            Voltar aos Livros
          </Link>
        </div>
      </div>
    );
  }

  const getAvailabilityInfo = (status: string) => {
    switch (status) {
      case 'in-stock':
        return { text: 'Em Stock', color: 'text-green-600' };
      case 'limited':
        return { text: 'Stock Limitado', color: 'text-amber-600' };
      case 'pre-order':
        return { text: 'Pré-encomenda', color: 'text-blue-600' };
      case 'out-of-stock':
        return { text: 'Esgotado', color: 'text-red-600' };
      default:
        return { text: 'Indisponível', color: 'text-gray-600' };
    }
  };

  const availability = getAvailabilityInfo(book.availability);
  
  return (
    <div className="book-details-container">
      {/* Toast Notification */}
      {showToast && (
        <div className={`toast-notification ${toastType}`}>
          <div className="toast-content">
            {toastType === 'success' && <Check size={18} className="toast-icon" />}
            {toastType === 'error' && <X size={18} className="toast-icon" />}
            {toastType === 'info' && <AlertCircle size={18} className="toast-icon" />}
            <span>{toastMessage}</span>
          </div>
          <button 
            className="toast-close" 
            onClick={() => setShowToast(false)}
            aria-label="Fechar notificação"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="book-details-header">
        <Link to="/#livros" className="back-button">
          <ChevronLeft size={16} />
          <span>{t("back")}</span>
        </Link>
        <h1 className="book-title">{t(`book.${book.id}.title`)}</h1>
      </div>

      <div className="book-details-content">
        <div className="book-details-image-container">
          <div className="relative w-full h-full overflow-hidden rounded-2xl">
            <div className={`image-loading-placeholder ${imageLoaded ? 'hidden' : 'visible'}`}></div>
            <img
              src={book.image}
              alt={book.title}
              className={`book-details-image ${imageLoaded ? 'loaded' : ''}`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          {book.featured && <div className="featured-badge">Destaque</div>}
          {book.discount && <div className="discount-badge">{book.discount}% OFF</div>}
          <button
            className={`wishlist-button ${isWishlisted ? 'wishlisted' : ''}`}
            onClick={handleWishlist}
            aria-label={isWishlisted ? 'Remover da lista de desejos' : 'Adicionar à lista de desejos'}
          >
            <Heart size={20} className={isWishlisted ? 'fill-current' : ''} />
          </button>
        </div>

        <div className="book-details-info">
          <div className="book-details-main">
            <div className="badge-container">
              <div className="book-category-badge">
                <BookOpen size={14} />
                <span>{book.category === 'ebook' ? 'eBook' : book.category.charAt(0).toUpperCase() + book.category.slice(1)}</span>
              </div>

              {book.newRelease && (
                <div className="new-release-badge">
                  {t(`book.${book.id}.newRelease`)}
                </div>
              )}

              {book.bestSeller && (
                <div className="bestseller-badge">
                  {t(`book.${book.id}.bestSeller`)}
                </div>
              )}
            </div>

            <div className="book-rating">
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < Math.floor(book.rating) ? "star filled" : i < book.rating ? "star half-filled" : "star"}
                    fill={i < Math.floor(book.rating) ? "currentColor" : i < book.rating ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <span className="rating-count">{book.reviews} {t(`book.${book.id}.reviews.title`)}</span>
            </div>

            <div className="book-details-price">
              <div className="price-current">€{book.price.toFixed(2)}</div>
              {book.originalPrice && (
                <div className="price-original">€{book.originalPrice.toFixed(2)}</div>
              )}
              {book.discount && (
                <div className="discount-text">
                  Poupa {book.discount}%
                </div>
              )}
            </div>

            <div className="book-description-container">
              <h2 className="section-title">{t(`book.${book.id}.about_book`)}</h2>
              <p className="book-description">{t(`book.${book.id}.description`)}</p>
            </div>

            <div className="book-details-meta">
              <div className="meta-item">
                <span className="meta-label">{t(`book.${book.id}.author.title`)}</span>
                <span className="meta-value">{book.author}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">{t(`book.${book.id}.publicationDate.title`)}</span>
                <span className="meta-value">{t(`book.${book.id}.publicationDate.date`)}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">{t(`book.${book.id}.language.title`)}</span>
                <span className="meta-value">{t(`book.${book.id}.language.lng`)}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">{t(`book.${book.id}.publisher.title`)}</span>
                <span className="meta-value">{book.publisher}</span>
              </div>
              {book.pages && (
                <div className="meta-item">
                  <span className="meta-label">{t(`book.${book.id}.pages.title`)}</span>
                  <span className="meta-value">{book.pages}</span>
                </div>
              )}
              {book.format && (
                <div className="meta-item">
                  <span className="meta-label">{t(`book.${book.id}.format.title`)}</span>
                  <span className="meta-value">{t(`book.${book.id}.format.res`)}</span>
                </div>
              )}
              {book.fileSize && (
                <div className="meta-item">
                  <span className="meta-label">{t(`book.${book.id}.fileSize.title`)}</span>
                  <span className="meta-value">{book.fileSize}</span>
                </div>
              )}
              <div className="meta-item">
                <span className="meta-label">{t(`book.${book.id}.availability.title`)}</span>
                <span className={`meta-value availability-${book.availability}`}>
                  {t(`book.${book.id}.availability.res`)}
                </span>
              </div>
            </div>

            <div className="book-actions">
              <div className="buttons-container">
                <button
                  className={`cart-button ${isAddedToCart ? 'added' : ''}`}
                  onClick={handleAddToCart}
                  disabled={isAddedToCart || book.availability === 'out-of-stock'}
                >
                  <ShoppingCart size={18} />
                  <span>{isAddedToCart ? t("has_been_add_to_cart") : t("add_to_cart")}</span>
                </button>
                <button
                  className="buy-button"
                  onClick={handleBuyNow}
                  disabled={book.availability === 'out-of-stock'}
                >
                  <span><img src={ptFlag} alt="pt" width="20" /></span>
                  <span>{t("buy_button")}</span>
                </button>
                <button
                  className="external-buy-button"
                  onClick={handleExternalPurchase}
                  aria-label="Comprar na Zamboni Books"
                >
                  <span><img src={brFlag} alt="br" width="20" /></span>
                  <span>{t("zomboni")}</span>
                </button>
              </div>
              <p className="exclusive-sale-message">
                <Trans
                  i18nKey="book_botton_atention"
                  components={{
                    ptFlag: <img src={ptFlag} alt="Portugal flag" width="20" style={{ display: "inline", verticalAlign: "middle" }} />,
                  }}
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;