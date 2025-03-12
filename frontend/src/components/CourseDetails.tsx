import { useParams } from "react-router-dom";
import { courses } from "../courseData";
import "../styles/pages/courseDetails.css";

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const course = courses.find((c) => c.id === Number(id));

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="course-details">
      <h1>{course.title}</h1>
      <div className="course-content">
        <div className="course-info">
          <section>
            <h2>Descrição do Curso</h2>
            <p>{course.description}</p>
          </section>

          <section>
            <h2>Professor(a)</h2>
            <p>{course.instructor}</p>
          </section>

          <section>
            <h2>Localizacao</h2>
            <p>{course.Localizacao  }</p>
          </section>
        </div>
        <div className="purchase-section">
          <div className="purchase-card">
            <div className="price">${course.price}</div>
            <button className="buy-button">Comprar Agora</button>
            <button className="cart-button">Adicionar ao Carrinho</button>
          </div>
          <div className="detalhes-adicionais">
            <h2>O que você vai aprender</h2>
            <ul>
              <li>Técnicas avançadas de terapia manual</li>
              <li>Avaliação e diagnóstico precisos</li>
              <li>Plano de tratamento personalizado</li>
              <li>Prevenção de lesões recorrentes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
