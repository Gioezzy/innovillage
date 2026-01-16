/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { getProducts } from '@/lib/actions/product';
import { getCategories } from '@/lib/actions/category';
import Breadcrumb from '@/components/layout/breadcrumb';
import ProductGrid from '@/components/product/product-grid';
import { Suspense } from 'react';
import CategoryFilterTabs from '@/components/product/category-filter-tabs';
import SearchBar from '@/components/product/search-bar';
import SortDropdown from '@/components/product/sort-dropdown';
import FadeIn from '@/components/animations/fade-in';

interface ShopPageProps {
  searchParams: {
    category?: string;
    sort?: string;
    min?: string;
    max?: string;
    search?: string;
  };
}

export const metadata = {
  title: 'Semua Produk - Nilam Bordir',
  description: 'Jelajahi koleksi lengkap produk bordir kami',
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const categories = await getCategories();

  const { products, total } = await getProducts({
    categoryId: params.category,
    sortBy: params.sort as any,
    minPrice: params.min ? parseInt(params.min) : undefined,
    maxPrice: params.max ? parseInt(params.max) : undefined,
    search: params.search,
  });

  const activeCategory = categories.find(c => c.id === params.category);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <FadeIn>
            <Breadcrumb items={[{ label: 'Katalog Produk' }]} />
            <h1 className="font-heading text-4xl md:text-5xl font-bold mt-6 mb-4">
              Katalog Produk
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl text-lg leading-relaxed">
              Jelajahi koleksi bordir pilihan kami, perpaduan sempurna antara
              ketelitian tangan dan desain modern — diciptakan untuk
              menyempurnakan setiap penampilanmu.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 space-y-8 h-fit lg:sticky lg:top-24">
            <FadeIn delay={0.1}>
              <div>
                <h3 className="font-heading font-semibold text-lg mb-4">
                  Kategori
                </h3>
                <CategoryFilterTabs
                  categories={categories}
                  activeCategory={params.category}
                />
              </div>
            </FadeIn>
          </aside>

          <div className="flex-1">
            <FadeIn delay={0.2}>
              <div className="bg-card border border-border rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="w-full sm:w-auto flex-1">
                  <SearchBar defaultValue={params.search} />
                </div>
                <div className="w-full sm:w-48 flex items-center gap-2">
                  <Suspense
                    fallback={
                      <div className="h-10 bg-muted animate-pulse rounded-md w-full" />
                    }
                  >
                    <SortDropdown defaultValue={params.sort} />
                  </Suspense>
                </div>
              </div>

              <div className="mb-6 flex justify-between items-center text-sm text-muted-foreground">
                <p>
                  {activeCategory ? (
                    <>
                      Menampilkan kategori{' '}
                      <span className="font-medium text-foreground">
                        {activeCategory.name}
                      </span>
                    </>
                  ) : (
                    'Menampilkan semua produk'
                  )}
                </p>
                <span>{total} Produk</span>
              </div>

              {products.length > 0 ? (
                <ProductGrid products={products} />
              ) : (
                <div className="text-center py-24 bg-card rounded-2xl border border-border border-dashed">
                  <p className="text-muted-foreground text-lg mb-4">
                    Tidak ada produk ditemukan
                  </p>
                  {(params.search || params.category) && (
                    <Button variant="link" asChild>
                      <a href="/shop">Reset Filter</a>
                    </Button>
                  )}
                </div>
              )}
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
