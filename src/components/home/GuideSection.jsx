import React from 'react';
import styles from './GuideSection.module.css';

const GuideSection = () => {
  const languages = [
    { name: 'English', code: 'en', flag: '🇬🇧' },
    { name: 'Spanish', code: 'es', flag: '🇪🇸' },
    { name: 'Portuguese', code: 'pt', flag: '🇵🇹' },
    { name: 'French', code: 'fr', flag: '🇫🇷' },
    { name: 'German', code: 'de', flag: '🇩🇪' },
    { name: 'Italian', code: 'it', flag: '🇮🇹' },
    { name: 'Chinese', code: 'zh', flag: '🇨🇳' },
    { name: 'Japanese', code: 'ja', flag: '🇯🇵' },
    { name: 'Korean', code: 'ko', flag: '🇰🇷' },
    { name: 'Russian', code: 'ru', flag: '🇷🇺' },
    { name: 'Arabic', code: 'ar', flag: '🇸🇦' },
    { name: 'Hindi', code: 'hi', flag: '🇮🇳' },
    { name: 'Dutch', code: 'nl', flag: '🇳🇱' },
    { name: 'Turkish', code: 'tr', flag: '🇹🇷' },
    { name: 'Indonesian', code: 'id', flag: '🇮🇩' },
    { name: 'Thai', code: 'th', flag: '🇹🇭' },
    { name: 'Vietnamese', code: 'vi', flag: '🇻🇳' },
    { name: 'Polish', code: 'pl', flag: '🇵🇱' },
    { name: 'Swedish', code: 'sv', flag: '🇸🇪' },
    { name: 'Norwegian', code: 'no', flag: '🇳🇴' },
    { name: 'Danish', code: 'da', flag: '🇩🇰' },
    { name: 'Finnish', code: 'fi', flag: '🇫🇮' },
  ];

  return (
    <section className={styles.guideSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Platform Guide & Resources</h2>
          <p>Everything you need to know about investing with Grant Union</p>
        </div>

        <div className={styles.contentGrid}>
          {/* Video Section */}
          <div className={styles.videoCard}>
            <h3>Video Tutorial</h3>
            <div className={styles.videoWrapper}>
              <a 
                href="https://www.youtube.com/@grantunion308?si=qa_rbv59ICycx0kK"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#1C0F36',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#FF8C37',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                ▶ Watch on YouTube
              </a>
            </div>
            <p className={styles.videoDesc}>
              Watch our comprehensive guide on how to create an account, make a deposit, and understand our investment packages.
            </p>
          </div>

          {/* PDF Download Section */}
          <div className={styles.downloadCard}>
            <h3>Official Investment Guide (PDF)</h3>
            <p className={styles.downloadDesc}>
              Download our detailed investment presentation. Available in 22 languages for our global community.
            </p>
            
            <div className={styles.languageGrid}>
              {languages.map((lang) => (
                <a 
                  key={lang.code} 
                  href={`/downloads/guide-${lang.code}.pdf`} 
                  className={styles.langButton}
                  download
                  onClick={(e) => {
                    // Prevent default if file doesn't exist yet
                    // e.preventDefault(); 
                    // alert('File coming soon!');
                  }}
                >
                  <span className={styles.flag}>{lang.flag}</span>
                  <span className={styles.langName}>{lang.name}</span>
                  <i className="icofont-download"></i>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuideSection;
