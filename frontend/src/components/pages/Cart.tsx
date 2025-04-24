import React, { useState, useEffect } from "react";
import { ShoppingCart, ArrowRight, X, Plus, Minus, BookOpen, GraduationCap } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import "../../styles/cart.css";
import { useTranslation } from "react-i18next";

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

// ✅ Utility to store data with expiry
const setWithExpiry = (key: string, value: any, ttl: number) => {
    const now = new Date();
    const item = {
        value,
        expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
};

const Cart = () => {
    const { t, i18n } = useTranslation();
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
    const [isLoaded, setIsLoaded] = useState(false);

    const [loading, setLoading] = useState(false); //for Stripe

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    // Calculate totals
    const subtotal = cart.reduce((total, item) => {
        if (item.type === 'book') {
            return total + (item.book.price * item.quantity);
        } else if (item.type === 'course') {
            // Handle price which could be string or number
            let priceNum;
            if (typeof item.course.price === 'string') {
                // Parse the price string to get a number (assuming format like "€100")
                priceNum = parseFloat(item.course.price.replace(/[^0-9.-]+/g, ""));
            } else {
                priceNum = item.course.price;
            }
            return total + (priceNum * item.quantity);
        }
        return total;
    }, 0);
    
    const shipping = subtotal > 50 ? 0 : 3.99; // Free shipping over €50
    const total = subtotal + shipping;

    const handleQuantityChange = (itemId: number, itemType: 'book' | 'course', change: number) => {
        let currentItem;
        
        if (itemType === 'book') {
            currentItem = cart.find(i => i.type === 'book' && 'book' in i && i.book.id === itemId);
        } else {
            currentItem = cart.find(i => i.type === 'course' && 'course' in i && i.course.id === itemId);
        }
        
        if (!currentItem) return;
        
        const newQuantity = currentItem.quantity + change;
        if (newQuantity < 1) {
            removeFromCart(itemId, itemType);
        } else {
            updateQuantity(itemId, itemType, newQuantity);
        }
    };

    // Helper function to get price for display
    const getItemPrice = (item: any) => {
        if (item.type === 'book') {
            return `€${item.book.price.toFixed(2)}`;
        } else if (item.type === 'course') {
            if (typeof item.course.price === 'string') {
                return item.course.price;
            } else {
                return `€${item.course.price.toFixed(2)}`;
            }
        }
        return "€0.00";
    };

    // Helper function to calculate item total
    const getItemTotal = (item: any) => {
        if (item.type === 'book') {
            return `€${(item.book.price * item.quantity).toFixed(2)}`;
        } else if (item.type === 'course') {
            let priceNum;
            if (typeof item.course.price === 'string') {
                priceNum = parseFloat(item.course.price.replace(/[^0-9.-]+/g, ""));
            } else {
                priceNum = item.course.price;
            }
            return `€${(priceNum * item.quantity).toFixed(2)}`;
        }
        return "€0.00";
    };

    const handleCheckout = async () => {        
        const flattenedCart = cart.map(item => {
          if (item.type === 'book') {
            return {
              type: 'book',
              id: item.book.id,
              title: item.book.title,
              price: Number(item.book.price) * 100, // Stripe expects cents
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

        // Save the entire cart in localStorage using setWithExpiry
        setWithExpiry("cart", flattenedCart, 300000); // Set expiry time for 5 minutes (300000 ms)

        console.log("🧾 Saved Cart:", flattenedCart);
      
        const currentLanguage = i18n.language;

        try {
          const response = await fetch("https://websitedrapaula-v2.onrender.com/payment/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
              cartItems: flattenedCart,
              language: currentLanguage,
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

    return (
        <div className={`cart-page ${isLoaded ? 'fade-in' : ''}`}>
            <div className="cart-container">
                <div className="cart-header">
                    <div className="header-content">
                        <h1>
                            <ShoppingCart className="cart-icon" /> 
                            {t("cart.title")}
                            <span className="item-count-badge">
                                {cart.reduce((sum, item) => sum + item.quantity, 0)}
                            </span>
                        </h1>
                        {cart.length > 0 && (
                            <button 
                                className="clear-cart-btn"
                                onClick={clearCart}
                            >
                                <X size={16} /> Limpar Carrinho
                            </button>
                        )}
                    </div>
                </div>

                {cart.length === 0 ? (
                    <div className="cart-empty">
                        <div className="empty-icon-container">
                            <BookOpen size={48} className="empty-icon" />
                        </div>
                        <h2>{t("cart.empty_list")}</h2>
                        <p>{t("cart.p")}</p>
                        <Link to="/" className="browse-button">
                            {t("cart.button")}
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="cart-items">
                            {cart.map((item, index) => (
                                <div key={index} className="cart-item">
                                    <div className="item-image-container">
                                        {item.type === 'book' ? (
                                            <img 
                                                src={item.book.image} 
                                                alt={item.book.title} 
                                                className="item-image"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <img 
                                                src={item.course.image} 
                                                alt={item.course.title} 
                                                className="item-image"
                                                loading="lazy"
                                            />
                                        )}
                                    </div>
                                    <div className="item-details">
                                        <div className="item-type-badge">
                                            {item.type === 'book' ? (
                                                <>
                                                    <BookOpen size={12} />
                                                    <span>Livro</span>
                                                </>
                                            ) : (
                                                <>
                                                    <GraduationCap size={12} />
                                                    <span>Curso</span>
                                                </>
                                            )}
                                        </div>
                                        <h3 className="item-title">
                                            {item.type === 'book' ? item.book.title : item.course.title}
                                        </h3>
                                        <p className="item-author">
                                            {item.type === 'book' ? item.book.author : item.course.instructor}
                                        </p>
                                        <div className="item-price">{getItemPrice(item)}</div>
                                    </div>
                                    <div className="item-quantity-controls">
                                        <button 
                                            className="quantity-btn"
                                            onClick={() => handleQuantityChange(
                                                item.type === 'book' ? item.book.id : item.course.id,
                                                item.type,
                                                -1
                                            )}
                                            aria-label="Diminuir quantidade"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="quantity-value">{item.quantity}</span>
                                        <button 
                                            className="quantity-btn"
                                            onClick={() => handleQuantityChange(
                                                item.type === 'book' ? item.book.id : item.course.id,
                                                item.type,
                                                1
                                            )}
                                            aria-label="Aumentar quantidade"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <div className="item-total">
                                        {getItemTotal(item)}
                                    </div>
                                    <button 
                                        className="item-remove"
                                        onClick={() => removeFromCart(
                                            item.type === 'book' ? item.book.id : item.course.id,
                                            item.type
                                        )}
                                        aria-label="Remover item"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <h3 className="summary-header">Resumo do Pedido</h3>
                            <div className="summary-row">
                                <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} itens)</span>
                                <span>€{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Portes de envio</span>
                                <span className={shipping === 0 ? "free-shipping" : ""}>
                                    {shipping === 0 ? 'Grátis' : `€${shipping.toFixed(2)}`}
                                </span>
                            </div>
                            {shipping > 0 && subtotal < 50 && (
                                <div className="shipping-notice">
                                    Adicione mais €{(50 - subtotal).toFixed(2)} para envio grátis!
                                </div>
                            )}
                            <div className="summary-total">
                                <span>Total</span>
                                <span className="total-price">€{total.toFixed(2)}</span>
                            </div>
                            <button 
                                className="checkout-button"
                                onClick={handleCheckout}
                            >
                                {
                                    t("cart.buy")
                                }
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </>
                )}

                <Link to="/" className="continue-shopping">
                    {t("cart.bottom_button")}
                </Link>
                
            </div>
        </div>
    );
};

export default Cart;