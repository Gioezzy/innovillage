'use client';

import { useCart } from '@/context/cart-context';
import { formatRupiah } from '@/lib/utils';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import Link from 'next/link';

export default function CartSummary() {
  const { totalPrice, totalItems } = useCart();

  return (
    <div className="bg-white p-6 rounded-lg border space-y-4 sticky top-24">
      <h3 className="font-semibold text-lg">Ringkasan Pesanan</h3>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({totalItems} item)</span>
          <span className="font-medium">{formatRupiah(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Pengiriman</span>
          <span className="text-gray-600">Dihitung di checkout</span>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>{formatRupiah(totalPrice)}</span>
      </div>

      <Link href="/checkout">
        <Button className="w-full" size="lg">
          Lanjut ke Checkout
        </Button>
      </Link>

      <Link href="/">
        <Button variant="outline" className="w-full">
          Lanjut Belanja
        </Button>
      </Link>
    </div>
  );
}
