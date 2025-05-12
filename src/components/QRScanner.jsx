import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactQRScanner from "react-qr-scanner";
import { useTranslation } from "react-i18next";

import {
  FiCamera,
  FiCheckCircle,
  FiXCircle,
  FiLink,
  FiRotateCw,
} from "react-icons/fi";
import "./QRScanner.css";

export default function QRScanner() {
  const [status, setStatus] = useState("loading");
  const [scannedData, setScannedData] = useState(null);
  const [showRedirect, setShowRedirect] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState("environment");
  const [permissionDenied, setPermissionDenied] = useState(false);
  const { t } = useTranslation();

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  // Prevent back navigation
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleScan = (data) => {
    if (data && data.text) {
      setScannedData(data.text);
      setStatus("success");

      if (isValidUrl(data.text)) {
        setShowRedirect(true);
        setTimeout(() => {
          if (data.text.startsWith("http") || data.text.startsWith("https")) {
            window.location.href = data.text;
          } else {
            navigate(data.text);
          }
        }, 2000);
      }
    }
  };

  const handleError = (err) => {
    console.error("QR Scan Error:", err);
    setStatus("error");
    setPermissionDenied(true);
  };

  const isValidUrl = (string) => {
    try {
      if (string.startsWith("/")) return true;
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const toggleCamera = () => {
    setCameraFacingMode((prev) =>
      prev === "environment" ? "user" : "environment"
    );
  };

  const resetScanner = () => {
    setStatus("loading");
    setScannedData(null);
    setShowRedirect(false);
  };

  return (
    <div className="qr-scanner-container">
      <div className="qr-scanner-header">
        <h2>
          <FiCamera className="header-icon" />
          <span>{t("qrScanner")}</span>
        </h2>
        <p className="instruction-text">{t("pointCamera")}</p>
      </div>

      <div className="qr-scanner-video-container">
        <div className={`qr-scanner-overlay ${status}`}>

          {status === "success" && (
            <div className="qr-scanner-success animate-pop">
              <FiCheckCircle className="success-icon" />
              <p>{t("qrScanned")}</p>
              {showRedirect && (
                <div className="qr-redirect-notice animate-pulse">
                  <FiLink className="link-icon" />
                  <p>{t("redirecting")}</p>
                </div>
              )}
            </div>
          )}

          

          {/* Scanner frame overlay */}
          <div className="scanner-frame">
            <div className="frame-corner top-left"></div>
            <div className="frame-corner top-right"></div>
            <div className="frame-corner bottom-left"></div>
            <div className="frame-corner bottom-right"></div>
            <div className="scan-line"></div>
          </div>
        </div>

        <ReactQRScanner
          delay={300}
          onScan={handleScan}
          onError={handleError}
          constraints={{
            video: { facingMode: { exact: cameraFacingMode } },
          }}
          style={{ width: "100%", height: "400px" }}
          key={cameraFacingMode}
          className="qr-scanner"
        />
      </div>

      <div className="qr-scanner-controls">
        <button 
          onClick={toggleCamera} 
          className="control-button camera-toggle"
        >
          <FiRotateCw /> {t("switchCamera")}
        </button>
        {status === "success" && (
          <button 
            onClick={resetScanner} 
            className="control-button scan-again"
          >
            {t("scanAnother")}
          </button>
        )}

      </div>

      {scannedData && !showRedirect && (
        <div className="qr-scanner-result animate-fade-in">
          <h3>{t("scannedContent")}</h3>
          <div className="result-content">
            {scannedData}
          </div>
        </div>
      )}
    </div>
  );
}