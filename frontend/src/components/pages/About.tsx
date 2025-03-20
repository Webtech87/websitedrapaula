import "../../styles/pages/about.css";
import aboutImage from "../../assets/about/Design sem nome 1.png";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <section className="about">
      <div className="about-container">
        {/* Header Section: Tag and Heading */}
        <div className="about-header">
          <span className="about-tag">Conheça a Paula</span>
          <h2>Paula Serrano</h2>
        </div>

        {/* Right Side: Image */}
        <div className="about-image">
          <img src={aboutImage} alt="Dra. Paula Serrano" />
        </div>

        {/* Left Side: Remaining Text Content */}
        <div className="about-content">
          <p>
            Terapeuta Ocupacional desde 1993. Com um mestrado em Terapia Ocupacional – Área de especialização 
            Integração Sensorial, pela Escola Superior de Saúde do Alcoitão.
          </p>
          <p>
            É certificada em Integração Sensorial pela University of Southern California – Department of 
            Occupational Science and Therapy e Western Psychological Services. É também certificada no 
            tratamento do neuro desenvolvimento (Bobath) pela European Bobath Tutors’ Association.
          </p>

          

          <Link to="/about-detail">
            <button className="about-button" aria-label="Saiba mais sobre Dra. Paula Serrano">
              Saiba mais
            </button>
          </Link>
          
        </div>
      </div>
    </section>
  );
};

export default About;