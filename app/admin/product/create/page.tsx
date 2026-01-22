import { createClient } from '@/lib/supabase/server';
import ProductForm from '@/components/forms/product-form';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Tambah Produk - Admin',
};

import { redirect } from 'next/navigation';

export default async function CreateProductPage() {
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

  if (profile?.role === 'super_admin') {
    redirect('/admin/product');
  }

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name');

  const { data: motifs } = await supabase
    .from('motifs')
    .select('id, name')
    .eq('is_active', true)
    .order('name');

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/admin/product">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground font-heading">
            Tambah Produk Baru
          </h1>
          <p className="text-muted-foreground mt-1">
            Lengkapi informasi produk untuk menambahkannya ke katalog.
          </p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 p-8 shadow-sm">
        <ProductForm categories={categories || []} motifs={motifs || []} />
      </div>
    </div>
  );
}
