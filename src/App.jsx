import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import QRScanner from './components/QRScanner';
import QRView from './components/QRView';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <div>
      <Navbar/>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/qrscanner" element={<QRScanner />} />
      <Route path="/qrscanner/view/:userId/:courseId/:formId" element={<QRView />} />
    </Routes>
    </div>
  );
};

export default App;
