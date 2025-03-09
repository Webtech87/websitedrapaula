import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/pages/books.css";

// Sample book data (replace with actual image paths)
import book1 from "../../assets/courses/image1.png";
import book2 from "../../assets/courses/image3.png";
import book3 from "../../assets/courses/image2.png";
import book4 from "../../assets/courses/image4.jpg";

const books = [
  { image: book1, title: "A criança e a Motricidade Fina" },
  { image: book2, title: "Brincar e Integração Sensorial nos Primeiros Anos" },
  { image: book3, title: "A Integração Sensorial" },
  { image: book4, title: "O Desenvolvimento da Autonomia dos 0 aos 3 anos" },
];

const Books = () => {
  const [loadedImages, setLoadedImages] = useState<number[]>([]);
  const [isTextVisible, setIsTextVisible] = useState(false);

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => [...prev, index]);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsTextVisible(true), 200); // Delay for fade-in
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="books">
      <h2 className={isTextVisible ? "fade-in" : ""}>Livros e eBooks</h2>
      <br />
      <p className={isTextVisible ? "fade-in" : ""}>
        Aproveite agora – descontos exclusivos por tempo limitado
      </p>
      <div className="books-container">
        {books.map((book, index) => (
          <div key={index} className="book-wrapper">
            <Link to={`/book/${index}`} className="book-link">
              <div className="book-card">
                <img
                  src={book.image}
                  alt={book.title}
                  className={`book-image ${loadedImages.includes(index) ? "loaded" : ""}`}
                  onLoad={() => handleImageLoad(index)}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            </Link>
            <h3 className="book-title">{book.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Books;