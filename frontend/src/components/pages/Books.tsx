import "../../styles/pages/books.css";
import { ShoppingBag } from "lucide-react";

// Sample book data (replace with actual image paths)
import book1 from "../../assets/courses/book1.png";
import book2 from "../../assets/courses/book2.png";
import book3 from "../../assets/courses/book3.png";
import book4 from "../../assets/courses/book4.png";



const books = [
  { image: book1, title: "A criança e a Motricidade Fina", price: "14,91 €" },
  { image: book2, title: "Brincar e Integração Sensorial nos Primeiros Anos", price: "14,91 €" },
  { image: book3, title: "A Integração Sensorial", price: "14,91 €" },
  { image: book4, title: "O Desenvolvimento da Autonomia dos 0 aos 3 anos", price: "14,91 €" },
];

const Books = () => {
  return (
    <section className="books">
      <h2>Livros e eBooks</h2>
      <p>Aproveite agora – descontos exclusivos por tempo limitado</p>

      <div className="books-container">
        {books.map((book, index) => (
          <div className="book-card" key={index}>
            <img src={book.image} alt={book.title} className="book-image" />
            <h3 className="book-title">{book.title}</h3>
            <p className="book-price">{book.price}</p>
            <button className="add-to-cart">
              Adicionar ao Carrinho <ShoppingBag />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Books;
