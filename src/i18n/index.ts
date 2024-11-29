import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import all translations
import translationEN from './locales/en.json';
import translationES from './locales/es.json';
import translationFR from './locales/fr.json';
import translationDE from './locales/de.json';
import translationIT from './locales/it.json';
import translationPT from './locales/pt.json';
import translationNL from './locales/nl.json';
import translationRU from './locales/ru.json';
import translationZH from './locales/zh.json';
import translationJA from './locales/ja.json';
import translationKO from './locales/ko.json';

const resources = {
  en: { translation: translationEN },
  es: { translation: translationES },
  fr: { translation: translationFR },
  de: { translation: translationDE },
  it: { translation: translationIT },
  pt: { translation: translationPT },
  nl: { translation: translationNL },
  ru: { translation: translationRU },
  zh: { translation: translationZH },
  ja: { translation: translationJA },
  ko: { translation: translationKO },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
    },
  });

export default i18n;