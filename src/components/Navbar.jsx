import React, { useState } from "react";
import { FiLogOut, FiGlobe } from "react-icons/fi";
import "./Navbar.css"; // Optional, for custom styling

const Navbar = ({ isLoggedIn, onLogout }) => {
  const [lang, setLang] = useState(localStorage.getItem("dashboardLang") || "en");

  const toggleLanguage = () => {
    const newLang = lang === "en" ? "ru" : "en";
    setLang(newLang);
    localStorage.setItem("dashboardLang", newLang);
    window.location.reload(); // reload to apply language globally
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <img
          src="https://static.wixstatic.com/media/e6f22e_a90a0fab7b764c24805e7e43d165d416~mv2.png"
          alt="Logo"
        />
      </div>

    </nav>
  );
};

export default Navbar;
