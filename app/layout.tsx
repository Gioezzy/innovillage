import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'sonner';
import { CartProvider } from '@/context/cart-context';
import CookieConsent from '@/components/layout/cookie-consent';
import TrafficTracker from '@/components/analytics/traffic-tracker';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: 'Songket.id | Warisan Budaya Digital',
  description: 'Temukan keindahan dan filosofi Songket Silungkang asli. Dilengkapi dengan teknologi AI untuk edukasi motif.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body
        className={`${jakarta.className} ${playfair.variable} ${jakarta.variable}`}
      >
        <CartProvider>
          <NextTopLoader color="#D4AF37" showSpinner={false} />
          <TrafficTracker />
          {children}
          <CookieConsent />
          <Toaster position="top-center" richColors />
        </CartProvider>
      </body>
    </html>
  );
}


