/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useTransition, useEffect } from 'react';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/hooks/use-auth';
import { createOrderAction } from '@/lib/actions/order';
import { formatRupiah } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import FadeIn from '@/components/animations/fade-in';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SHIPPING_RATES, PROVINCES } from '@/components/checkout/shipping-rates';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, isLoading } = useAuth();
  const [isPending, startTransition] = useTransition();

  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pickupMethod, setPickupMethod] = useState<'in_store' | 'delivery'>(
    'in_store'
  );
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [shippingCost, setShippingCost] = useState(0);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (pickupMethod === 'in_store') {
      setShippingCost(0);
    } else if (pickupMethod === 'delivery' && selectedProvince) {
      setShippingCost(SHIPPING_RATES[selectedProvince] || 0);
    } else {
      setShippingCost(0);
    }
  }, [pickupMethod, selectedProvince]);

  const finalTotal = totalPrice + shippingCost;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    redirect('/login?redirect=/checkout');
  }

  if (items.length === 0) {
    redirect('/cart');
  }

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
    }

    startTransition(async () => {
      const orderItems = items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.price,
      }));

      const result = await createOrderAction({
        items: orderItems,
        pickupMethod,
        note,
        phone,
        address: pickupMethod === 'delivery' 
          ? `${address}, ${selectedProvince}` 
          : undefined,
        shippingCost: pickupMethod === 'delivery' ? shippingCost : 0,
      });

      if (result?.error) {
        toast.error(result.error);
      } else if (result.success) {
        clearCart();
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 space-y-10">
        <FadeIn>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground">
            Checkout Pesanan
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
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
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl shadow-sm border border-border/50 p-6 space-y-6">
                <h2 className="font-heading text-xl font-semibold flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  Metode Pengambilan
                </h2>

                <RadioGroup
                  value={pickupMethod}
                  onValueChange={(value: any) => setPickupMethod(value)}
                  className="grid gap-4"
                >
                  <label
                    htmlFor="in_store"
                    className={`cursor-pointer border-2 rounded-2xl p-5 transition-all duration-200 ${
                      pickupMethod === 'in_store'
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border hover:border-border/80'
                    }`}
                    onClick={() => setPickupMethod('in_store')}
                  >
                    <div className="flex items-start gap-3">
                      <RadioGroupItem
                        id="in_store"
                        value="in_store"
                        className="mt-1"
                      />
                      <div>
                        <p className="font-semibold text-foreground">
                          Ambil di Toko
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Gratis tanpa biaya tambahan. Lokasi: Padang Panjang, Sumatera Barat.
                        </p>
                      </div>
                    </div>
                  </label>

                  <label
                    htmlFor="delivery"
                    className={`cursor-pointer border-2 rounded-2xl p-5 transition-all duration-200 ${
                      pickupMethod === 'delivery'
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border hover:border-border/80'
                    }`}
                    onClick={() => setPickupMethod('delivery')}
                  >
                    <div className="flex items-start gap-3">
                      <RadioGroupItem
                        id="delivery"
                        value="delivery"
                        className="mt-1"
                      />
                      <div>
                        <p className="font-semibold text-foreground">
                          Pengiriman Ekspedisi
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Dikirim dari Padang Panjang menggunakan ekspedisi rekanan (JNE/J&T/Sicepat).
                        </p>
                      </div>
                    </div>
                  </label>
                </RadioGroup>

                {pickupMethod === 'delivery' && (
                  <FadeIn className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="province">Provinsi Tujuan *</Label>
                        <Select
                            value={selectedProvince}
                            onValueChange={setSelectedProvince}
                        >
                            <SelectTrigger className="h-12 rounded-xl">
                                <SelectValue placeholder="Pilih Provinsi" />
                            </SelectTrigger>
                            <SelectContent>
                                {PROVINCES.map((prov) => (
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
                        />
                    </div>
                  </FadeIn>
                )}
              </div>

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
                />
              </div>
            </div>

            <div className="lg:col-span-1">
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
                            ? formatRupiah(shippingCost)
                            : '-'}
                    </span>
                  </div>
                </div>

                <Separator className="bg-border" />

                <div className="flex justify-between text-xl font-bold text-primary">
                  <span>Total</span>
                  <span>{formatRupiah(finalTotal)}</span>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={isPending}
                  className="w-full h-12 text-lg rounded-xl shadow-lg hover:shadow-primary/25 transition-all"
                  size="lg"
                >
                  {isPending ? (
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
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
