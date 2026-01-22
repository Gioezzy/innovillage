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

interface StoreSettingsFormProps {
  store: Store;
}

export default function StoreSettingsForm({ store }: StoreSettingsFormProps) {
  const [isPending, startTransition] = useTransition();

  const [logoPreview, setLogoPreview] = useState<string | null>(
    store.image_url ?? null
  );
  const [bannerPreview, setBannerPreview] = useState<string | null>(
    store.banner_url ?? null
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const [name, setName] = useState(store.name);
  const [slug, setSlug] = useState(store.slug);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setSlug(
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    );
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: (url: string | null) => void,
    setFile: (file: File | null) => void,
    maxSizeMB: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar');
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Ukuran gambar maksimal ${maxSizeMB}MB`);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setFile(file);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Gagal upload gambar');
    }

    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        if (logoFile) {
          const infoToast = toast.info('Mengupload logo...', {
            duration: 2000,
          });
          const logoUrl = await uploadImage(logoFile);
          formData.set('image_url', logoUrl);
          toast.dismiss(infoToast);
        }

        if (bannerFile) {
          const infoToast = toast.info('Mengupload banner...', {
            duration: 2000,
          });
          const bannerUrl = await uploadImage(bannerFile);
          formData.set('banner_url', bannerUrl);
          toast.dismiss(infoToast);
        }

        formData.set('slug', slug);

        formData.delete('image_file');
        formData.delete('banner_file');

        const result = await updateStoreAction(store.id, formData);

        if (result?.error) {
          toast.error(result.error);
        } else {
          toast.success('Pengaturan toko berhasil disimpan');
          setLogoFile(null);
          setBannerFile(null);
        }
      } catch (error) {
        console.error(error);
        toast.error('Terjadi kesalahan saat menyimpan pengaturan');
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
            <Label>Nama Toko</Label>
            <Input
              name="name"
              value={name}
              onChange={handleNameChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Slug URL</Label>
            <Input value={slug} disabled />
            {/* PERBAIKAN: Tambahkan hidden input untuk mengirim slug */}
            <input type="hidden" name="slug" value={slug} />
          </div>

          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Textarea
              name="description"
              defaultValue={store.description ?? ''}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Logo Toko</Label>
              <div className="mt-2">
                <label className="block w-32 h-32 rounded-xl overflow-hidden border-2 border-dashed cursor-pointer hover:border-primary/50 transition-colors bg-muted/10 relative group">
                  {logoPreview ? (
                    <>
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          Ubah
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors text-center px-2">
                        Upload Logo
                      </span>
                    </div>
                  )}

                  <input
                    type="file"
                    name="image_file"
                    accept="image/*"
                    className="hidden"
                    onChange={e =>
                      handleImageChange(e, setLogoPreview, setLogoFile, 2)
                    }
                  />
                </label>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Format: JPG, PNG. Maks 2MB.
              </p>
            </div>

            <div>
              <Label>Banner Toko</Label>
              <div className="mt-2">
                <label className="block w-full h-48 rounded-xl overflow-hidden border-2 border-dashed cursor-pointer hover:border-primary/50 transition-colors bg-muted/10 relative group">
                  {bannerPreview ? (
                    <>
                      <img
                        src={bannerPreview}
                        alt="Banner Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          Ubah Banner
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                        Upload Banner
                      </span>
                    </div>
                  )}

                  <input
                    type="file"
                    name="banner_file"
                    accept="image/*"
                    className="hidden"
                    onChange={e =>
                      handleImageChange(e, setBannerPreview, setBannerFile, 5)
                    }
                  />
                </label>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Format: JPG, PNG. Maks 5MB.
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Simpan
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
