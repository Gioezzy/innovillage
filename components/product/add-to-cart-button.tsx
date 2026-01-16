/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useCart } from '@/context/cart-context';
import { toast } from 'sonner';
import { ShoppingCart } from 'lucide-react';
import { getProductImage } from '@/lib/utils';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image_urls: string[];
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [customNotes, setCustomNotes] = useState('');
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity,
      image: getProductImage(product.image_urls),
      customization: customNotes
        ? {
            categorySlug: 'generic',
            additionalNotes: customNotes,
            totalPrice: product.price,
          }
        : undefined,
    });

    toast.success('Produk ditambahkan ke keranjang!');
    setQuantity(1);
    setCustomNotes('');
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Jumlah</Label>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            -
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={e =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="w-20 text-center"
            min="1"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Catatan Khusus (Opsional)</Label>
        <Textarea
          placeholder="Contoh: Warna benang merah"
          value={customNotes}
          onChange={e => setCustomNotes(e.target.value)}
          rows={3}
        />
      </div>

      <Button onClick={handleAddToCart} size="lg" className="w-full">
        <ShoppingCart className="w-5 h-5 mr-2" />
        Tambah ke Keranjang
      </Button>
    </div>
  );
}
