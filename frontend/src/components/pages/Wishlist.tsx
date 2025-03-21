import React, { useState } from "react";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import "../../styles/wishlist.css";

const Wishlist = () => {
    // Start with an empty wishlist by default
    const [wishlistItems, setWishlistItems] = useState([]);

    // For handling the removal of items (even though none exist yet)
    const removeFromWishlist = (id: number) => {
        setWishlistItems(wishlistItems.filter(item => item.id !== id));
    };

    // Placeholder function for adding to cart
    const addToCart = (id: number) => {
        console.log(`Item ${id} added to cart`);
        // Here you would integrate with your cart functionality
    };

    return (
        <div className="wishlist-page">
            <div className="wishlist-container">
                <div className="wishlist-header">
                    <h1><Heart className="wishlist-icon" /> Minha Lista de Desejos</h1>
                    <p className="wishlist-count">{wishlistItems.length} itens</p>
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="wishlist-empty">
                        <Heart className="empty-icon" />
                        <h2>Sua lista de desejos está vazia</h2>
                        <p>Adicione itens à sua lista de desejos para encontrá-los aqui mais tarde.</p>
                        <button 
                            className="browse-button"
                            onClick={() => window.location.href = "/"}
                        >
                            Explorar Produtos
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="wishlist-items">
                            {wishlistItems.map((item) => (
                                <div key={item.id} className="wishlist-item">
                                    <div className="wishlist-item-image">
                                        <img src={item.image} alt={item.title} />
                                        <span className="item-category">{item.category}</span>
                                    </div>
                                    <div className="wishlist-item-content">
                                        <h3>{item.title}</h3>
                                        <p className="item-description">{item.description}</p>
                                        <p className="item-price">{item.price}</p>
                                        
                                        <div className="wishlist-item-actions">
                                            <button 
                                                className="add-to-cart-button"
                                                onClick={() => addToCart(item.id)}
                                            >
                                                <ShoppingCart size={18} />
                                                Adicionar ao Carrinho
                                            </button>
                                            <button 
                                                className="remove-button"
                                                onClick={() => removeFromWishlist(item.id)}
                                            >
                                                <Trash2 size={18} />
                                                Remover
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="wishlist-footer">
                            <button className="continue-shopping" onClick={() => window.location.href = "/"}>
                                Continuar Comprando
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
