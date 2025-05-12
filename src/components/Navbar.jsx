import React from "react";
import { FiLogOut } from "react-icons/fi";
import LanguageDropdown from "./LanguageDropdown";
import "./Navbar.css";

const Navbar = ({ isLoggedIn, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => window.location.href = "/qrscanner"}>
        <img
          src="https://static.wixstatic.com/media/e6f22e_a90a0fab7b764c24805e7e43d165d416~mv2.png"
          alt="Logo"
        />
      </div>

      <div className="navbar-right">
        <div className="language-selector">
          <LanguageDropdown />
        </div>

        {isLoggedIn && (
          <button className="logout-btn" onClick={onLogout} title="Logout">
            <FiLogOut />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
