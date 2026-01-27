'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag, FileText, Upload } from 'lucide-react';

export default function DashboardQuickActions() {
  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="outline"
        className="w-full justify-start h-12 text-left font-medium"
        asChild
      >
        <Link href="/shop">
          <ShoppingBag className="w-4 h-4 mr-3 text-primary" />
          Mulai Belanja
        </Link>
      </Button>

      <Button
        variant="outline"
        className="w-full justify-start h-12 text-left font-medium"
        asChild
      >
        <Link href="/orders">
          <FileText className="w-4 h-4 mr-3 text-primary" />
          Riwayat Pesanan
        </Link>
      </Button>

      <Button
        variant="outline"
        className="w-full justify-start h-12 text-left font-medium"
        asChild
      >
        <Link href="/smart-lens">
          <Upload className="w-4 h-4 mr-3 text-primary" />
          Smart Lens
        </Link>
      </Button>
    </div>
  );
}
