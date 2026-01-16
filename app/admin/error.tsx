'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin panel error:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center max-w-md p-8">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Admin Panel Error
        </h2>
        <p className="text-gray-600 mb-6">
          {error.message || 'Terjadi kesalahan di admin panel'}
        </p>
        <div className="space-y-3">
          <Button onClick={reset} className="w-full">
            Coba Lagi
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/admin">
              Kembali ke Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
