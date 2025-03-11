import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/pages/courses.css";
import { courses } from "../courseData";

const Courses = () => {
  const [loadedImages, setLoadedImages] = useState<number[]>([]);
  const [isTextVisible, setIsTextVisible] = useState(false);
  const [isCoursesVisible, setIsCoursesVisible] = useState(false);

  const handleImageLoad = (id: number) => {
    setLoadedImages((prev) => [...prev, id]);
  };

  useEffect(() => {
    const textTimer = setTimeout(() => setIsTextVisible(true), 200);
    const coursesTimer = setTimeout(() => setIsCoursesVisible(true), 400);
    
    return () => {
      clearTimeout(textTimer);
      clearTimeout(coursesTimer);
    };
  }, []);

  return (
    <section className="courses">
      <h2 className={isTextVisible ? "fade-in" : ""}>Cursos</h2>
      <br />
      <p className={isTextVisible ? "fade-in" : ""}>
        Os favoritos de Terapeutas e Educadores para transformar o desenvolvimento infantil na prática
      </p>
      <div className={`courses-container ${isCoursesVisible ? "fade-in" : ""}`}>
        {courses.map((course) => (
          <div key={course.id} className="course-wrapper fade-in">
            <Link to={`/course/${course.id}`} className="course-link">
              <div className={`course-card ${course.id === 3 ? "special-course" : ""}`}>
                <img
                  src={course.image}
                  alt={course.title}
                  className={`course-image ${loadedImages.includes(course.id) ? "loaded" : ""}`}
                  onLoad={() => handleImageLoad(course.id)}
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
