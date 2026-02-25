'use client';

import { useState, useTransition } from 'react';
import { submitStoreRequestAction } from '@/lib/actions/store-requests';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Store, Clock, CheckCircle2, XCircle, RefreshCw, ChevronRight } from 'lucide-react';
import FadeIn from '@/components/animations/fade-in';
import { cn } from '@/lib/utils';

interface StoreRequest {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  store_name: string;
  store_description?: string;
  rejection_reason?: string;
  created_at: string;
}

interface OpenShopClientProps {
  existingRequest: StoreRequest | null;
}

export default function OpenShopClient({ existingRequest }: OpenShopClientProps) {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [allowResubmit, setAllowResubmit] = useState(false);

  const currentRequest = submitted ? { status: 'pending' as const, store_name: '', created_at: new Date().toISOString() } : existingRequest;
  const showForm = !currentRequest || allowResubmit;

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await submitStoreRequestAction(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Pengajuan berhasil dikirim! Tunggu review dari admin.');
        setSubmitted(true);
        setAllowResubmit(false);
      }
    });
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 pointer-events-none" />

      <FadeIn className="w-full max-w-lg z-10">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8 space-y-2">
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4",
              currentRequest?.status === 'pending' ? "bg-yellow-500/10" :
              currentRequest?.status === 'approved' ? "bg-green-500/10" :
              currentRequest?.status === 'rejected' ? "bg-red-500/10" :
              "bg-primary/10"
            )}>
              {currentRequest?.status === 'pending' ? <Clock className="w-8 h-8 text-yellow-600" /> :
               currentRequest?.status === 'approved' ? <CheckCircle2 className="w-8 h-8 text-green-600" /> :
               currentRequest?.status === 'rejected' ? <XCircle className="w-8 h-8 text-red-600" /> :
               <Store className="w-8 h-8 text-primary" />}
            </div>
            <h1 className="font-heading text-3xl font-bold">Buka Toko Songket</h1>
            {!currentRequest && (
              <p className="text-muted-foreground">Bergabunglah sebagai pengrajin dan pasarkan karya Anda ke seluruh dunia.</p>
            )}
          </div>

          {/* Status Request */}
          {currentRequest && !allowResubmit && (
            <div className="space-y-4">
              {currentRequest.status === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-yellow-600 shrink-0" />
                    <h3 className="font-semibold text-yellow-900">Pengajuan Sedang Diproses</h3>
                  </div>
                  <p className="text-sm text-yellow-800">
                    Pengajuan toko Anda sedang menunggu persetujuan dari Super Admin. Proses ini biasanya memakan waktu 1-3 hari kerja.
                  </p>
                  {currentRequest.store_name && (
                    <div className="mt-3 bg-yellow-100 rounded-lg p-3">
                      <p className="text-xs text-yellow-700 font-medium">Nama toko yang diajukan:</p>
                      <p className="text-sm font-bold text-yellow-900">{currentRequest.store_name}</p>
                    </div>
                  )}
                </div>
              )}

              {currentRequest.status === 'approved' && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <h3 className="font-semibold text-green-900">Pengajuan Disetujui! 🎉</h3>
                  </div>
                  <p className="text-sm text-green-800">
                    Selamat! Toko Anda telah disetujui. Silakan logout dan login kembali untuk mengakses dashboard toko Anda.
                  </p>
                  <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
                    <a href="/admin">
                      Pergi ke Dashboard Toko <ChevronRight className="w-4 h-4 ml-1" />
                    </a>
                  </Button>
                </div>
              )}

              {currentRequest.status === 'rejected' && (
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                      <h3 className="font-semibold text-red-900">Pengajuan Ditolak</h3>
                    </div>
                    {currentRequest.rejection_reason && (
                      <div className="mt-2 bg-red-100 rounded-lg p-3">
                        <p className="text-xs text-red-700 font-medium">Alasan penolakan:</p>
                        <p className="text-sm text-red-900">{currentRequest.rejection_reason}</p>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setAllowResubmit(true)}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Ajukan Ulang dengan Data Baru
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Form Pengajuan */}
          {showForm && (
            <form action={handleSubmit} className="space-y-6">
              {allowResubmit && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800">
                  Anda sedang mengajukan ulang. Pastikan informasi toko sudah sesuai.
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="store_name">Nama Toko / Brand</Label>
                <Input
                  id="store_name"
                  name="store_name"
                  placeholder="Contoh: Songket Pandai Sikek"
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="store_description">Deskripsi Singkat</Label>
                <Textarea
                  id="store_description"
                  name="store_description"
                  placeholder="Ceritakan sedikit tentang keunikan tenun Anda..."
                  rows={4}
                />
              </div>

              <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Proses Persetujuan</p>
                <p>Pengajuan toko Anda akan ditinjau oleh tim Innovillage. Anda akan mendapat notifikasi setelah pengajuan diproses.</p>
              </div>

              <Button type="submit" className="w-full h-12 text-lg" disabled={isPending}>
                {isPending ? 'Mengirim Pengajuan...' : 'Ajukan Permohonan Buka Toko'}
              </Button>
            </form>
          )}
        </div>
      </FadeIn>
    </div>
  );
}
