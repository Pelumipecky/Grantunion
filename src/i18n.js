import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../public/locales/en/common.json';
import es from '../public/locales/es/common.json';
import fr from '../public/locales/fr/common.json';
import pt from '../public/locales/pt/common.json';
import de from '../public/locales/de/common.json';
import it from '../public/locales/it/common.json';
import ja from '../public/locales/ja/common.json';
import zh from '../public/locales/zh/common.json';
import ar from '../public/locales/ar/common.json';
import ru from '../public/locales/ru/common.json';
import hi from '../public/locales/hi/common.json';
import ko from '../public/locales/ko/common.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: en },
      es: { common: es },
      fr: { common: fr },
      pt: { common: pt },
      de: { common: de },
      it: { common: it },
      ja: { common: ja },
      zh: { common: zh },
      ar: { common: ar },
      ru: { common: ru },
      hi: { common: hi },
      ko: { common: ko },
    },
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;