import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Edit } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import Image from 'next/image';
import DeleteProductButton from '@/components/admin/delete-product-button';
import FadeIn from '@/components/animations/fade-in';

export const metadata = {
  title: 'Manajemen Produk - Admin',
};

export default async function ProductListPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  let query = supabase
    .from('products')
    .select('*, category:categories(name)')
    .order('created_at', { ascending: false });

  if (profile?.role !== 'super_admin') {
    const { data: store } = await supabase
      .from('stores')
      .select('id')
      .eq('owner_id', user.id)
      .single();
    if (store) {
      query = query.eq('store_id', store.id);
    } else {
      query = query.eq('id', '00000000-0000-0000-0000-000000000000');
    }
  }

  const { data: products, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <div className="space-y-8">
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-heading">
              Manajemen Produk
            </h1>
            <p className="text-muted-foreground mt-2">
              Kelola katalog produk bordir Anda
            </p>
          </div>
          {profile?.role !== 'super_admin' && (
            <Link href="/admin/product/create">
              <Button
                size="lg"
                className="rounded-xl shadow-lg shadow-primary/25"
              >
                <Plus className="w-5 h-5 mr-2" />
                Tambah Produk
              </Button>
            </Link>
          )}
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Gambar
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Nama Produk
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Harga
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {products?.map(product => (
                  <tr
                    key={product.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="w-16 h-16 bg-muted rounded-xl overflow-hidden border border-border/50">
                        {product.image_urls?.[0] ? (
                          <Image
                            src={product.image_urls[0]}
                            alt={product.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {product.name}
                        </p>
                        {product.sku && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            SKU: {product.sku}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {product.category?.name || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {formatRupiah(product.price)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.is_active
                            ? 'bg-green-500/10 text-green-600'
                            : 'bg-red-500/10 text-red-600'
                        }`}
                      >
                        {product.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/product/${product.id}/edit`}>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="hover:bg-primary/10 hover:text-primary rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <DeleteProductButton
                          productId={product.id}
                          productName={product.name}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
