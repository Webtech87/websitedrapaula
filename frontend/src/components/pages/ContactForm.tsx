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
    <section className="cf-contact-section">
      <div className="cf-contact-container">
        {/* Left Side - Text */}
        <div className="cf-contact-text">
          <h2>Entre em Contato</h2>
          <p>
          Na Paula Serrano, valorizamos cada ligação com os nossos clientes. Seja para esclarecer dúvidas, receber feedback valioso ou simplesmente trocar uma ideia, a nossa equipa está sempre pronta para ouvir e ajudar.
          </p>
          
          <p>
            Utilize nosso formulário de contato para:
          </p>

          <ul className="cf-contact-benefits">
            <li>Solicitar orçamentos personalizados</li>
            <li>Obter informações técnicas sobre nossos produtos</li>
            <li>Reportar qualquer questão sobre entregas</li>
            <li>Dar sugestões para melhorarmos nossos serviços</li>
          </ul>

          <p>
          Para um atendimento imediato durante o horário comercial (Seg-Sex: 9h-18h), também pode contactar-nos diretamente pelo telefone  <strong>(+351) 965 430 026</strong>. Garantimos uma resposta por e-mail em até 24 horas úteis para todas as mensagens recebidas.
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="cf-contact-form">
          <h2>Envie-nos uma mensagem</h2>
          <form onSubmit={handleSubmit}>
            <div className="cf-form-group">
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
              {errors.name && <span className="cf-error">{errors.name}</span>}
            </div>

            <div className="cf-form-group">
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
              {errors.email && <span className="cf-error">{errors.email}</span>}
            </div>

            <div className="cf-form-group">
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
              {errors.subject && <span className="cf-error">{errors.subject}</span>}
            </div>

            <div className="cf-form-group">
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
              {errors.message && <span className="cf-error">{errors.message}</span>}
            </div>

            <button type="submit">Enviar mensagem</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;