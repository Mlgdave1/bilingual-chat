import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe2 } from 'lucide-react';

const LANGUAGES = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  nl: 'Nederlands',
  ru: 'Русский',
  zh: '中文',
  ja: '日本語',
  ko: '한국어'
};

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Globe2 size={20} className="text-blue-600" />
        <span className="text-sm">{LANGUAGES[i18n.language as keyof typeof LANGUAGES] || LANGUAGES.en}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg py-2 w-48 z-50">
          {Object.entries(LANGUAGES).map(([code, name]) => (
            <button
              key={code}
              onClick={() => {
                i18n.changeLanguage(code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                i18n.language === code ? 'text-blue-600 font-medium' : 'text-gray-700'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}