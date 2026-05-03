import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../styles/cookies.css";

interface CookiePrefs {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

const DEFAULT_PREFS: CookiePrefs = {
  necessary: true,
  analytics: false,
  marketing: false,
  functional: false,
};

const STORAGE_KEY = "dps_cookie_consent";

const loadPrefs = (): CookiePrefs | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const savePrefs = (prefs: CookiePrefs) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
};

const CookieBanner = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith("pt") ? "pt" : "en";

  const [visible, setVisible] = useState(false);
  const [hiding, setHiding] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [prefs, setPrefs] = useState<CookiePrefs>(DEFAULT_PREFS);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const saved = loadPrefs();
    if (!saved) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = (delay = 0) => {
    setTimeout(() => {
      setHiding(true);
      setTimeout(() => {
        setVisible(false);
        setHiding(false);
      }, 550);
    }, delay);
  };

  const acceptAll = () => {
    const all: CookiePrefs = { necessary: true, analytics: true, marketing: true, functional: true };
    savePrefs(all);
    setPrefs(all);
    setModalOpen(false);
    dismiss();
  };

  const rejectAll = () => {
    savePrefs(DEFAULT_PREFS);
    dismiss();
  };

  const saveSelected = () => {
    savePrefs(prefs);
    setModalOpen(false);
    dismiss(100);
  };

  const togglePref = (key: keyof CookiePrefs) => {
    if (key === "necessary") return;
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  };

  const toggleExpand = (key: string) =>
    setExpanded((v) => (v === key ? null : key));

  if (!visible) return null;

  const copy = {
    pt: {
      title: "A sua privacidade importa",
      desc: "Utilizamos cookies para melhorar a sua experiência, analisar o tráfego e personalizar conteúdos.",
      policy: "Política de Privacidade",
      acceptAll: "Aceitar todos",
      manage: "Gerir preferências",
      reject: "Rejeitar",
      modalTitle: "Preferências de cookies",
      modalSub: "Escolha quais os cookies que aceita. Os cookies necessários não podem ser desativados.",
      save: "Guardar preferências",
      categories: {
        necessary: { name: "Necessários", badge: "Obrigatórios", badgeRequired: true, desc: "Essenciais para o funcionamento do website. Incluem autenticação de sessão, segurança e preferências básicas." },
        analytics: { name: "Analíticos", badge: "Opcional", badgeRequired: false, desc: "Permitem-nos compreender como os visitantes interagem com o website, ajudando a melhorar o conteúdo e a navegação." },
        marketing: { name: "Marketing", badge: "Opcional", badgeRequired: false, desc: "Utilizados para apresentar anúncios relevantes e medir a eficácia de campanhas publicitárias." },
        functional: { name: "Funcionais", badge: "Opcional", badgeRequired: false, desc: "Memorizam as suas preferências, como idioma ou região, para uma experiência mais personalizada." },
      },
    },
    en: {
      title: "Your privacy matters",
      desc: "We use cookies to enhance your experience, analyse traffic and personalise content.",
      policy: "Privacy Policy",
      acceptAll: "Accept all",
      manage: "Manage preferences",
      reject: "Reject",
      modalTitle: "Cookie preferences",
      modalSub: "Choose which cookies you accept. Necessary cookies cannot be disabled.",
      save: "Save preferences",
      categories: {
        necessary: { name: "Necessary", badge: "Required", badgeRequired: true, desc: "Essential for the website to function. These include session authentication, security, and basic preferences." },
        analytics: { name: "Analytics", badge: "Optional", badgeRequired: false, desc: "Help us understand how visitors interact with the website, improving content and navigation." },
        marketing: { name: "Marketing", badge: "Optional", badgeRequired: false, desc: "Used to display relevant advertisements and measure the effectiveness of ad campaigns." },
        functional: { name: "Functional", badge: "Optional", badgeRequired: false, desc: "Remember your preferences such as language or region for a more personalised experience." },
      },
    },
  };

  const c = copy[lang];
  const categories: { key: keyof CookiePrefs; required?: boolean }[] = [
    { key: "necessary", required: true },
    { key: "analytics" },
    { key: "marketing" },
    { key: "functional" },
  ];

  return (
    <>
      <div
        className={`cookie-bar${visible ? " visible" : ""}${hiding ? " hiding" : ""}`}
        role="region"
        aria-label={c.title}
      >
        <div className="cookie-bar__inner">
          <div className="cookie-bar__icon" aria-hidden="true">🍪</div>
          <div className="cookie-bar__text">
            <p className="cookie-bar__title">{c.title}</p>
            <p className="cookie-bar__desc">
              {c.desc}{" "}
              <a href="/politica-cookies">{c.policy}</a>.
            </p>
          </div>
          <div className="cookie-bar__actions">
            <button className="cookie-btn cookie-btn--accept" onClick={acceptAll}>{c.acceptAll}</button>
            <button className="cookie-btn cookie-btn--manage" onClick={() => setModalOpen(true)}>{c.manage}</button>
            <button className="cookie-btn cookie-btn--reject" onClick={rejectAll}>{c.reject}</button>
          </div>
        </div>
      </div>

      <div
        className={`cookie-modal-overlay${modalOpen ? " visible" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={c.modalTitle}
        onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
      >
        <div className="cookie-modal">
          <div className="cookie-modal__handle" aria-hidden="true" />
          <div className="cookie-modal__header">
            <div>
              <h2 className="cookie-modal__title">{c.modalTitle}</h2>
              <p className="cookie-modal__subtitle">{c.modalSub}</p>
            </div>
            <button className="cookie-modal__close" onClick={() => setModalOpen(false)} aria-label="Close">✕</button>
          </div>
          <div className="cookie-modal__body">
            {categories.map(({ key, required }) => {
              const cat = c.categories[key];
              const isExpanded = expanded === key;
              return (
                <div key={key} className={`cookie-category${isExpanded ? " expanded" : ""}`}>
                  <div
                    className="cookie-category__header"
                    onClick={() => toggleExpand(key)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && toggleExpand(key)}
                  >
                    <div className="cookie-category__info">
                      <span className="cookie-category__name">
                        {cat.name}
                        <span className={`cookie-category__badge${cat.badgeRequired ? " cookie-category__badge--required" : ""}`}>
                          {cat.badge}
                        </span>
                        <span className="cookie-category__expand" aria-hidden="true">▾</span>
                      </span>
                      <span className="cookie-category__desc">{cat.desc}</span>
                    </div>
                    <label className="cookie-toggle" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={prefs[key]}
                        disabled={required}
                        onChange={() => togglePref(key)}
                        aria-label={cat.name}
                      />
                      <span className="cookie-toggle__track" />
                      <span className="cookie-toggle__thumb" />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="cookie-modal__footer">
            <button className="cookie-btn cookie-btn--accept-all" onClick={acceptAll}>{c.acceptAll}</button>
            <button className="cookie-btn cookie-btn--save" onClick={saveSelected}>{c.save}</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookieBanner;
