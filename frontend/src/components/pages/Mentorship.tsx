import "../../styles/pages/Mentorship.css";
import mentorshipImage from "../../assets/courses/image1.png"; 

const Mentorship = () => {
  return (
    <section className="mentorship">
      <div className="mentorship-container">
        {/* Left Side: Image */}
        <div className="mentorship-image">
        <img src={mentorshipImage} alt="Mentorship Session" />

        </div>

        {/* Right Side: Text Content */}
        <div className="mentorship-content">
          <span className="mentorship-tag">Mentoria</span>
          <h2>Mentoria Profissional: O Que é e Quais São as Suas Vantagens?</h2>
          <p>
            A mentoria profissional é um processo no qual um profissional mais
            experiente (mentor) orienta e apoia outro profissional menos
            experiente (mentorado) no desenvolvimento da sua carreira. Essa
            relação baseia-se na troca de experiências, conhecimentos e
            conselhos práticos, ajudando o mentorado a superar desafios e
            desenvolver competências.
          </p>

          <h3>Vantagens da Mentoria Profissional</h3>
          <p>
            A mentoria proporciona acesso a conhecimentos e experiências que
            normalmente levariam anos para serem adquiridos. O mentor compartilha
            insights valiosos sobre boas práticas e estratégias eficazes.
          </p>

          <button className="mentorship-button">Saiba mais</button>
        </div>
      </div>
    </section>
  );
};

export default Mentorship;
