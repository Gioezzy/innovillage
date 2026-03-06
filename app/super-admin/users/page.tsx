import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import FadeIn from '@/components/animations/fade-in';
import { Users, Search, Store, Crown, Scissors, ShoppingBag } from 'lucide-react';
import { formatDistanceToNow } from '@/lib/utils';
import Image from 'next/image';

export const metadata = {
  title: 'Manajemen Pengguna - Super Admin',
};

const roleConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive'; icon: React.ElementType; color: string }> = {
  super_admin: { label: 'Super Admin', variant: 'default', icon: Crown, color: 'text-purple-600 bg-purple-100 border-purple-200' },
  admin: { label: 'Admin', variant: 'default', icon: Store, color: 'text-blue-600 bg-blue-100 border-blue-200' },
  artisan: { label: 'Artisan', variant: 'secondary', icon: Scissors, color: 'text-amber-600 bg-amber-100 border-amber-200' },
  customer: { label: 'Customer', variant: 'outline', icon: ShoppingBag, color: 'text-green-600 bg-green-100 border-green-200' },
};

export default async function SuperAdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string; page?: string }>;
}) {
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

  const { q, role, page = '1' } = await searchParams;
  const currentPage = Math.max(1, parseInt(page as string) || 1);
  const ITEMS_PER_PAGE = 15;

  // Ambil semua profiles + join ke stores sebagai owner (untuk role admin)
  let query = supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      avatar_url,
      role,
      created_at,
      stores_as_owner:stores!stores_owner_id_fkey(id, name, slug)
    `, { count: 'exact' })
    .order('created_at', { ascending: false });

  if (role && role !== 'all') {
    query = query.eq('role', role as string);
  }

  if (q) {
    query = query.ilike('full_name', `%${q}%`);
  }

  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;
  query = query.range(from, to);

  const { data: users, count: totalUsersCount } = await query;

  // Untuk artisan, cari toko yang mereka terdaftar sebagai staff via stores.owner_id atau artisan join
  // Berdasarkan codebase: artisan punya store_id di profiles (dipakai di store.ts baris 174)
  // Kita ambil artisan users lalu query stores yang owner nya bukan artisan tersebut
  // Sebenarnya berdasarkan store.ts, artisan memiliki profile.store_id
  // Kita akan query artisan stores secara terpisah
  const artisanIds = users?.filter(u => u.role === 'artisan').map(u => u.id) ?? [];
  let artisanStoreMap: Record<string, string> = {};
  
  if (artisanIds.length > 0) {
    // Query dari tabel profiles dengan select store_id (kolom runtime)
    const { data: artisanProfiles } = await supabase
      .from('profiles')
      .select('id, store_id')
      .in('id', artisanIds);
    
    const artisanStoreIds = artisanProfiles
      ?.filter((p): p is typeof p & { store_id: string } => !!p.store_id)
      .map(p => p.store_id) ?? [];
    
    if (artisanStoreIds.length > 0) {
      const { data: storeData } = await supabase
        .from('stores')
        .select('id, name')
        .in('id', artisanStoreIds);
      
      // Build user_id -> store_name map
      const storeNameById = Object.fromEntries(storeData?.map(s => [s.id, s.name]) ?? []);
      artisanProfiles?.forEach(p => {
        if (p.store_id && storeNameById[p.store_id]) {
          artisanStoreMap[p.id] = storeNameById[p.store_id];
        }
      });
    }
  }

  // Count per role
  const { data: roleCounts } = await supabase
    .from('profiles')
    .select('role');
  
  const counts = roleCounts?.reduce((acc, p) => {
    if (p.role) acc[p.role] = (acc[p.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) ?? {};

  return (
    <div className="space-y-8">
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-heading flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              Manajemen Pengguna
            </h1>
            <p className="text-muted-foreground mt-2">
              Daftar seluruh pengguna yang terdaftar di platform.
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-foreground">{totalUsersCount ?? 0}</p>
            <p className="text-sm text-muted-foreground">Total Pengguna</p>
          </div>
        </div>
      </FadeIn>

      {/* Summary Cards */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(roleConfig).map(([key, cfg]) => {
            const Icon = cfg.icon;
            return (
              <a
                key={key}
                href={`/super-admin/users?role=${key}`}
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                  role === key ? 'ring-2 ring-primary shadow-md' : 'bg-card border-border/50'
                }`}
              >
                <div className={`p-2 rounded-lg ${cfg.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{counts[key] ?? 0}</p>
                  <p className="text-xs text-muted-foreground">{cfg.label}</p>
                </div>
              </a>
            );
          })}
        </div>
      </FadeIn>

      {/* Search & Filter */}
      <FadeIn delay={0.15}>
        <div className="flex flex-col sm:flex-row gap-3">
          <form method="GET" action="/super-admin/users" className="flex gap-2 flex-1">
            {role && <input type="hidden" name="role" value={role} />}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                name="q"
                defaultValue={q}
                type="text"
                placeholder="Cari nama pengguna..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-border/50 rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium"
            >
              Cari
            </button>
            {(q || role) && (
              <a
                href="/super-admin/users"
                className="px-4 py-2 text-sm border border-border/50 rounded-xl hover:bg-muted transition-colors"
              >
                Reset
              </a>
            )}
          </form>
        </div>
      </FadeIn>

      {/* Table */}
      <FadeIn delay={0.2}>
        <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Pengguna
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Toko Terdaftar
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Terdaftar
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {users?.map(u => {
                  const cfg = roleConfig[u.role ?? 'customer'] ?? roleConfig.customer;
                  const Icon = cfg.icon;

                  // Tentukan nama toko
                  let storeName: string | null = null;
                  if (u.role === 'admin') {
                    const ownerStore = (u as unknown as { stores_as_owner: { name: string; slug: string }[] | null }).stores_as_owner;
                    storeName = Array.isArray(ownerStore) && ownerStore.length > 0
                      ? ownerStore[0].name
                      : null;
                  } else if (u.role === 'artisan') {
                    storeName = artisanStoreMap[u.id] ?? null;
                  }

                  return (
                    <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted overflow-hidden border border-border/50 shrink-0">
                            {u.avatar_url ? (
                              <Image
                                src={u.avatar_url}
                                alt={u.full_name ?? 'User'}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground font-bold text-sm">
                                {u.full_name?.charAt(0).toUpperCase() ?? '?'}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-sm">
                              {u.full_name ?? <span className="text-muted-foreground italic">Belum diisi</span>}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono">{u.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {storeName ? (
                          <a
                            href={`/super-admin/stores`}
                            className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                          >
                            <Store className="w-3.5 h-3.5 shrink-0" />
                            {storeName}
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {u.created_at
                          ? formatDistanceToNow(new Date(u.created_at))
                          : '—'}
                      </td>
                    </tr>
                  );
                })}
                {(!users || users.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <Users className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                      <p className="text-muted-foreground font-medium">Tidak ada pengguna ditemukan.</p>
                      {q && <p className="text-sm text-muted-foreground mt-1">Coba ubah kata kunci pencarian.</p>}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {users && users.length > 0 && (
            <div className="px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-border/50 text-sm text-muted-foreground">
              <div>
                Menampilkan <span className="font-medium text-foreground">{from + 1}</span> - <span className="font-medium text-foreground">{Math.min(to + 1, totalUsersCount || 0)}</span> dari <span className="font-medium text-foreground">{totalUsersCount}</span> pengguna
                {q && ` untuk pencarian "${q}"`}
                {role && role !== 'all' && ` dengan role ${roleConfig[role as string]?.label ?? role}`}
              </div>
              
              {/* Pagination Controls */}
              {totalUsersCount && totalUsersCount > ITEMS_PER_PAGE && (
                <div className="flex items-center gap-2">
                  <a
                    href={`/super-admin/users?${new URLSearchParams({
                      ...(q ? { q: q as string } : {}),
                      ...(role ? { role: role as string } : {}),
                      page: (currentPage - 1).toString(),
                    }).toString()}`}
                    className={`px-3 py-1.5 border border-border/50 rounded-lg text-sm bg-background font-medium shadow-sm ${
                      currentPage <= 1 
                        ? 'opacity-50 cursor-not-allowed pointer-events-none' 
                        : 'hover:bg-muted hover:text-foreground transition-colors'
                    }`}
                  >
                    Sebelumnya
                  </a>
                  <span className="font-medium text-foreground mx-2 text-xs">
                    Halaman {currentPage} dari {Math.ceil(totalUsersCount / ITEMS_PER_PAGE)}
                  </span>
                  <a
                    href={`/super-admin/users?${new URLSearchParams({
                      ...(q ? { q: q as string } : {}),
                      ...(role ? { role: role as string } : {}),
                      page: (currentPage + 1).toString(),
                    }).toString()}`}
                    className={`px-3 py-1.5 border border-border/50 rounded-lg text-sm bg-background font-medium shadow-sm ${
                      currentPage >= Math.ceil(totalUsersCount / ITEMS_PER_PAGE) 
                        ? 'opacity-50 cursor-not-allowed pointer-events-none' 
                        : 'hover:bg-muted hover:text-foreground transition-colors'
                    }`}
                  >
                    Selanjutnya
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  );
}
