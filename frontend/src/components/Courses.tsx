import { useState, useEffect } from "react";
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
  const [isTextVisible, setIsTextVisible] = useState(false);

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => [...prev, index]);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsTextVisible(true), 200); // Delay for fade-in
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="courses">
      <h2 className={isTextVisible ? "fade-in" : ""}>Cursos</h2>
      <br />
      <p className={isTextVisible ? "fade-in" : ""}>
        Os favoritos de Terapeutas e Educadores para transformar o desenvolvimento infantil na prática
      </p>
      <div className="courses-container">
        {courses.map((course, index) => (
          <div key={index} className="course-wrapper">
            <Link to={`/course/${index}`} className="course-link">
              <div className="course-card">
                <img
                  src={course.image}
                  alt={course.title}
                  className={`course-image ${loadedImages.includes(index) ? "loaded" : ""}`}
                  onLoad={() => handleImageLoad(index)}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            </Link>
            <h3 className="course-title">{course.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Courses;