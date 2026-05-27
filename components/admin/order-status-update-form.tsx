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
import { updateOrderStatusAction } from '@/lib/actions/order';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface OrderStatusUpdateFormProps {
  order: {
    id: string;
    status: string;
    marketplace_platform?: string | null;
  };
}

// Status options for regular orders (with Midtrans payment)
const regularStatusOptions = [
  { value: 'pending_payment', label: 'Menunggu Pembayaran' },
  { value: 'paid', label: 'Sudah Dibayar' },
  { value: 'in_production', label: 'Sedang Diproduksi' },
  { value: 'ready_for_pickup', label: 'Siap Diambil' },
  { value: 'completed', label: 'Selesai' },
  { value: 'cancelled', label: 'Dibatalkan' },
];

// Status options for marketplace orders
const marketplaceStatusOptions = [
  { value: 'marketplace_redirect', label: 'Redirect ke Marketplace' },
  { value: 'confirmed', label: 'Dikonfirmasi' },
  { value: 'in_weaving', label: 'Sedang Ditenun' },
  { value: 'quality_check', label: 'Pengecekan Kualitas' },
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

  // Determine if this is a marketplace order
  const isMarketplaceOrder = order.status === 'marketplace_redirect' || 
    ['confirmed', 'in_weaving', 'quality_check'].includes(order.status);

  // Select appropriate status options
  const statusOptions = isMarketplaceOrder ? marketplaceStatusOptions : regularStatusOptions;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (status === order.status) {
      toast.info('Status tidak berubah');
      return;
    }

    startTransition(async () => {
      try {
        // Use the new server action for marketplace orders
        if (isMarketplaceOrder) {
          const result = await updateOrderStatusAction({
            orderId: order.id,
            newStatus: status as any,
          });

          if (!result.success) {
            toast.error(result.error || 'Gagal mengupdate status pesanan');
            return;
          }

          // Show success message
          toast.success('Status pesanan berhasil diupdate');

          // Show notification status
          if (result.notificationSent) {
            toast.success('Notifikasi berhasil dikirim ke pelanggan', {
              icon: <CheckCircle2 className="w-4 h-4" />,
            });
          } else if (result.notificationError) {
            toast.warning(
              'Status berhasil diupdate, tetapi notifikasi gagal dikirim',
              {
                icon: <AlertCircle className="w-4 h-4" />,
                description: result.notificationError,
              }
            );
          }

          router.refresh();
        } else {
          // Use the old API route for regular orders
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
        }
      } catch (error) {
        console.error('Error updating order status:', error);
        toast.error('Gagal mengupdate status pesanan');
      }
    });
  };

  return (
    <div className="space-y-4">
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

      {isMarketplaceOrder && (
        <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <p className="font-medium mb-1">Catatan:</p>
          <p>
            Notifikasi akan dikirim ke pelanggan saat status diubah ke
            &quot;Dikonfirmasi&quot; atau &quot;Selesai&quot;.
          </p>
        </div>
      )}
    </div>
  );
}
