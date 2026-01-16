'use client';

import { useState, useTransition } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
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

interface ProductFormProps {
  categories: Category[];
  initialData?: {
    name: string;
    sku?: string;
    description?: string;
    price: number;
    category_id: string;
    lead_time_days: number;
    is_active: boolean;
  };
}

export default function ProductForm({
  categories,
  initialData,
}: ProductFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    sku: initialData?.sku || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    category_id: initialData?.category_id || '',
    lead_time_days: initialData?.lead_time_days || 3,
    is_active: initialData?.is_active !== false,
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length + images.length > 5) {
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

    setImages([...images, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category_id || !formData.price) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    if (images.length === 0) {
      toast.error('Mohon upload minimal 1 gambar produk');
      return;
    }

    startTransition(async () => {
      try {
        const uploadedImages = [];
        for (const image of images) {
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

        const slug = formData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        const response = await fetch('/api/admin/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            slug,
            image_urls: uploadedImages,
          }),
        });

        if (!response.ok) {
          throw new Error('Gagal menyimpan produk');
        }
        toast.success('Produk berhasil ditambahkan');
        router.push('/admin/product');
      } catch (error) {
        console.error('Error creating product:', error);
        toast.error('Gagal menambahkan produk');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-6">
        <h2 className="text-xl font-semibold mb-2">Informasi Produk</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">
              Nama Produk <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Bordir Nama 3 Titik"
              required
              disabled={isPending}
              className="rounded-xl"
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
              className="rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="category">
            Kategori <span className="text-red-500">*</span>
          </Label>

          <Select
            value={formData.category_id}
            onValueChange={value =>
              setFormData({ ...formData, category_id: value })
            }
            disabled={isPending}
          >
            <SelectTrigger className="rounded-xl w-full h-11 px-4">
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>

            <SelectContent className="z-50 mt-1 shadow-xl border border-gray-200 rounded-xl">
              {categories.map(category => (
                <SelectItem
                  key={category.id}
                  value={category.id}
                  className="cursor-pointer text-sm py-2 hover:bg-gray-100 focus:bg-gray-100"
                >
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
            rows={4}
            disabled={isPending}
            className="rounded-xl"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="price">
              Harga <span className="text-red-500">*</span>
            </Label>
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
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead_time">
              Lead Time (Hari) <span className="text-red-500">*</span>
            </Label>
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
              className="rounded-xl"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={e =>
              setFormData({ ...formData, is_active: e.target.checked })
            }
            className="w-5 h-5 rounded"
            disabled={isPending}
          />
          <Label htmlFor="is_active" className="cursor-pointer">
            Aktifkan produk (tampilkan di website)
          </Label>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
        <Label className="font-semibold">
          Gambar Produk <span className="text-red-500">*</span> (Maksimal 5)
        </Label>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {imagePreviews.map((preview, index) => (
            <div
              key={index}
              className="relative aspect-square border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden group"
            >
              <Image
                src={preview}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-[10px] px-2 py-1 rounded">
                  Utama
                </span>
              )}
            </div>
          ))}

          {images.length < 5 && (
            <label className="aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-gray-400 transition">
              <Upload className="w-8 h-8 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Upload gambar
              </span>
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

        <p className="text-sm text-gray-500">
          Gambar pertama akan menjadi gambar utama produk
        </p>
      </div>

      <div className="flex gap-3 pt-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
          className="rounded-xl px-6"
        >
          Batal
        </Button>
        <Button type="submit" disabled={isPending} className="rounded-xl px-6">
          {isPending ? 'Menyimpan...' : 'Simpan Produk'}
        </Button>
      </div>
    </form>
  );
}
