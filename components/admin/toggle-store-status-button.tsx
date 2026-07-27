'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { toggleStoreActiveAction } from '@/lib/actions/store';
import { toast } from 'sonner';
import { Power, PowerOff } from 'lucide-react';

interface ToggleStoreStatusButtonProps {
  storeId: string;
  isActive: boolean;
}

export default function ToggleStoreStatusButton({
  storeId,
  isActive,
}: ToggleStoreStatusButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const newStatus = !isActive;
      const result = await toggleStoreActiveAction(storeId, newStatus);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(
          `Toko berhasil di-${newStatus ? 'aktifkan' : 'nonaktifkan'}!`
        );
      }
    });
  };

  return (
    <Button
      variant={isActive ? 'outline' : 'default'}
      size="sm"
      disabled={isPending}
      onClick={handleToggle}
      className={
        isActive
          ? 'text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700'
          : 'bg-green-600 hover:bg-green-700 text-white'
      }
    >
      {isActive ? (
        <>
          <PowerOff className="w-3.5 h-3.5 mr-1" />
          Nonaktifkan
        </>
      ) : (
        <>
          <Power className="w-3.5 h-3.5 mr-1" />
          Aktifkan
        </>
      )}
    </Button>
  );
}
