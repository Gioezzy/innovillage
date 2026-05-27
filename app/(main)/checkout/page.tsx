/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useTransition, useEffect } from 'react';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/hooks/use-auth';
import { createOrderAction } from '@/lib/actions/order';
import { getCheckoutConfig } from '@/lib/config/checkout-config';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import FadeIn from '@/components/animations/fade-in';
import CheckoutMethodSelection from './components/CheckoutMethodSelection';
import MarketplaceCheckoutFlow, { MarketplaceCheckoutData } from './components/MarketplaceCheckoutFlow';
import DirectCheckoutFlow, { DirectCheckoutData } from './components/DirectCheckoutFlow';

/**
 * Main Checkout Page Component
 * 
 * Orchestrates the checkout flow based on the configured checkout method:
 * - Shows method selection when both marketplace and direct checkout are enabled
 * - Shows marketplace checkout flow when marketplace is selected/enabled
 * - Shows direct checkout flow when direct is selected/enabled
 * - Handles empty cart validation
 * 
 * **Validates: Requirements 2.1, 2.6, 9.2, 13.3, 13.4, 13.5**
 */
export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, isLoading } = useAuth();
  const [isPending, startTransition] = useTransition();

  // Get checkout configuration to determine which flow to show
  const checkoutConfig = getCheckoutConfig();

  // Track selected checkout method (for 'both' mode)
  const [selectedMethod, setSelectedMethod] = useState<'marketplace' | 'direct' | null>(null);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  // Authentication check
  if (!user) {
    redirect('/login?redirect=/checkout');
  }

  // Empty cart validation - Requirement 2.6, 9.2
  if (items.length === 0) {
    redirect('/cart');
  }

  /**
   * Handle marketplace checkout submission
   * Creates order with marketplace_redirect status and redirects to marketplace
   */
  const handleMarketplaceCheckout = async (data: MarketplaceCheckoutData): Promise<{ success: boolean; error?: string; errorType?: string; retryable?: boolean }> => {
    return new Promise((resolve) => {
      startTransition(async () => {
        const orderItems = items.map(item => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.price,
        }));

        const result = await createOrderAction({
          items: orderItems,
          pickupMethod: data.deliveryMethod,
          note: data.note,
          phone: data.phone,
          address: data.address,
          province: data.province,
          shippingCost: data.shippingCost,
          checkoutMethod: 'marketplace',
          marketplacePlatform: data.marketplace as 'shopee' | 'tokopedia',
        });

        if (result?.error) {
          toast.error(result.error);
          resolve({ success: false, error: result.error, retryable: true });
        } else if (result.success) {
          // Clear cart before redirecting to marketplace
          clearCart();

          // Open marketplace URLs for each product
          const marketplaceUrls: string[] = [];
          items.forEach(item => {
            let url: string | undefined;
            if (data.marketplace === 'shopee') {
              url = item.shopeeUrl || undefined;
            } else if (data.marketplace === 'tokopedia') {
              url = item.tokopediaUrl || undefined;
            }

            if (url && !marketplaceUrls.includes(url)) {
              marketplaceUrls.push(url);
            }
          });

          // Open each unique marketplace URL in a new tab
          marketplaceUrls.forEach(url => {
            window.open(url, '_blank', 'noopener,noreferrer');
          });

          toast.success('Pesanan berhasil dibuat! Anda akan diarahkan ke marketplace.');
          
          // Redirect to orders page after a short delay
          setTimeout(() => {
            window.location.href = '/orders';
          }, 2000);

          resolve({ success: true });
        } else {
          resolve({ success: false, error: 'Terjadi kesalahan yang tidak diketahui', retryable: true });
        }
      });
    });
  };

  /**
   * Handle direct checkout submission
   * Creates order with pending_payment status and redirects to Midtrans
   */
  const handleDirectCheckout = async (data: DirectCheckoutData): Promise<void> => {
    return new Promise((resolve) => {
      startTransition(async () => {
        const orderItems = items.map(item => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.price,
        }));

        const result = await createOrderAction({
          items: orderItems,
          pickupMethod: data.deliveryMethod,
          note: data.note,
          phone: data.phone,
          address: data.address,
          province: data.province,
          shippingCost: data.shippingCost,
          checkoutMethod: 'direct',
        });

        if (result?.error) {
          toast.error(result.error);
          resolve();
        } else if (result.success) {
          clearCart();
          if (result.redirectUrl) {
            window.location.href = result.redirectUrl;
          } else {
            toast.success('Pesanan berhasil dibuat!');
            window.location.href = '/orders';
          }
          resolve();
        } else {
          resolve();
        }
      });
    });
  };

  // Determine which checkout flow to render based on configuration
  // Requirement 13.3, 13.4, 13.5
  
  // Case 1: Both methods enabled - show method selection first
  if (checkoutConfig.method === 'both' && !selectedMethod) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
          <CheckoutMethodSelection onSelect={setSelectedMethod} />
        </div>
      </div>
    );
  }

  // Determine active method
  const activeMethod = selectedMethod || 
    (checkoutConfig.marketplaceEnabled ? 'marketplace' : 'direct');

  // Case 2: Marketplace checkout flow
  if (activeMethod === 'marketplace') {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 space-y-10">
          <FadeIn>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground">
              Checkout Pesanan
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <MarketplaceCheckoutFlow
              items={items}
              totalPrice={totalPrice}
              onCheckout={handleMarketplaceCheckout}
              isProcessing={isPending}
            />
          </FadeIn>
        </div>
      </div>
    );
  }

  // Case 3: Direct checkout flow
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 space-y-10">
        <FadeIn>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground">
            Checkout Pesanan
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <DirectCheckoutFlow
            items={items}
            totalPrice={totalPrice}
            onCheckout={handleDirectCheckout}
            isProcessing={isPending}
          />
        </FadeIn>
      </div>
    </div>
  );
}
