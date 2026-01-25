import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './TelegramWidget.module.css';

const TelegramWidget = () => {
  const [bottomOffset, setBottomOffset] = useState(30);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const adjustOffset = () => {
      // If Tawk.to is present, move Telegram button below it
      if (window.Tawk_API || document.querySelector('.tawk-min')) {
        setBottomOffset(110);
      } else {
        setBottomOffset(30);
      }
    };

    // Initial check and after a short delay to allow Tawk to initialize
    adjustOffset();
    const timer = setTimeout(adjustOffset, 1500);

    return () => clearTimeout(timer);
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
