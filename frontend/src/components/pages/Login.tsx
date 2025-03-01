import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import "../../styles/pages/login.css";
import backgroundImage from "../../assets/contact-image.jpg"; // Import the image

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Login bem-sucedido!");
  };

  return (
    <section className="auth-wrapper">
      {/* Background Image */}
      <div className="auth-bg">
        <img src={backgroundImage} alt="Background" />
      </div>

      {/* Login Form */}
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

          {/* Password Input with Eye Icon */}
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

          {/* Forgot Password Link */}
          <div className="forgot-password">
            <Link to="/recuperar-senha">Recuperar palavra-passe</Link>
          </div>

          <button type="submit">Entrar</button>
        </form>
        <p>Não tem uma conta? <Link to="/register">Registre-se</Link></p>
      </div>
    </section>
  );
};

export default Login;
