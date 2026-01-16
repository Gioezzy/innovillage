import { getUserOrders, getUserOrderStats } from '@/lib/actions/order';
import { getUserProfile } from '@/lib/actions/profile';
import StatsCard from '@/components/dashboard/stats-card';
import RecentOrders from '@/components/dashboard/recent-orders';
import { ShoppingBag, Clock, Package, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import DashboardQuickActions from '@/components/dashboard/dashboard-quick-actions';
import FadeIn from '@/components/animations/fade-in';

export const metadata = {
  title: 'Dashboard - Songket.id',
  description: 'Dashboard Pelanggan',
};

export default async function DashboardPage() {
  const profile = await getUserProfile();
  const stats = await getUserOrderStats();
  const { orders } = await getUserOrders({ limit: 5 });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <FadeIn>
        <div>
          <h1 className="text-3xl font-bold text-foreground font-heading mb-2">
            Selamat Datang, {profile?.full_name?.split(' ')[0] || 'Customer'}
          </h1>
          <p className="text-muted-foreground">
            Kelola pesanan dan pantau pengiriman Songket Anda di sini.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Pesanan"
            value={stats.total}
            icon={<ShoppingBag />}
            iconColor="text-blue-500"
          />

          <StatsCard
            title="Menunggu Pembayaran"
            value={stats.pending}
            icon={<Clock />}
            iconColor="text-yellow-500"
          />

          <StatsCard
            title="Sedang Diproses"
            value={stats.inProduction}
            icon={<Package />}
            iconColor="text-purple-500"
          />

          <StatsCard
            title="Selesai"
            value={stats.completed}
            icon={<CheckCircle />}
            iconColor="text-green-500"
          />
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <FadeIn delay={0.2}>
            <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold font-heading text-foreground">
                  Pesanan Terbaru
                </h2>
                {orders.length > 0 && (
                  <Button
                    variant="ghost"
                    className="text-sm text-primary hover:text-primary/80"
                    asChild
                  >
                    <Link href="/orders">Lihat Semua &rarr;</Link>
                  </Button>
                )}
              </div>
              <RecentOrders orders={orders} />
            </div>
          </FadeIn>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <FadeIn delay={0.3}>
            <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
              <h2 className="text-xl font-bold font-heading text-foreground mb-4">
                Aksi Cepat
              </h2>
              <DashboardQuickActions />
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/10">
              <h3 className="font-bold text-foreground mb-2">Butuh Bantuan?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Tim kami siap membantu kendala pesanan Anda.
              </p>
              <Button
                variant="outline"
                className="w-full bg-background/50 backdrop-blur-sm"
              >
                Hubungi Admin
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
