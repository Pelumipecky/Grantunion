import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import styles from './LanguageSwitcher.module.css';

const SCRIPT_ID = 'google-translate-script';
const WIDGET_CONTAINER_ID = 'google_translate_element';
const HIDE_DELAY_MS = 30 * 1000;

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const hideTimerRef = useRef(null);
  const pendingLanguageRef = useRef(null);

  const languages = useMemo(() => SUPPORTED_LANGUAGES, []);

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  const scheduleHide = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, HIDE_DELAY_MS);
  }, []);

  // Show language switcher on page load and hide after 30 seconds
  useEffect(() => {
    setIsVisible(true);
    scheduleHide();

    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [scheduleHide]);

  const handleInteraction = useCallback(() => {
    setIsVisible(true);
    scheduleHide();
  }, [scheduleHide]);

  const applyGoogleLanguage = useCallback((langCode) => {
    if (typeof window === 'undefined') return false;
    const combo = document.querySelector('.goog-te-combo');
    if (!combo) return false;
    if (combo.value !== langCode) {
      combo.value = langCode;
    }
    combo.dispatchEvent(new Event('change'));
    document.documentElement.setAttribute('lang', langCode);
    return true;
  }, []);

  const initGoogleTranslate = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (window.google?.translate?.TranslateElement && !window.__grantUnionTranslateElement) {
      window.__grantUnionTranslateElement = new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: languages.map((lang) => lang.code).join(','),
          autoDisplay: false,
        },
        WIDGET_CONTAINER_ID
      );
    }
    if (window.google?.translate?.TranslateElement) {
      setIsGoogleReady(true);
      if (pendingLanguageRef.current) {
        applyGoogleLanguage(pendingLanguageRef.current);
        pendingLanguageRef.current = null;
      }
    }
  }, [languages, applyGoogleLanguage]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.initGrantUnionTranslate = initGoogleTranslate;

    if (document.getElementById(SCRIPT_ID)) {
      initGoogleTranslate();
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = 'https://translate.google.com/translate_a/element.js?cb=initGrantUnionTranslate';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [initGoogleTranslate]);

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
    handleInteraction();

    if (!applyGoogleLanguage(langCode)) {
      pendingLanguageRef.current = langCode;
      if (!isGoogleReady) {
        // Retry shortly in case the widget loads right after selection
        setTimeout(() => applyGoogleLanguage(langCode), 500);
      }
    }
  };

  if (!isVisible) return (
    <div id={WIDGET_CONTAINER_ID} className={styles.hiddenTranslateContainer} aria-hidden="true" />
  );

  return (
    <div className={styles.languageSwitcher} onMouseEnter={handleInteraction}>
      <button
        className={styles.languageButton}
        onClick={() => {
          handleInteraction();
          setIsOpen(!isOpen);
        }}
        aria-label="Change language"
      >
        <span className={styles.flag}>{currentLanguage.flag}</span>
        <span className={styles.langCode}>{currentLanguage.code.toUpperCase()}</span>
        <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`${styles.dropdownItem} ${i18n.language === lang.code ? styles.active : ''}`}
              onClick={() => {
                changeLanguage(lang.code);
                handleInteraction();
              }}
            >
              <span className={styles.flag}>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}

      <div id={WIDGET_CONTAINER_ID} className={styles.hiddenTranslateContainer} aria-hidden="true" />
    </div>
  );
};

export default LanguageSwitcher;