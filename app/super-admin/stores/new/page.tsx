'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createStoreByAdminAction } from '@/lib/actions/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ChevronLeft, Loader2, Upload } from 'lucide-react';
import Link from 'next/link';
import FadeIn from '@/components/animations/fade-in';
import Image from 'next/image';

export default function NewStorePage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
      const result = await createStoreByAdminAction(formData);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Toko berhasil dibuat!');
        router.push('/super-admin/stores');
        router.refresh();
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat membuat toko.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <FadeIn>
        <div className="flex items-center gap-4 mb-6">
          <Link href="/super-admin/stores">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ChevronLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground font-heading">
              Buat Toko Baru
            </h1>
            <p className="text-muted-foreground mt-1">
              Tambahkan toko baru dan tetapkan pemiliknya.
            </p>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm space-y-6">
            
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Logo Toko</Label>
              <div className="flex items-start gap-6">
                <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-border/50 flex items-center justify-center relative overflow-hidden bg-muted/20">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Upload className="w-8 h-8 text-muted-foreground/50" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <div className="flex-1 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Upload Logo</p>
                  <p>Format: JPG, PNG, WEBP.</p>
                  <p>Maksimal 2MB.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Toko *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Contoh: Tenun Unggan"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug URL *</Label>
                <Input
                  id="slug"
                  name="slug"
                  placeholder="contoh-tenun-unggan"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Deskripsi singkat tentang toko..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="owner_email">Email Pemilik *</Label>
              <Input
                id="owner_email"
                name="owner_email"
                type="email"
                placeholder="email@pemilik.com"
                required
              />
              <p className="text-xs text-muted-foreground">
                Email user yang akan dijadikan Admin Toko. User harus sudah terdaftar.
              </p>
            </div>

          </div>

          <div className="flex justify-end gap-3">
            <Link href="/super-admin/stores">
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
                'Buat Toko'
              )}
            </Button>
          </div>
        </form>
      </FadeIn>
    </div>
  );
}
