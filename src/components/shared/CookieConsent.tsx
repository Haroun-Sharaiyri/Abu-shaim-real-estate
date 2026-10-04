'use client';

import { useState, useEffect } from 'react';

interface CookieConsentProps {
  dictionary: any;
}

export default function CookieConsent({ dictionary }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
    // Initialize GA4/Pixel here or dispatch event
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 md:bottom-0 z-50 w-full bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] border-t border-gray-200">
      <div className="container mx-auto px-4 py-3 md:h-[60px] flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-navy font-body flex-1 text-center md:text-start">
          {dictionary?.message || 'We use cookies to improve your experience and analyze site traffic.'}
        </p>
        <div className="flex items-center gap-3 w-full md:w-auto pb-safe md:pb-0">
          <button 
            onClick={handleDecline}
            className="flex-1 md:flex-none min-h-[44px] px-4 md:px-6 py-2 text-sm font-medium text-navy bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            {dictionary?.decline || 'Decline'}
          </button>
          <button 
            onClick={handleAccept}
            className="flex-1 md:flex-none min-h-[44px] px-4 md:px-6 py-2 text-sm font-medium text-navy bg-cyan-light hover:bg-cyan-dark transition-colors rounded"
          >
            {dictionary?.accept || 'Accept'}
          </button>
        </div>
      </div>
    </div>
  );
}
