import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      render: (element: HTMLElement, options: { sitekey: string; size?: string; theme?: string }) => string;
      reset: (widgetId: number) => void;
    };
  }
}

interface RecaptchaProps {
  onVerify: (token: string) => void;
  onError?: (error: string) => void;
  size?: 'normal' | 'compact' | 'invisible';
  theme?: 'light' | 'dark';
  action?: string; // For v3
  version?: 'v2' | 'v3';
}

export const Recaptcha = ({
  onVerify,
  onError,
  size = 'normal',
  theme = 'light',
  action = 'submit',
  version = 'v2',
}: RecaptchaProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    if (!siteKey) {
      console.warn('reCAPTCHA site key not found in environment variables');
      return;
    }

    // Load reCAPTCHA script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (version === 'v3') {
        // v3: Execute on load and provide a function to re-execute
        const executeRecaptcha = () => {
          window.grecaptcha.ready(() => {
            window.grecaptcha
              .execute(siteKey, { action })
              .then((token) => {
                onVerify(token);
              })
              .catch((error) => {
                onError?.(error.message || 'reCAPTCHA verification failed');
              });
          });
        };
        
        // Execute immediately on load
        executeRecaptcha();
        
        // Store execute function for re-execution on form submit
        if (containerRef.current) {
          (containerRef.current as any).executeRecaptcha = executeRecaptcha;
        }
      } else {
        // v2: Render widget
        window.grecaptcha.ready(() => {
          if (containerRef.current) {
            const widgetId = window.grecaptcha.render(containerRef.current, {
              sitekey: siteKey,
              size: size === 'invisible' ? 'invisible' : size,
              theme,
              callback: (token: string) => {
                onVerify(token);
              },
              'error-callback': () => {
                onError?.('reCAPTCHA error occurred');
              },
            });
            widgetIdRef.current = widgetId;
          }
        });
      }
    };

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [siteKey, size, theme, action, version, onVerify, onError]);

  const reset = () => {
    if (widgetIdRef.current !== null && window.grecaptcha) {
      window.grecaptcha.reset(widgetIdRef.current);
    }
  };

  // Expose reset function
  useEffect(() => {
    if (containerRef.current) {
      (containerRef.current as any).reset = reset;
    }
  }, []);

  if (!siteKey) {
    return null;
  }

  if (version === 'v3') {
    // v3 doesn't need a visible widget
    return null;
  }

  return <div ref={containerRef} />;
};

export default Recaptcha;

