import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Banner from "./components/Banner";
import Courses from "./components/Courses";
import Mentorship from "./components/pages/Mentorship";
import Books from "./components/pages/Books";
import About from "./components/pages/About";
import Imersoes from "./components/pages/Imersoes";
import Lancamentos from "./components/pages/Lancamentos";
import Testemunhos from "./components/pages/Testemunhos";
import ContactForm from "./components/pages/ContactForm";
import Footer from "./components/pages/Footer";
import Login from "./components/pages/Login";       // ✅ Import Login page
import Register from "./components/pages/Register"; // ✅ Import Register page
import RecuperarSenha from "./components/pages/RecuperarSenha";
import Wishlist from "./components/pages/Wishlist";
import Contact from "./components/Contact";
import "./styles/global.css";

function Home() {
  return (
    <>
      <Banner />
      <Courses />
      <Mentorship />
      <Books />
      <About />
      <Imersoes />
      <Lancamentos />
      <Testemunhos />
      <ContactForm />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />         {/* ✅ Home now contains all sections */}
        <Route path="/login" element={<Login />} />   {/* ✅ Standalone pages */}
        <Route path="/register" element={<Register />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
