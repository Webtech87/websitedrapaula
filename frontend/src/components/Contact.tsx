import React, { useState, FormEvent } from "react";
import "../styles/contact.css";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
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
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Use validateForm() to check for errors
    if (!validateForm()) return;

    setIsSubmitting(true);
  
    try {
      const response = await fetch("https://websitedrapaula-v2.onrender.com/api/send_contact_email/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: formData.name,
            email: formData.email,
            message: formData.message,
          }),
        }
      );
  
      const data = await response.json();
  
      if (response.ok) {
        setFormSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setFormSubmitted(false), 5000);
      } else {
        setError(`Erro ao enviar email: ${data.error}`);
      }
    } catch (error) {
      console.error("Erro:", error);
      setError("Erro ao enviar email.");
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  const { t } = useTranslation();

  return (
    <div id="contact" className="contact-page">
      <div className="contact-container">
        <h1 className="contact-header">{t("contact")}</h1>
        
        <div className="contact-content">
          {/* Contact Form Section */}
          <div className="contact-form">
            {formSubmitted ? (
              <div className="form-success">
                <p>{t("contact_us_success")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2>{t("contact_us_form_h2")}</h2>
                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                  <label htmlFor="name">{t("contact_us_form_name")}:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t("contact_us_form_name_placeholder")}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">{t("contact_us_form_email")}:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t("email_placeholder")}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">{t("contact_us_form_messag")}:</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t("contact_us_form_messag_placeholder")}
                    rows={5}
                  />
                </div>

                <button type="submit" className="submit-button">
                  {t("contact_us_form_button")}
                </button>
              </form>
            )}
          </div>

          {/* Contact Information Section */}
          <div className="contact-info">
            <div className="info-section">
              <h2>Email</h2>
              <p>paulaserranoeducacao@gmail.com</p>
              
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="contact-footer">
          <div className="footer-section">
            <h3>{t("cust_area")}</h3>
            <ul>
              <li><a href="/profile">{t("ac_o1")}</a></li>
              <li><a href="/cart">{t("ac_o2")}</a></li>
              <li><a href="/contact#contact">{t("ac_o3")}</a></li>
              <li><a href="/mentorship-details#faq">{t("ac_o4")}</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>{t("info")}</h3>
            <ul>
              <li><a href="/politica">{t("info_o1")}</a></li>
              <li><a href="/politica-cookies">{t("info_o2")}</a></li>
              <li><a href="/termos-condicoes">{t("info_o3")}</a></li>
              <li><a href="https://www.livroreclamacoes.pt/Inicio/">{t("info_o4")}</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="contact-copyright">
          <p>© {new Date().getFullYear()} {t("footer_bottom")}</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
