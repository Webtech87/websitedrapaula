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
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import RecuperarSenha from "./components/pages/RecuperarSenha";
import Wishlist from "./components/pages/Wishlist";
import Contact from "./components/Contact";
import Cart from "./components/pages/Cart";
import CourseDetails from "./components/CourseDetails";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ Import ProtectedRoute
import "./styles/global.css";

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
      <Routes>
        <Route path="/" element={<Home />} />           {/* ✅ Public home route */}
        <Route path="/login" element={<Login />} />     {/* ✅ Public login route */}
        <Route path="/register" element={<Register />} /> {/* ✅ Public register route */}
        <Route path="/recuperar-senha" element={<RecuperarSenha />} /> {/* ✅ Public password recovery */}
        <Route path="/contact" element={<Contact />} /> {/* ✅ Public contact route */}
        <Route path="/cart" element={<Cart />} />       {/* ✅ Public cart route */}
        <Route path="/course/:id" element={<CourseDetails />} /> {/* ✅ Public course details */}
        
        {/* Protected Routes */}
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