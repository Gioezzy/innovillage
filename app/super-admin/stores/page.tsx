import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Store as StoreIcon,
  ExternalLink,
  CheckCircle,
  XCircle,
  Plus,
} from 'lucide-react';
import FadeIn from '@/components/animations/fade-in';
import Image from 'next/image';

export const metadata = {
  title: 'Manajemen Toko - Super Admin',
};

export default async function AdminStoresPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'super_admin') {
    redirect('/dashboard');
  }

  const { data: stores, error } = await supabase
    .from('stores')
    .select('*, profiles:owner_id(full_name)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching stores', error);
  }

  return (
    <div className="space-y-8">
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-heading">
              Manajemen Toko
            </h1>
            <p className="text-muted-foreground mt-2">
              Kelola semua toko vendor yang terdaftar di platform.
            </p>
          </div>
          <Link href="/super-admin/stores/new">
            <Button className="rounded-xl shadow-lg shadow-primary/25">
              <Plus className="w-4 h-4 mr-2" />
              Buat Toko Baru
            </Button>
          </Link>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Toko
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Pemilik
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Halaman Toko
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {stores?.map(store => (
                  <tr
                    key={store.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden border">
                          {store.image_url ? (
                            <Image
                              src={store.image_url}
                              alt={store.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <StoreIcon className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {store.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            /{store.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <p className="text-foreground">
                        {(store.profiles as any)?.full_name || 'Unknown'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div
                          className={`text-xs px-2 py-0.5 rounded-full inline-flex w-fit items-center gap-1 ${
                            store.is_active
                              ? 'bg-green-500/10 text-green-600'
                              : 'bg-red-500/10 text-red-600'
                          }`}
                        >
                          {store.is_active ? 'Aktif' : 'Nonaktif'}
                        </div>
                        <div
                          className={`text-xs px-2 py-0.5 rounded-full inline-flex w-fit items-center gap-1 ${
                            store.is_verified
                              ? 'bg-blue-500/10 text-blue-600'
                              : 'bg-yellow-500/10 text-yellow-600'
                          }`}
                        >
                          {store.is_verified ? 'Verified' : 'Unverified'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/stores/${store.slug}`} target="_blank">
                        <Button variant="ghost" size="sm" className="h-8 gap-1">
                          <ExternalLink size={14} /> Buka
                        </Button>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/super-admin/stores/${store.id}/edit`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {stores?.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Belum ada toko terdaftar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
