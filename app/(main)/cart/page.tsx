'use client';

import { useCart } from '@/context/cart-context';
import CartItem from '@/components/cart/cart-item';
import CartSummary from '@/components/cart/cart-summary';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import FadeIn from '@/components/animations/fade-in';

export default function CartPage() {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <FadeIn className="text-center space-y-6 max-w-md">
          <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Keranjang Kosong
          </h1>
          <p className="text-muted-foreground text-lg">
            Belum ada produk di keranjang Anda. Yuk, mulai belanja koleksi
            eksklusif kami!
          </p>
          <Button
            size="lg"
            className="rounded-full px-8 shadow-lg hover:shadow-primary/25"
            asChild
          >
            <Link href="/shop">Mulai Belanja</Link>
          </Button>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <FadeIn>
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-8 md:mb-12">
            Keranjang Belanja
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 space-y-6">
                  {items.map(item => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              </div>

              <Button
                variant="ghost"
                className="mt-6 text-muted-foreground hover:text-foreground"
                asChild
              >
                <Link href="/shop" className="flex items-center gap-2">
                  ← Lanjut Belanja
                </Link>
              </Button>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <CartSummary />
                <div className="mt-6 p-4 bg-secondary/5 border border-secondary/10 rounded-xl text-sm text-muted-foreground space-y-2">
                  <p className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    Pembayaran Aman
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    Garansi Kualitas Bordir
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
