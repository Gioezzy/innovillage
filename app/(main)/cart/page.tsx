'use client';

import { useCart } from '@/context/cart-context';
import CartItem from '@/components/cart/cart-item';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag, AlertTriangle, Store as StoreIcon } from 'lucide-react';
import FadeIn from '@/components/animations/fade-in';
import { formatRupiah } from '@/lib/utils';
import { useMemo } from 'react';
import type { CartItemWithMarketplace } from '@/lib/types';

export default function CartPage() {
  const { items, getItemsByStore, hasMultipleStores } = useCart();

  // Group items by store
  const itemsByStore = useMemo(() => getItemsByStore(), [getItemsByStore]);
  const multipleStores = useMemo(() => hasMultipleStores(), [hasMultipleStores]);

  // Calculate subtotal for a store's items
  const calculateStoreTotal = (storeItems: CartItemWithMarketplace[]) => {
    return storeItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // Check if any products in a store group lack marketplace URLs
  const getProductsWithoutMarketplaceUrls = (storeItems: CartItemWithMarketplace[]) => {
    return storeItems.filter(
      item =>
        (!item.shopeeUrl || item.shopeeUrl.trim() === '') &&
        (!item.tokopediaUrl || item.tokopediaUrl.trim() === '') &&
        (!item.padiumkmUrl || item.padiumkmUrl.trim() === '')
    );
  };

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

          {/* Multiple stores warning - Requirement 5.1, 5.2, 5.3 */}
          {multipleStores && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Keranjang Anda berisi produk dari beberapa toko
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Silakan checkout secara terpisah untuk setiap toko.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-8">
            {/* Render store groups - Requirement 5.4, 5.5, 5.6, 5.7 */}
            {Array.from(itemsByStore.entries()).map(([storeId, storeItems]) => {
              const storeTotal = calculateStoreTotal(storeItems);
              const productsWithoutUrls = getProductsWithoutMarketplaceUrls(storeItems);
              const storeName = storeItems[0]?.storeName || 'Toko Tidak Diketahui';

              return (
                <div
                  key={storeId}
                  className="bg-card rounded-2xl border-2 border-border/50 shadow-sm overflow-hidden"
                >
                  {/* Store header - Requirement 5.5 */}
                  <div className="bg-secondary/10 px-6 py-4 border-b border-border/50">
                    <div className="flex items-center gap-2">
                      <StoreIcon className="w-5 h-5 text-primary" />
                      <h2 className="font-semibold text-lg">{storeName}</h2>
                    </div>
                  </div>

                  {/* Store items */}
                  <div className="p-6 sm:p-8 space-y-6">
                    {storeItems.map(item => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </div>

                  {/* Warning for products without marketplace URLs - Requirement 10.4 */}
                  {productsWithoutUrls.length > 0 && (
                    <div className="mx-6 mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-orange-800">
                            Beberapa produk tidak tersedia untuk pembelian online
                          </p>
                          <p className="text-sm text-orange-700 mt-1">
                            Produk berikut tidak memiliki link marketplace:{' '}
                            <span className="font-medium">
                              {productsWithoutUrls.map(p => p.productName).join(', ')}
                            </span>
                          </p>
                          <p className="text-sm text-orange-700 mt-1">
                            Silakan hubungi toko secara langsung untuk membeli produk ini.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Store checkout section - Requirement 5.6, 5.7 */}
                  <div className="px-6 pb-6 sm:px-8 sm:pb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-border/50">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Subtotal ({storeItems.reduce((sum, item) => sum + item.quantity, 0)}{' '}
                          item)
                        </p>
                        <p className="text-2xl font-bold">{formatRupiah(storeTotal)}</p>
                      </div>
                      <Button
                        size="lg"
                        className="rounded-full px-8 shadow-lg hover:shadow-primary/25"
                        asChild
                      >
                        <Link href={`/checkout?storeId=${storeId}`}>
                          Checkout Toko Ini
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
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

          {/* Info section */}
          <div className="mt-8 p-4 bg-secondary/5 border border-secondary/10 rounded-xl text-sm text-muted-foreground space-y-2">
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
        </FadeIn>
      </div>
    </div>
  );
}
