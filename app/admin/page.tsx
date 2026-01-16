import { createClient } from '@/lib/supabase/server';
import StatsCard from '@/components/admin/stats-card';
import { Package, ShoppingBag, Users, Store } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import OrderStatusBadge from '@/components/dashboard/order-status-badge';
import Link from 'next/link';

export const metadata = {
  title: 'Admin Dashboard - Songket.id',
  description: 'Admin Dashboard',
};

export default async function AdminDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, store_id')
    .eq('id', user.id)
    .single();

  const isSuperAdmin = profile?.role === 'super_admin';
  let stats = {
    card1: { title: 'Total Produk', value: 0, icon: Package },
    card2: { title: 'Total Pesanan', value: 0, icon: ShoppingBag },
    card3: { title: 'Total Pendapatan', value: 0, icon: null as any },
  };

  if (isSuperAdmin) {
    const { count: totalStores } = await supabase
      .from('stores')
      .select('id', { count: 'exact', head: true });
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true });

    const { data: revenueData } = await supabase
      .from('orders')
      .select('total_amount')
      .in('status', ['paid', 'completed']);

    const totalRevenue =
      revenueData?.reduce((acc, curr) => acc + curr.total_amount, 0) || 0;

    stats = {
      card1: { title: 'Total Toko', value: totalStores || 0, icon: Store },
      card2: { title: 'Total User', value: totalUsers || 0, icon: Users },
      card3: { title: 'Total Transaksi', value: totalRevenue, icon: null },
    };
  } else {
    let storeId = profile?.store_id;
    
    if (!storeId) {
        const { data: store } = await supabase
        .from('stores')
        .select('id')
        .eq('owner_id', user.id)
        .single();
        storeId = store?.id;
    }

    if (storeId) {
      const { count: totalProducts } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true)
        .eq('store_id', storeId);

      const { count: totalOrders } = await supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('store_id', storeId);

      const { data: orders } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('store_id', storeId)
        .in('status', ['paid', 'in_weaving', 'ready_for_pickup', 'completed']);

      const totalRevenue =
        orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

      stats = {
        card1: {
          title: 'Total Produk',
          value: totalProducts || 0,
          icon: Package,
        },
        card2: {
          title: 'Total Pesanan',
          value: totalOrders || 0,
          icon: ShoppingBag,
        },
        card3: { title: 'Pendapatan Toko', value: totalRevenue, icon: null },
      };
    }
  }

  let recentOrdersQuery = supabase
    .from('orders')
    .select(`*, profiles(full_name)`)
    .order('created_at', { ascending: false })
    .limit(5);

  if (!isSuperAdmin) {
    let storeId = profile?.store_id;

    if (!storeId) {
        const { data: store } = await supabase
        .from('stores')
        .select('id')
        .eq('owner_id', user.id)
        .single();
        storeId = store?.id;
    }

    if (storeId) {
      recentOrdersQuery = recentOrdersQuery.eq('store_id', storeId);
    } else {
      recentOrdersQuery = recentOrdersQuery.eq(
        'id',
        '00000000-0000-0000-0000-000000000000'
      );
    }
  }

  const { data: recentOrders } = await recentOrdersQuery;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-heading">
            Dashboard {isSuperAdmin ? 'Platform' : 'Toko'}
          </h1>
          <p className="text-muted-foreground mt-2">
            Overview aktivitas {isSuperAdmin ? 'platform' : 'toko'} dan
            statistik performa.
          </p>
        </div>
        <div className="hidden md:block">
          <div className="px-4 py-2 bg-card rounded-full border border-border/50 text-sm text-foreground flex items-center gap-2 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            System Active
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title={stats.card1.title}
          value={stats.card1.value}
          icon={stats.card1.icon}
        />
        <StatsCard
          title={stats.card2.title}
          value={stats.card2.value}
          icon={stats.card2.icon}
        />
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
          <div className="relative z-10">
            <p className="text-sm font-medium opacity-90 mb-1">
              {stats.card3.title}
            </p>
            <p className="text-2xl font-bold font-heading">
              {formatRupiah(stats.card3.value)}
            </p>
          </div>
          <div className="relative z-10 mt-4 flex items-center gap-2 text-xs opacity-80">
            <ShoppingBag size={14} />
            <span>Terverifikasi (Lunas/Selesai)</span>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border/50 flex items-center justify-between">
          <h2 className="text-xl font-bold font-heading">Pesanan Terbaru</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-primary hover:underline font-medium"
          >
            Lihat Semua
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Pelanggan
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {recentOrders && recentOrders.length > 0 ? (
                recentOrders.map(order => (
                  <tr
                    key={order.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      #{order.order_number}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {order.profiles?.full_name || 'Guest'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {formatRupiah(order.total_amount)}
                    </td>
                    <td className="px-6 py-4">
                      <OrderStatusBadge status={order.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    Belum ada pesanan terbaru.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
