import React from "react";
import { FiLogOut } from "react-icons/fi";
import "./Navbar.css";

const Navbar = ({ isLoggedIn, onLogout }) => {
  const handleLogout = () => {
    if (onLogout) onLogout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img
          src="https://static.wixstatic.com/media/e6f22e_a90a0fab7b764c24805e7e43d165d416~mv2.png"
          alt="Logo"
        />
      </div>

      {isLoggedIn && (
        <div className="navbar-right">
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
