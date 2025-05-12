import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar";
import QRScanner from "./components/QRScanner";
import QRView from "./components/QRView";
import Login from "./components/Login";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check if token is valid
  const isTokenValid = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      return decoded.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  };

  // Check authentication status
  const checkAuthentication = () => {
    const role = localStorage.getItem("userRole");
    return isTokenValid() && role === "admin";
  };

  // Handle successful login
  const handleSuccessfulLogin = () => {
    setIsAuthenticated(true);
    navigate('/qrscanner');
  };

  useEffect(() => {
    setIsAuthenticated(checkAuthentication());

    const interval = setInterval(() => {
      if (!isTokenValid()) {
        setIsAuthenticated(false);
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userEmail");
        navigate('/');
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      <ToastContainer position="top-right" autoClose={3000} />

      {isAuthenticated ? (
        <>
          <Navbar />
          <div className="main-section">
            <div className="main-content">
              <Routes>
                <Route path="/qrscanner" element={<QRScanner />} />
                <Route path="/qrscanner/view/:userId/:courseId/:formId" element={<QRView />} />
                <Route path="/" element={<Navigate to="/qrscanner" />} />
                <Route path="*" element={<Navigate to="/qrscanner" />} />
              </Routes>
            </div>
          </div>
        </>
      ) : (
        <Routes>
          <Route 
  path="/" 
  element={isAuthenticated ? <Navigate to="/qrscanner" replace /> : <Login onLogin={handleSuccessfulLogin} />} 
/>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </div>
  );
};

export default App;
