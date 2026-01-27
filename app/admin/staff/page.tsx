import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getStaffList, deleteStaffAction } from '@/lib/actions/staff';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Trash2, User } from 'lucide-react';
import FadeIn from '@/components/animations/fade-in';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Manajemen Staff - Admin',
};

export default async function StaffPage() {
  const staffList = await getStaffList();

  return (
    <div className="space-y-8">
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-heading">
              Manajemen Staff
            </h1>
            <p className="text-muted-foreground mt-2">
              Kelola karyawan (Artisans) yang dapat mengakses toko ini.
            </p>
          </div>
          <Link href="/admin/staff/new">
            <Button size="lg" className="rounded-xl shadow-lg shadow-primary/25">
              <Plus className="w-5 h-5 mr-2" />
              Tambah Staff
            </Button>
          </Link>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Bergabung
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {staffList.map((staff) => (
                  <tr key={staff.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <User size={20} />
                        </div>
                        <div>
                            <p className="font-medium text-foreground">{staff.full_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="capitalize">
                        {staff.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(staff.created_at || '').toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-right">
                        <form action={async () => {
                            'use server';
                            await deleteStaffAction(staff.id);
                        }}>
                             <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                <Trash2 size={16} />
                             </Button>
                        </form>
                    </td>
                  </tr>
                ))}
                {staffList.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-muted-foreground">
                      Belum ada staff yang ditambahkan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
