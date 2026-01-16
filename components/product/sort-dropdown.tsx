'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

function SortDropdown({ defaultValue }: { defaultValue?: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select
      className="w-full border rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
      defaultValue={defaultValue || 'name'}
      onChange={e => handleSort(e.target.value)}
    >
      <option value="name">Nama (A-Z)</option>
      <option value="price_asc">Harga: Rendah ke Tinggi</option>
      <option value="price_desc">Harga: Tinggi ke Rendah</option>
      <option value="newest">Terbaru</option>
    </select>
  );
}

export default SortDropdown;
