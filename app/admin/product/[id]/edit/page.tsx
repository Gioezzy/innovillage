import { createClient } from '@/lib/supabase/server';
import NotFound from '@/app/not-found';
import ProductEditForm from '@/components/forms/product-edit-form';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Edit Produk - Admin',
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from('products')
    .select('*, category:categories(id,name)')
    .eq('id', id)
    .single();

  if (error || !product) {
    NotFound();
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/product">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Produk</h1>
          <p className="text-gray-600 mt-2">Update informasi produk</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <ProductEditForm 
          product={product} 
          categories={categories || []} 
          motifs={motifs || []} 
        />
      </div>
    </div>
  );
}
