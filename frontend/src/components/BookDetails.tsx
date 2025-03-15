import React from "react";
import { useParams } from "react-router-dom";
import { books } from "../bookData";
import "../styles/pages/bookDetails.css";

const BookDetails = () => {
  const { id } = useParams<{ id: string }>(); // Type id as string
  const bookId = parseInt(id || "", 10); // Convert to number

  // Check if the ID is valid
  if (isNaN(bookId) || bookId < 1 || bookId > books.length) {
    return <div className="book-not-found">Livro não encontrado</div>;
  }

  // Find the book by ID (array is 0-indexed, but IDs start at 1)
  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return <div className="book-not-found">Livro não encontrado</div>;
  }

  // Placeholder functions for button actions
  const handleAddToCart = () => {
    console.log(`${book.title} adicionado ao carrinho`);
  };

  const handleAddToWishlist = () => {
    console.log(`${book.title} adicionado à lista de desejos`);
  };

  return (
    <div className="book-details">
      <img src={book.image} alt={book.title} className="book-image" />
      <div className="book-info">
        <h2>{book.title}</h2>
        <p>{book.description}</p>
        <p className="book-price">Preço: R${book.price.toFixed(2)}</p>
        <div className="book-actions">
          <button onClick={handleAddToCart} className="add-to-cart">
            Adicionar ao Carrinho
          </button>
          <button onClick={handleAddToWishlist} className="add-to-wishlist">
            ❤️ Adicionar à Lista de Desejos
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;