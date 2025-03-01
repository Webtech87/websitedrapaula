import React, { useState } from "react";
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
    acceptTerms: false, // State for checkbox
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptTerms) {
      alert("Você deve aceitar os Termos e Condições e as Políticas de Privacidade.");
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

          {/* Checkbox for Terms and Privacy Policy */}
          <div className="terms-checkbox">
  <input
    type="checkbox"
    id="acceptTerms"
    name="acceptTerms"
    checked={formData.acceptTerms}
    onChange={handleChange}
  />
  <label htmlFor="acceptTerms">
    Eu li e aceito os{" "}
    <a href="/termos" target="_blank" rel="noopener noreferrer">
      Termos e Condições
    </a>{" "}
    e as{" "}
    <a href="/privacidade" target="_blank" rel="noopener noreferrer">
      Políticas de Privacidade
    </a>.
  </label>
</div>


          <button type="submit">Criar Conta</button>

          {/* Link to Login Page */}
          <p className="login-link">
            Já tem uma conta? <a href="/login">Iniciar Sessão</a>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Register;
