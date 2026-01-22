import { getOrderById } from '@/lib/actions/order';
import { formatRupiah, formatDate, getProductImage } from '@/lib/utils';
import OrderStatusBadge from '@/components/dashboard/order-status-badge';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, MapPin, CreditCard, Package } from 'lucide-react';
import CancelOrderButton from '@/components/orders/cancel-order-button';
import PaymentButton from '@/components/orders/payment-button';
import PaymentNotification from '@/components/orders/payment-notification';
import OrderTrackingTimeline from '@/components/orders/order-tracking-timeline';
import { notFound } from 'next/navigation';

import { CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Detail Pesanan - Songket.id',
};

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) {
    notFound();
  }

  const payment = order.payment?.[0];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link href="/orders" className="inline-block">
        <Button
          variant="ghost"
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Kembali ke Pesanan
        </Button>
      </Link>

      <PaymentNotification
        orderId={order.id}
        currentStatus={order.status || 'unknown'}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground font-heading mb-2">
                  {order.order_number}
                </h1>
                <p className="text-muted-foreground">
                  Dipesan pada {formatDate(order.created_at || '')}
                </p>
              </div>
              <OrderStatusBadge
                status={order.status || 'unknown'}
                className="self-start text-lg px-4 py-1"
              />
            </div>

            <Separator className="my-6 opacity-50" />
            <OrderTimeline status={order.status || 'unknown'} />
          </div>

          <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold font-heading mb-6 flex items-center text-foreground">
              <Package className="w-5 h-5 mr-3 text-primary" />
              Item Pesanan
            </h2>
            <div className="space-y-6">
              {order.order_items?.map(item => {
                const imageUrl =
                  item.custom && item.designs?.file_url
                    ? item.designs.file_url
                    : item.products?.image_urls
                    ? getProductImage(item.products.image_urls)
                    : '/images/placeholder-product.png';

                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-4 pb-6 border-b border-border/50 last:border-0 last:pb-0"
                  >
                    <div className="w-24 h-24 bg-muted rounded-xl flex-shrink-0 overflow-hidden relative border border-border/50">
                      <Image
                        src={imageUrl}
                        alt={
                          item.products?.name ||
                          item.product_snapshot?.name ||
                          'Product'
                        }
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-foreground font-heading">
                            {item.products?.name || item.product_snapshot?.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatRupiah(item.unit_price)} x {item.quantity}
                          </p>
                        </div>
                        <p className="font-bold text-primary text-lg">
                          {formatRupiah(item.line_total)}
                        </p>
                      </div>


                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <OrderTrackingTimeline
            order={{
              status: order.status || 'unknown',
              created_at: order.created_at || new Date().toISOString(),
              updated_at: order.updated_at || new Date().toISOString(),
              payment:
                order.payment?.map(p => ({
                  created_at: p.created_at || new Date().toISOString(),
                  status: p.status || 'unknown',
                })) || undefined,
            }}
          />
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm sticky top-6">
            <h2 className="text-lg font-bold font-heading mb-4 text-foreground">
              Ringkasan Pesanan
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatRupiah(order.total_amount)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Biaya Pengiriman</span>
                <span className="font-medium text-foreground">
                  {order.delivery_method === 'in_store'
                    ? 'Gratis (Ambil di Toko)'
                    : 'Akan Dikonfirmasi'}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-lg font-bold text-primary">
                <span>Total Tagihan</span>
                <span>{formatRupiah(order.total_amount)}</span>
              </div>
            </div>

            {order.status === 'pending_payment' && (
              <div className="mt-6 space-y-3">
                <PaymentButton
                  orderId={order.id}
                  orderNumber={order.order_number}
                  paymentToken={payment?.midtrans_token ?? undefined}
                  paymentStatus={payment?.status || 'pending'}
                  orderStatus={order.status || 'pending_payment'}
                />
                <CancelOrderButton orderId={order.id} />
              </div>
            )}
          </div>

          <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
            <h2 className="text-lg font-bold font-heading mb-4 flex items-center text-foreground">
              <MapPin className="w-5 h-5 mr-2 text-primary" />
              Info Pengambilan
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Metode
                </p>
                <p className="font-medium text-foreground text-base">
                  {order.delivery_method === 'in_store'
                    ? 'Ambil di Toko'
                    : 'Pengiriman Kurir'}
                </p>
              </div>

              {order.delivery_method === 'delivery' && (
                <>
                  {order.profiles?.phone && (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        Kontak
                      </p>
                      <p className="font-medium text-foreground">
                        {order.profiles.phone}
                      </p>
                    </div>
                  )}
                  {order.profiles?.address && (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        Alamat
                      </p>
                      <p className="font-medium text-foreground leading-relaxed">
                        {order.profiles.address}
                      </p>
                    </div>
                  )}
                </>
              )}

              {order.pickup_date && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Estimasi Selesai
                  </p>
                  <p className="font-medium text-foreground">
                    {formatDate(order.pickup_date)}
                  </p>
                </div>
              )}

              {order.note && (
                <div className="mt-2 p-3 bg-muted rounded-lg border border-border/50 text-muted-foreground italic">
                  &quot;{order.note}&quot;
                </div>
              )}
            </div>
          </div>

          {payment && (
            <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
              <h2 className="text-lg font-bold font-heading mb-4 flex items-center text-foreground">
                <CreditCard className="w-5 h-5 mr-2 text-primary" />
                Pembayaran
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
                      payment.status === 'success'
                        ? 'bg-green-500/10 text-green-600'
                        : payment.status === 'pending'
                        ? 'bg-yellow-500/10 text-yellow-600'
                        : 'bg-destructive/10 text-destructive'
                    }`}
                  >
                    {payment.status === 'success'
                      ? 'Lunas'
                      : payment.status === 'pending'
                      ? 'Belum Lunas'
                      : 'Gagal'}
                  </span>
                </div>
                {payment.method && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Metode</span>
                    <span className="font-medium capitalize text-foreground">
                      {payment.method.replace('_', ' ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OrderTimeline({ status }: { status: string }) {
  const steps = [
    { key: 'pending_payment', label: 'Bayar' },
    { key: 'paid', label: 'Proses' },
    { key: 'in_production', label: 'Produksi' },
    { key: 'ready_for_pickup', label: 'Siap' },
    { key: 'completed', label: 'Selesai' },
  ];

  const statusIndex = steps.findIndex(s => s.key === status);
  const isCancelled = status === 'cancelled';

  if (isCancelled) {
    return (
      <div className="w-full bg-destructive/10 border border-destructive/20 rounded-xl p-3 text-center">
        <p className="text-destructive font-bold">Pesanan Dibatalkan</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative flex items-center justify-between w-full">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted z-0 rounded-full" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary z-0 rounded-full transition-all duration-1000"
          style={{ width: `${(statusIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isActive = index <= statusIndex;
          return (
            <div
              key={step.key}
              className="relative z-10 flex flex-col items-center group"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isActive
                    ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110'
                    : 'bg-background border-muted text-muted-foreground'
                }`}
              >
                {isActive ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <span className="text-xs">{index + 1}</span>
                )}
              </div>
              <span
                className={`absolute top-10 text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="h-6" />
    </div>
  );
}
