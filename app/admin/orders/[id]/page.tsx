import { getAdminOrderById } from '@/lib/actions/order';
import { formatRupiah, formatDate } from '@/lib/utils';
import OrderStatusBadge from '@/components/dashboard/order-status-badge';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/layout/back-button';
import { ChevronLeft, CreditCard, Package, User } from 'lucide-react';
import OrderStatusUpdateForm from '@/components/admin/order-status-update-form';
import { AdminOrderItem } from '@/lib/types';


import FadeIn from '@/components/animations/fade-in';

export const metadata = {
  title: 'Detail Pesanan - Admin',
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await getAdminOrderById(id);
  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 animate-in fade-in zoom-in-50 duration-500">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
          <Package className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold font-heading">
          Order Tidak Ditemukan
        </h2>
        <p className="text-muted-foreground max-w-md">
          Maaf, order yang Anda cari tidak dapat ditemukan atau mungkin telah
          dihapus.
        </p>
        <Link href="/admin/orders">
          <Button size="lg" className="rounded-xl mt-4">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Pesanan
          </Button>
        </Link>
      </div>
    );
  }

  const payment = Array.isArray(order.payment)
    ? order.payment[0]
    : order.payment;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <FadeIn>
        <BackButton
          href="/admin/orders"
          className="mb-4 text-muted-foreground hover:text-foreground"
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-heading">
              Order #{order.order_number}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Dibuat pada {formatDate(order.created_at || '')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Current Status
              </p>
              <OrderStatusBadge status={order.status || 'unknown'} />
            </div>
            <div className="md:hidden">
              <OrderStatusBadge status={order.status || 'unknown'} />
            </div>
          </div>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <FadeIn delay={0.1}>
            <div className="bg-card rounded-2xl border border-border/50 p-8 shadow-sm">
              <h3 className="text-lg font-bold font-heading mb-6">
                Status Timeline
              </h3>
              <OrderTimeLine status={order.status || 'unknown'} />
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="bg-card rounded-2xl border border-border/50 p-8 shadow-sm">
              <h3 className="text-lg font-bold font-heading mb-6 flex items-center">
                <Package className="w-5 h-5 mr-3 text-primary" />
                Item Pesanan
              </h3>

              <div className="space-y-6">
                {order.order_items?.map((item: AdminOrderItem) => (
                  <div
                    key={item.id}
                    className="flex gap-5 pb-6 border-b border-border/50 last:border-0 last:pb-0"
                  >
                    <div className="w-24 h-24 bg-muted rounded-xl flex-shrink-0 overflow-hidden border border-border/50 relative group">
                      {item.custom && item.designs?.file_url ? (
                        <Image
                          src={item.designs.file_url}
                          alt={item.products?.name || 'Custom Product'}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : item.products?.image_urls?.[0] ? (
                        <Image
                          src={item.products.image_urls[0]}
                          alt={item.products.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary/5 text-muted-foreground">
                          <Package size={24} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-bold text-foreground font-heading text-lg">
                        {item.products?.name ||
                          item.product_snapshot?.name ||
                          'Custom Order'}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatRupiah(item.unit_price)}{' '}
                        <span className="text-xs mx-1">×</span> {item.quantity}{' '}
                        _pcs_
                      </p>

                      {item.designs && (
                        <div className="mt-2 inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-medium">
                          Custom Design
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-lg text-primary">
                        {formatRupiah(item.line_total)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {order.order_items?.some((item: AdminOrderItem) => item.designs) && (
            <FadeIn delay={0.3}>
              <div className="bg-card rounded-2xl border border-border/50 p-8 shadow-sm">
                <h3 className="text-lg font-bold font-heading mb-6 flex items-center">
                  <Package className="w-5 h-5 mr-3 text-primary" />
                  Preview Desain User
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {order.order_items
                    .filter((item: AdminOrderItem) => item.designs)
                    .map((item: AdminOrderItem) => (
                      <div
                        key={item.id}
                        className="border border-border/50 rounded-xl p-5 bg-muted/20"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-bold text-sm text-foreground">
                            {item.products?.name || item.product_snapshot?.name}
                          </h4>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary-foreground font-medium">
                            {item.designs?.categories?.name || 'Custom'}
                          </span>
                        </div>

                        <div className="aspect-video relative bg-background rounded-lg overflow-hidden border border-border/50 shadow-sm p-2">
                          {item.designs?.file_url ? (
                            <Image
                              src={item.designs.file_url}
                              alt="User Design"
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                              No Preview
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </FadeIn>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <FadeIn delay={0.1}>
            <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm sticky top-6">
              <h3 className="text-lg font-bold font-heading mb-4 border-b border-border/50 pb-4">
                Update Status
              </h3>
              <OrderStatusUpdateForm
                order={{
                  id: order.id,
                  status: order.status ?? 'pending',
                }}
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
              <h3 className="text-lg font-bold font-heading mb-4 border-b border-border/50 pb-4 flex items-center">
                <User className="w-4 h-4 mr-2 text-primary" />
                Data Pelanggan
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Nama Lengkap
                  </p>
                  <p className="font-medium text-foreground">
                    {order.profiles?.full_name || 'Guest User'}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Kontak
                  </p>
                  <p className="font-medium text-foreground">
                    {order.profiles?.phone || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Alamat Pengiriman
                  </p>
                  <p className="font-medium text-foreground text-sm leading-relaxed">
                    {order.shipping_address || order.profiles?.address || 'Alamat tidak tersedia'}
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
              <h3 className="text-lg font-bold font-heading mb-4 border-b border-border/50 pb-4 flex items-center">
                <CreditCard className="w-4 h-4 mr-2 text-primary" />
                Pembayaran
              </h3>

              {payment ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Status
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        payment.status === 'success'
                          ? 'bg-green-500/10 text-green-600'
                          : payment.status === 'pending'
                          ? 'bg-yellow-500/10 text-yellow-600'
                          : 'bg-red-500/10 text-red-600'
                      }`}
                    >
                      {payment.status === 'success'
                        ? 'LUNAS'
                        : payment.status?.toUpperCase() || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Metode
                    </span>
                    <span className="font-medium capitalize text-sm">
                      {payment.method?.replace('_', ' ') || '-'}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-border/50 flex justify-between items-center">
                    <span className="font-bold text-foreground">
                      Total Bayar
                    </span>
                    <span className="font-bold text-primary">
                      {formatRupiah(payment.amount)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground text-sm italic">
                  Belum ada data pembayaran
                </div>
              )}
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="bg-muted/30 rounded-2xl border border-border/50 p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-medium">
                  {formatRupiah(order.total_amount)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-muted-foreground">Ongkir</span>
                <span className="font-medium text-sm">
                  {order.delivery_method === 'in_store'
                    ? 'Gratis (Diambil)'
                    : '-'}
                </span>
              </div>
              <Separator className="bg-border/50 my-2" />
              <div className="flex justify-between items-center mt-2">
                <span className="font-bold text-lg text-foreground">
                  Total Order
                </span>
                <span className="font-bold text-lg text-primary">
                  {formatRupiah(order.total_amount)}
                </span>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}

function OrderTimeLine({ status }: { status: string }) {
  const steps = [
    { key: 'pending_payment', label: 'Menunggu Pembayaran' },
    { key: 'paid', label: 'Dibayar' },
    { key: 'in_production', label: 'Sedang Dikerjakan' },
    { key: 'ready_for_pickup', label: 'Siap Diambil' },
    { key: 'completed', label: 'Selesai' },
  ];

  const statusIndex = steps.findIndex(s => s.key === status);
  const isCancelled = status === 'cancelled';

  if (isCancelled) {
    return (
      <div className="text-center py-8 bg-destructive/10 rounded-xl border border-destructive/20">
        <p className="text-destructive font-bold text-lg">Pesanan Dibatalkan</p>
        <p className="text-muted-foreground text-sm">
          Pesanan ini telah dibatalkan dan tidak diproses.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full relative">
      <div className="absolute top-4 left-0 w-full h-1 bg-muted -z-10 rounded-full" />

      <div
        className="absolute top-4 left-0 h-1 bg-primary -z-10 rounded-full transition-all duration-500"
        style={{ width: `${(statusIndex / (steps.length - 1)) * 100}%` }}
      />

      {steps.map((step, index) => {
        const isActive = index <= statusIndex;

        return (
          <div key={step.key} className="flex flex-col items-center flex-1">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center border-4 transition-all duration-300 z-10 ${
                isActive
                  ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'bg-card border-muted text-muted-foreground'
              }`}
            >
              {isActive ? (
                <div className="w-2.5 h-2.5 bg-white rounded-full" />
              ) : (
                <span className="text-xs font-medium">{index + 1}</span>
              )}
            </div>
            <p
              className={`text-xs mt-3 text-center font-medium max-w-[80px] leading-tight ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {step.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
