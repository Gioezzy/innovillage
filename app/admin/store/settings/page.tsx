import { getUserStore } from '@/lib/actions/store';
import StoreSettingsForm from '@/components/admin/store-settings-form';
import { redirect } from 'next/navigation';
import { Store as StoreIcon } from 'lucide-react';

export const metadata = {
  title: 'Pengaturan Toko - Admin Dashboard',
  description: 'Kelola informasi toko anda',
};

export default async function StoreSettingsPage() {
  const store = await getUserStore();

  if (!store) {
    redirect('/open-shop');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <StoreIcon className="w-6 h-6 text-primary" />
             <h1 className="text-2xl font-bold tracking-tight font-heading">Pengaturan Toko</h1>
           </div>
           <p className="text-muted-foreground">
            Kelola profil dan tampilan toko anda di marketplace.
           </p>
        </div>
      </div>

      <StoreSettingsForm store={store} />
    </div>
  );
}
