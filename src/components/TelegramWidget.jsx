import React from 'react';
import Image from 'next/image';
import styles from './TelegramWidget.module.css';

const TelegramWidget = () => {
  return (
    <div className={styles.details}>
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
