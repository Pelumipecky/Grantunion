import Script from 'next/script';

const TawkToWidget = () => {
  return (
    <Script
      src="https://embed.tawk.to/691a8701dde8a319591806a0/1ja7puo6d"
      strategy="afterInteractive"
      crossOrigin="anonymous"
      onLoad={() => {
        console.log('Tawk.to loaded successfully');
      }}
      onError={(e) => {
        console.warn('Tawk.to failed to load:', e);
      }}
    />
  );
};

export default TawkToWidget;
