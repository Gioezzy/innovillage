'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { CircleCheck, Loader2, ShoppingBag, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { 
  calculateShippingCost, 
  getAvailableProvinces 
} from '@/lib/services/shipping-cost';
import { formatRupiah } from '@/lib/utils';
import { MarketplacePlatform, CartItemWithMarketplace, DeliveryMethod } from '@/lib/types';
import FadeIn from '@/components/animations/fade-in';
import MarketplaceConfirmationDialog from './MarketplaceConfirmationDialog';

/**
 * Props for MarketplaceCheckoutFlow component
 */
interface MarketplaceCheckoutFlowProps {
  /** Cart items to checkout */
  items: CartItemWithMarketplace[];
  /** Total price of items (without shipping) */
  totalPrice: number;
  /** Callback when checkout is initiated */
  onCheckout: (data: MarketplaceCheckoutData) => Promise<{ success: boolean; error?: string; errorType?: string; retryable?: boolean }>;
  /** Whether checkout is in progress */
  isProcessing?: boolean;
}

/**
 * Data collected from marketplace checkout form
 */
export interface MarketplaceCheckoutData {
  marketplace: MarketplacePlatform;
  phone: string;
  deliveryMethod: DeliveryMethod;
  address?: string;
  province?: string;
  shippingCost: number;
  note?: string;
}

/**
 * Available marketplace options with their metadata
 */
interface MarketplaceOption {
  id: MarketplacePlatform;
  name: string;
  logo: string;
  color: string;
  available: boolean;
  missingProducts: string[];
}

/**
 * MarketplaceCheckoutFlow Component
 * 
 * Displays marketplace checkout flow with:
 * - Marketplace selection (Shopee, Tokopedia)
 * - Customer information form
 * - Delivery method and address
 * - Province selection with shipping cost calculation
 * - Order summary
 * 
 * **Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 9.8, 11.1, 11.2, 11.5, 11.7, 11.8**
 */
