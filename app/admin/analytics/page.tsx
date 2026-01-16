/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAdminAnalytics } from '@/lib/actions/analytics';
import { formatRupiah } from '@/lib/utils';
import StatsCard from '@/components/admin/stats-card';
import { ShoppingBag, Users, DollarSign, Package } from 'lucide-react';
import FadeIn from '@/components/animations/fade-in';

export const metadata = {
  title: 'Analytics - Admin',
};

export default async function AnalyticsPage() {
  const analytics = await getAdminAnalytics();

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Data analytics tidak tersedia</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <FadeIn>
        <div>
          <h1 className="text-3xl font-bold text-foreground font-heading">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor performa bisnis dan statistik penjualan
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Revenue"
            value={formatRupiah(analytics?.revenue?.total || 0)}
            description={`${analytics?.revenue?.growth > 0 ? '+' : ''}${
              analytics?.revenue?.growth || 0
            }% vs bulan lalu`}
            icon={DollarSign}
            className="bg-card from-primary/5 to-transparent bg-gradient-to-br"
          />

          <StatsCard
            title="Total Orders"
            value={analytics?.orders?.total || 0}
            description={`${analytics?.orders?.month || 0} orders bulan ini`}
            icon={ShoppingBag}
          />

          <StatsCard
            title="Total Customers"
            value={analytics?.customers?.total || 0}
            description={`${analytics?.customers?.month || 0} customer baru`}
            icon={Users}
          />

          <StatsCard
            title="Active Products"
            value={analytics?.products?.total || 0}
            icon={Package}
          />
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <FadeIn delay={0.2} className="h-full">
          <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm h-full">
            <h2 className="text-xl font-bold font-heading mb-6 flex items-center">
              <Package className="w-5 h-5 mr-3 text-primary" />
              Top 5 Produk Terlaris
            </h2>
            <div className="space-y-4">
              {analytics?.topProducts?.map((product: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0
                          ? 'bg-yellow-500/20 text-yellow-600'
                          : index === 1
                          ? 'bg-gray-300/30 text-gray-600'
                          : index === 2
                          ? 'bg-orange-400/20 text-orange-600'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="font-medium text-foreground">
                      {product.name}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground bg-background px-2.5 py-1 rounded-full border border-border/50">
                    {product.quantity} terjual
                  </span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.3} className="h-full">
          <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm h-full">
            <h2 className="text-xl font-bold font-heading mb-6 flex items-center">
              <ShoppingBag className="w-5 h-5 mr-3 text-primary" />
              Status Pesanan
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(analytics?.statusBreakdown || {}).map(
                ([status, count]) => (
                  <div
                    key={status}
                    className="p-5 bg-muted/30 rounded-xl border border-border/50 flex flex-col justify-center items-center text-center"
                  >
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      {status.replace('_', ' ')}
                    </p>
                    <p className="text-3xl font-bold text-primary">
                      {count as number}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
