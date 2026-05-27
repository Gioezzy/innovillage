/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
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
import { CircleCheck, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { 
  calculateShippingCost, 
  getAvailableProvinces 
} from '@/lib/services/shipping-cost';
import { formatRupiah } from '@/lib/utils';
import { CartItemWithMarketplace, DeliveryMethod } from '@/lib/types';
import FadeIn from '@/components/animations/fade-in';

/**
 * Props for DirectCheckoutFlow component
 */
interface DirectCheckoutFlowProps {
  /** Cart items to checkout */
  items: CartItemWithMarketplace[];
  /** Total price of items (without shipping) */
  totalPrice: number;
  /** Callback when checkout is initiated */
  onCheckout: (data: DirectCheckoutData) => Promise<void>;
  /** Whether checkout is in progress */
  isProcessing?: boolean;
}

/**
 * Data collected from direct checkout form
 */
export interface DirectCheckoutData {
  phone: string;
  deliveryMethod: DeliveryMethod;
  address?: string;
  province?: string;
  shippingCost: number;
  note?: string;
}

/**
 * DirectCheckoutFlow Component
 * 
 * Displays direct Midtrans checkout flow with:
 * - Customer information form
 * - Delivery method and address
 * - Province selection with shipping cost calculation
 * - Order summary
 * - Midtrans payment processing
 * 
 * This component preserves the existing Midtrans checkout logic without modification.
 * **Validates: Requirements 6.3, 6.8**
 */
export default function DirectCheckoutFlow({
  items,
  totalPrice,
  onCheckout,
  isProcessing = false,
}: DirectCheckoutFlowProps) {
  // Form state
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pickupMethod, setPickupMethod] = useState<'in_store' | 'delivery'>('delivery');
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingCostError, setShippingCostError] = useState<string>('');
  const [note, setNote] = useState('');

  /**
   * Calculate shipping cost when province or pickup method changes
   * This is the preserved Midtrans checkout logic
   */
  useEffect(() => {
    if (pickupMethod === 'in_store') {
      setShippingCost(0);
      setShippingCostError('');
    } else if (pickupMethod === 'delivery' && selectedProvince) {
      const result = calculateShippingCost(selectedProvince);
      if (result.success && result.cost !== undefined) {
        setShippingCost(result.cost);
        setShippingCostError('');
      } else {
        setShippingCost(0);
        setShippingCostError(result.error || 'Gagal menghitung biaya pengiriman');
        console.error('Shipping cost calculation error:', result.error);
      }
    } else {
      setShippingCost(0);
      setShippingCostError('');
    }
  }, [pickupMethod, selectedProvince]);

  const finalTotal = totalPrice + shippingCost;

  /**
   * Handle checkout submission
   * This preserves the existing validation logic
   */
  const handleCheckout = async () => {
    if (!phone) {
      toast.error('Nomor telepon wajib diisi');
      return;
    }

    if (pickupMethod === 'delivery') {
      if (!address) {
        toast.error('Alamat pengiriman wajib diisi');
        return;
      }
      if (!selectedProvince) {
        toast.error('Silakan pilih provinsi tujuan pengiriman');
        return;
      }
      if (shippingCostError) {
        toast.error(shippingCostError);
        return;
      }
    }

    const checkoutData: DirectCheckoutData = {
      phone,
      deliveryMethod: pickupMethod,
      address: pickupMethod === 'delivery' ? address : undefined,
      province: pickupMethod === 'delivery' ? selectedProvince : undefined,
      shippingCost: pickupMethod === 'delivery' ? shippingCost : 0,
      note: note || undefined,
    };

    await onCheckout(checkoutData);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Form */}
      <div className="lg:col-span-2 space-y-8">
        {/* Step 1: Contact Information */}
        <FadeIn>
          <div className="bg-card rounded-2xl shadow-sm border border-border/50 p-6 space-y-6">
            <h2 className="font-heading text-xl font-semibold flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-sm font-bold">
                1
              </span>
              Informasi Kontak
            </h2>

            <div className="grid gap-5">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Nomor Telepon *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="08123456789"
                  className="h-12 rounded-xl"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  disabled={isProcessing}
                  required
                />
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Step 2: Delivery Method */}
        <FadeIn delay={0.1}>
          <div className="bg-card rounded-2xl shadow-sm border border-border/50 p-6 space-y-6">
            <h2 className="font-heading text-xl font-semibold flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-sm font-bold">
                2
              </span>
              Metode Pengiriman
            </h2>

            <div className="p-5 border-2 border-primary bg-primary/5 ring-1 ring-primary rounded-2xl flex items-start gap-3">
              <div className="mt-1 text-primary">
                <CircleCheck className="w-5 h-5 fill-current text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  Pengiriman Ekspedisi
                </p>
                <p className="text-sm text-muted-foreground">
                  Dikirim dari Silungkang menggunakan ekspedisi rekanan (JNE/J&T/Sicepat).
                </p>
              </div>
            </div>

            <FadeIn className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="province">Provinsi Tujuan *</Label>
                <Select
                  value={selectedProvince}
                  onValueChange={setSelectedProvince}
                  disabled={isProcessing}
                >
                  <SelectTrigger className="h-12 rounded-xl">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Alamat Lengkap *</Label>
                <Textarea
                  id="address"
                  placeholder="Masukkan alamat lengkap (Jalan, No, RT/RW, Kelurahan, Kecamatan, Kode Pos)"
                  rows={4}
                  className="rounded-xl"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  disabled={isProcessing}
                />
              </div>
            </FadeIn>
          </div>
        </FadeIn>

        {/* Step 3: Additional Notes */}
        <FadeIn delay={0.2}>
          <div className="bg-card rounded-2xl shadow-sm border border-border/50 p-6 space-y-2">
            <h2 className="font-heading text-xl font-semibold flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-sm font-bold">
                3
              </span>
              Catatan Tambahan
            </h2>
            <Textarea
              placeholder="Catatan untuk pesanan ini (opsional)"
              rows={4}
              className="rounded-xl"
              value={note}
              onChange={e => setNote(e.target.value)}
              disabled={isProcessing}
            />
          </div>
        </FadeIn>
      </div>

      {/* Right Column - Order Summary */}
      <div className="lg:col-span-1">
        <FadeIn delay={0.3}>
          <div className="bg-card rounded-2xl shadow-lg border border-border/50 p-6 space-y-5 sticky top-24">
            <h2 className="font-heading text-xl font-bold">
              Ringkasan Pesanan
            </h2>

            <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {items.map(item => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm py-2 border-b border-border/50 last:border-0"
                >
                  <div>
                    <p className="font-semibold text-foreground">
                      {item.productName}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-foreground">
                    {formatRupiah(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold text-foreground">
                  {formatRupiah(totalPrice)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Biaya Pengiriman
                </span>
                <span className="font-medium">
                  {pickupMethod === 'in_store'
                    ? 'Gratis'
                    : selectedProvince 
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

            <div className="flex justify-between text-xl font-bold text-primary">
              <span>Total</span>
              <span>{formatRupiah(finalTotal)}</span>
            </div>

            {pickupMethod === 'delivery' && selectedProvince && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800 leading-relaxed">
                  <strong>Catatan:</strong> Biaya pengiriman di atas adalah estimasi. 
                  Biaya pengiriman final akan ditentukan oleh marketplace saat checkout.
                </p>
              </div>
            )}

            <Button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full h-12 text-lg rounded-xl shadow-lg hover:shadow-primary/25 transition-all"
              size="lg"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Memproses...
                </div>
              ) : (
                'Buat Pesanan Sekarang'
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              Tombol ini akan membuat pesanan Anda.
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
