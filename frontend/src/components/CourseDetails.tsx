import { useParams } from "react-router-dom";
import { courses } from "../courseData";
import "../styles/pages/courseDetails.css";

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const course = courses.find((c) => c.id === parseInt(id || "", 10));

  if (!course) {
    return <div className="course-details">Curso não encontrado</div>;
  }

  return (
    <div className="course-details">
      <h1>{course.title}</h1>
      <div className="course-content">
        <div className="course-info">
          <section className="descricao">
            <h2>Descrição do Curso</h2>
            <p>{course.description}</p>
          </section>
          <section className="o-que-vc-aprendera">
            <h2>O que Você Vai Aprender</h2>
            <ul>
              <li>Conhecimento aprofundado dos tópicos principais.</li>
              <li>Aplicações práticas e exemplos do mundo real.</li>
              <li>Orientações passo a passo ao longo do conteúdo.</li>
              <li>Ferramentas e técnicas para o sucesso.</li>
            </ul>
          </section>
          <section className="curriculo">
            <h2>Conteúdo do Curso</h2>
            <ol>
              <li>Introdução e Visão Geral</li>
              <li>Conceitos Básicos</li>
              <li>Técnicas Avançadas</li>
              <li>Estudos de Caso</li>
              <li>Projeto Final</li>
            </ol>
          </section>
          <section className="instrutor">
            <h2>Instrutor</h2>
            <p>{course.instructor}</p>
          </section>
          
        </div>
        <div className="purchase-section">
          <div className="purchase-card">
            <h3 className="price">${course.price.toFixed(2)}</h3>
            <button className="buy-button">Comprar Agora</button>
            <button className="cart-button">Adicionar ao Carrinho</button>
          </div>
          <section className="detalhes-adicionais">
            <h2>Detalhes do Curso</h2>
            <ul>
              <li>Duração: 8 semanas</li>
              <li>Esforço: 3-4 horas por semana</li>
              <li>Nível: Intermediário</li>
              <li>Idioma: Português/Inglês</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
