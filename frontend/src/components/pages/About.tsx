import "../../styles/pages/about.css";
import aboutImage from "../../assets/about/about-image.png"; // Make sure the correct image path is used.

const About = () => {
  return (
    <section className="about">
      <div className="about-container">
        {/* Left Side: Text Content */}
        <div className="about-content">
          <span className="about-tag">Conheça a Dra. Paula</span>
          <h2>Dra. Paula Serrano</h2>
          <p>
            Terapeuta Ocupacional desde 1993. Com um mestrado em Terapia Ocupacional – Área de especialização 
            Integração Sensorial, pela Escola Superior de Saúde do Alcoitão.
          </p>
          <p>
            É certificada em Integração Sensorial pela University of Southern California – Department of 
            Occupational Science and Therapy e Western Psychological Services. É também certificada no 
            tratamento do neuro desenvolvimento (Bobath) pela European Bobath Tutors’ Association.
          </p>
          <button className="about-button">Saiba mais</button>
        </div>

        {/* Right Side: Image */}
        <div className="about-image">
          <img src={aboutImage} alt="Dra. Paula Serrano" />
        </div>
      </div>
    </section>
  );
};

export default About;
