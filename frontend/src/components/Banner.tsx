import React from "react";
import "../styles/Banner.css"; // Import styles
import bannerImage from "../assets/bannerImage.jpeg"; // Import the image

const Banner: React.FC = () => {
  return (
    <section className="banner">
      <div className="banner-content">
      <h1>Intervenção terapêutica na prática</h1>
        <p>Formações e recursos para terapeutas, educadores e pais que querem fazer a diferença.</p>
        <button className="cta-button">Saber mais</button>
      </div>
      <img src={bannerImage} alt="" className="banner-image" />
    </section>
  );
};

export default Banner;
