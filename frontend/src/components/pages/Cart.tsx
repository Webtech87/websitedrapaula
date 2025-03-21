import React, { useState, useEffect } from "react";
import { ShoppingCart, ArrowRight } from "lucide-react";
import "../../styles/cart.css";

const Cart = () => {
    // State for empty cart by default
    const [cartItems, setCartItems] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Add a small delay to make the fade-in animation smooth
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 100);
        
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`cart-page ${isLoaded ? 'fade-in' : ''}`}>
            <div className="cart-container">
                <div className="cart-header">
                    <h1><ShoppingCart className="cart-icon" /> O teu Carrinho</h1>
                    <p className="cart-count">{cartItems.length} itens</p>
                </div>

                {cartItems.length === 0 ? (
                    <div className="cart-empty">
                        <ShoppingCart className="empty-icon" />
                        <h2>O teu carrinho está vazio</h2>
                        <p>Adiciona produtos ao teu carrinho para continuar o processo de compra.</p>
                        <button 
                            className="browse-button"
                            onClick={() => window.location.href = "/"}
                        >
                            Explorar Produtos
                        </button>
                    </div>
                ) : (
                    // This part would render cart items if there were any
                    <div>Cart items would go here</div>
                )}

                {/* Always show the cart summary and checkout options */}
                <div className="cart-summary">
                    <h3 className="summary-header">Resumo do Pedido</h3>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>€0.00</span>
                    </div>
                    <div className="summary-row">
                        <span>Portes de envio</span>
                        <span>€0.00</span>
                    </div>
                    <div className="summary-total">
                        <span>Total</span>
                        <span>€0.00</span>
                    </div>
                    <button 
                        className="checkout-button"
                        disabled={cartItems.length === 0}
                        onClick={() => console.log("Proceed to checkout")}
                    >
                        Finalizar Compra
                        <ArrowRight size={18} />
                    </button>
                </div>

                <button 
                    className="continue-shopping"
                    onClick={() => window.location.href = "/"}
                >
                    Continuar Comprando
                </button>
            </div>
        </div>
    );
};

export default Cart;