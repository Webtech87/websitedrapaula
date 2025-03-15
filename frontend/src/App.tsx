import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
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
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import RecuperarSenha from "./components/pages/RecuperarSenha";
import Wishlist from "./components/pages/Wishlist";
import Contact from "./components/Contact";
import Cart from "./components/pages/Cart";
import CourseDetails from "./components/CourseDetails";
import BookDetails from "./components/BookDetails"; // Add this line
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./components/Profile";
import PrivacyPolicy from "./components/pages/PrivacyPolicy";
import "./styles/global.css";
import CookieConsent from "react-cookie-consent";





// Placeholder for a protected Dashboard page (replace with your actual component if needed)
const Dashboard = () => <div>Dashboard (Protected)</div>;

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
      {/* Cookie Consent Banner */}
      <CookieConsent
        location="bottom"
        buttonText="Aceitar" // Portuguese for "Accept"
        declineButtonText="Recusar" // Portuguese for "Decline"
        cookieName="myCookieConsent"
        style={{
          background: "#ffffff",
          color: "#333",
          padding: "10px 20px",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
          borderRadius: "5px",
          fontSize: "14px",
          fontFamily: "Arial, sans-serif",
        }}
        buttonStyle={{
          background: "#4CAF50",
          color: "#fff",
          padding: "8px 16px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        declineButtonStyle={{
          background: "#f44336",
          color: "#fff",
          padding: "8px 16px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        expires={150}
        enableDeclineButton
        onDecline={() => {
          console.log("User declined cookies");
        }}
        overlay
        overlayStyle={{
          background: "rgba(0,0,0,0.5)",
        }}
      >
        Este site utiliza cookies para melhorar a sua experiência. Ao continuar, você concorda com o uso de cookies.{" "}
        <Link to="/privacy" style={{ color: "#007bff", textDecoration: "underline" }}>
          Saiba mais
        </Link>
      </CookieConsent>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/privacy" element={<PrivacyPolicy />} /> {/* New route */}
        <Route path="/" element={<Books />} />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;