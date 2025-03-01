import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/pages/recuperar-senha.css";

const RecuperarSenha = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Se este email estiver registado, um link para redefinir a senha será enviado.");
  };

  return (
    <section className="auth-container">
      <h2>Recuperar Palavra-Passe</h2>
      <p>Digite seu email e enviaremos um link para redefinir sua senha.</p>

      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          placeholder="Insira o seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">Recuperar Palavra-Passe</button>
      </form>

      {/* 🔹 Link to Return to Login */}
      <div className="back-to-login">
        <Link to="/login">Voltar ao login</Link>
      </div>
    </section>
  );
};

export default RecuperarSenha;
