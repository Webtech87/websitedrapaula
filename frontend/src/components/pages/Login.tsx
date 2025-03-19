import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/pages/login.css";
import backgroundImage from "../../assets/contact-image.jpg";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://websitedrapaula.onrender.com/api/token/", {
        username: formData.email,
        password: formData.password,
      });
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      navigate("/");
    } catch (error) {
      alert("Credenciais inválidas. Por favor, tente novamente.");
      console.error(error);
    }
  };

  // Log mount and unmount to verify rendering
  useEffect(() => {
    console.log("Login component mounted");
    return () => console.log("Login component unmounted");
  }, []);

  return (
    <section className="auth-wrapper">
      <div className="auth-bg">
        <img src={backgroundImage} alt="Background" />
      </div>
      <div className="auth-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Insira o seu email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label>Senha:</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Insira a sua senha"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span className="toggle-password" onClick={togglePasswordVisibility}>
              {showPassword ? <EyeOff /> : <Eye />}
            </span>
          </div>
          <div className="forgot-password">
            <Link to="/recuperar-senha">Recuperar palavra-passe</Link>
          </div>
          <button type="submit">Entrar</button>
        </form>
        <p>
          Não tem uma conta? <Link to="/register">Registre-se</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;