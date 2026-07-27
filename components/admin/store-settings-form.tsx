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
  const [isActive, setIsActive] = useState<boolean>(store.is_active ?? true);

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
        formData.set('is_active', String(isActive));

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
          <div className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Label className="text-base font-semibold">Status Operasional Toko</Label>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${
                    isActive
                      ? 'bg-green-500/10 text-green-600 border-green-500/20'
                      : 'bg-red-500/10 text-red-600 border-red-500/20'
                  }`}
                >
                  {isActive ? 'Toko Buka / Aktif' : 'Toko Tutup / Nonaktif'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {isActive
                  ? 'Toko Anda sedang Buka. Produk Anda dapat dilihat dan dibeli oleh pelanggan.'
                  : 'Toko Anda sedang Tutup. Produk Anda akan disembunyikan sementara dari marketplace.'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={isActive}
                onChange={e => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

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
