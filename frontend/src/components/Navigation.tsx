import { useState } from "react";
import { Menu, X, Heart, ShoppingBag, User } from "lucide-react";
import { useMobile } from "../hooks/use-mobile";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMobile();

  const navigationLinks = [
    { label: "Home", href: "#" },
    { label: "Sobre mim", href: "#" },
    { label: "Formações", href: "#" },
    { label: "Recursos", href: "#" },
    { label: "Contacto", href: "#" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-main">
          {/* Logo */}
          <div className="navbar-logo">
            <a href="/">PS</a>
          </div>

          {/* Desktop Navigation */}
          <div className="navbar-links desktop">
            {navigationLinks.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>

          {/* Icons */}
          <div className="navbar-icons">
            <User className="icon" />
            <Heart className="icon" />
            <ShoppingBag className="icon" />
            
            {/* Language Selector */}
            <div className="language-selector desktop">
              <button>PT 🇵🇹</button>
              <span>|</span>
              <button>EN 🇬🇧</button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="mobile-menu-button"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && isMobile && (
          <div className="mobile-menu">
            {navigationLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="mobile-language-selector">
              <button>PT 🇵🇹</button>
              <span>|</span>
              <button>EN 🇬🇧</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;