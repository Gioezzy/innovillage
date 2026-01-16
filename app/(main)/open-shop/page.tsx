'use client';

import { useState, useTransition } from 'react';
import { createStoreAction } from '@/lib/actions/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Store, ShoppingBag } from 'lucide-react';
import FadeIn from '@/components/animations/fade-in';

export default function OpenShopPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createStoreAction(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Toko berhasil dibuat!');
        router.push('/admin');
      }
    });
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 pointer-events-none" />
        
        <FadeIn className="w-full max-w-lg z-10">
            <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
                <div className="text-center mb-8 space-y-2">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Store className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="font-heading text-3xl font-bold">Buka Toko Songket</h1>
                    <p className="text-muted-foreground">Bergabunglah sebagai pengrajin dan pasarkan karya Anda ke seluruh dunia.</p>
                </div>

                <form action={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama Toko / Brand</Label>
                        <Input 
                            id="name" 
                            name="name" 
                            placeholder="Contoh: Songket Pandai Sikek" 
                            required 
                            className="h-12"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Deskripsi Singkat</Label>
                        <Textarea 
                            id="description" 
                            name="description" 
                            placeholder="Ceritakan sedikit tentang keunikan tenun Anda..." 
                            rows={4}
                        />
                    </div>

                    <Button type="submit" className="w-full h-12 text-lg" disabled={isPending}>
                        {isPending ? 'Memproses...' : 'Buka Toko Sekarang'}
                    </Button>
                </form>
            </div>
        </FadeIn>
    </div>
  );
}
