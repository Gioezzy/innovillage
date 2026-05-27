'use client';

import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertCircle, ShoppingBag, Loader2 } from 'lucide-react';
import { MarketplacePlatform, CartItemWithMarketplace } from '@/lib/types';
import { toast } from 'sonner';

/**
 * Props for MarketplaceConfirmationDialog component
 */
interface MarketplaceConfirmationDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void;
  /** Selected marketplace platform */
  marketplace: MarketplacePlatform | null;
  /** Cart items to be redirected */
  items: CartItemWithMarketplace[];
  /** Callback when user confirms and proceeds */
  onProceed: () => Promise<void>;
  /** Callback when user cancels */
  onCancel: () => void;
}

/**
 * Get marketplace display name
 */
function getMarketplaceName(platform: MarketplacePlatform): string {
  const names: Record<MarketplacePlatform, string> = {
    shopee: 'Shopee',
    tokopedia: 'Tokopedia',
    padiumkm: 'PadiUMKM',
  };
  return names[platform] || platform;
}

/**
 * Get marketplace logo emoji
 */
function getMarketplaceLogo(platform: MarketplacePlatform): string {
  const logos: Record<MarketplacePlatform, string> = {
    shopee: '🛍️',
    tokopedia: '🛒',
    padiumkm: '🏪',
  };
  return logos[platform] || '🛒';
}

/**
 * MarketplaceConfirmationDialog Component
 * 
 * Displays a confirmation dialog before redirecting to marketplace:
 * - Shows selected marketplace
 * - Warns that cart will be cleared
 * - Provides Proceed and Cancel actions
 * - Handles redirect with timeout
 * - Opens marketplace URLs in new tabs
 * 
 * **Validates: Requirements 2.5, 2.7, 9.6, 9.7, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6**
 */
