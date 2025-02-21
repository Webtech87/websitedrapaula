import { useState, useEffect, useRef } from "react";
import { Menu, X, Heart, ShoppingBag, User, ChevronDown } from "lucide-react";
import { useMobile } from "../hooks/use-mobile";
import logo from "../assets/logo.svg";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [language, setLanguage] = useState<"PT" | "EN">("PT"); // Default to PT
  const isMobile = useMobile();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigationLinks = [
    { label: "Home", href: "#" },
    {
      label: "Sobre mim",
      href: "#",
      subItems: [
        { label: "PSE", href: "#" },
        { label: "Miudos & etc", href: "#" },
      ],
    },
    {
      label: "Formações",
      href: "#",
      subItems: [
        { label: "Cursos", href: "#" },
        { label: "Mentorias", href: "#" },
        { label: "Imersoes", href: "#" },
      ],
    },
    {
      label: "Recursos",
      href: "#",
      subItems: [
        { label: "Livros e ebooks", href: "#" },
        { label: "Artigos e teses", href: "#" },
      ],
    },
    { label: "Contacto", href: "#" },
  ];

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-main">
          {/* Logo */}
          <div className="navbar-logo">
            <a href="/">
              <img src={logo} alt="Logo" className="logo-img" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="navbar-links desktop">
            {navigationLinks.map((link) => (
              <div
                key={link.label}
                className="dropdown-container"
                ref={link.subItems ? dropdownRef : null}
              >
                {link.subItems ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(link.label)}
                      className="dropdown-trigger"
                    >
                      {link.label}
                      <ChevronDown className="dropdown-icon" />
                    </button>
                    {openDropdown === link.label && (
                      <div className="dropdown-menu">
                        {link.subItems.map((subItem) => (
                          <a
                            key={subItem.label}
                            href={subItem.href}
                            onClick={() => setOpenDropdown(null)}
                          >
                            {subItem.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <a href={link.href}>{link.label}</a>
                )}
              </div>
            ))}
          </div>

          {/* Icons */}
          <div className="navbar-icons">
            <User className="icon" />
            <Heart className="icon" />
            <ShoppingBag className="icon" />
            <div className="language-selector desktop">
              <button
                className={language === "PT" ? "active" : ""}
                onClick={() => setLanguage("PT")}
              >
                PT 🇵🇹
              </button>
              <span>|</span>
              <button
                className={language === "EN" ? "active" : ""}
                onClick={() => setLanguage("EN")}
              >
                EN 🇬🇧
              </button>
            </div>
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
              <div
                key={link.label}
                className="mobile-dropdown-container"
                ref={link.subItems ? dropdownRef : null}
              >
                {link.subItems ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(link.label)}
                      className="mobile-dropdown-trigger"
                    >
                      {link.label}
                      <ChevronDown className="dropdown-icon" />
                    </button>
                    {openDropdown === link.label && (
                      <div className="mobile-dropdown-menu">
                        {link.subItems.map((subItem) => (
                          <a
                            key={subItem.label}
                            href={subItem.href}
                            onClick={() => {
                              setIsMenuOpen(false);
                              setOpenDropdown(null);
                            }}
                          >
                            {subItem.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <a href={link.href} onClick={() => setIsMenuOpen(false)}>
                    {link.label}
                  </a>
                )}
              </div>
            ))}
            <div className="mobile-language-selector">
              <button
                className={language === "PT" ? "active" : ""}
                onClick={() => setLanguage("PT")}
              >
                PT 🇵🇹
              </button>
              <span>|</span>
              <button
                className={language === "EN" ? "active" : ""}
                onClick={() => setLanguage("EN")}
              >
                EN 🇬🇧
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;