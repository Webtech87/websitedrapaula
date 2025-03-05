import React from "react";
import "../../styles/wishlist.css";

const Wishlist = () => {
    // Example wishlist items
    const wishlistItems = [
        {
            id: 1,
            title: "Product 1",
            description: "This is a description for product 1.",
            image: "https://via.placeholder.com/250",
        },
        {
            id: 2,
            title: "Product 2",
            description: "This is a description for product 2.",
            image: "https://via.placeholder.com/250",
        },
        {
            id: 3,
            title: "Product 3",
            description: "This is a description for product 3.",
            image: "https://via.placeholder.com/250",
        },
    ];

    return (
        <div className="wishlist-container">
            <h1 className="wishlist-header">My Wishlist</h1>
            <div className="wishlist-items">
                {wishlistItems.map((item) => (
                    <div key={item.id} className="wishlist-item">
                        <img src={item.image} alt={item.title} />
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                        <button>Remove from Wishlist</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;