'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { recordVisit } from '@/lib/actions/traffic';

export default function TrafficTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const timeout = setTimeout(() => {
        recordVisit(pathname);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return null; 
}
