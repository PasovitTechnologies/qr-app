import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import QRScanner from './components/QRScanner';
import QRView from './components/QRView';
import Navbar from './components/Navbar';

const App = () => {
  // Check if the user is logged in by checking if the token exists in localStorage
  const isAuthenticated = Boolean(localStorage.getItem('token')); // Will be true if the token exists

  return (
    <div>
      <Navbar />
      <Routes>
        {/* If authenticated, show QRScanner and QRView */}
        <Route 
          path="/" 
          element={isAuthenticated ? <><QRScanner /></> : <Login />} 
        />
        
        {/* Protected route for QRView */}
        <Route 
          path="/qrscanner/view/:userId/:courseId/:formId" 
          element={isAuthenticated ? <QRView /> : <Navigate to="/" />} 
        />
      </Routes>
    </div>
  );
};

export default App;
