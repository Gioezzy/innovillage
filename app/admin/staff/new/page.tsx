'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createStaffAction } from '@/lib/actions/staff';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import FadeIn from '@/components/animations/fade-in';

export default function NewStaffPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await createStaffAction(formData);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Staff berhasil ditambahkan!');
        router.push('/admin/staff');
        router.refresh();
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menambahkan staff.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-8 max-w-xl mx-auto">
      <FadeIn>
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/staff">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ChevronLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground font-heading">
              Tambah Staff Baru
            </h1>
            <p className="text-muted-foreground mt-1">
              Buat akun untuk karyawan toko.
            </p>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="full_name">Nama Lengkap *</Label>
              <Input
                id="full_name"
                name="full_name"
                placeholder="Nama staff..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="staff@toko.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="******"
                required
                minLength={6}
              />
            </div>

          </div>

          <div className="flex justify-end gap-3">
            <Link href="/admin/staff">
              <Button type="button" variant="outline" className="rounded-xl">
                Batal
              </Button>
            </Link>
            <Button 
                type="submit" 
                className="rounded-xl shadow-lg shadow-primary/25"
                disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Buat Akun Staff'
              )}
            </Button>
          </div>
        </form>
      </FadeIn>
    </div>
  );
}
