import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getSuperAdminAnalytics } from '@/lib/actions/analytics';
import { Badge } from '@/components/ui/badge';
import FadeIn from '@/components/animations/fade-in';
import { CheckCircle, XCircle, Store, DollarSign, Users, Activity, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatsCard from '@/components/admin/stats-card';
import { formatRupiah } from '@/lib/utils';
import Link from 'next/link';

export const metadata = {
  title: 'Super Admin - Songket.id',
};

export default async function SuperAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'super_admin') {
    redirect('/dashboard');
  }

  // Fetch Analytics & Stores
  const analytics = await getSuperAdminAnalytics();
  const { data: stores } = await supabase
    .from('stores')
    .select('*, profiles(full_name, email:id)')
    .order('created_at', { ascending: false })
    .limit(5);

  const { count: pendingStoresCount } = await supabase
    .from('stores')
    .select('*', { count: 'exact', head: true })
    .eq('is_verified', false);

  return (
    <div className="min-h-screen bg-background">
       <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="font-heading text-3xl font-bold text-foreground">Super Admin Dashboard</h1>
                <p className="text-muted-foreground mt-2">Platform Health Overview & Management</p>
            </div>
            <div className="flex gap-2">
                <Badge variant="outline" className="text-primary border-primary px-3 py-1">
                    Admin Access
                </Badge>
            </div>
        </div>

        {/* --- STATS CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
                title="Total Revenue"
                value={formatRupiah(analytics?.totalRevenue || 0)}
                icon={DollarSign}
                description="All time platform revenue"
                className="bg-gradient-to-br from-green-500/10 to-transparent"
            />
            <StatsCard
                title="Active Stores"
                value={analytics?.activeStores || 0}
                icon={Store}
                description={`${analytics?.totalStores || 0} Total Stores Registered`}
            />
             <StatsCard
                title="Total Users"
                value={analytics?.totalUsers || 0}
                icon={Users}
                description="Registered Customers & Sellers"
            />
             <StatsCard
                title="Monthly Traffic"
                value={analytics?.monthTraffic || 0}
                icon={Activity}
                description="Page views this month"
                className="bg-gradient-to-br from-blue-500/10 to-transparent"
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* --- RECENT STORES --- */}
            <div className="lg:col-span-2 space-y-6">
                <FadeIn delay={0.2}>
                    <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-border/50 flex justify-between items-center">
                            <h2 className="text-xl font-bold font-heading flex items-center gap-2">
                                <Store className="w-5 h-5 text-primary" />
                                Toko Terbaru
                            </h2>
                            <Link href="/super-admin/stores" className="text-sm text-primary hover:underline">
                                Lihat Semua
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50 text-xs uppercase font-medium text-muted-foreground">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Nama Toko</th>
                                        <th className="px-6 py-3 text-left">Owner</th>
                                        <th className="px-6 py-3 text-center">Status</th>
                                        <th className="px-6 py-3 text-center">Verifikasi</th>
                                        <th className="px-6 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-border/50">
                                    {stores?.map((store) => (
                                        <tr key={store.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="px-6 py-4 font-medium">{store.name}</td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {store.profiles?.full_name || 'Unknown'}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Badge variant={store.is_active ? 'default' : 'secondary'} className="text-xs">
                                                    {store.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 flex justify-center">
                                                {store.is_verified ? (
                                                    <div className="flex items-center gap-1 text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded-full">
                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                        Verified
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1 text-amber-600 text-xs font-medium bg-amber-50 px-2 py-1 rounded-full">
                                                        <XCircle className="w-3.5 h-3.5" />
                                                        Pending
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                 <Link href={`/super-admin/stores?id=${store.id}`}>
                                                    <Button size="sm" variant="ghost" className="h-8">Detail</Button>
                                                 </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!stores || stores.length === 0) && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Belum ada data toko.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </FadeIn>
            </div>

            {/* --- QUICK ACTIONS & ALERTS --- */}
            <div className="space-y-6">
                <FadeIn delay={0.3}>
                     {/* Pending Verification Card */}
                     <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-amber-800 font-semibold text-lg">Perlu Verifikasi</p>
                                <p className="text-amber-700 text-sm mt-1">Toko baru menunggu persetujuan Anda.</p>
                            </div>
                            <div className="bg-white text-amber-600 font-bold text-xl w-10 h-10 rounded-full flex items-center justify-center shadow-sm">
                                {pendingStoresCount || 0}
                            </div>
                        </div>
                        <div className="mt-4">
                            <Link href="/super-admin/stores">
                                <Button size="sm" className="w-full bg-amber-600 hover:bg-amber-700 text-white border-none">
                                    Review Sekarang
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
                        <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
                        <div className="space-y-2">
                             <Link href="/super-admin/traffic" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors border border-transparent hover:border-border/50 group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-md group-hover:bg-blue-200 transition-colors">
                                        <Activity className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-medium">Traffic Analytics</span>
                                </div>
                                <span className="text-xs text-muted-foreground">Lihat Detail &rarr;</span>
                            </Link>
                            
                             <Link href="/super-admin/manual" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors border border-transparent hover:border-border/50 group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 text-purple-600 rounded-md group-hover:bg-purple-200 transition-colors">
                                        <ShoppingBag className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-medium">Buku Panduan</span>
                                </div>
                                <span className="text-xs text-muted-foreground">Baca Manual &rarr;</span>
                            </Link>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
      </div>
    </div>
  );
}
