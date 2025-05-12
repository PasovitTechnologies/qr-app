import React, { useState } from 'react';
import ReactQRScanner from 'react-qr-scanner';
import { FiCamera, FiCheckCircle, FiLink, FiRotateCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './QRScanner.css';

export default function QRScanner() {
  const [status, setStatus] = useState('loading');
  const [scannedData, setScannedData] = useState(null);
  const [showRedirect, setShowRedirect] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState('environment');
  const [permissionDenied, setPermissionDenied] = useState(false);

  const navigate = useNavigate(); // Initialize navigate hook

  const handleScan = (data) => {
    if (data && data.text) {
      setScannedData(data.text);
      console.log(data.text);
      setStatus('success');
      if (isValidUrl(data.text)) {
        setShowRedirect(true);
        setTimeout(() => {
          navigate(data.text); // Use navigate to redirect without reloading the page
        }, 2000);
      }
    }
  };

  const handleError = (err) => {
    console.error('QR Scan Error:', err);
    setStatus('error');
    setPermissionDenied(true);
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const toggleCamera = () => {
    setCameraFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  return (
    <div className="qr-scanner-container">
      <div className="qr-scanner-header">
        <h2><FiCamera /> QR Code Scanner</h2>
        <p>Point your camera at a QR code</p>
      </div>

      <div className="qr-scanner-video-container">
        <div className="qr-scanner-overlay">
          {status === 'loading' && <p>Loading camera...</p>}

          {status === 'success' && (
            <div className="qr-scanner-success">
              <FiCheckCircle className="success-icon" />
              <p>QR Code Scanned</p>
              {showRedirect && (
                <div className="qr-redirect-notice">
                  <FiLink className="link-icon" />
                  <p>Redirecting to URL...</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Updated Scanner Component with facingMode constraints */}
        <ReactQRScanner
          delay={300}
          onScan={handleScan}
          onError={handleError}
          constraints={{
            video: { facingMode: { exact: cameraFacingMode } }
          }}
          style={{ width: '100%', height: 'auto' }}
          key={cameraFacingMode}
        />
      </div>

      <div className="qr-scanner-controls">
        <button onClick={toggleCamera}><FiRotateCw /> Switch Camera</button>
        {status === 'success' && <button onClick={() => setStatus('loading')}>Scan Another</button>}
      </div>

      {scannedData && !showRedirect && (
        <div className="qr-scanner-result">
          <h3>Raw QR Code Content</h3>
          <p>{scannedData}</p>
        </div>
      )}
    </div>
  );
}
