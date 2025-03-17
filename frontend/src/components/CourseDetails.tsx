import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import "../styles/pages/courseDetails.css";

// Import directly from the same file path
import { courses } from "../courseData";

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const course = courses.find((c) => c.id === Number(id));
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    // Check if course is in wishlist (from localStorage)
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setIsInWishlist(wishlist.includes(Number(id)));
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [id]);

  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    
    if (isInWishlist) {
      const newWishlist = wishlist.filter((itemId: number) => itemId !== Number(id));
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
    } else {
      wishlist.push(Number(id));
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
    
    setIsInWishlist(!isInWishlist);
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  if (!course) {
    return (
      <div className="course-details">
        <h1>Curso não encontrado</h1>
        <p>O curso que você está procurando não está disponível.</p>
      </div>
    );
  }

  return (
    <div className="course-details">
      <h1>{course.title}</h1>
      
      <div className="course-image">
        {!imageLoaded && <div className="skeleton" style={{ height: '300px' }}></div>}
        <img 
          src={course.image} 
          alt={course.title} 
          onLoad={() => setImageLoaded(true)}
          style={{ display: imageLoaded ? 'block' : 'none' }}
        />
      </div>
      
      <div className="course-content">
        <div className="course-info">
          <section>
            <h2>Descrição do Curso</h2>
            <div className="description-container">
              <div className={`description-text ${!isDescriptionExpanded ? 'collapsed' : ''}`}>
                {course.description}
              </div>
              <Button 
                variant="primary" 
                size="small" 
                className="expand-button"
                onClick={toggleDescription}
              >
                {isDescriptionExpanded ? (
                  <>
                    <span>Ler menos</span>
                    <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <span>Ler mais</span>
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </section>

          <section>
            <h2>Professor(a)</h2>
            <p>{course.instructor}</p>
          </section>

          <section>
            <h2>Localização</h2>
            <p>{course.Localizacao}</p>
          </section>
        </div>
        
        <div className="purchase-section">
          <div className="purchase-card">
            <div className="price">{course.price}</div>
            <div className="button-container">
              <button className="buy-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6H21L19 16H5L3 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 21C8.55228 21 9 20.5523 9 20C9 19.4477 8.55228 19 8 19C7.44772 19 7 19.4477 7 20C7 20.5523 7.44772 21 8 21Z" fill="currentColor"/>
                  <path d="M16 21C16.5523 21 17 20.5523 17 20C17 19.4477 16.5523 19 16 19C15.4477 19 15 19.4477 15 20C15 20.5523 15.4477 21 16 21Z" fill="currentColor"/>
                </svg>
                Comprar Agora
              </button>
              <button className="cart-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 20C9 21.1 8.1 22 7 22C5.9 22 5 21.1 5 20C5 18.9 5.9 18 7 18C8.1 18 9 18.9 9 20Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M20 20C20 21.1 19.1 22 18 22C16.9 22 16 21.1 16 20C16 18.9 16.9 18 18 18C19.1 18 20 18.9 20 20Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M3 3H5.5L7.5 14H18L21 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Adicionar ao Carrinho
              </button>
              <button 
                className={`wishlist-button ${isInWishlist ? 'wishlist-active' : ''}`}
                onClick={toggleWishlist}
                aria-label={isInWishlist ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill={isInWishlist ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {isInWishlist ? "Adicionado aos Favoritos" : "Adicionar aos Favoritos"}
              </button>
            </div>
          </div>
          
          <div className="detalhes-adicionais">
            <h2>O que você vai aprender</h2>
            <ul>
              <li>Técnicas avançadas de terapia manual</li>
              <li>Avaliação e diagnóstico precisos</li>
              <li>Plano de tratamento personalizado</li>
              <li>Prevenção de lesões recorrentes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;