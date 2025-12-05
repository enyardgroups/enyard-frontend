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
  const scriptLoadedRef = useRef<boolean>(false);
  const onVerifyRef = useRef(onVerify);
  const onErrorRef = useRef(onError);
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  // Update refs when callbacks change (without causing re-renders)
  useEffect(() => {
    onVerifyRef.current = onVerify;
    onErrorRef.current = onError;
  }, [onVerify, onError]);

  useEffect(() => {
    if (!siteKey) {
      console.warn('reCAPTCHA site key not found in environment variables');
      return;
    }

    // Prevent loading script multiple times
    if (scriptLoadedRef.current || document.querySelector(`script[src*="recaptcha/api.js"]`)) {
      return;
    }

    // Load reCAPTCHA script only once
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    script.id = 'recaptcha-script';
    document.body.appendChild(script);
    scriptLoadedRef.current = true;

    script.onload = () => {
      if (version === 'v3') {
        // v3: Execute on load and provide a function to re-execute
        const executeRecaptcha = () => {
          if (!window.grecaptcha) return;
          window.grecaptcha.ready(() => {
            window.grecaptcha
              .execute(siteKey, { action })
              .then((token) => {
                onVerifyRef.current(token);
              })
              .catch((error) => {
                onErrorRef.current?.(error.message || 'reCAPTCHA verification failed');
              });
          });
        };
        
        // Execute immediately on load (only once)
        executeRecaptcha();
        
        // Store execute function for re-execution on form submit
        if (containerRef.current) {
          (containerRef.current as any).executeRecaptcha = executeRecaptcha;
        }
      } else {
        // v2: Render widget
        if (window.grecaptcha && containerRef.current) {
        window.grecaptcha.ready(() => {
            if (containerRef.current && !widgetIdRef.current) {
            const widgetId = window.grecaptcha.render(containerRef.current, {
              sitekey: siteKey,
              size: size === 'invisible' ? 'invisible' : size,
              theme,
              callback: (token: string) => {
                  onVerifyRef.current(token);
              },
              'error-callback': () => {
                  onErrorRef.current?.('reCAPTCHA error occurred');
              },
            });
            widgetIdRef.current = widgetId;
          }
        });
        }
      }
    };

    // Cleanup only on unmount
    return () => {
      // Don't remove script on cleanup - it's shared across components
      // Only reset widget if needed
    };
  }, [siteKey, version, action]); // Only depend on props that should trigger re-initialization

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

