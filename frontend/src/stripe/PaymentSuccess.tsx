import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, CreditCard, ShoppingBag } from 'lucide-react';
import '../styles/stripeSuccess.css';
import {useTranslation} from "react-i18next";

const PaymentSuccess: React.FC = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Show confetti animation
    const confettiElements = document.querySelectorAll('.confetti');
    confettiElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('active');
      }, index * 100);
    });

    // Track payment success event
    console.log('Payment success page viewed');
  }, []);

  const {t} = useTranslation();

  return (
    <div className="success-container">
      <div className="confetti-container">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="confetti" style={{ 
            left: `${Math.random() * 100}%`, 
            animationDelay: `${Math.random() * 5}s` 
          }} />
        ))}
      </div>
      
      <div className="success-card">
        <div className="success-icon">
          <Check size={50} />
        </div>
        
        <h1 className="success-title">{t("payment_success.title")}</h1>
        <p className="success-message">{t("payment_confirm_p")}
        </p>
        
        <div className="order-details">
          <h2>{t("order_details_h2")}</h2>
          <div className="detail-row">
            <span>{t("order_number_sp")}</span>
            <span>#{Math.floor(100000 + Math.random() * 900000)}</span>
          </div>
          <div className="detail-row">
            <span>{t("date_sp")}</span>
            <span>{new Date().toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="detail-row">
            <span>{t("payment_method_sp")}</span>
            <span>{t("credit_card_sp")} <CreditCard size={16} /></span>
          </div>
        </div>
        
        <div className="next-steps">
          <h2>{t("next_steps_h2")}</h2>
          <ul className="steps-list">
            <li>{t("confirmation_email_li")}</li>
            <li>{t("contact_support_team_li")}</li>
          </ul>
        </div>
        
        <div className="success-actions">
          <Link to="/" className="home-button">
            <ShoppingBag size={18} />
            {t("keep_shopping_btn")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