export default function MarketplaceConfirmationDialog({
  open,
  onOpenChange,
  marketplace,
  items,
  onProceed,
  onCancel,
}: MarketplaceConfirmationDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [redirectTimeout, setRedirectTimeout] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [canRetry, setCanRetry] = useState(false);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setIsProcessing(false);
      setRedirectTimeout(false);
      setErrorMessage(null);
      setCanRetry(false);
    }
  }, [open]);

  /**
   * Handle proceed action with comprehensive error handling
   * **Validates: Requirements 2.7, 12.3, 12.4, 12.5, 12.6**
   */
  const handleProceed = async () => {
    if (!marketplace) {
      const error = 'Marketplace tidak dipilih';
      setErrorMessage(error);
      setCanRetry(false);
      toast.error(error);
      console.error('[MarketplaceRedirect] No marketplace selected');
      return;
    }

    setIsProcessing(true);
    setRedirectTimeout(false);
    setErrorMessage(null);
    setCanRetry(false);

    try {
      // Call the onProceed callback which should:
      // 1. Create the order
      // 2. Clear the cart
      console.log('[MarketplaceRedirect] Starting order creation for', marketplace);
      await onProceed();
      console.log('[MarketplaceRedirect] Order created successfully');

      // Get marketplace URLs for all items
      const marketplaceUrls = items
        .map((item) => {
          if (marketplace === 'shopee') {
            return item.shopeeUrl;
          } else if (marketplace === 'tokopedia') {
            return item.tokopediaUrl;
          }
          return null;
        })
        .filter((url): url is string => !!url && url.trim() !== '');

      if (marketplaceUrls.length === 0) {
        const error = 'Tidak ada URL marketplace yang tersedia';
        setErrorMessage(error);
        setCanRetry(false);
        setIsProcessing(false);
        toast.error(error);
        console.error('[MarketplaceRedirect] No marketplace URLs available for items:', items);
        return;
      }

      console.log(`[MarketplaceRedirect] Opening ${marketplaceUrls.length} marketplace URLs`);

      // Set up redirect timeout (5 seconds)
      let timeoutTriggered = false;
      const timeoutId = setTimeout(() => {
        timeoutTriggered = true;
        setRedirectTimeout(true);
        setIsProcessing(false);
        setCanRetry(true);
        const error = 'Redirect timeout. Silakan coba lagi atau buka marketplace secara manual.';
        setErrorMessage(error);
        toast.error(error, { duration: 5000 });
        console.error('[MarketplaceRedirect] Timeout after 5 seconds');
      }, 5000);

      // Open each marketplace URL in a new tab
      let successCount = 0;
      const failedUrls: string[] = [];
      
      for (const url of marketplaceUrls) {
        try {
          console.log('[MarketplaceRedirect] Attempting to open URL:', url);
          const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
          
          if (newWindow) {
            successCount++;
            console.log('[MarketplaceRedirect] Successfully opened URL:', url);
          } else {
            // window.open returned null - likely blocked by popup blocker
            failedUrls.push(url);
            console.warn('[MarketplaceRedirect] window.open returned null for URL:', url, '(popup may be blocked)');
          }
        } catch (error) {
          failedUrls.push(url);
          console.error('[MarketplaceRedirect] Failed to open marketplace URL:', url, error);
        }
      }

      // Clear timeout if we completed the loop
      clearTimeout(timeoutId);

      // Don't update state if timeout already triggered
      if (timeoutTriggered) {
        return;
      }

      if (successCount > 0) {
        // Partial or full success
        if (failedUrls.length > 0) {
          // Partial success
          const warning = `Berhasil membuka ${successCount} dari ${marketplaceUrls.length} produk. ${failedUrls.length} produk gagal dibuka. Pastikan popup tidak diblokir.`;
          setErrorMessage(warning);
          setCanRetry(true);
          toast.warning(warning, { duration: 5000 });
          console.warn('[MarketplaceRedirect] Partial success:', { successCount, failedCount: failedUrls.length, failedUrls });
        } else {
          // Full success
          toast.success(
            `Berhasil membuka ${successCount} produk di ${getMarketplaceName(marketplace)}`,
            { duration: 3000 }
          );
          console.log('[MarketplaceRedirect] All URLs opened successfully');
        }
        
        // Close dialog after successful redirect (even if partial)
        setTimeout(() => {
          onOpenChange(false);
          setIsProcessing(false);
        }, 1000);
      } else {
        // Complete failure
        const error = 'Gagal membuka marketplace. Pastikan popup tidak diblokir oleh browser. Silakan coba lagi.';
        setRedirectTimeout(true);
        setErrorMessage(error);
        setCanRetry(true);
        setIsProcessing(false);
        toast.error(error, { duration: 5000 });
        console.error('[MarketplaceRedirect] All window.open attempts failed. Failed URLs:', failedUrls);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      const userError = 'Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.';
      setErrorMessage(userError);
      setCanRetry(true);
      setIsProcessing(false);
      toast.error(userError, { duration: 5000 });
      console.error('[MarketplaceRedirect] Error during marketplace redirect:', {
        error,
        errorMessage: errorMsg,
        marketplace,
        itemCount: items.length
      });
    }
  };

  /**
   * Handle cancel action
   * **Validates: Requirements 12.5**
   */
  const handleCancel = () => {
    if (isProcessing) {
      return; // Prevent cancel during processing
    }
    onCancel();
    onOpenChange(false);
  };

  if (!marketplace) {
    return null;
  }

  const marketplaceName = getMarketplaceName(marketplace);
  const marketplaceLogo = getMarketplaceLogo(marketplace);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md mx-4 sm:mx-auto rounded-xl sm:rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
            <span className="text-2xl sm:text-3xl">{marketplaceLogo}</span>
            <span>Konfirmasi Checkout</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3 sm:space-y-4 text-left">
            {/* Selected marketplace info */}
            <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs sm:text-sm text-blue-900 flex items-center gap-2">
                <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>
                  Anda akan diarahkan ke <strong>{marketplaceName}</strong> untuk menyelesaikan pembelian.
                </span>
              </p>
            </div>

            {/* Cart clear warning */}
            <div className="p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs sm:text-sm text-yellow-900 flex items-start gap-2">
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Perhatian:</strong> Keranjang belanja Anda akan dikosongkan setelah redirect. 
                  Pastikan Anda siap untuk melanjutkan ke marketplace.
                </span>
              </p>
            </div>

            {/* Product count info */}
            <div className="text-xs sm:text-sm text-muted-foreground">
              <p>
                {items.length} produk akan dibuka di tab baru. Pastikan browser Anda mengizinkan popup.
              </p>
            </div>

            {/* Redirect timeout or error message */}
            {(redirectTimeout || errorMessage) && (
              <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs sm:text-sm text-red-900 flex items-start gap-2">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    {errorMessage || 'Redirect timeout. Silakan coba lagi atau buka marketplace secara manual.'}
                  </span>
                </p>
                {canRetry && (
                  <p className="text-xs text-red-700 mt-2">
                    Klik tombol "Coba Lagi" untuk mencoba membuka marketplace kembali.
                  </p>
                )}
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel
            onClick={handleCancel}
            disabled={isProcessing}
            className="rounded-xl w-full sm:w-auto"
          >
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleProceed}
            disabled={isProcessing}
            className="rounded-xl bg-primary hover:bg-primary/90 w-full sm:w-auto"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses...</span>
              </div>
            ) : canRetry ? (
              'Coba Lagi'
            ) : (
              'Lanjutkan'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
