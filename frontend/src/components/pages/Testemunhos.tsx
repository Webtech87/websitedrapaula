import React from "react";
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
  return (
    <section className="testemunhos">
      <h2>O que dizem sobre nós</h2>
      <p>Veja as opiniões de nossos clientes sobre os cursos e mentorias.</p>

      <div className="carousel">
        <div className="testemunhos-container">
          {[...testemunhos, ...testemunhos].map((testemunho, index) => ( // 🔹 Duplicate for seamless loop
            <div className="testemunho-card" key={index}>
              <span className="testemunho-icon">💬</span>
              <h3>{testemunho.comment}</h3>
              <StarRating rating={testemunho.rating} />
              <p className="testemunho-name">{testemunho.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testemunhos;
