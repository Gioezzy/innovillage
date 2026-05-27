'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, ShoppingBag, ArrowRight } from 'lucide-react';
import FadeIn from '@/components/animations/fade-in';

/**
 * Props for CheckoutMethodSelection component
 */
interface CheckoutMethodSelectionProps {
  /** Callback when a checkout method is selected */
  onSelect: (method: 'marketplace' | 'direct') => void;
}

/**
 * CheckoutMethodSelection Component
 * 
 * Displays two checkout method options when both marketplace and direct checkout are enabled.
 * Allows customers to choose between:
 * - Marketplace Checkout: Redirect to Shopee/Tokopedia for payment
 * - Direct Checkout: Pay directly using Midtrans payment gateway
 * 
 * **Validates: Requirements 13.5**
 * 
 * @param {CheckoutMethodSelectionProps} props - Component props
 * @returns {JSX.Element} The checkout method selection UI
 */
export default function CheckoutMethodSelection({
  onSelect,
}: CheckoutMethodSelectionProps) {
  const [selectedMethod, setSelectedMethod] = useState<'marketplace' | 'direct' | null>(null);

  const handleMethodClick = (method: 'marketplace' | 'direct') => {
    setSelectedMethod(method);
  };

  const handleContinue = () => {
    if (selectedMethod) {
      onSelect(selectedMethod);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 space-y-8 sm:space-y-10">
        <FadeIn>
          <div className="text-center space-y-2 sm:space-y-3">
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Pilih Metode Checkout
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              Pilih cara pembayaran yang Anda inginkan
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Marketplace Checkout Option */}
            <button
              type="button"
              onClick={() => handleMethodClick('marketplace')}
              className={`
                relative p-6 sm:p-8 rounded-xl sm:rounded-2xl border-2 transition-all text-left
                ${selectedMethod === 'marketplace'
                  ? 'border-primary bg-primary/5 ring-2 ring-primary shadow-lg'
                  : 'border-border hover:border-primary/50 hover:bg-primary/5 hover:shadow-md'
                }
              `}
            >
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-orange-100 flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
                  </div>
                  {selectedMethod === 'marketplace' && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                    Marketplace Checkout
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    Bayar melalui Shopee atau Tokopedia. Anda akan diarahkan ke marketplace untuk menyelesaikan pembayaran.
                  </p>
                </div>

                <div className="pt-3 sm:pt-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs sm:text-sm text-foreground">
                      Berbagai metode pembayaran marketplace
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs sm:text-sm text-foreground">
                      Perlindungan pembeli marketplace
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs sm:text-sm text-foreground">
                      Promo dan cashback marketplace
                    </span>
                  </div>
                </div>
              </div>
            </button>

            {/* Direct Checkout Option */}
            <button
              type="button"
              onClick={() => handleMethodClick('direct')}
              className={`
                relative p-6 sm:p-8 rounded-xl sm:rounded-2xl border-2 transition-all text-left
                ${selectedMethod === 'direct'
                  ? 'border-primary bg-primary/5 ring-2 ring-primary shadow-lg'
                  : 'border-border hover:border-primary/50 hover:bg-primary/5 hover:shadow-md'
                }
              `}
            >
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-100 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                  </div>
                  {selectedMethod === 'direct' && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                    Direct Checkout
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    Bayar langsung di website kami menggunakan berbagai metode pembayaran melalui Midtrans.
                  </p>
                </div>

                <div className="pt-3 sm:pt-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs sm:text-sm text-foreground">
                      Checkout langsung tanpa redirect
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs sm:text-sm text-foreground">
                      Transfer bank, e-wallet, kartu kredit
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs sm:text-sm text-foreground">
                      Proses pembayaran aman dengan Midtrans
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="flex justify-center pt-4 sm:pt-6">
            <Button
              onClick={handleContinue}
              disabled={!selectedMethod}
              size="lg"
              className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg rounded-xl shadow-lg hover:shadow-primary/25 transition-all w-full sm:w-auto"
            >
              Lanjutkan
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
          </div>
        </FadeIn>

        {!selectedMethod && (
          <FadeIn delay={0.3}>
            <p className="text-center text-xs sm:text-sm text-muted-foreground">
              Silakan pilih metode checkout untuk melanjutkan
            </p>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
