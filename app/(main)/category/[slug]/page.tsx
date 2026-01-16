/* eslint-disable @typescript-eslint/no-explicit-any */
import NotFound from '@/app/not-found';
import { getCategoryBySlug } from '@/lib/actions/category';
import { getProducts } from '@/lib/actions/product';
import Breadcrumb from '@/components/layout/breadcrumb';
import ProductGrid from '@/components/product/product-grid';
import { Suspense } from 'react';
import CategorySort from '@/components/product/category-sort';

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams: Promise<{
    sort?: string;
    min?: string;
    max?: string;
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const resolvedParams = await params
  const category = await getCategoryBySlug(resolvedParams.slug);

  if (!category) {
    return { title: 'Category Not Found' };
  }

  return {
    title: `${category.name} - Nilam Bordir`,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const category = await getCategoryBySlug(resolvedParams.slug);

  if (!category) {
    return <NotFound />;
  }

  const { products, total } = await getProducts({
    categoryId: category.id,
    sortBy: resolvedSearchParams.sort as any,
    minPrice: resolvedSearchParams.min ? parseInt(resolvedSearchParams.min) : undefined,
    maxPrice: resolvedSearchParams.max ? parseInt(resolvedSearchParams.max) : undefined,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb
            items={[{ label: 'Kategori', href: '/' }, { label: category.name }]}
          />
          <h1 className="text-4xl font-bold mt-4 mb-2">{category.name}</h1>
          <p className="text-gray-300 max-w-2xl">{category.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Menampilkan {products.length} dari {total} produk
          </p>

          <Suspense fallback={<div>Loading...</div>}>
            <CategorySort />
          </Suspense>
        </div>

        <ProductGrid products={products} />

        {products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">
              Belum ada produk di kategori ini
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
