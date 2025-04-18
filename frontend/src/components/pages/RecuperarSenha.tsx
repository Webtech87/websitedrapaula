import { useState } from "react";
import { Link } from "react-router-dom";
import config from "@/config";
import "../../styles/pages/recuperar-senha.css";
import { useTranslation } from 'react-i18next';

const RecuperarSenha = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });
    
    try {
      const response = await fetch(`${config.backendUrl}/api/auth/password-reset/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      // Even if the email doesn't exist, we should show the same message for security reasons
      setMessage({
        text: t("reset_pass_success"),
        type: "success"
      });
      setEmail("");
      
    } catch (error) {
      console.error("Password reset request error:", error);
      setMessage({
        text: t("reset_pass_error"),
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="recovery-page">
      <div className="recovery-container">
        <div className="recovery-card">
          <div className="recovery-header">
            <h2>{t("account.login.reset_password")}</h2>
            <p>{t("reset_pass_p")}</p>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="recovery-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder={t("insert_email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="recovery-input"
                disabled={isSubmitting}
              />
            </div>

            <button 
              type="submit" 
              className={`recovery-button ${isSubmitting ? 'submitting' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? t("sending") : t("account.login.reset_password")}
            </button>
          </form>

          <div className="recovery-footer">
            <Link to="/login" className="back-link">
              <span className="back-arrow">←</span> {t("back_login")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecuperarSenha;