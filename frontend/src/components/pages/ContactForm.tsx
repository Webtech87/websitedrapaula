import React, { useState } from "react";
import "../../styles/pages/contactform.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email" && value && !/\S+@\S+\.\S+/.test(value)) {
      setErrors({ ...errors, email: "Email inválido" });
    } else {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      name: formData.name ? "" : "Nome é obrigatório",
      email: formData.email ? "" : "Email é obrigatório",
      subject: formData.subject ? "" : "Assunto é obrigatório",
      message: formData.message ? "" : "Mensagem é obrigatória",
    };
    setErrors(newErrors);

    if (!Object.values(newErrors).some((error) => error)) {
      alert("Mensagem enviada com sucesso!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        {/* Left Side - Text */}
        <div className="contact-text">
          <h2>Entre em Contato</h2>
          <p>
            Adoraríamos ouvir de você! Seja uma dúvida, feedback ou apenas um olá, sinta-se à vontade para entrar em contato usando o formulário abaixo. Nossa equipe responderá o mais rápido possível.
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="contact-form">
          <h2>Envie-nos uma mensagem</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Nome:</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Digite seu nome"
              value={formData.name}
              onChange={handleChange}
              required
              aria-required="true"
            />
            {errors.name && <span className="error">{errors.name}</span>}

            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Digite seu email"
              value={formData.email}
              onChange={handleChange}
              required
              aria-required="true"
            />
            {errors.email && <span className="error">{errors.email}</span>}

            <label htmlFor="subject">Assunto:</label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              aria-required="true"
            >
              <option value="">Selecione um assunto</option>
              <option value="duvida">Dúvida</option>
              <option value="feedback">Feedback</option>
              <option value="outro">Outro</option>
            </select>
            {errors.subject && <span className="error">{errors.subject}</span>}

            <label htmlFor="message">Mensagem:</label>
            <textarea
              id="message"
              name="message"
              placeholder="Escreva sua mensagem aqui"
              value={formData.message}
              onChange={handleChange}
              required
              aria-required="true"
            ></textarea>
            {errors.message && <span className="error">{errors.message}</span>}

            <button type="submit">Enviar mensagem</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;