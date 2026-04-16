import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from '@/locales/translation.json';

void i18n.use(initReactI18next).init({
  resources: {
    en: translationEN,
  },
  lng: 'en',
  fallbackLng: 'en',
  ns: ['common', 'login', 'forgotPassword', 'register', 'dashboard', 'tailoring'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
