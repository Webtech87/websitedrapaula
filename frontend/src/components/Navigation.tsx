import { useState, useEffect, useRef } from "react";
import { Menu, X, Heart, ShoppingBag, User, ChevronDown } from "lucide-react";
import { useMobile } from "../hooks/use-mobile";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import logo from "../assets/20.png";
import "../styles/navigation.css";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdowns, setDropdowns] = useState({
    navDropdown: null as string | null,
    userDropdown: false,
  });
  const [language, setLanguage] = useState<"PT" | "EN">("PT");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [userName, setUserName] = useState(""); // Store the user's name
  const isMobile = useMobile();
  const navigate = useNavigate();
  const location = useLocation(); // Track route changes

  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const navigationLinks = [
    { label: "Home", href: "/" },
    {
      label: "Sobre a Fundadora",
      href: "#",
      subItems: [{ label: "PSE", href: "#" }],
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
    { label: "Mentorias", href: "#" },
    {
      label: "Recursos",
      href: "#",
      subItems: [
        { label: "Livros e ebooks", href: "#" },
        { label: "Artigos e teses", href: "#" },
      ],
    },
    { label: "Contacto", href: "/contact" },
  ];

  // Combined useEffect for login status and user profile fetching
  useEffect(() => {
    console.log("Navigation component rendered");
    const token = localStorage.getItem("access");
    setIsLoggedIn(!!token);
    if (token) {
      const fetchUserProfile = async () => {
        try {
          const response = await axios.get("http://localhost:8000/api/user/profile/", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserName(response.data.full_name);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };
      fetchUserProfile();
    } else {
      setUserName("");
    }
  }, [location]); // Re-run when the route changes

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

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsLoggedIn(false);
    setUserName(""); // Clear the name on logout
    navigate("/login");
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
          <div className="navbar-logo">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/";
              }}
            >
              <img src={logo} alt="Logo" className="logo-img" />
            </a>
          </div>

          <div className="navbar-links desktop">
            {navigationLinks.map((link) => (
              <div key={link.label} className="dropdown-container">
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
                      if (link.label === "Home") {
                        window.location.href = "/";
                      } else {
                        handleLinkClick(link.href);
                      }
                    }}
                  >
                    {link.label}
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="navbar-icons">
            {/* Wrapper for the user icon and hover message */}
            <div className="user-icon-wrapper" ref={userDropdownRef}>
              <User
                className="icon"
                color={isLoggedIn ? "green" : "black"} // Change color based on login status
                onClick={toggleUserDropdown}
              />
              {isLoggedIn && userName && (
                <div className="hover-message">Olá {userName}</div>
              )}
              {dropdowns.userDropdown && (
                <div className="user-dropdown-menu">
                  {isLoggedIn ? (
                    <>
                      <button
                        className="user-dropdown-button"
                        onClick={() => navigate("/profile")}
                      >
                        Perfil
                      </button>
                      <button
                        className="user-dropdown-button"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              )}
            </div>
            <Heart className="icon" onClick={handleWishlistClick} />
            <ShoppingBag className="icon" onClick={() => navigate("/cart")} />

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

        {isMenuOpen && isMobile && (
          <div className="mobile-menu">
            {navigationLinks.map((link) => (
              <div key={link.label} className="mobile-dropdown-container">
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
            {/* User options in mobile menu */}
            {isLoggedIn ? (
              <>
                <button
                  className="mobile-menu-button"
                  onClick={() => navigate("/profile")}
                >
                  Perfil
                </button>
                <button className="mobile-menu-button" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="mobile-menu-button"
                  onClick={() => navigate("/login")}
                >
                  Iniciar sessão
                </button>
                <button
                  className="mobile-menu-button"
                  onClick={() => navigate("/register")}
                >
                  Criar uma conta
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;