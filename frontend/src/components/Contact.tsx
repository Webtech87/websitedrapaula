import React, { useState, FormEvent } from "react";
import "../styles/contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.message) {
      setError("Por favor, preencha todos os campos.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Insira um email válido.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log("Form submitted:", formData);
    setFormSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact-page"> 
    <div className="contact-container">
      <h1 className="contact-header">Entre em Contato</h1>
      
      <div className="contact-content" >
        {/* Contact Information */}
        <div className="contact-info" > 
          <div className="contact-section">
            <h2>Horário</h2>
            <p>Segunda - Sexta: 9:00 - 18:00</p>
          </div>
          <div className="contact-section">
            <h2>Telefone</h2>
            <p>(+351) 965 430 026</p>
            <p>Chamada para rede móvel nacional</p>
          </div>
          <div className="contact-section">
            <h2>Endereço</h2>
            <p>Rua Arthur Águedo Miranda, Bloco 2, Loja A</p>
            <p>Loja C - 000-000, Faro</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form">
          <h2>Fale Conosco</h2>
          {formSubmitted ? (
            <p className="form-success">Obrigado! Entraremos em contato em breve.</p>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <p className="error-message">{error}</p>}

              <div className="form-group">
                <label htmlFor="name">Nome</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Mensagem</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="submit-button">Enviar</button>
            </form>
          )}
        </div>
      </div>

      {/* Footer Section */}
      <div className="contact-footer">
        <div className="footer-section">
          <h2>Área do Cliente</h2>
          <ul>
            <li><a href="/account">A minha conta</a></li>
            <li><a href="/orders">Encomendas</a></li>
            <li><a href="/deliveries">Entregas</a></li>
            <li><a href="/faq">Perguntas Frequentes</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h2>Informações</h2>
          <ul>
            <li><a href="/privacy">Política de Privacidade</a></li>
            <li><a href="/cookies">Política de Cookies</a></li>
            <li><a href="/terms">Termos e Condições</a></li>
            <li><a href="/complaints">Livro de Reclamações</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="contact-copyright">
        <p>Todos os direitos reservados por ©Paula Serrano</p>
      </div>
    </div>
    </div>
  );
};

export default Contact;
