import { getStoreById } from '@/lib/actions/store';
import StoreSettingsForm from '@/components/admin/store-settings-form';
import { redirect } from 'next/navigation';
import { Store as StoreIcon, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import FadeIn from '@/components/animations/fade-in';

export const metadata = {
  title: 'Edit Toko - Super Admin',
};

export default async function EditStorePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const store = await getStoreById(resolvedParams.id);

  if (!store) {
    redirect('/super-admin/stores');
  }

  return (
    <div className="space-y-6">
      <FadeIn>
          <div className="flex items-center gap-4 mb-6">
                <Link href="/super-admin/stores">
                    <Button variant="ghost" size="icon" className="rounded-xl">
                    <ChevronLeft size={20} />
                    </Button>
                </Link>
                <div>
                   <div className="flex items-center gap-2 mb-1">
                     <StoreIcon className="w-6 h-6 text-primary" />
                     <h1 className="text-2xl font-bold tracking-tight font-heading">Edit Toko</h1>
                   </div>
                   <p className="text-muted-foreground">
                    Super Admin Override: Update detail toko ini.
                   </p>
                </div>
          </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <StoreSettingsForm store={store} />
      </FadeIn>
    </div>
  );
}
