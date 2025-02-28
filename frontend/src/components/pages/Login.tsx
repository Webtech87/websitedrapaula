import { useState } from "react";
import "../../styles/pages/login.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Login bem-sucedido!");
  };

  return (
    <section className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input type="email" name="email" placeholder="Insira o seu email" value={formData.email} onChange={handleChange} required />

        <label>Senha:</label>
        <input type="password" name="password" placeholder="Insira a sua senha" value={formData.password} onChange={handleChange} required />

        <button type="submit">Entrar</button>
      </form>
      <p>Não tem uma conta? <a href="/register">Registre-se</a></p>
    </section>
  );
};

export default Login;
