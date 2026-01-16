import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminSidebar from '@/components/layout/admin-sidebar';

export default async function AdminLayout({
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
    .select('role, store_id')
    .eq('id', user.id)
    .single();

  if (!profile) redirect('/dashboard');
  
  const allowedRoles = ['admin', 'artisan', 'super_admin'];
  if (!allowedRoles.includes(profile.role || '')) {
    redirect('/dashboard');
  }

  if (profile.role === 'artisan' || profile.role === 'admin') {
      if (!profile.store_id) {
          const { data: stores } = await supabase.from('stores').select('id').eq('owner_id', user.id).limit(1);
          const store = stores?.[0];
          if (!store) {
              redirect('/open-shop');
          }
      }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar userRole={profile.role} />
      <main className="flex-1 overflow-x-hidden relative">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 pointer-events-none" />
        <div className="container mx-auto px-6 py-8 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
