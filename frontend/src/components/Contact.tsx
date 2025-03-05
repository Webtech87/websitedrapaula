import React, { useState, FormEvent } from "react";
import "../styles/contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Here you can add logic to handle form submission (e.g., send data to a server)
    console.log("Form submitted:", formData);
    setFormSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact-container">
      <h1 className="contact-header">CONTACTO</h1>
      <div className="contact-content">
        {/* Left Section: Contact Information */}
        <div className="contact-info">
          <div className="contact-section">
            <h2>Horário</h2>
            <p>Segunda - Sexta</p>
            <p>9:00 - 18:00</p>
          </div>
          <div className="contact-section">
            <h2>Telefone</h2>
            <p>(+351) 965 430 026</p>
            <p>(Chamada para rede móvel nacional)</p>
          </div>
          <div className="contact-section">
            <h2>Morada</h2>
            <p>Rua Arthur Águedo Miranda, Bloco 2, Loja A,</p>
            <p>Loja C - 000-000, Faro</p>
          </div>
        </div>

        {/* Right Section: Form */}
        <div className="contact-form">
          <h2>Pedir Mais Informações</h2>
          {formSubmitted ? (
            <p className="form-success">Obrigado! Entraremos em contacto em breve.</p>
          ) : (
            <form onSubmit={handleSubmit}>
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
              <button type="submit" className="submit-button">
                Enviar
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer Sections */}
      <div className="contact-footer">
        <div className="footer-section">
          <h2>ÁREA DO CLIENTE</h2>
          <ul>
            <li><a href="/account">A minha conta</a></li>
            <li><a href="/orders">Encomendas</a></li>
            <li><a href="/deliveries">Entregas</a></li>
            <li><a href="/faq">Perguntas Frequentes</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h2>INFORMAÇÕES</h2>
          <ul>
            <li><a href="/privacy">Política de Privacidade</a></li>
            <li><a href="/cookies">Política de Cookies</a></li>
            <li><a href="/terms">Termos e condições</a></li>
            <li><a href="/complaints">Livro de Reclamações</a></li>
          </ul>
        </div>
      </div>

      <div className="contact-copyright">
        <p>Todos os direitos reservados por ©Paula Serrano</p>
      </div>
    </div>
  );
};

export default Contact;