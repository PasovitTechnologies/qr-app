import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import QRScanner from './components/QRScanner';
import QRView from './components/QRView';
import Navbar from './components/Navbar';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <QRScanner /> : <LoginWrapper setIsAuthenticated={setIsAuthenticated} />} 
        />
        <Route 
          path="/qrscanner/view/:userId/:courseId/:formId" 
          element={isAuthenticated ? <QRView /> : <Navigate to="/" />} 
        />
      </Routes>
    </div>
  );
};

// Wrapper to pass auth state setter to Login
const LoginWrapper = ({ setIsAuthenticated }) => (
  <Login onLogin={() => setIsAuthenticated(true)} />
);

export default App;
