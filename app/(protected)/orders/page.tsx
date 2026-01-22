/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUserOrders } from '@/lib/actions/order';
import { formatRupiah, formatDate } from '@/lib/utils';
import OrderStatusBadge from '@/components/dashboard/order-status-badge';
import Link from 'next/link';
import { ChevronRight, Search } from 'lucide-react';
import OrdersFilter from '@/components/orders/orders-filter';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Pesanan Saya - Songket.id',
  description: 'Daftar pesanan Anda',
};

interface OrdersPageProps {
  searchParams: {
    status?: string;
    search?: string;
  };
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams;

  const { orders, total } = await getUserOrders({
    status: params.status,
    search: params.search,
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-heading mb-2">
          Pesanan Saya
        </h1>
        <p className="text-muted-foreground">
          Kelola dan lacak pesanan Anda di sini.
        </p>
      </div>

      <OrdersFilter />

      <div className="bg-card rounded-lg border border-border/50 p-4 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Menampilkan{' '}
          <span className="font-semibold text-foreground">{orders.length}</span>{' '}
          dari {total} pesanan
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-card rounded-lg border border-border/50 border-dashed p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-secondary" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2 font-heading">
            Tidak ada pesanan ditemukan
          </h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {searchParams.status || searchParams.search
              ? 'Pesanan yang Anda cari tidak ditemukan. Coba gunakan filter atau kata kunci lain.'
              : 'Anda belum pernah membuat pesanan. Yuk mulai eksplorasi produk kami!'}
          </p>
          <Link href="/shop">
            <Button
              size="lg"
              className="rounded-full shadow-lg hover:shadow-primary/25"
            >
              Mulai Belanja Sekarang
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block bg-card border border-border/50 rounded-xl p-6 hover:shadow-lg transition-all hover:border-primary/20 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {order.order_number}
                      </p>
                      <span className="text-xs text-muted-foreground bg-secondary/10 px-2 py-1 rounded-full">
                        {formatDate(order.created_at)}
                      </span>
                    </div>
                  </div>
                  <OrderStatusBadge
                    status={order.status}
                    className="self-start"
                  />
                </div>

                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {order.order_items?.slice(0, 3).map((item: any) => (
                      <span
                        key={item.id}
                        className="text-xs font-medium bg-muted text-muted-foreground px-3 py-1.5 rounded-full border border-border/50"
                      >
                        {item.product?.name || item.product_snapshot?.name}
                      </span>
                    ))}
                    {(order.order_items?.length || 0) > 3 && (
                      <span className="text-xs text-muted-foreground px-3 py-1.5">
                        +{order.order_items.length - 3} lainnya
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-end justify-between pt-4 border-t border-border/50">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Total Pesanan
                    </p>
                    <p className="text-xl font-bold text-primary font-heading">
                      {formatRupiah(order.total_amount)}
                    </p>
                  </div>
                  <div className="flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform">
                    <span className="mr-2 text-sm">Lihat Detail</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
