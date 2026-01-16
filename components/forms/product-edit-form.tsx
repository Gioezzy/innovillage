/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useTransition } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  sku?: string;
  description?: string;
  price: number;
  category_id: string;
  lead_time_days: number;
  is_active: boolean;
  image_urls?: string[];
}

interface ProductEditFormProps {
  product: Product;
  categories: Category[];
}

export default function ProductEditForm({
  product,
  categories,
}: ProductEditFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: product.name,
    sku: product.sku || '',
    description: product.description || '',
    price: product.price,
    category_id: product.category_id,
    lead_time_days: product.lead_time_days,
    is_active: product.is_active,
  });

  const [existingImages, setExistingImages] = useState<string[]>(
    product.image_urls || []
  );
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length + existingImages.length + newImages.length > 5) {
      toast.error('Maksimal 5 gambar');
      return;
    }

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('File harus berupa gambar');
        return;
      }
    }

    setNewImages([...newImages, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index));
    setNewImagePreviews(newImagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category_id || !formData.price) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    const totalImages = existingImages.length + newImages.length;
    if (totalImages === 0) {
      toast.error('Mohon upload minimal 1 gambar produk');
      return;
    }

    startTransition(async () => {
      try {
        const uploadedImages = [];
        for (const image of newImages) {
          const formData = new FormData();
          formData.append('file', image);

          const response = await fetch('/api/upload-image', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Gagal upload gambar');
          }

          const data = await response.json();
          uploadedImages.push(data.url);
        }

        const allImages = [...existingImages, ...uploadedImages];

        const slug = formData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        const response = await fetch(`/api/admin/products/${product.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            slug,
            image_urls: allImages,
          }),
        });

        if (!response.ok) {
          throw new Error('Gagal mengupdate produk');
        }

        toast.success('Produk berhasil diupdate!');
        router.push('/admin/product');
        router.refresh();
      } catch (error) {
        console.error('Error updating product:', error);
        toast.error('Gagal mengupdate produk');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Informasi Produk
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Produk *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Bordir Nama 3 Titik"
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku">SKU (Opsional)</Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={e => setFormData({ ...formData, sku: e.target.value })}
              placeholder="Contoh: BRD-001"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori *</Label>
            <Select
              value={formData.category_id}
              onValueChange={value =>
                setFormData({ ...formData, category_id: value })
              }
              disabled={isPending}
            >
              <SelectTrigger className="w-full h-12 rounded-xl">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Deskripsi produk..."
              rows={5}
              disabled={isPending}
              className="rounded-xl"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Harga & Lead Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Harga *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={e =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                placeholder="0"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lead_time">Lead Time (Hari) *</Label>
              <Input
                id="lead_time"
                type="number"
                value={formData.lead_time_days}
                onChange={e =>
                  setFormData({
                    ...formData,
                    lead_time_days: Number(e.target.value),
                  })
                }
                min="1"
                required
                disabled={isPending}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={e =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
              className="w-4 h-4"
              disabled={isPending}
            />
            <Label htmlFor="is_active" className="cursor-pointer">
              Aktifkan produk (tampilkan di website)
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Gambar Produk</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Upload Gambar (maks 5)</Label>

          <div className="grid grid-cols-5 gap-4 mt-2">
            {existingImages.map((image, index) => (
              <div
                key={`exist-${index}`}
                className="relative aspect-square border rounded-lg overflow-hidden"
              >
                <Image src={image} alt="" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {newImagePreviews.map((preview, index) => (
              <div
                key={`new-${index}`}
                className="relative aspect-square border rounded-lg overflow-hidden"
              >
                <Image src={preview} alt="" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {existingImages.length + newImages.length < 5 && (
              <label className="aspect-square border border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                <Upload className="w-8 h-8 opacity-60 mb-1" />
                <span className="text-xs text-gray-500">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Batal
        </Button>
      </div>
    </form>
  );
}
