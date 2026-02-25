'use client';

import { useState, useTransition } from 'react';
import { approveStoreRequestAction, rejectStoreRequestAction } from '@/lib/actions/store-requests';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, Clock, Store, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatDateTime } from '@/lib/utils';

interface StoreRequest {
  id: string;
  store_name: string;
  store_description: string | null;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string | null;
  created_at: string;
  reviewed_at: string | null;
  profiles: {
    id: string;
    full_name: string;
  } | null;
}

interface StoreRequestsClientProps {
  requests: StoreRequest[];
}

function RejectModal({ requestId, onClose, onSuccess }: { requestId: string; onClose: () => void; onSuccess: () => void }) {
  const [reason, setReason] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleReject = () => {
    if (!reason.trim()) {
      toast.error('Alasan penolakan harus diisi.');
      return;
    }
    startTransition(async () => {
      const result = await rejectStoreRequestAction(requestId, reason.trim());
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Pengajuan berhasil ditolak.');
        onSuccess();
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h3 className="text-lg font-bold mb-4 text-foreground">Tolak Pengajuan</h3>
        <p className="text-sm text-muted-foreground mb-4">Berikan alasan penolakan agar user dapat memperbaiki pengajuannya.</p>
        <textarea
          className="w-full border border-border rounded-xl p-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary h-28 resize-none"
          placeholder="Contoh: Nama toko tidak sesuai ketentuan platform..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="flex gap-3 mt-4">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={isPending}>Batal</Button>
          <Button variant="destructive" className="flex-1" onClick={handleReject} disabled={isPending}>
            {isPending ? 'Memproses...' : 'Tolak Pengajuan'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function RequestCard({ request, onAction }: { request: StoreRequest; onAction: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approveStoreRequestAction(request.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Toko "${request.store_name}" berhasil disetujui!`);
        onAction();
      }
    });
  };

  const statusConfig = {
    pending: { label: 'Menunggu Review', icon: Clock, color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    approved: { label: 'Disetujui', icon: CheckCircle2, color: 'bg-green-100 text-green-700 border-green-200' },
    rejected: { label: 'Ditolak', icon: XCircle, color: 'bg-red-100 text-red-700 border-red-200' },
  };

  const status = statusConfig[request.status];
  const StatusIcon = status.icon;

  return (
    <>
      {showRejectModal && (
        <RejectModal
          requestId={request.id}
          onClose={() => setShowRejectModal(false)}
          onSuccess={() => { setShowRejectModal(false); onAction(); }}
        />
      )}
      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="p-2 bg-primary/10 rounded-xl shrink-0">
                <Store className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground truncate">{request.store_name}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  oleh <span className="font-medium text-foreground">{request.profiles?.full_name || 'Unknown User'}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">{formatDateTime(request.created_at)}</p>
              </div>
            </div>
            <span className={cn('flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border shrink-0', status.color)}>
              <StatusIcon className="w-3.5 h-3.5" />
              {status.label}
            </span>
          </div>

          {request.store_description && (
            <div className="mt-4">
              <button
                onClick={() => setShowDetail(!showDetail)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', showDetail && 'rotate-180')} />
                {showDetail ? 'Sembunyikan' : 'Lihat deskripsi'}
              </button>
              {showDetail && (
                <p className="text-sm text-muted-foreground mt-2 bg-muted/50 rounded-lg p-3">
                  {request.store_description}
                </p>
              )}
            </div>
          )}

          {request.status === 'rejected' && request.rejection_reason && (
            <div className="mt-3 bg-red-50 border border-red-100 rounded-lg p-3">
              <p className="text-xs text-red-700 font-medium mb-1">Alasan penolakan:</p>
              <p className="text-sm text-red-800">{request.rejection_reason}</p>
            </div>
          )}

          {request.status === 'pending' && (
            <div className="flex gap-3 mt-4 pt-4 border-t border-border/50">
              <Button
                size="sm"
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleApprove}
                disabled={isPending}
              >
                {isPending ? 'Memproses...' : (
                  <><CheckCircle2 className="w-4 h-4 mr-1.5" /> Setujui</>
                )}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="flex-1"
                onClick={() => setShowRejectModal(true)}
                disabled={isPending}
              >
                <XCircle className="w-4 h-4 mr-1.5" /> Tolak
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function StoreRequestsClient({ requests: initialRequests }: StoreRequestsClientProps) {
  const [requests, setRequests] = useState(initialRequests);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const filteredRequests = activeFilter === 'all' ? requests : requests.filter(r => r.status === activeFilter);

  // Refresh data setelah action
  const handleAction = () => {
    // Next.js router.refresh() tidak bisa dipanggil dari client ini — kita pakai window.location
    window.location.reload();
  };

  const filters: { key: typeof activeFilter; label: string }[] = [
    { key: 'all', label: `Semua (${requests.length})` },
    { key: 'pending', label: `Menunggu (${pendingCount})` },
    { key: 'approved', label: 'Disetujui' },
    { key: 'rejected', label: 'Ditolak' },
  ];

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all',
              activeFilter === f.key
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Request Cards */}
      {filteredRequests.length === 0 ? (
        <div className="bg-card border border-border/50 rounded-2xl p-12 text-center">
          <Store className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Tidak ada pengajuan ditemukan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredRequests.map(request => (
            <RequestCard key={request.id} request={request} onAction={handleAction} />
          ))}
        </div>
      )}
    </div>
  );
}
