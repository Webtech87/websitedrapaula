import React, { useEffect } from 'react';
import { AlertTriangle, CreditCard, HelpCircle } from 'lucide-react';
import '../styles/stripeCancel.css';
import { useTranslation } from 'react-i18next';

const getWithExpiry = (key: string) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return item.value;
};

const PaymentCancelled: React.FC = () => {

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Animate the error icon
    const errorIcon = document.querySelector('.error-icon');
    if (errorIcon) {
      errorIcon.classList.add('animated');
    }

    // Track cancellation event
    console.log('Página de pagamento cancelado visualizada');

    // Check and remove expired items
    const cart = getWithExpiry('cart');
    const product = getWithExpiry('lastCheckedProduct');

    if (!cart && !product) {
      // Show alert when both cart and product are expired or unavailable
      alert(t("alert_session_expired"));
    }

    // Optional: Schedule cleanup anyway after 2 minutes
    const cleanupTimer = setTimeout(() => {
      localStorage.removeItem('cart');
      localStorage.removeItem('lastCheckedProduct');
      console.log("🧹 localStorage cleaned after 2 minutes");
    }, 300000);

    return () => clearTimeout(cleanupTimer); // Clean up on unmount
  }, []);

  // 🚨 Handle retry checkout from saved product in localStorage
  const handleRetryCheckout = async () => {
    // Use getWithExpiry to check expiration and retrieve only valid data
    const savedCart = getWithExpiry('cart');  // Will return null if expired
    const savedProduct = getWithExpiry('lastCheckedProduct');  // Will return null if expired

    if (!savedCart && !savedProduct) {
      // Show alert when both cart and product are expired or unavailable
      alert('Sua sessão expirou. Por favor, inicie o processo de compra novamente.');
    }
  
    console.log("🧾 Saved Cart:", savedCart);
    console.log("🧾 Saved Product:", savedProduct);
  
    const itemsToRetry = savedCart && savedCart.length > 0
      ? savedCart.map(item => ({
          type: item.type,
          id: item.id,
          title: item.title,
          price: Number(item.price),
          quantity: item.quantity,
        }))
      : savedProduct
      ? [{
          id: savedProduct.bookId || savedProduct.courseId,
          title: savedProduct.title,
          price: savedProduct.price * 100,  // Stripe expects price in cents
          quantity: 1,
        }]
      : [];


    console.log("➡️ itemsToRetry:", itemsToRetry);

    try {
      // Send saved product data to backend to create a new checkout session
      const response = await fetch("https://websitedrapaula-v2.onrender.com/payment/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems: itemsToRetry,
        }),
      });

      const data = await response.json();

      if (data.checkout_url) {
        window.location.href = data.checkout_url;  // ✅ Redirect to Stripe checkout
      } else {
        console.error("Failed to create Checkout Session:", data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleReasonSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('Motivo do cancelamento:', event.target.value);
  };


  const {t} = useTranslation();


  return (
    <div className="cancelled-container">
      <div className="cancelled-card">
        <div className="error-icon">
          <AlertTriangle size={50} />
        </div>
        
        <h1 className="cancelled-title">{t("payment_cancelled.title")}</h1>
        <p className="cancelled-message">
          {t("cancelled_message_p")}
        </p>
        
        <div className="cancelled-info">
          <h2>{t("what_happened_h2")}</h2>
          <p>{t("payment_reasons_p")}</p>
          <ul className="reasons-list">
            <li>{t("cancelled_manually_li")}</li>
            <li>{t("issue_payment_method_li")}</li>
            <li>{t("connection_time_li")}</li>
            <li>{t("declined_by_bank_li")}</li>
          </ul>
        </div>
        
        <div className="feedback-section">
          <h2>{t("help_us_improve_h2")}</h2>
          <p>{t("why_cancelled_p")}</p>
          <select 
            className="feedback-select" 
            onChange={handleReasonSelection}
            defaultValue=""
          >
            <option value="" disabled>{t("select_reason_opt")}</option>
            <option value="changed-mind">{t("changed_mind_opt")}</option>
            <option value="payment-issue">{t("issues_payment_opt")}</option>
            <option value="too-expensive">{t("price_high_opt")}</option>
            <option value="security">{t("security_concerns_opt")}</option>
            <option value="other">{t("other_reason_opt")}</option>
          </select>
        </div>
        
        <div className="assistance-section">
          <div className="assistance-card">
            <HelpCircle size={24} />
            <div>
              <h3>{t("need_help_h3")}</h3>
              <p>{t("our_support_team_p")}</p>
              <a href="#" className="contact-link">{t("contact_support_a")}</a>
            </div>
          </div>
        </div>
        
        <div className="cancelled-actions">
          <button className="retry-button" onClick={handleRetryCheckout}>
            <CreditCard size={18} />
            {t("try_again_btn")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;