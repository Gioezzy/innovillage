/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

function CategoryFilterTabs({
  categories,
  activeCategory,
}: {
  categories: any[];
  activeCategory?: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleCategoryClick = (categoryId?: string) => {
    const params = new URLSearchParams(searchParams);
    if (categoryId) {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <button
        onClick={() => handleCategoryClick()}
        className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
          !activeCategory
            ? 'bg-gray-900 text-white'
            : 'bg-white text-gray-700 hover:text-gray-100 border'
        } `}
      >
        Semua
      </button>
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => handleCategoryClick(category.id)}
          className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
            activeCategory === category.id
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border'
          }`}
        >
          {category.name}
        </button>
      ))}
    </>
  );
}
export default CategoryFilterTabs;
