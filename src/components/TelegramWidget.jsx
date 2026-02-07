import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './TelegramWidget.module.css';

const BASE_OFFSET = 30;

const TelegramWidget = () => {
  const [bottomOffset, setBottomOffset] = useState(BASE_OFFSET);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const findTawkElement = () =>
      document.querySelector(
        '.tawk-min-container, .tawk-min, .tawk-button, #tawk-mpreview-wrapper, iframe[src*="tawk.to"], iframe[title*="chat widget"], iframe[title*="tawk"]'
      );

    const adjustOffset = () => {
      const tawkNode = findTawkElement();

      if (tawkNode) {
        const rect = tawkNode.getBoundingClientRect();
        const height = rect?.height || 80; // fallback height if rect is zero while hidden
        const clearance = Math.min(220, Math.max(110, Math.round(height + 40)));
        setBottomOffset(clearance);
        return;
      }

      setBottomOffset(BASE_OFFSET);
    };

    const observer = new MutationObserver(adjustOffset);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('resize', adjustOffset);

    // Initial checks to catch both immediate and delayed loads
    adjustOffset();
    const timer = setTimeout(adjustOffset, 1500);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('resize', adjustOffset);
    };
  }, []);

  return (
    <div className={styles.details} style={{ bottom: `${bottomOffset}px` }}>
      <a
        href="https://t.me/grant_union"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.telegramBtn}
        aria-label="Chat on Telegram"
        title="Chat with us on Telegram"
      >
        <Image
          src="/telegram.svg"
          alt="Telegram"
          width={30}
          height={30}
          className={styles.icon}
        />
      </a>
    </div>
  );
};

export default TelegramWidget;
