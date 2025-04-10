import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, CreditCard, HelpCircle } from 'lucide-react';
import '../styles/stripeCancel.css';

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
  }, []);

  // 🚨 Handle retry checkout from saved product in localStorage
  const handleRetryCheckout = async () => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const savedProduct = JSON.parse(localStorage.getItem('lastCheckedProduct') || 'null');

    console.log("🧾 Saved Cart:", savedCart);
    console.log("🧾 Saved Product:", savedProduct);

    const itemsToRetry = savedCart.length > 0
      ? savedCart.map(item => ({ 
          type: item.type,
          id: item.id,
          title: item.title,
          price: Number(item.price) * 100,
          quantity: item.quantity,
        }))
      : savedProduct
        ? [{
            id: savedProduct.bookId || savedProduct.courseId,
            title: savedProduct.title,
            price: savedProduct.price * 100,
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

  return (
    <div className="cancelled-container">
      <div className="cancelled-card">
        <div className="error-icon">
          <AlertTriangle size={50} />
        </div>
        
        <h1 className="cancelled-title">Pagamento Cancelado</h1>
        <p className="cancelled-message">
          Seu processo de pagamento foi cancelado. Nenhuma cobrança foi feita em sua conta.
        </p>
        
        <div className="cancelled-info">
          <h2>O que aconteceu?</h2>
          <p>Seu pagamento não foi concluído por um dos seguintes motivos:</p>
          <ul className="reasons-list">
            <li>O processo de pagamento foi cancelado manualmente</li>
            <li>Houve um problema com o método de pagamento</li>
            <li>A conexão expirou durante o pagamento</li>
            <li>O pagamento foi recusado pelo seu banco</li>
          </ul>
        </div>
        
        <div className="feedback-section">
          <h2>Ajude-nos a melhorar</h2>
          <p>Por favor, nos informe por que você cancelou seu pagamento:</p>
          <select 
            className="feedback-select" 
            onChange={handleReasonSelection}
            defaultValue=""
          >
            <option value="" disabled>Selecione um motivo</option>
            <option value="changed-mind">Mudei de ideia</option>
            <option value="payment-issue">Tive problemas com o método de pagamento</option>
            <option value="too-expensive">Preço muito alto</option>
            <option value="security">Preocupações com segurança</option>
            <option value="other">Outro motivo</option>
          </select>
        </div>
        
        <div className="assistance-section">
          <div className="assistance-card">
            <HelpCircle size={24} />
            <div>
              <h3>Precisa de ajuda?</h3>
              <p>Nossa equipe de suporte está disponível para ajudá-lo com qualquer problema que você possa ter encontrado.</p>
              <a href="#" className="contact-link">Contatar Suporte</a>
            </div>
          </div>
        </div>
        
        <div className="cancelled-actions">
          <Link to="/" className="back-button">
            <ArrowLeft size={18} />
            Voltar para Início
          </Link>
          <button className="retry-button" onClick={handleRetryCheckout}>
            <CreditCard size={18} />
            Tentar Novamente
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;
