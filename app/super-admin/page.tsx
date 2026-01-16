import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getAllStores } from '@/lib/actions/store';
import { Badge } from '@/components/ui/badge';
import FadeIn from '@/components/animations/fade-in';
import { CheckCircle, XCircle, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  const { data: stores } = await supabase.from('stores').select('*, profiles(full_name, email:id)');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
            <h1 className="font-heading text-3xl font-bold">Super Admin Dashboard</h1>
            <Badge variant="outline" className="text-primary border-primary">Admin Access</Badge>
        </div>

        <FadeIn>
            <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Store className="w-5 h-5" />
                    Daftar Toko & Pengrajin
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-border/50">
                            <tr className="text-left text-sm text-muted-foreground">
                                <th className="pb-4 font-medium">Nama Toko</th>
                                <th className="pb-4 font-medium">Slug</th>
                                <th className="pb-4 font-medium">Owner ID</th>
                                <th className="pb-4 font-medium">Status</th>
                                <th className="pb-4 font-medium">Verifikasi</th>
                                <th className="pb-4 font-medium text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {stores?.map((store) => (
                                <tr key={store.id} className="border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors">
                                    <td className="py-4 font-medium">{store.name}</td>
                                    <td className="py-4 text-muted-foreground">{store.slug}</td>
                                    <td className="py-4 font-mono text-xs">{store.owner_id.slice(0, 8)}...</td>
                                    <td className="py-4">
                                        <Badge variant={store.is_active ? 'default' : 'secondary'}>
                                            {store.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </td>
                                    <td className="py-4">
                                        {store.is_verified ? (
                                            <div className="flex items-center gap-1 text-green-600">
                                                <CheckCircle className="w-4 h-4" />
                                                Verified
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 text-amber-600">
                                                <XCircle className="w-4 h-4" />
                                                Pending
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-4 text-right">
                                        <Button size="sm" variant="outline">Detail</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </FadeIn>
      </div>
    </div>
  );
}
