import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Flag from "react-world-flags";
import "./Navbar.css";

const languages = [
  { code: "en", name: "English", flagCode: "gb" },
  { code: "ru", name: "Русский", flagCode: "ru" },
];

const LanguageDropdown = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLanguage = i18n?.language || "en";
  const selectedLang = languages.find((l) => l.code === currentLanguage) || languages[0];

  const handleSelect = (lang) => {
    i18n.changeLanguage(lang.code);
    localStorage.setItem("language", lang.code);
    setOpen(false);
  };

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="custom-language-dropdown" ref={dropdownRef}>
      <button className="dropdown-toggle" onClick={() => setOpen((prev) => !prev)}>
        <Flag code={selectedLang.flagCode} style={{ width: 20, height: 14 }} />
        <span>{selectedLang.name}</span>
        <span className="chevron">▼</span>
      </button>

      {open && (
        <div className="dropdown-menu">
          {languages.map((lang) => (
            <div
              key={lang.code}
              className={`dropdown-item ${lang.code === currentLanguage ? "active" : ""}`}
              onClick={() => handleSelect(lang)}
            >
              <Flag code={lang.flagCode} style={{ width: 20, height: 14, marginRight: 8 }} />
              {lang.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;
