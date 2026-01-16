'use client';

import Image from 'next/image';
import { Minus, Plus, X } from 'lucide-react';
import { Button } from '../ui/button';
import { formatRupiah } from '@/lib/utils';
import { useCart } from '@/context/cart-context';
import type { CartItem } from '@/lib/types';

interface CartItemProps {
  item: CartItem;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-4 py-4 border-b">
      <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.image}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 mb-1">{item.productName}</h3>
        <p className="text-lg font-bold text-gray-900">
          {formatRupiah(item.price)}
        </p>
        {item.customization && (
          <p className="text-sm text-gray-600 mt-1">
            Catatan: {JSON.stringify(item.customization)}
          </p>
        )}
      </div>

      <div className="flex flex-col items-end justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => removeItem(item.id)}
          className="text-gray-400 hover:text-red-600"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="flex items-center gap-2 border rounded-lg">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="w-8 text-center font-medium">
            {item.quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-sm font-semibold text-gray-900">
          {formatRupiah(item.price * item.quantity)}
        </p>
      </div>
    </div>
  );
}
