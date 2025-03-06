import React from 'react';
import "../../styles/cart.css"; 
   

   
   
const Cart = () => {
    return (
      <div className="cart-container">
        <h1>O teu Carrinho</h1>
        {/* Add cart items here */}
        <div className="cart-item">
          <div className="item-details">
            <img src="path/to/item-image.jpg" alt="Item Name" />
            <div className="item-name">Item Name</div>
          </div>
          <div className="item-price">€100</div>
        </div>
        {/* Add more cart items as needed */}
        <button className="checkout-button">Finalizar Compra</button>
      </div>
    );
  };
  
  export default Cart;