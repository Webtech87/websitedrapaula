import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/pages/lancamentos.css"; // Ensure this CSS file exists
import modulo1 from "../../assets/lancamentos/modulo1.jpg";
import modulo2 from "../../assets/lancamentos/modulo2.jpg";
import modulo3 from "../../assets/lancamentos/modulo3.jpg";
import modulo4 from "../../assets/lancamentos/modulo4.jpg";

const lancamentos = [
  { image: modulo3, title: "Módulo 3: Brincar da teoria à prática em terapia ocupacional." },
  { image: modulo2, title: "Módulo 2: Brincar da teoria à prática em terapia ocupacional." },
  { image: modulo1, title: "Módulo 1: Brincar da teoria à prática em terapia ocupacional." },
  { image: modulo4, title: "Módulo 4: Brincar da teoria à prática em terapia ocupacional." },
];

const Lancamentos = () => {
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
    <section className="lancamentos">
      <h2 className={isTextVisible ? "fade-in" : ""}>Novos Lançamentos</h2>
      <br />
      <p className={isTextVisible ? "fade-in" : ""}>
        Conteúdo atualizado para transformar sua prática – descubra as novidades!
      </p>
      <div className="lancamentos-container">
        {lancamentos.map((lancamento, index) => (
          <div key={index} className="lancamento-wrapper">
            <Link to={`/lancamento/${index}`} className="lancamento-link">
              <div className="lancamento-card">
                <img
                  src={lancamento.image}
                  alt={lancamento.title}
                  className={`lancamento-image ${loadedImages.includes(index) ? "loaded" : ""}`}
                  onLoad={() => handleImageLoad(index)}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            </Link>
            <h3 className="lancamento-title">{lancamento.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Lancamentos;