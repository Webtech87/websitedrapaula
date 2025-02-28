import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "../../styles/pages/register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    phone: "",
    birthDate: "",
    country: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false, // Checkbox for terms
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === "checkbox" ? checked : value 
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptTerms) {
      alert("Você precisa aceitar os Termos e Condições para continuar.");
      return;
    }
    alert("Registro concluído com sucesso!");
  };

  return (
    <section className="register-section">
      <div className="register-container">
        <h2>Registar Conta</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <label>Nome Completo:</label>
          <input type="text" name="fullName" required onChange={handleChange} />

          <label>Idade:</label>
          <input type="number" name="age" required onChange={handleChange} />

          <label>Gênero:</label>
          <select name="gender" required onChange={handleChange}>
            <option value="">Selecione</option>
            <option value="male">Masculino</option>
            <option value="female">Feminino</option>
            <option value="other">Outro</option>
          </select>

          <label>Telefone:</label>
          <input type="tel" name="phone" required onChange={handleChange} />

          <label>Data de Nascimento:</label>
          <input type="date" name="birthDate" required onChange={handleChange} />

          <label>País:</label>
          <input type="text" name="country" required onChange={handleChange} />

          <label>Email:</label>
          <input type="email" name="email" required onChange={handleChange} />

          <label>Senha:</label>
          <input type="password" name="password" required onChange={handleChange} />

          <label>Confirmar Senha:</label>
          <input type="password" name="confirmPassword" required onChange={handleChange} />

          {/* Checkbox for Terms & Conditions */}
          <div className="terms-checkbox">
            <input type="checkbox" name="acceptTerms" id="terms" onChange={handleChange} />
            <label htmlFor="terms">
              Li e Aceito os <Link to="/termos-e-condicoes">Termos e Condições </Link>
            </label>
          </div>

          <button type="submit">Criar Conta</button>

          {/* Link to Login Page */}
          <p className="login-link">
            Já tem uma conta? <Link to="/login">Iniciar Sessão</Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Register;
