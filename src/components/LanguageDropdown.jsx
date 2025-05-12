import React from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

const LanguageDropdown = () => {
  const { i18n } = useTranslation();

  // Add null check for i18n
  const handleChange = (e) => {
    const lang = e.target.value;
    if (i18n && typeof i18n.changeLanguage === 'function') {
      i18n.changeLanguage(lang);
      try {
        localStorage.setItem('language', lang);
      } catch (e) {
        console.warn('Could not save language preference', e);
      }
    } else {
      console.error('i18n instance not available');
    }
  };

  // Fallback to first language if i18n.language isn't set
  const currentLanguage = i18n?.language || languages[0].code;

  return (
    <select
      value={currentLanguage}
      onChange={handleChange}
      className="language-dropdown"
      aria-label="Select language"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.name}
        </option>
      ))}
    </select>
  );
};

export default LanguageDropdown;