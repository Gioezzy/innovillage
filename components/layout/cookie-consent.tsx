'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Cookie, X } from 'lucide-react';
import Link from 'next/link';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setTimeout(() => {
        setShowConsent(true);
      }, 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowConsent(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur border-t border-border shadow-2xl animate-in slide-in-from-bottom duration-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full text-primary shrink-0">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="text-sm text-foreground space-y-1">
            <p className="font-medium">Kami menghargai privasi Anda</p>
            <p className="text-muted-foreground">
              Kami menggunakan cookie untuk meningkatkan pengalaman Anda dan menganalisis lalu lintas situs. 
              {` `}
              <Link href="/privacy" className="text-primary hover:underline">
                Pelajari selengkapnya
              </Link>.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 sm:flex-none"
            onClick={handleDecline}
          >
            Tolak
          </Button>
          <Button 
            size="sm" 
            className="flex-1 sm:flex-none"
            onClick={handleAccept}
          >
            Terima Semua
          </Button>
        </div>
      </div>
    </div>
  );
}
