import { useState, useEffect, useRef } from "react";
import { Menu, X, Heart, ShoppingBag, User, ChevronDown } from "lucide-react";
import { useMobile } from "../hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import "../styles/navigation.css";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdowns, setDropdowns] = useState({
    navDropdown: null as string | null,
    userDropdown: false,
  });
  const [language, setLanguage] = useState<"PT" | "EN">("PT");
  const isMobile = useMobile();
  const navigate = useNavigate();

  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const navigationLinks = [
    { label: "Home", href: "/" },
    {
      label: "Sobre a Fundadora",
      href: "#",
      subItems: [
        { label: "PSE", href: "#" },
        
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
      label: "Mentorias",
      href: "#",
    },
    {
      label: "Recursos",
      href: "#",
      subItems: [
        { label: "Livros e ebooks", href: "#" },
        { label: "Artigos e teses", href: "#" },
      ],
    },
    { label: "Contacto", href: "/contact" }, // Updated href to "/contact"
  ];

  const toggleDropdown = (label: string) => {
    setDropdowns((prev) => ({
      ...prev,
      navDropdown: prev.navDropdown === label ? null : label,
    }));
  };

  const toggleUserDropdown = () => {
    setDropdowns((prev) => ({
      ...prev,
      userDropdown: !prev.userDropdown,
    }));
  };

  const handleWishlistClick = () => {
    navigate("/wishlist");
  };

  const handleLinkClick = (href: string) => {
    navigate(href);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current?.contains(event.target as Node)) return;

      let clickedOutsideAll = true;
      Object.values(dropdownRefs.current).forEach((ref) => {
        if (ref && ref.contains(event.target as Node)) {
          clickedOutsideAll = false;
        }
      });

      if (clickedOutsideAll) {
        setDropdowns({ navDropdown: null, userDropdown: false });
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDropdowns({ navDropdown: null, userDropdown: false });
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-main">
          {/* Logo */}
          <div className="navbar-logo">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
              <img src={logo} alt="Logo" className="logo-img" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="navbar-links desktop">
            {navigationLinks.map((link) => (
              <div
                key={link.label}
                className="dropdown-container"
                ref={(el) => {
                  if (link.subItems) dropdownRefs.current[link.label] = el;
                }}
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
                    {dropdowns.navDropdown === link.label && (
                      <div className="dropdown-menu">
                        {link.subItems.map((subItem) => (
                          <a
                            key={subItem.label}
                            href={subItem.href}
                            onClick={(e) => {
                              e.preventDefault();
                              handleLinkClick(subItem.href);
                              setDropdowns({ ...dropdowns, navDropdown: null });
                            }}
                          >
                            {subItem.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.href);
                    }}
                  >
                    {link.label}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Icons */}
          <div className="navbar-icons">
  <div className="user-dropdown-container" ref={userDropdownRef}>
    <User className="icon" onClick={toggleUserDropdown} />
    {dropdowns.userDropdown && (
      <div className="user-dropdown-menu">
        <button
          className="user-dropdown-button"
          onClick={() => navigate("/login")}
        >
          Iniciar sessão
        </button>
        <button
          className="user-dropdown-button"
          onClick={() => navigate("/register")}
        >
          Criar uma conta
        </button>
      </div>
    )}
  </div>
  <Heart className="icon" onClick={handleWishlistClick} />
  <ShoppingBag className="icon" onClick={() => navigate("/cart")} /> {/* Add this line */}

  <div className="language-selector desktop">
    {["PT", "EN"].map((lang) => (
      <button
        key={lang}
        className={language === lang ? "active" : ""}
        onClick={() => setLanguage(lang as "PT" | "EN")}
      >
        {lang} {lang === "PT" ? "🇵🇹" : "🇬🇧"}
      </button>
    ))}
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
                ref={(el) => {
                  if (link.subItems) dropdownRefs.current[link.label] = el;
                }}
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
                    {dropdowns.navDropdown === link.label && (
                      <div className="mobile-dropdown-menu">
                        {link.subItems.map((subItem) => (
                          <a
                            key={subItem.label}
                            href={subItem.href}
                            onClick={(e) => {
                              e.preventDefault();
                              handleLinkClick(subItem.href);
                              setDropdowns({ ...dropdowns, navDropdown: null });
                            }}
                          >
                            {subItem.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.href);
                    }}
                  >
                    {link.label}
                  </a>
                )}
              </div>
            ))}
            <div className="mobile-language-selector">
              {["PT", "EN"].map((lang) => (
                <button
                  key={lang}
                  className={language === lang ? "active" : ""}
                  onClick={() => setLanguage(lang as "PT" | "EN")}
                >
                  {lang} {lang === "PT" ? "🇵🇹" : "🇬🇧"}
                </button>
              ))}
            </div>


          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;