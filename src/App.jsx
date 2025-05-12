import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import QRScanner from "./components/QRScanner";
import QRView from "./components/QRView";
import Login from "./components/Login";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Improved token validator with logging
  const isTokenValid = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Token missing from localStorage");
      return false;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      const timeLeft = decoded.exp - currentTime;

      console.log(`Token expires in ${Math.floor(timeLeft)} seconds`);

      // Consider invalid if token is expiring very soon
      if (timeLeft < 60) {
        console.warn("Token is about to expire (under 60s)");
        return false;
      }

      return decoded.exp > currentTime;
    } catch (error) {
      console.error("Token decoding error:", error);
      return false;
    }
  };

  const checkAuthentication = () => {
    const role = localStorage.getItem("userRole");
    return isTokenValid() && role === "admin";
  };

  const handleSuccessfulLogin = () => {
    setIsAuthenticated(true);
    navigate("/qrscanner");
  };

  useEffect(() => {
    setIsAuthenticated(checkAuthentication());

    const interval = setInterval(() => {
      const valid = isTokenValid();
      console.log("Periodic token check - valid:", valid);

      if (!valid) {
        console.warn("Token expired or invalid. Logging out.");
        setIsAuthenticated(false);
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userEmail");
        navigate("/");
      }
    }, 60000); // every 60 seconds

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
                <Route
                  path="/qrscanner/view/:userId/:courseId/:formId"
                  element={<QRView />}
                />
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
            element={
              isAuthenticated ? (
                <Navigate to="/qrscanner" replace />
              ) : (
                <Login onLogin={handleSuccessfulLogin} />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </div>
  );
};

export default App;
