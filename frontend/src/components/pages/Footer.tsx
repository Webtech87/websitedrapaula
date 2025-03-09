import React from "react";
import "../../styles/pages/footer.css"; // Adjust the path based on your project structure
import logo from "../../assets/logo.svg"; // Ensure this path matches your logo file

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left - Logo & Social Icons */}
        <div className="footer-logo">
          <img src={logo} alt="Logo Paula Serrano" />
          <div className="social-icons">
            <a href="#" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" aria-label="Email">
              <i className="fas fa-envelope"></i>
            </a>
          </div>
        </div>

        {/* Middle - Contact Information */}
        <div className="footer-column">
          <h3>CONTACTO</h3>
          <p>Segunda - Sexta<br />9:00 - 18:00</p>
          <p>
            (+351) 965 430 026<br />
            <span className="small-text">(Chamada para rede móvel nacional)</span>
          </p>
          <p>Rua Arthur Águedo Miranda, Bloco 2, Loja A,<br />Loja C - 000-000, Faro</p>
        </div>

        {/* Right - Client Area */}
        <div className="footer-column">
          <h3>ÁREA DO CLIENTE</h3>
          <ul>
            <li><a href="#">A minha conta</a></li>
            <li><a href="#">Encomendas</a></li>
            <li><a href="#">Entregas</a></li>
            <li><a href="#">Perguntas Frequentes</a></li>
          </ul>
        </div>

        {/* Right - Informations */}
        <div className="footer-column">
          <h3>INFORMAÇÕES</h3>
          <ul>
            <li><a href="#">Política de Privacidade</a></li>
            <li><a href="#">Política de Cookies</a></li>
            <li><a href="#">Termos e condições</a></li>
            <li><a href="#">Livro de Reclamações</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>Todos os direitos reservados por ©Paula Serrano</p>
      </div>
    </footer>
  );
};

export default Footer;