import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "../../styles/pages/books.css";
import { books } from "../../bookData";
import { ChevronRight, Star, Search } from "lucide-react";
import debounce from "lodash/debounce";

const Books = ({ id }: { id: string }) => {
  const [loadedImages, setLoadedImages] = useState<number[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [hoveredBook, setHoveredBook] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const bookContainerRef = useRef<HTMLDivElement>(null);

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => [...prev, index]);
  };

  const debouncedSearch = useCallback(debounce((value: string) => setSearchQuery(value), 300), []);

  const filteredBooks = books
    .filter((book) => (activeFilter === "all" ? true : book.category === activeFilter))
    .filter((book) =>
      searchQuery.trim() ? book.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
    );

  const filters = [
    { id: "all", label: "Todos" },
    { id: "ebook", label: "eBooks" },
    { id: "printed", label: "Impressos" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );

    const bookItems = document.querySelectorAll(".book-wrapper");
    bookItems.forEach((item) => observer.observe(item));

    return () => bookItems.forEach((item) => observer.unobserve(item));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <section id={id} className="books">
        <div className="books-header">
          <div className="title-container">
            <h2 className="section-title">Livros e eBooks</h2>
            <p className="section-subtitle">Aproveite agora – descontos exclusivos por tempo limitado</p>
          </div>
          <div className="search-container">
            <div className="search-wrapper">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Buscar livros..."
                onChange={(e) => debouncedSearch(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>

        <div className="filter-container">
          <div className="books-filter">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`filter-button ${activeFilter === filter.id ? "active" : ""}`}
                aria-label={`Filtrar por ${filter.label}`}
                aria-pressed={activeFilter === filter.id}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="books-container" ref={bookContainerRef}>
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div
                key={book.id}
                className="book-wrapper"
                onMouseEnter={() => setHoveredBook(book.id)}
                onMouseLeave={() => setHoveredBook(null)}
              >
                <Link to={`/book/${book.id}`} className="book-link">
                  <div className="book-card">
                    <div className="image-container">
                      <img
                        src={book.image}
                        alt={book.title}
                        className={`book-image ${loadedImages.includes(book.id) ? "loaded" : ""}`}
                        onLoad={() => handleImageLoad(book.id)}
                        onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
                      />
                      {!loadedImages.includes(book.id) && (
                        <div className="image-placeholder">
                          <div className="loader"></div>
                        </div>
                      )}
                    </div>
                    {book.discount && (
                      <div className="book-discount">
                        <span>{book.discount}% OFF</span>
                      </div>
                    )}
                    <div className="book-info">
                      <h3 className="book-title">{book.title}</h3>
                      <div className="book-rating">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < (book.rating || 0) ? "star filled" : "star"}
                          />
                        ))}
                        {book.rating && <span className="rating-count">({book.reviews || 0})</span>}
                      </div>
                      <div className="book-price-container">
                        {book.discount && book.originalPrice && (
                          <span className="book-original-price">${book.originalPrice}</span>
                        )}
                        <span className="book-price">${book.price}</span>
                      </div>
                    </div>
                    <div className={`book-overlay ${hoveredBook === book.id ? "active" : ""}`}>
                      <span className="view-details">
                        Ver detalhes <ChevronRight size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>Nenhum livro encontrado para sua busca.</p>
              <button
                className="reset-button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilter("all");
                }}
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>

        
          
          
         

      </section>
    </div>
  );
};

export default Books;