'use client';

import { useState, useTransition } from 'react';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface OrderStatusUpdateFormProps {
  order: {
    id: string;
    status: string;
  };
}

const statusOptions = [
  { value: 'pending_payment', label: 'Menunggu Pembayaran' },
  { value: 'paid', label: 'Sudah Dibayar' },
  { value: 'in_production', label: 'Sedang Diproduksi' },
  { value: 'ready_for_pickup', label: 'Siap Diambil' },
  { value: 'completed', label: 'Selesai' },
  { value: 'cancelled', label: 'Dibatalkan' },
];

export default function OrderStatusUpdateForm({
  order,
}: OrderStatusUpdateFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [status, setStatus] = useState(order.status);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (status === order.status) {
      toast.info('Status tidak berubah');
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch('/api/admin/orders', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: order.id,
            status,
          }),
        });

        if (!response.ok) {
          throw new Error('Gagal mengupdate status');
        }

        toast.success('Status pesanan berhasil diupdate');
        router.refresh();
      } catch (error) {
        console.error('Error updating order status:', error);
        toast.error('Gagal mengupdate status pesanan');
      }
    });
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-lg font-semibold mb-4">Update Status Pesanan</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={setStatus} disabled={isPending}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          disabled={isPending || status === order.status}
          className="w-full"
        >
          {isPending ? 'Menyimpan...' : 'Update Status'}
        </Button>
      </form>
    </div>
  );
}
