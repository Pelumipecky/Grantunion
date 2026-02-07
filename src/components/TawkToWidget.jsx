import { useEffect } from 'react';

const SCRIPT_ID = 'tawk-to-script';
const TAWK_SRC = 'https://embed.tawk.to/691a8701dde8a319591806a0/1ja7puo6d';

const TawkToWidget = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // If already present, nothing to do
    if (window.Tawk_API) {
      console.log('Tawk.to already available');
      return;
    }

    // Avoid adding the script multiple times
    if (document.getElementById(SCRIPT_ID)) {
      // Wait briefly for the global to appear
      const checkExisting = setInterval(() => {
        if (window.Tawk_API) {
          clearInterval(checkExisting);
          console.log('Tawk.to initialized after existing script');
        }
      }, 500);
      // stop checking after 10s
      setTimeout(() => clearInterval(checkExisting), 10000);
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = TAWK_SRC;
    script.async = true;
    script.crossOrigin = 'anonymous';

    script.onload = () => {
      console.log('Tawk.to script loaded');
      // Wait for widget to initialize
      const check = setInterval(() => {
        if (window.Tawk_API) {
          clearInterval(check);
          try {
            // Ensure widget is visible
            if (typeof window.Tawk_API.showWidget === 'function') {
              window.Tawk_API.showWidget();
            }
            if (typeof window.Tawk_API.show === 'function') {
              window.Tawk_API.show();
            }
            console.log('Tawk.to widget shown');
          } catch (e) {
            console.warn('Tawk.to API error after load', e);
          }
          console.log('Tawk.to API ready');
        }
      }, 500);
      setTimeout(() => clearInterval(check), 10000);
    };

    script.onerror = (e) => {
      console.warn('Tawk.to failed to load script', e);
    };

    document.body.appendChild(script);

    return () => {
      // keep the script in place for other pages; do not remove it
      script.onload = null;
      script.onerror = null;
    };
  }, []);

  return null;
};

export default TawkToWidget;
