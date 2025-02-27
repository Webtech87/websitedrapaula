import Navbar from "./components/Navigation";
import Banner from "./components/Banner";
import Courses from "./components/Courses";
import Mentorship from "./components/pages/Mentorship";
import Books from "./components/pages/Books";
import About from "./components/pages/About";
import Imersoes from "./components/pages/Imersoes";
import Lancamentos from "./components/pages/Lancamentos";
import Testemunhos from "./components/pages/Testemunhos";
import ContactForm from "./components/pages/ContactForm";  // ✅ Import the Contact Form
import Footer from "./components/pages/Footer"; // ✅ Add this

import "./styles/global.css";

function App() {
  return (
    <div>
      <Navbar />
      <Banner />
      <Courses />
      <Mentorship />
      <Books />
      <About />
      <Imersoes />
      <Lancamentos />
      <Testemunhos />
      <ContactForm /> {/* ✅ Add the Contact Form below Testimonials */}
      <Footer />
    </div>
  );
}

export default App;
