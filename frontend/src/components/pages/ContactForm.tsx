import React, { useState } from "react";
import "../../styles/pages/contactform.css";
import bannerImage from "../../assets/bannerImage.jpeg"; // ✅ Import the image

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Mensagem enviada com sucesso!");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        {/* Left Side - Image */}
        <div className="contact-image">
          <img src={bannerImage} alt="Paula Serrano" />
        </div>

        {/* Right Side - Form */}
        <div className="contact-form">
          <h2>Envie-nos uma mensagem</h2>

          <form onSubmit={handleSubmit}>
            <label>Nome:</label>
            <input
              type="text"
              name="name"
              placeholder="Insira o seu nome"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label>Email:</label>
            <input
              type="email"
              name="email"
              placeholder="Insira o seu email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className="form-row">
              <div>
                <label>Assunto:</label>
                <select name="subject" value={formData.subject} onChange={handleChange} required>
                  <option value="">Selecione um assunto</option>
                  <option value="duvida">Dúvida</option>
                  <option value="feedback">Feedback</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
            </div>

            <label>Mensagem:</label>
            <textarea
              name="message"
              placeholder="Escreva aqui a sua mensagem"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit">Enviar mensagem</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
