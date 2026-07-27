'use client';

import { useState, useTransition } from 'react';
import { Button } from '../ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { deleteInactiveStoreAction } from '@/lib/actions/store';

interface DeleteStoreButtonProps {
  storeId: string;
  storeName: string;
  isActive: boolean;
}

export default function DeleteStoreButton({
  storeId,
  storeName,
  isActive,
}: DeleteStoreButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (isActive) {
    return null; // Hanya dapat menghapus toko yang sudah nonaktif
  }

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteInactiveStoreAction(storeId);

        if (result?.error) {
          toast.error(result.error);
        } else {
          toast.success('Toko berhasil dihapus!', { id: 'store-delete' });
          setIsOpen(false);
        }
      } catch (error) {
        console.error('Error deleting store:', error);
        toast.error('Terjadi kesalahan saat menghapus toko');
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
          title="Hapus Toko Nonaktif"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Hapus
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Toko Nonaktif?</AlertDialogTitle>
          <AlertDialogDescription asChild className="space-y-2">
            <div className="space-y-2">
              <p>
                Apakah Anda yakin ingin menghapus toko <strong>{storeName}</strong>?
              </p>
              <p className="text-amber-600 font-medium">
                ⚠️ Akun pengguna yang terdaftar di toko ini akan disesuaikan secara otomatis menjadi akun Pelanggan biasa (role: Customer), dan seluruh katalog produk milik toko ini akan dibersihkan dari platform.
              </p>
              <p className="text-red-600 text-xs">Tindakan ini tidak dapat dibatalkan.</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isPending ? 'Menghapus...' : 'Ya, Hapus Toko'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
