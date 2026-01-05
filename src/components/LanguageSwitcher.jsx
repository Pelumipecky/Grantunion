import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import styles from './LanguageSwitcher.module.css';

const SCRIPT_ID = 'google-translate-script';
const WIDGET_CONTAINER_ID = 'google_translate_element';

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', region: 'Americas' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', region: 'Europe' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', region: 'Europe' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', region: 'Europe' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', region: 'Europe' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', region: 'Europe' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', region: 'Asia' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', region: 'Asia' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', region: 'Middle East' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', region: 'Europe' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', region: 'Asia' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', region: 'Asia' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const hideTimerRef = useRef(null);
  const pendingLanguageRef = useRef(null);
  const searchInputRef = useRef(null);

  const languages = useMemo(() => SUPPORTED_LANGUAGES, []);

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  const filteredLanguages = useMemo(() => {
    return languages.filter(
      (lang) =>
        lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lang.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [languages, searchTerm]);

  const scheduleHide = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  }, []);

  // Show language switcher on page load
  useEffect(() => {
    setIsVisible(true);

    return () => {
      const timerId = hideTimerRef.current;
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  const handleInteraction = useCallback(() => {
    setIsVisible(true);
  }, []);

  const applyGoogleLanguage = useCallback((langCode) => {
    if (typeof window === 'undefined') return false;
    const combo = document.querySelector('.goog-te-combo');
    if (!combo) return false;
    if (combo.value !== langCode) {
      combo.value = langCode;
    }
    combo.dispatchEvent(new Event('change'));
    document.documentElement.setAttribute('lang', langCode);
    document.documentElement.dir = langCode === 'ar' ? 'rtl' : 'ltr'; // RTL support for Arabic
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

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Change language
  const changeLanguage = useCallback((langCode) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
    setSearchTerm('');
    setSelectedIndex(0);
    handleInteraction();

    if (!applyGoogleLanguage(langCode)) {
      pendingLanguageRef.current = langCode;
      if (!isGoogleReady) {
        setTimeout(() => applyGoogleLanguage(langCode), 500);
      }
    }

    // Save language preference to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('i18nextLng', langCode);
    }
  }, [i18n, applyGoogleLanguage, isGoogleReady, handleInteraction]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredLanguages.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredLanguages.length) % filteredLanguages.length);
    } else if (e.key === 'Enter' && filteredLanguages[selectedIndex]) {
      e.preventDefault();
      changeLanguage(filteredLanguages[selectedIndex].code);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setSearchTerm('');
    }
  }, [isOpen, filteredLanguages, selectedIndex, changeLanguage]);

  if (!isVisible) return (
    <div id={WIDGET_CONTAINER_ID} className={styles.hiddenTranslateContainer} aria-hidden="true" />
  );

  return (
    <div className={styles.languageSwitcher} onMouseEnter={handleInteraction} onKeyDown={handleKeyDown}>
      <button
        className={styles.languageButton}
        onClick={() => {
          handleInteraction();
          setIsOpen(!isOpen);
          setSearchTerm('');
        }}
        aria-label="Change language"
        title={`Current language: ${currentLanguage.nativeName}`}
      >
        <span className={styles.flag}>{currentLanguage.flag}</span>
        <span className={styles.langCode}>{currentLanguage.code.toUpperCase()}</span>
        <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <input
            ref={searchInputRef}
            type="text"
            className={styles.searchInput}
            placeholder="Search languages..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedIndex(0);
            }}
            aria-label="Search languages"
          />

          <div className={styles.languageList}>
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((lang, index) => (
                <button
                  key={lang.code}
                  className={`${styles.dropdownItem} ${
                    i18n.language === lang.code ? styles.active : ''
                  } ${selectedIndex === index ? styles.focused : ''}`}
                  onClick={() => changeLanguage(lang.code)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  title={`${lang.name} - ${lang.region}`}
                >
                  <span className={styles.flag}>{lang.flag}</span>
                  <div className={styles.langInfo}>
                    <span className={styles.langName}>{lang.name}</span>
                    <span className={styles.nativeName}>{lang.nativeName}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className={styles.noResults}>
                No languages match &quot;{searchTerm}&quot;
              </div>
            )}
          </div>
        </div>
      )}

      <div id={WIDGET_CONTAINER_ID} className={styles.hiddenTranslateContainer} aria-hidden="true" />
    </div>
  );
};

export default LanguageSwitcher;