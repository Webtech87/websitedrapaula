import "../styles/pages/courses.css";


import { ShoppingBag } from "lucide-react";
import img1 from "../assets/courses/image1.png";
import img2 from "../assets/courses/image2.png";
import img3 from "../assets/courses/image3.png";
import img4 from "../assets/courses/image4.jpg";


const courses = [
    { image: img1, title: "A criança e a Motricidade Fina", price: "14,91 €" },
    { image: img2, title: "Brincar e Integração Sensorial nos Primeiros Anos", price: "14,91 €" },
    { image: img3, title: "A Integração Sensorial", price: "14,91 €" },
    { image: img4, title: "O Desenvolvimento da Autonomia dos 0 aos 3 anos", price: "14,91 €" },
  ];
  

const Courses = () => {
  return (
    <section className="courses">
      <h2>Cursos</h2><br />

      <p>Os favoritos de Terapeutas e Educadores para transformar o desenvolvimento infantil na prática</p>
      <div className="courses-container">
        {courses.map((course, index) => (
          <div className="course-card" key={index}>
            <img src={course.image} alt={course.title} className="course-image" />
            <h3 className="course-title">{course.title}</h3>
            <p className="course-price">{course.price}</p>
            <button className="add-to-cart">
              Adicionar ao Carrinho <ShoppingBag />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Courses;
