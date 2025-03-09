import React from "react";
import "../styles/Banner.css";

const Banner: React.FC = () => {
  return (
    <section className="banner">
      <div className="banner-content">
        <h1>Intervenção terapêutica na prática</h1>
        <p>Formações e recursos para terapeutas, educadores e pais que querem fazer a diferença.</p>
        <a href="/about" className="cta-button">Saber mais</a>
      </div>
    </section>
  );
};

export default Banner;