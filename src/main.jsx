import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter} from 'react-router-dom'; // Import Router
import App from './App.jsx';
import './i18n'; // Import the i18n configuration


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
