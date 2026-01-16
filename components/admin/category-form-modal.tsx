/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
}

interface CategoryFormModalProps {
  children: React.ReactNode;
  mode: 'create' | 'edit';
  category?: Category;
}

export default function CategoryFormModal({
  children,
  mode,
  category,
}: CategoryFormModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    display_order: category?.display_order || 0,
    is_active: category?.is_active !== false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeOldImage, setRemoveOldImage] = useState(false);

  const [imagePreview, setImagePreview] = useState<string | null>(
    category?.image_url || null
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024)
      return toast.error('Ukuran file maksimal 5MB');

    if (!file.type.startsWith('image/'))
      return toast.error('File harus berupa gambar');

    setImageFile(file);
    setRemoveOldImage(false);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.slug)
      return toast.error('Nama dan slug wajib diisi');

    startTransition(async () => {
      try {
        let finalImageUrl = category?.image_url;

        if (imageFile) {
          const fd = new FormData();
          fd.append('file', imageFile);

          const uploadRes = await fetch('/api/upload-image', {
            method: 'POST',
            body: fd,
          });

          if (!uploadRes.ok) throw new Error('Upload gagal');

          const json = await uploadRes.json();
          finalImageUrl = json.url;
        }

        const endpoint =
          mode === 'create'
            ? '/api/admin/categories'
            : `/api/admin/categories/${category?.id}`;

        const method = mode === 'create' ? 'POST' : 'PUT';

        const res = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            image_url: removeOldImage ? null : finalImageUrl,
            removeOldImage,
          }),
        });

        if (!res.ok) throw new Error('Gagal menyimpan kategori');

        toast.success(
          mode === 'create'
            ? 'Kategori berhasil ditambahkan!'
            : 'Kategori berhasil diperbarui!'
        );

        setIsOpen(false);
        router.refresh();

        if (mode === 'create') {
          setFormData({
            name: '',
            slug: '',
            description: '',
            display_order: 0,
            is_active: true,
          });
          setImageFile(null);
          setImagePreview(null);
        }
      } catch {
        toast.error('Gagal menyimpan kategori');
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent className="max-w-3xl rounded-xl border shadow-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold">
            {mode === 'create' ? 'Tambah Kategori' : 'Edit Kategori'}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nama Kategori *</Label>
                <Input
                  value={formData.name}
                  onChange={e => handleNameChange(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Slug *</Label>
                <Input
                  value={formData.slug}
                  onChange={e =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Urutan Tampilan</Label>
                <Input
                  type="number"
                  value={formData.display_order}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      display_order: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={e =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                />
                <Label className="cursor-pointer">Tampilkan kategori</Label>
              </div>
            </div>

            <div>
              <Label>Gambar Kategori</Label>

              {imagePreview && !removeOldImage ? (
                <div className="mt-2 relative w-full h-56 border rounded-lg overflow-hidden shadow">
                  <Image
                    src={imagePreview}
                    fill
                    alt="Preview"
                    className="object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setRemoveOldImage(true);
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full shadow hover:bg-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="mt-2 flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100">
                  <Upload className="w-10 h-10 text-gray-400" />
                  <span className="text-sm text-gray-600">Upload Gambar</span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Textarea
              rows={4}
              value={formData.description}
              onChange={e =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Batal
            </Button>

            <Button type="submit">
              {mode === 'create' ? 'Tambah' : 'Update'}
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
