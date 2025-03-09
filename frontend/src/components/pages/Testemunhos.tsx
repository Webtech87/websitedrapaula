import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/pages/testemunhos.css";

// Sample Testimonials Data
const testemunhos = [
  { id: 1, comment: "Muito prático", rating: 5, name: "Rita Maria" },
  { id: 2, comment: "Conteúdo excelente", rating: 4, name: "João Pedro" },
  { id: 3, comment: "Aprendi muito", rating: 5, name: "Mariana Silva" },
  { id: 4, comment: "Explicação clara", rating: 4, name: "Carlos Lima" },
  { id: 5, comment: "Excelente didática", rating: 5, name: "Ana Paula" },
  { id: 6, comment: "Recomendo!", rating: 5, name: "Fernanda Souza" },
  { id: 7, comment: "Ótimo curso", rating: 4, name: "João Vitor" },
  { id: 8, comment: "Melhor curso que fiz", rating: 5, name: "Clara Mendes" },
];

// Rating Component (Stars)
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="stars">
      {"★".repeat(rating)}{"☆".repeat(5 - rating)}
    </div>
  );
};

// Testimonials Component
const Testemunhos = () => {
  const settings = {
    dots: true,              // Show navigation dots
    infinite: true,          // Loop the carousel
    speed: 500,              // Transition speed (ms)
    slidesToShow: 3,         // Cards visible on desktop
    slidesToScroll: 1,       // Cards scrolled per click
    autoplay: true,          // Auto-scroll
    autoplaySpeed: 3000,     // 3-second interval
    pauseOnHover: true,      // Pause on hover
    responsive: [            // Adjust for different screen sizes
      {
        breakpoint: 1024,    // Tablets and smaller
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,     // Mobile devices
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="testemunhos">
      <h2>O que dizem sobre nós</h2>
      <p>Veja as opiniões de nossos clientes sobre os cursos e mentorias.</p>

      <Slider {...settings}>
        {testemunhos.map((testemunho) => (
          <div key={testemunho.id} className="testemunho-card">
            <span className="testemunho-icon">💬</span>
            <h3>{testemunho.comment}</h3>
            <StarRating rating={testemunho.rating} />
            <p className="testemunho-name">{testemunho.name}</p>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default Testemunhos;