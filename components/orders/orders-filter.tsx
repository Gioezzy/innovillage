'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ORDER_STATUS_LABELS } from '@/lib/constans';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function OrdersFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState(searchParams.get('search') || '');

  const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'pending_payment', label: ORDER_STATUS_LABELS.pending_payment },
    { value: 'paid', label: ORDER_STATUS_LABELS.paid },
    { value: 'in_production', label: ORDER_STATUS_LABELS.in_production },
    { value: 'ready_for_pickup', label: ORDER_STATUS_LABELS.ready_for_pickup },
    { value: 'completed', label: ORDER_STATUS_LABELS.completed },
    { value: 'cancelled', label: ORDER_STATUS_LABELS.cancelled },
  ];

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setSearch('');
    router.push(pathname);
  };

  const hasFilters = searchParams.has('status') || searchParams.has('search');

  return (
    <div className="bg-white rounded-lg border p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter Status
        </label>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map(option => {
            const isActive =
              (searchParams.get('status') || '') === option.value;
            return (
              <button
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nomor pesanan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Cari
        </button>
      </form>

      {hasFilters && (
        <button
          onClick={handleClearFilters}
          className="text-sm text-gray-600 hover:text-gray-900 underline"
        >
          Reset Filter
        </button>
      )}
    </div>
  );
}
