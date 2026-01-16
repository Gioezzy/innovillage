'use client';

import { useState, useTransition } from 'react';
import { updateStoreAction } from '@/lib/actions/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Store } from '@/lib/types';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Save } from 'lucide-react';
import Image from 'next/image';

interface StoreSettingsFormProps {
  store: Store;
}

export default function StoreSettingsForm({ store }: StoreSettingsFormProps) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await updateStoreAction(store.id, formData);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Pengaturan toko berhasil disimpan');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Profil Toko</CardTitle>
          <CardDescription>
            Ubah informasi toko anda yang akan tampil di halaman publik.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Toko</Label>
            <Input
              id="name"
              name="name"
              defaultValue={store.name}
              placeholder="Contoh: Songket Minang"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={store.description || ''}
              placeholder="Ceritakan tentang toko anda..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="image_url">Logo URL (Sementara)</Label>
              <Input
                id="image_url"
                name="image_url"
                defaultValue={store.image_url || ''}
                placeholder="https://..."
              />
              <p className="text-xs text-muted-foreground">
                Gunakan URL gambar valid. (Fitur upload gambar akan segera
                hadir)
              </p>
              {store.image_url && (
                <div className="mt-2 relative w-20 h-20 rounded-lg overflow-hidden border">
                  <Image
                    src={store.image_url}
                    alt="Logo"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner_url">Banner URL (Sementara)</Label>
              <Input
                id="banner_url"
                name="banner_url"
                defaultValue={store.banner_url || ''}
                placeholder="https://..."
              />
              <p className="text-xs text-muted-foreground">
                Gunakan URL gambar valid untuk banner toko.
              </p>
              {store.banner_url && (
                <div className="mt-2 relative w-full h-20 rounded-lg overflow-hidden border">
                  <Image
                    src={store.banner_url}
                    alt="Banner"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Simpan Perubahan
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
