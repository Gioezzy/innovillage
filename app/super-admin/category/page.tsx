import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Plus, Edit } from 'lucide-react';
import Image from 'next/image';
import CategoryFormModal from '@/components/admin/category-form-modal';
import DeleteCategoryButton from '@/components/admin/delete-category-button';
import FadeIn from '@/components/animations/fade-in';

export const metadata = {
  title: 'Manajemen Kategori - Admin',
};

export default async function AdminCategoryPage() {
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
  }

  return (
    <div className="space-y-8">
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-heading">
              Manajemen Kategori
            </h1>
            <p className="text-muted-foreground mt-2">
              Kelola kategori produk bordir
            </p>
          </div>
          <CategoryFormModal mode="create">
            <Button
              size="lg"
              className="rounded-xl shadow-lg shadow-primary/25"
            >
              <Plus className="w-5 h-5 mr-2" />
              Tambah Kategori
            </Button>
          </CategoryFormModal>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories && categories.length > 0 ? (
            categories?.map(category => (
              <div
                key={category.id}
                className="bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                <div className="relative h-48 bg-muted border-b border-border/50 overflow-hidden">
                  {category.image_url ? (
                    <Image
                      src={category.image_url}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/5">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 mr-2">
                      <h3 className="font-bold text-lg text-foreground font-heading">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {category.description}
                      </p>
                    </div>
                    <span
                      className={`flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        category.is_active
                          ? 'bg-green-500/10 text-green-600 border-green-500/20'
                          : 'bg-red-500/10 text-red-600 border-red-500/20'
                      }`}
                    >
                      {category.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-5 pt-5 border-t border-border/50">
                    <CategoryFormModal mode="edit" category={category}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 rounded-xl hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-colors"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </CategoryFormModal>
                    <DeleteCategoryButton
                      categoryId={category.id}
                      categoryName={category.name}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground bg-muted/20 rounded-2xl border border-dashed border-border">
              Belum ada kategori yang ditambahkan.
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  );
}
