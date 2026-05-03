import { useState, useEffect, useRef, useCallback } from "react";
import {
  Menu, X, Heart, ShoppingBag, User,
  ChevronDown, LogIn, UserPlus, UserCircle, LogOut,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import logo from "../assets/20.png";
import "../styles/navigation.css";
import { useTranslation } from "react-i18next";
import ptFlag from "../assets/flag-pt.png";
import gbFlag from "../assets/flag-gb.png";

/* ─── Types ─────────────────────────────────────── */
interface NavItem {
  label: string;
  href: string;
  subItems?: { label: string; href: string }[];
}

/* ─── Helpers ───────────────────────────────────── */
const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const decoded: any = jwtDecode(token);
    return decoded.exp < Date.now() / 1000;
  } catch {
    return true;
  }
};

/* ─── Component ─────────────────────────────────── */
const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openNavDropdown, setOpenNavDropdown] = useState<string | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuInnerRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  /* ── Navigation links ── */
  const navigationLinks: NavItem[] = [
    { label: t("home"), href: "/nossos-valores" },
    { label: t("meating_ps"), href: "#about" },
    {
      label: t("tranings"),
      href: "#",
      subItems: [
        { label: t("tranings_courses"), href: "#cursos" },
        { label: t("tranings_mentorships"), href: "#mentorias" },
        { label: t("tranings_Immersions"), href: "#imersoes" },
      ],
    },
    {
      label: t("resources"),
      href: "#",
      subItems: [
        { label: t("resources_books"), href: "#livros" },
        { label: t("resources_articles"), href: "/artigos-teses" },
      ],
    },
    { label: t("contact"), href: "/contact" },
  ];

  /* ── Scroll detection ── */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Auth check ── */
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token && !isTokenExpired(token)) {
      setIsLoggedIn(true);
      axios
        .get("https://websitedrapaula-v2.onrender.com/api/users/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const name =
            res.data?.user?.full_name ?? res.data?.full_name ?? "";
          setUserName(name);
        })
        .catch((err) => {
          if (axios.isAxiosError(err) && err.response?.status === 401)
            handleLogout();
        });
    } else {
      setIsLoggedIn(false);
      setUserName("");
    }
  }, [location.pathname]);

  /* ── Close-outside handler ── */
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target as Node)
      )
        setUserDropdownOpen(false);

      const clickedAny = Object.values(dropdownRefs.current).some(
        (ref) => ref?.contains(e.target as Node)
      );
      if (!clickedAny) setOpenNavDropdown(null);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenNavDropdown(null);
        setUserDropdownOpen(false);
        closeMobileMenu();
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [isMenuOpen]);

  /* ── Resize handler ── */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) closeMobileMenu();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isMenuOpen]);

  /* ── Helpers ── */
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const closeMobileMenu = useCallback(() => {
    const el = mobileMenuRef.current;
    if (!el || !isMenuOpen) return;
    el.classList.remove("open");
    setTimeout(() => setIsMenuOpen(false), 380);
  }, [isMenuOpen]);

  const openMobileMenu = () => {
    setIsMenuOpen(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        mobileMenuRef.current?.classList.add("open");
      });
    });
  };

  const toggleMobileMenu = () =>
    isMenuOpen ? closeMobileMenu() : openMobileMenu();

  const handleLinkClick = (href: string) => {
    closeMobileMenu();
    setOpenNavDropdown(null);
    setUserDropdownOpen(false);

    setTimeout(() => {
      if (href.startsWith("#")) {
        const id = href.slice(1);
        if (location.pathname === "/") {
          scrollToSection(id);
        } else {
          navigate(`/#${id}`);
        }
      } else {
        navigate(href);
        scrollToTop();
      }
    }, 10);
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsLoggedIn(false);
    setUserName("");
    setOpenNavDropdown(null);
    setUserDropdownOpen(false);
    closeMobileMenu();
    navigate("/login");
    scrollToTop();
  };

  /* ─── Render ─────────────────────────────────── */
  return (
    <nav className={`navbar${isScrolled ? " scrolled" : ""}`}>
      <div className="navbar-container">
        {/* ── Main row ── */}
        <div className="navbar-main">

          {/* Logo */}
          <div className="navbar-logo">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                closeMobileMenu();
                scrollToTop();
                navigate("/");
              }}
            >
              <img src={logo} alt="Logo" className="logo-img" />
            </a>
          </div>

          {/* Desktop links */}
          <nav className="navbar-links desktop" aria-label="Main navigation">
            {navigationLinks.map((link) => (
              <div
                key={link.label}
                className={`dropdown-container${openNavDropdown === link.label ? " active" : ""}`}
                ref={(el) => { dropdownRefs.current[link.label] = el; }}
              >
                {link.subItems ? (
                  <>
                    <button
                      className="dropdown-trigger"
                      onClick={() =>
                        setOpenNavDropdown(
                          openNavDropdown === link.label ? null : link.label
                        )
                      }
                      aria-expanded={openNavDropdown === link.label}
                      aria-haspopup="true"
                    >
                      {link.label}
                      <ChevronDown className="dropdown-icon" aria-hidden="true" />
                    </button>
                    <div className="dropdown-menu" role="menu">
                      {link.subItems.map((sub) => (
                        <a
                          key={sub.label}
                          href={sub.href}
                          role="menuitem"
                          onClick={(e) => {
                            e.preventDefault();
                            handleLinkClick(sub.href);
                          }}
                        >
                          {sub.label}
                        </a>
                      ))}
                    </div>
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
          </nav>

          {/* Right icons */}
          <div className="navbar-icons">

            {/* Language selector */}
            <div className="language-selector desktop" role="group" aria-label="Language">
              {i18n.languages.map((lang) => (
                <button
                  key={lang}
                  className={i18n.language === lang ? "active" : ""}
                  onClick={() => i18n.changeLanguage(lang)}
                  aria-pressed={i18n.language === lang}
                >
                  <span className="lang-button-content">
                    {lang.toUpperCase()}
                    <img
                      src={lang === "pt" ? ptFlag : gbFlag}
                      alt={lang}
                      width="18"
                      height="13"
                    />
                  </span>
                </button>
              ))}
            </div>

            {/* User */}
            <div
              className={`user-icon-wrapper${userDropdownOpen ? " active" : ""}`}
              ref={userDropdownRef}
            >
              <button
                className="icon-btn"
                onClick={() => setUserDropdownOpen((v) => !v)}
                aria-expanded={userDropdownOpen}
                aria-haspopup="true"
                aria-label="Account"
              >
                <User
                  className="icon"
                  aria-hidden="true"
                  color={isLoggedIn ? "#16a34a" : "currentColor"}
                />
              </button>

              {isLoggedIn && userName && (
                <div className="hover-message" aria-hidden="true">
                  {t("welcome")}, {userName}
                </div>
              )}

              <div className="user-dropdown-menu" role="menu">
                {isLoggedIn ? (
                  <>
                    <button
                      className="user-dropdown-button"
                      role="menuitem"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate("/profile");
                        scrollToTop();
                      }}
                    >
                      <UserCircle size={16} aria-hidden="true" />
                      {t("profile")}
                    </button>
                    <div className="user-dropdown-divider" />
                    <button
                      className="user-dropdown-button danger"
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} aria-hidden="true" />
                      {t("logout")}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="user-dropdown-button"
                      role="menuitem"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate("/login");
                        scrollToTop();
                      }}
                    >
                      <LogIn size={16} aria-hidden="true" />
                      {t("login")}
                    </button>
                    <button
                      className="user-dropdown-button"
                      role="menuitem"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate("/register");
                        scrollToTop();
                      }}
                    >
                      <UserPlus size={16} aria-hidden="true" />
                      {t("registration")}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Wishlist */}
            <button
              className="icon-btn"
              onClick={() => { closeMobileMenu(); navigate("/wishlist"); scrollToTop(); }}
              aria-label="Wishlist"
            >
              <Heart className="icon" aria-hidden="true" />
            </button>

            {/* Cart */}
            <button
              className="icon-btn"
              onClick={() => { closeMobileMenu(); navigate("/cart"); scrollToTop(); }}
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="icon" aria-hidden="true" />
            </button>

            {/* Hamburger */}
            <button
              className="mobile-menu-button"
              onClick={toggleMobileMenu}
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen
                ? <X size={22} aria-hidden="true" />
                : <Menu size={22} aria-hidden="true" />
              }
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        <div
          className="mobile-menu"
          ref={mobileMenuRef}
          aria-hidden={!isMenuOpen}
        >
          <div className="mobile-menu-inner" ref={mobileMenuInnerRef}>

            {/* Nav items */}
            {navigationLinks.map((link) => (
              <div
                key={link.label}
                className={`mobile-dropdown-container${openNavDropdown === link.label ? " active" : ""}`}
              >
                {link.subItems ? (
                  <>
                    <button
                      className="mobile-dropdown-trigger"
                      onClick={() =>
                        setOpenNavDropdown(
                          openNavDropdown === link.label ? null : link.label
                        )
                      }
                      aria-expanded={openNavDropdown === link.label}
                    >
                      {link.label}
                      <ChevronDown className="dropdown-icon" aria-hidden="true" />
                    </button>
                    <div className="mobile-dropdown-menu">
                      {link.subItems.map((sub) => (
                        <a
                          key={sub.label}
                          href={sub.href}
                          onClick={(e) => {
                            e.preventDefault();
                            handleLinkClick(sub.href);
                          }}
                        >
                          {sub.label}
                        </a>
                      ))}
                    </div>
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

            <div className="mobile-divider" />

            {/* Auth buttons */}
            {isLoggedIn ? (
              <>
                <button
                  className="mobile-action-button ghost"
                  onClick={() => { closeMobileMenu(); navigate("/profile"); scrollToTop(); }}
                >
                  <UserCircle size={18} aria-hidden="true" />
                  {t("profile")}
                </button>
                <button
                  className="mobile-action-button danger"
                  onClick={handleLogout}
                >
                  <LogOut size={18} aria-hidden="true" />
                  {t("logout")}
                </button>
              </>
            ) : (
              <>
                <button
                  className="mobile-action-button primary"
                  onClick={() => { closeMobileMenu(); navigate("/login"); scrollToTop(); }}
                >
                  <LogIn size={18} aria-hidden="true" />
                  {t("login")}
                </button>
                <button
                  className="mobile-action-button ghost"
                  onClick={() => { closeMobileMenu(); navigate("/register"); scrollToTop(); }}
                >
                  <UserPlus size={18} aria-hidden="true" />
                  {t("registration")}
                </button>
              </>
            )}

            <div className="mobile-divider" />

            {/* Language */}
            <div
              className="mobile-language-selector"
              role="group"
              aria-label="Language"
            >
              {i18n.languages.map((lang) => (
                <button
                  key={lang}
                  className={i18n.language === lang ? "active" : ""}
                  onClick={() => { i18n.changeLanguage(lang); }}
                  aria-pressed={i18n.language === lang}
                >
                  {lang === "pt" ? "🇵🇹" : "🇬🇧"} {lang.toUpperCase()}
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;