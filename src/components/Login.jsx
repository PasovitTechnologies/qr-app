import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import './Login.css';

function Login({ onLogin }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/qrscanner');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${baseUrl}/api/qr/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('userEmail', result.user.email);
        localStorage.setItem('userRole', result.user.role);
        onLogin();
        navigate('/qrscanner');
      } else {
        setError(result.message || t('invalidCredentials'));
      }
    } catch (err) {
      setError(t('networkError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{t('welcome')}</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>{t('email')}</label>
            <input
              type="email"
              placeholder={t('enterEmail')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>{t('password')}</label>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={t('enterPassword')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? t('loggingIn') : t('login')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
