import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import QRScanner from './components/QRScanner';
import QRView from './components/QRView';
import Navbar from './components/Navbar';
import "./i18n";


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/qrscanner'); // redirect to QRScanner after login
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    navigate('/'); // redirect to login after logout
  };

  useEffect(() => {
    // Keep sync in case token is added/removed outside (e.g., in another tab)
    const syncLogin = () => setIsLoggedIn(!!localStorage.getItem('token'));
    window.addEventListener('storage', syncLogin);
    return () => window.removeEventListener('storage', syncLogin);
  }, []);

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/qrscanner" element={<QRScanner />} />
        <Route path="/qrscanner/view/:userId/:courseId/:formId" element={<QRView />} />
      </Routes>
    </div>
  );
};

export default App;
