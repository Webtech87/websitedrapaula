import React, { useMemo } from "react";
import "../../styles/pages/lancamentos.css";
import { ShoppingBag } from "lucide-react";

import modulo1 from "../../assets/lancamentos/modulo1.jpg";
import modulo2 from "../../assets/lancamentos/modulo2.jpg";
import modulo3 from "../../assets/lancamentos/modulo3.jpg";
import modulo4 from "../../assets/lancamentos/modulo4.jpg";

const Lancamentos = () => {
  const lancamentos = useMemo(() => [
    { image: modulo3, title: "Módulo 3: Brincar da teoria à prática em terapia ocupacional." },
    { image: modulo2, title: "Módulo 2: Brincar da teoria à prática em terapia ocupacional." },
    { image: modulo1, title: "Módulo 1: Brincar da teoria à prática em terapia ocupacional." },
    { image: modulo4, title: "Módulo 4: Brincar da teoria à prática em terapia ocupacional." },
  ], []);

  return (
    <section className="lancamentos">
      <h2>Novos Lançamentos</h2>
      <p>Conteúdo atualizado para transformar sua prática – descubra as novidades!</p>

      <div className="lancamentos-container">
        {lancamentos.map((item, index) => (
          <div className="lancamento-card" key={index}>
            <img src={item.image} alt={item.title} className="lancamento-image" />
            <h3 className="lancamento-title">{item.title}</h3>
            <button className="add-to-cart">
              Adicionar ao Carrinho <ShoppingBag />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Lancamentos;
