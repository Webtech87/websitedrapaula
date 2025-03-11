import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For redirection
import axios from "axios"; // For API calls
import "../../styles/pages/register.css";

const Register = () => {
  // State to manage form data
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

  const navigate = useNavigate(); // For redirecting to login page

  // Handle input changes for both text inputs and checkbox
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if terms are accepted
    if (!formData.acceptTerms) {
      alert("Você deve aceitar os Termos e Condições e as Políticas de Privacidade.");
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    // Prepare data for backend in nested structure
    const dataToSend = {
      user: {
        username: formData.email, // Using email as username for simplicity
        email: formData.email,
        password: formData.password,
      },
      profile: {
        full_name: formData.fullName,
        age: parseInt(formData.age) || 0, // Convert age to integer, default to 0 if invalid
        gender: formData.gender,
        phone: formData.phone,
        birth_date: formData.birthDate,
        country: formData.country,
      },
    };

    try {
      const response = await axios.post("http://localhost:8000/api/register/", dataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        alert("Registro concluído com sucesso!");
        navigate("/login"); // Redirect to login page on success
      }
    } catch (error) {
      if (error.response) {
        console.error("Erro no registro:", error.response.data);
        alert("Erro ao registrar: " + JSON.stringify(error.response.data));
      } else {
        console.error("Erro no registro:", error);
        alert("Erro ao registrar. Verifique os dados e tente novamente.");
      }
    }
  };

  return (
    <section className="register-section">
      <div className="register-container">
        <h2>Registar Conta</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <label>Nome Completo:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            required
            onChange={handleChange}
          />

          <label>Idade:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            required
            onChange={handleChange}
          />

          <label>Gênero:</label>
          <select name="gender" value={formData.gender} required onChange={handleChange}>
            <option value="">Selecione</option>
            <option value="male">Masculino</option>
            <option value="female">Feminino</option>
            <option value="other">Outro</option>
          </select>

          <label>Telefone:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            required
            onChange={handleChange}
          />

          <label>Data de Nascimento:</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            required
            onChange={handleChange}
          />

          <label>País:</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            required
            onChange={handleChange}
          />

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            required
            onChange={handleChange}
          />

          <label>Senha:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            required
            onChange={handleChange}
          />

          <label>Confirmar Senha:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            required
            onChange={handleChange}
          />

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