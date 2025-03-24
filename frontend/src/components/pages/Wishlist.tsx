import React, { useState, useEffect } from "react";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import "../../styles/wishlist.css";

const Wishlist = () => {
    // Start with an empty wishlist by default
    interface WishlistItem {
        id: number;
        // Add other properties as needed, e.g., name, price, etc.
    }

    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Add a small delay to make the fade-in animation more noticeable
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 100);
        
        return () => clearTimeout(timer);
    }, []);

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
        <div className={`wishlist-page ${isLoaded ? 'fade-in' : ''}`}>
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
                    <div className="wishlist-items">
                        {wishlistItems.map(item => (
                            <div key={item.id} className="wishlist-item">
                                <p>Item {item.id}</p>
                                <button onClick={() => addToCart(item.id)}>
                                    <ShoppingCart /> Adicionar ao Carrinho
                                </button>
                                <button onClick={() => removeFromWishlist(item.id)}>
                                    <Trash2 /> Remover
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;