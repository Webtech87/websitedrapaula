import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/pages/courses.css";

import img1 from "../assets/courses/image1.png";
import img2 from "../assets/courses/image2.png";
import img3 from "../assets/courses/image3.png";
import img4 from "../assets/courses/image4.jpg";

const courses = [
  { image: img1, title: "A criança e a Motricidade Fina" },
  { image: img2, title: "Brincar e Integração Sensorial nos Primeiros Anos" },
  { image: img3, title: "A Integração Sensorial" },
  { image: img4, title: "O Desenvolvimento da Autonomia dos 0 aos 3 anos" },
];

const Courses = () => {
  const [loadedImages, setLoadedImages] = useState<number[]>([]);

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => [...prev, index]);
  };

  return (
    <section className="courses">
      <h2>Cursos</h2>
      <br />
      <p>Os favoritos de Terapeutas e Educadores para transformar o desenvolvimento infantil na prática</p>
      <div className="courses-container">
        {courses.map((course, index) => (
          <Link to={`/course/${index}`} key={index} className="course-link">
            <div className="course-card">
              <img
                src={course.image}
                alt={course.title}
                className={`course-image ${loadedImages.includes(index) ? "loaded" : ""}`}
                onLoad={() => handleImageLoad(index)}
              />
              <h3 className="course-title">{course.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Courses;