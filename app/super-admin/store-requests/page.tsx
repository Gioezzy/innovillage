import { getStoreRequestsForAdmin } from '@/lib/actions/store-requests';
import StoreRequestsClient from './store-requests-client';
import FadeIn from '@/components/animations/fade-in';
import { ClipboardList } from 'lucide-react';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Request Toko - Super Admin',
};

export default async function StoreRequestsPage() {
  const requests = await getStoreRequestsForAdmin();

  if (!requests) {
    redirect('/');
  }

  const pendingCount = requests.filter((r: any) => r.status === 'pending').length;

  return (
    <div className="space-y-8">
      <FadeIn>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-heading flex items-center gap-3">
              <ClipboardList className="w-8 h-8 text-primary" />
              Request Pembukaan Toko
            </h1>
            <p className="text-muted-foreground mt-2">
              Review dan kelola pengajuan pembukaan toko dari pengguna.
            </p>
          </div>
          {pendingCount > 0 && (
            <div className="bg-yellow-100 border border-yellow-200 text-yellow-800 text-sm font-semibold px-4 py-2 rounded-xl">
              {pendingCount} menunggu review
            </div>
          )}
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <StoreRequestsClient requests={requests} />
      </FadeIn>
    </div>
  );
}
