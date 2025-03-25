import { useState } from "react";
import "../../styles/pages/about.css";
import aboutImage from "../../assets/about/Design sem nome 1.png";
import { Link } from "react-router-dom";

const About = () => {
  const [showFullText, setShowFullText] = useState(false);

  const toggleText = () => {
    setShowFullText(!showFullText);
  };

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
          <div className={`about-text ${showFullText ? "expanded" : "collapsed"}`}>
            <p>
              Sou terapeuta ocupacional com 30 anos de experiência em prática clínica e 20 anos dedicados
              à docência. Durante a minha trajetória, sempre busquei formação junto às maiores referências
              mundiais na área, o que me levou a me especializar em integração sensorial e no brincar nos
              Estados Unidos.
              A prática clínica, aliada ao ensino, permitiu-me construir um raciocínio clínico sólido e
              desenvolver uma abordagem baseada em evidências. Essa metodologia é comprovada
              diariamente nos atendimentos às muitas crianças e famílias com quem tive o privilégio de
              trabalhar.
            </p>
            <p className="additional-text">
              Acredito profundamente que a infância é um período transformador, no qual nós,
              profissionais, temos a oportunidade de alterar significativamente o percurso de vida das
              crianças e de suas famílias. Essa certeza traz uma enorme responsabilidade à minha prática
              clínica, mas também um compromisso em compartilhar os conhecimentos adquiridos ao longo
              de 30 anos de estudo e trabalho.
              Sou grata aos profissionais que me ensinaram e que moldaram minha jornada. Hoje, sinto que
              é meu dever, por meio da minha experiência, contribuir para a formação de outros
              profissionais e alcançar ainda mais crianças e famílias, ajudando a construir um futuro com
              mais possibilidades e qualidade de vida para todos.
            </p>
          </div>

          <button 
            className="read-more-button" 
            onClick={toggleText}
            aria-expanded={showFullText}
          >
            {showFullText ? "Ler menos" : "Ler mais"}
          </button>

          <Link to="/about-detail">
            <button className="about-button" aria-label="Saiba mais sobre Dra. Paula Serrano">
              Conheça a Paula
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default About;
