import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ProtectedSidebar from '@/components/protected/protected-sidebar';
import Navbar from '@/components/layout/navbar';

export default async function ProtectedLayout({
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

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-background">
        <ProtectedSidebar />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </>
  );
}