export default function MarketplaceCheckoutFlow({
  items,
  totalPrice,
  onCheckout,
  isProcessing = false,
}: MarketplaceCheckoutFlowProps) {
  // Form state
  const [selectedMarketplace, setSelectedMarketplace] = useState<MarketplacePlatform | null>(null);
  const [phone, setPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
  const [address, setAddress] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingCostError, setShippingCostError] = useState<string>('');
  const [note, setNote] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Confirmation dialog state
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Error handling state
  const [checkoutError, setCheckoutError] = useState<{
    message: string;
    type?: string;
    retryable?: boolean;
  } | null>(null);

  /**
   * Calculate available marketplaces based on product URLs
   * **Validates: Requirements 9.3, 9.4, 9.5**
   */
  const marketplaceOptions = useMemo((): MarketplaceOption[] => {
    const shopeeProducts = items.filter(item => !item.shopeeUrl || item.shopeeUrl.trim() === '');
    const tokopediaProducts = items.filter(item => !item.tokopediaUrl || item.tokopediaUrl.trim() === '');

    return [
      {
        id: 'shopee' as MarketplacePlatform,
        name: 'Shopee',
        logo: '🛍️',
        color: 'bg-orange-500',
        available: shopeeProducts.length === 0,
        missingProducts: shopeeProducts.map(p => p.productName),
      },
      {
        id: 'tokopedia' as MarketplacePlatform,
        name: 'Tokopedia',
        logo: '🛒',
        color: 'bg-green-500',
        available: tokopediaProducts.length === 0,
        missingProducts: tokopediaProducts.map(p => p.productName),
      },
    ];
  }, [items]);

  /**
   * Calculate shipping cost when province changes
   * **Validates: Requirements 11.1, 11.2, 11.5**
   */
  useEffect(() => {
    if (deliveryMethod === 'in_store') {
      setShippingCost(0);
      setShippingCostError('');
    } else if (deliveryMethod === 'delivery' && selectedProvince) {
      const result = calculateShippingCost(selectedProvince);
      if (result.success && result.cost !== undefined) {
        setShippingCost(result.cost);
        setShippingCostError('');
      } else {
        setShippingCost(0);
        setShippingCostError(result.error || 'Gagal menghitung biaya pengiriman');
      }
    } else {
      setShippingCost(0);
      setShippingCostError('');
    }
  }, [deliveryMethod, selectedProvince]);

  /**
   * Validate phone number format (E.164)
   * **Validates: Requirements 3.2, 3.11**
   */
  const validatePhone = (phoneNumber: string): boolean => {
    // E.164 format: +[country code][number], 10-15 digits total
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    const cleanPhone = phoneNumber.replace(/\s/g, '');
    return phoneRegex.test(cleanPhone);
  };

  /**
   * Validate address length
   * **Validates: Requirements 3.4, 3.12**
   */
  const validateAddress = (addr: string): boolean => {
    return addr.length > 0 && addr.length <= 500;
  };

  /**
   * Validate note length
   * **Validates: Requirements 3.5**
   */
  const validateNote = (noteText: string): boolean => {
    return noteText.length <= 1000;
  };

  /**
   * Validate entire form before submission
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Marketplace selection
    if (!selectedMarketplace) {
      newErrors.marketplace = 'Silakan pilih marketplace';
    }

    // Phone validation
    if (!phone) {
      newErrors.phone = 'Nomor telepon wajib diisi';
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'Format nomor telepon tidak valid (gunakan format E.164, contoh: +628123456789)';
    }

    // Delivery method validation
    if (deliveryMethod === 'delivery') {
      if (!address) {
        newErrors.address = 'Alamat pengiriman wajib diisi';
      } else if (!validateAddress(address)) {
        newErrors.address = 'Alamat tidak valid (maksimal 500 karakter)';
      }

      if (!selectedProvince) {
        newErrors.province = 'Provinsi wajib dipilih untuk pengiriman';
      }

      if (shippingCostError) {
        newErrors.shipping = shippingCostError;
      }
    }

    // Note validation
    if (note && !validateNote(note)) {
      newErrors.note = 'Catatan terlalu panjang (maksimal 1000 karakter)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle marketplace selection
   * **Validates: Requirements 9.1, 9.2, 9.5**
   */
  const handleMarketplaceSelect = (marketplace: MarketplacePlatform) => {
    const option = marketplaceOptions.find(m => m.id === marketplace);
    
    if (!option || !option.available) {
      // Display clear error message with specific products - Requirement 9.5
      const productList = option?.missingProducts.join(', ') || '';
      toast.error(
        `Tidak dapat checkout melalui ${option?.name || 'marketplace ini'}. Produk berikut tidak memiliki link marketplace: ${productList}`,
        { duration: 5000 }
      );
      return;
    }

    setSelectedMarketplace(marketplace);
    setErrors(prev => ({ ...prev, marketplace: '' }));
  };

  /**
   * Handle form submission
   * Opens confirmation dialog instead of directly proceeding
   */
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    // Show confirmation dialog
    setShowConfirmDialog(true);
  };

  /**
   * Handle confirmed proceed action from dialog
   * This is called after user confirms in the dialog
   * Handles errors gracefully and preserves form data
   */
  const handleConfirmedProceed = async () => {
    // Clear any previous errors
    setCheckoutError(null);

    const checkoutData: MarketplaceCheckoutData = {
      marketplace: selectedMarketplace!,
      phone,
      deliveryMethod,
      address: deliveryMethod === 'delivery' ? address : undefined,
      province: deliveryMethod === 'delivery' ? selectedProvince : undefined,
      shippingCost: deliveryMethod === 'delivery' ? shippingCost : 0,
      note: note || undefined,
    };

    try {
      const result = await onCheckout(checkoutData);
      
      // Check if checkout failed
      if (!result.success && result.error) {
        // Close the confirmation dialog
        setShowConfirmDialog(false);
        
        // Set error state with details
        setCheckoutError({
          message: result.error,
          type: result.errorType,
          retryable: result.retryable !== false, // Default to true if not specified
        });

        // Show error toast
        toast.error(result.error, {
          duration: 5000,
          action: result.retryable !== false ? {
            label: 'Coba Lagi',
            onClick: () => {
              setCheckoutError(null);
              handleSubmit();
            }
          } : undefined
        });

        // Form data is preserved - user can retry
        return;
      }

      // Success case is handled by the parent component
    } catch (error) {
      // Handle unexpected errors
      console.error('Unexpected checkout error:', error);
      
      setShowConfirmDialog(false);
      setCheckoutError({
        message: 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi.',
        type: 'unknown',
        retryable: true,
      });

      toast.error('Terjadi kesalahan yang tidak terduga. Silakan coba lagi.', {
        duration: 5000,
        action: {
          label: 'Coba Lagi',
          onClick: () => {
            setCheckoutError(null);
            handleSubmit();
          }
        }
      });
    }
  };

  /**
   * Handle cancel action from dialog
   * Preserves cart and returns to checkout page
   */
  const handleConfirmCancel = () => {
    setShowConfirmDialog(false);
    // Cart is preserved, user stays on checkout page
  };

  const finalTotal = totalPrice + shippingCost;

  // Check if any marketplace is available - Requirement 10.5
  const hasAvailableMarketplace = marketplaceOptions.some(m => m.available);
  const allProductsWithoutUrls = items.filter(
    item =>
      (!item.shopeeUrl || item.shopeeUrl.trim() === '') &&
      (!item.tokopediaUrl || item.tokopediaUrl.trim() === '')
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
      {/* Left Column - Form */}
      <div className="lg:col-span-2 space-y-6 sm:space-y-8">
        {/* Error Display */}
        {checkoutError && (
          <FadeIn>
            <div className="bg-red-50 border-2 border-red-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 mb-2">
                    Gagal Membuat Pesanan
                  </h3>
                  <p className="text-sm text-red-800 mb-4">
                    {checkoutError.message}
                  </p>
                  {checkoutError.retryable && (
                    <div className="flex gap-3">
                      <Button
                        onClick={() => {
                          setCheckoutError(null);
                          handleSubmit();
                        }}
                        variant="outline"
                        className="border-red-300 text-red-700 hover:bg-red-100"
                      >
                        Coba Lagi
                      </Button>
                      <Button
                        onClick={() => setCheckoutError(null)}
                        variant="ghost"
                        className="text-red-700 hover:bg-red-100"
                      >
                        Tutup
                      </Button>
                    </div>
                  )}
                  {!checkoutError.retryable && (
                    <p className="text-xs text-red-700 mt-2">
                      Silakan perbaiki data form dan coba lagi.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {/* No Marketplace Available Warning - Requirement 10.5 */}
        {!hasAvailableMarketplace && allProductsWithoutUrls.length > 0 && (
          <FadeIn>
            <div className="bg-orange-50 border-2 border-orange-300 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-900 text-base sm:text-lg mb-2">
                    ⚠️ Tidak Dapat Melanjutkan Checkout
                  </h3>
                  <p className="text-sm text-orange-800 mb-3">
                    Beberapa produk di keranjang Anda tidak memiliki link marketplace dan tidak dapat dibeli secara online.
                  </p>
                  <div className="bg-white/50 border border-orange-200 rounded-lg p-3 mb-3">
                    <p className="text-xs text-orange-800 font-semibold mb-2">
                      Produk yang tidak dapat dibeli online:
                    </p>
                    <ul className="text-xs text-orange-700 list-disc list-inside space-y-1">
                      {allProductsWithoutUrls.map((product, idx) => (
                        <li key={idx} className="font-medium">{product.productName}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-orange-800 font-semibold">
                      💡 Pilihan Anda:
                    </p>
                    <ul className="text-sm text-orange-700 space-y-1 ml-4">
                      <li>• Hapus produk tersebut dari keranjang untuk melanjutkan checkout</li>
                      <li>• Hubungi toko secara langsung untuk membeli produk ini</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {/* Step 1: Marketplace Selection */}
        <FadeIn>
          <div className="bg-card rounded-xl sm:rounded-2xl shadow-sm border border-border/50 p-4 sm:p-6 space-y-4 sm:space-y-6">
            <h2 className="font-heading text-lg sm:text-xl font-semibold flex items-center gap-2">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-sm font-bold">
                1
              </span>
              Pilih Marketplace
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {marketplaceOptions.map((marketplace) => (
                <button
                  key={marketplace.id}
                  type="button"
                  onClick={() => handleMarketplaceSelect(marketplace.id)}
                  disabled={!marketplace.available || isProcessing}
                  className={`
                    relative p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all
                    ${selectedMarketplace === marketplace.id
                      ? 'border-primary bg-primary/5 ring-2 ring-primary'
                      : marketplace.available
                      ? 'border-border hover:border-primary/50 hover:bg-primary/5'
                      : 'border-border bg-gray-50 opacity-60 cursor-not-allowed'
                    }
                  `}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-3xl sm:text-4xl">{marketplace.logo}</span>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-base sm:text-lg">{marketplace.name}</h3>
                      {marketplace.available ? (
                        <p className="text-xs sm:text-sm text-green-600">✓ Semua produk tersedia</p>
                      ) : (
                        <p className="text-xs sm:text-sm text-red-600">✗ Beberapa produk tidak tersedia</p>
                      )}
                    </div>
                    {selectedMarketplace === marketplace.id && (
                      <CircleCheck className="w-5 h-5 sm:w-6 sm:h-6 text-primary fill-current flex-shrink-0" />
                    )}
                  </div>

                  {/* Show missing products - Requirements 9.5, 10.5 */}
                  {!marketplace.available && marketplace.missingProducts.length > 0 && (
                    <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-xs text-red-800 font-semibold mb-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Tidak dapat checkout melalui {marketplace.name}
                      </p>
                      <p className="text-xs text-red-700 mb-1.5">
                        Produk berikut tidak memiliki link marketplace:
                      </p>
                      <ul className="text-xs text-red-700 list-disc list-inside space-y-0.5 mb-2">
                        {marketplace.missingProducts.map((product, idx) => (
                          <li key={idx} className="truncate font-medium">{product}</li>
                        ))}
                      </ul>
                      <p className="text-xs text-red-600 font-medium">
                        💡 Silakan hapus produk ini dari keranjang atau hubungi toko untuk informasi pembelian.
                      </p>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {errors.marketplace && (
              <div className="flex items-center gap-2 text-red-600 text-xs sm:text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errors.marketplace}</span>
              </div>
            )}
          </div>
        </FadeIn>

        {/* Step 2: Customer Information */}
        <FadeIn delay={0.1}>
          <div className="bg-card rounded-xl sm:rounded-2xl shadow-sm border border-border/50 p-4 sm:p-6 space-y-4 sm:space-y-6">
            <h2 className="font-heading text-lg sm:text-xl font-semibold flex items-center gap-2">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-sm font-bold">
                2
              </span>
              Informasi Kontak
            </h2>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs sm:text-sm font-medium">
                Nomor Telepon *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+628123456789"
                className={`h-11 sm:h-12 rounded-xl ${errors.phone ? 'border-red-500' : ''}`}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrors(prev => ({ ...prev, phone: '' }));
                }}
                disabled={isProcessing}
              />
              {errors.phone && (
                <p className="text-xs sm:text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  {errors.phone}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Gunakan format E.164 (contoh: +628123456789)
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Step 3: Delivery Method */}
        <FadeIn delay={0.2}>
          <div className="bg-card rounded-xl sm:rounded-2xl shadow-sm border border-border/50 p-4 sm:p-6 space-y-4 sm:space-y-6">
            <h2 className="font-heading text-lg sm:text-xl font-semibold flex items-center gap-2">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-sm font-bold">
                3
              </span>
              Metode Pengiriman
            </h2>

            <div className="p-4 sm:p-5 border-2 border-primary bg-primary/5 ring-1 ring-primary rounded-xl sm:rounded-2xl flex items-start gap-2 sm:gap-3">
              <div className="mt-0.5 sm:mt-1 text-primary">
                <CircleCheck className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-sm sm:text-base text-foreground">
                  Pengiriman Ekspedisi
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Dikirim dari Silungkang menggunakan ekspedisi rekanan (JNE/J&T/Sicepat).
                </p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 pt-2 sm:pt-4">
              <div className="space-y-2">
                <Label htmlFor="province" className="text-xs sm:text-sm font-medium">Provinsi Tujuan *</Label>
                <Select
                  value={selectedProvince}
                  onValueChange={(value) => {
                    setSelectedProvince(value);
                    setErrors(prev => ({ ...prev, province: '' }));
                  }}
                  disabled={isProcessing}
                >
                  <SelectTrigger className={`h-11 sm:h-12 rounded-xl ${errors.province ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Pilih Provinsi" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableProvinces().map((prov) => (
                      <SelectItem key={prov} value={prov}>
                        {prov}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.province && (
                  <p className="text-xs sm:text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    {errors.province}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-xs sm:text-sm font-medium">Alamat Lengkap *</Label>
                <Textarea
                  id="address"
                  placeholder="Masukkan alamat lengkap (Jalan, No, RT/RW, Kelurahan, Kecamatan, Kode Pos)"
                  rows={4}
                  className={`rounded-xl text-sm ${errors.address ? 'border-red-500' : ''}`}
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setErrors(prev => ({ ...prev, address: '' }));
                  }}
                  maxLength={500}
                  disabled={isProcessing}
                />
                {errors.address && (
                  <p className="text-xs sm:text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    {errors.address}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Maksimal 500 karakter ({address.length}/500)
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Step 4: Additional Notes */}
        <FadeIn delay={0.3}>
          <div className="bg-card rounded-xl sm:rounded-2xl shadow-sm border border-border/50 p-4 sm:p-6 space-y-2">
            <h2 className="font-heading text-lg sm:text-xl font-semibold flex items-center gap-2">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-sm font-bold">
                4
              </span>
              Catatan Tambahan
            </h2>
            <Textarea
              placeholder="Catatan untuk pesanan ini (opsional)"
              rows={4}
              className={`rounded-xl text-sm ${errors.note ? 'border-red-500' : ''}`}
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                setErrors(prev => ({ ...prev, note: '' }));
              }}
              maxLength={1000}
              disabled={isProcessing}
            />
            {errors.note && (
              <p className="text-xs sm:text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                {errors.note}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Maksimal 1000 karakter ({note.length}/1000)
            </p>
          </div>
        </FadeIn>
      </div>

      {/* Right Column - Order Summary */}
      <div className="lg:col-span-1">
        <FadeIn delay={0.4}>
          <div className="bg-card rounded-xl sm:rounded-2xl shadow-lg border border-border/50 p-4 sm:p-6 space-y-4 sm:space-y-5 lg:sticky lg:top-24">
            <h2 className="font-heading text-lg sm:text-xl font-bold">
              Ringkasan Pesanan
            </h2>

            <div className="space-y-3 sm:space-y-4 max-h-48 sm:max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-xs sm:text-sm py-2 border-b border-border/50 last:border-0 gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {item.productName}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-foreground whitespace-nowrap">
                    {formatRupiah(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold text-foreground">
                  {formatRupiah(totalPrice)}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">
                  Biaya Pengiriman
                </span>
                <span className="font-medium">
                  {selectedProvince 
                    ? (shippingCostError ? 'Error' : formatRupiah(shippingCost))
                    : '-'}
                </span>
              </div>
              {shippingCostError && (
                <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-800">
                    {shippingCostError}
                  </p>
                </div>
              )}
            </div>

            <Separator className="bg-border" />

            <div className="flex justify-between text-lg sm:text-xl font-bold text-primary">
              <span>Total</span>
              <span>{formatRupiah(finalTotal)}</span>
            </div>

            {/* Shipping cost notice */}
            {selectedProvince && (
              <div className="p-2 sm:p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800 leading-relaxed">
                  <strong>Catatan:</strong> Biaya pengiriman di atas adalah estimasi. 
                  Biaya pengiriman final akan ditentukan oleh marketplace saat checkout.
                </p>
              </div>
            )}

            {/* Selected marketplace indicator */}
            {selectedMarketplace && (
              <div className="p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800 flex items-center gap-2">
                  <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>
                    Checkout melalui: <strong>{marketplaceOptions.find(m => m.id === selectedMarketplace)?.name}</strong>
                  </span>
                </p>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={isProcessing || !selectedMarketplace || !hasAvailableMarketplace}
              className="w-full h-11 sm:h-12 text-base sm:text-lg rounded-xl shadow-lg hover:shadow-primary/25 transition-all"
              size="lg"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> Memproses...
                </div>
              ) : !hasAvailableMarketplace ? (
                'Tidak Dapat Checkout'
              ) : (
                'Lanjut ke Marketplace'
              )}
            </Button>

            {!hasAvailableMarketplace ? (
              <p className="text-xs text-orange-600 text-center leading-relaxed font-medium">
                ⚠️ Checkout tidak tersedia. Silakan hapus produk tanpa link marketplace dari keranjang.
              </p>
            ) : (
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                Anda akan diarahkan ke {selectedMarketplace ? marketplaceOptions.find(m => m.id === selectedMarketplace)?.name : 'marketplace'} untuk menyelesaikan pembayaran.
              </p>
            )}
          </div>
        </FadeIn>
      </div>

      {/* Marketplace Confirmation Dialog */}
      <MarketplaceConfirmationDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        marketplace={selectedMarketplace}
        items={items}
        onProceed={handleConfirmedProceed}
        onCancel={handleConfirmCancel}
      />
    </div>
  );
}
