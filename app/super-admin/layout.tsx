import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SuperAdminSidebar from '@/components/layout/super-admin-sidebar';
import { getPendingRequestCount } from '@/lib/actions/store-requests';

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'super_admin') {
    redirect('/dashboard');
  }

  const pendingRequestCount = await getPendingRequestCount();

  return (
    <div className="flex min-h-screen bg-background">
      <SuperAdminSidebar pendingRequestCount={pendingRequestCount} />
      <main className="flex-1 overflow-x-hidden relative">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 pointer-events-none" />
        <div className="container mx-auto px-6 py-8 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
