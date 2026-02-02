/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useTransition } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
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
import { Product } from '@/lib/types';

interface Category {
  id: string;
  name: string;
}

interface Motif {
  id: string;
  name: string;
}

interface ProductEditFormProps {
  product: Product;
  categories: Category[];
  motifs: Motif[];
}

export default function ProductEditForm({
  product,
  categories,
  motifs,
}: ProductEditFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description || '',
    price: product.price,
    category_id: product.category_id || '',
    weaving_time_days: product.weaving_time_days || 1,
    is_active: product.is_active !== false,
    
    motif_id: product.motif_id || '',
    material: product.material || '',
    color: product.color || '',
    size: product.size || '',
    stock_quantity: product.stock_quantity || 0,
    is_limited: product.is_limited || false,

    shopee_url: product.shopee_url || '',
    tokopedia_url: product.tokopedia_url || '',
    padiumkm_url: product.padiumkm_url || '',
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
          <CardTitle>Informasi Produk</CardTitle>
          <CardDescription>
            Update informasi produk anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Produk *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Salempang Barendo"
              required
              disabled={isPending}
              className="rounded-xl"
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
            <Label htmlFor="motif">Motif</Label>
            <Select
              value={formData.motif_id}
              onValueChange={value =>
                setFormData({ ...formData, motif_id: value })
              }
              disabled={isPending}
            >
              <SelectTrigger className="rounded-xl w-full h-12 px-4">
                <SelectValue placeholder="Pilih motif (Opsional)" />
              </SelectTrigger>
              <SelectContent>
                {motifs.map(motif => (
                  <SelectItem key={motif.id} value={motif.id}>
                    {motif.name}
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
              <Label htmlFor="stock">
                Stok <span className="text-red-500">*</span>
              </Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock_quantity}
                onChange={e =>
                  setFormData({
                    ...formData,
                    stock_quantity: Number(e.target.value),
                  })
                }
                min="0"
                required
                disabled={isPending}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="material">Bahan</Label>
              <Input
                id="material"
                value={formData.material}
                onChange={e =>
                  setFormData({ ...formData, material: e.target.value })
                }
                placeholder="Contoh: Katun"
                disabled={isPending}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Warna</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={e =>
                  setFormData({ ...formData, color: e.target.value })
                }
                placeholder="Contoh: Merah Maroon"
                disabled={isPending}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Ukuran</Label>
              <Input
                id="size"
                value={formData.size}
                onChange={e =>
                  setFormData({ ...formData, size: e.target.value })
                }
                placeholder="Contoh: 200cm x 110cm"
                disabled={isPending}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="weaving_time">
              Lama Pengerjaan (Hari) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="weaving_time"
              type="number"
              value={formData.weaving_time_days}
              onChange={e =>
                setFormData({
                  ...formData,
                  weaving_time_days: Number(e.target.value),
                })
              }
              min="1"
              required
              disabled={isPending}
              className="rounded-xl"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
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
            <CardTitle>Gambar Produk</CardTitle>
            <CardDescription>
              Upload minimal 1 gambar produk (Maksimal 5).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {existingImages.map((image, index) => (
                <div
                  key={`exist-${index}`}
                  className="relative aspect-square border rounded-xl overflow-hidden group"
                >
                  <Image src={image} alt="" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-2 py-1 rounded">Existing</span>
                </div>
              ))}

              {newImagePreviews.map((preview, index) => (
                <div
                  key={`new-${index}`}
                  className="relative aspect-square border rounded-xl overflow-hidden group"
                >
                  <Image src={preview} alt="" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                   <span className="absolute bottom-1 left-1 bg-green-500/80 text-white text-[10px] px-2 py-1 rounded">New</span>
                </div>
              ))}

              {existingImages.length + newImages.length < 5 && (
                <label className="aspect-square border-2 border-dashed border-muted-foreground/25 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Upload</span>
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

      <Card>
        <CardHeader>
          <CardTitle>Link Marketplace (Opsional)</CardTitle>
          <CardDescription>
            Tambahkan link produk di marketplace lain untuk memudahkan pembeli.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shopee_url">Link Shopee</Label>
            <Input
              id="shopee_url"
              value={formData.shopee_url}
              onChange={e =>
                setFormData({ ...formData, shopee_url: e.target.value })
              }
              placeholder="https://shopee.co.id/..."
              disabled={isPending}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tokopedia_url">Link Tokopedia</Label>
            <Input
              id="tokopedia_url"
              value={formData.tokopedia_url}
              onChange={e =>
                setFormData({ ...formData, tokopedia_url: e.target.value })
              }
              placeholder="https://www.tokopedia.com/..."
              disabled={isPending}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="padiumkm_url">Link PadiUMKM</Label>
            <Input
              id="padiumkm_url"
              value={formData.padiumkm_url}
              onChange={e =>
                setFormData({ ...formData, padiumkm_url: e.target.value })
              }
              placeholder="https://padiumkm.id/..."
              disabled={isPending}
              className="rounded-xl"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-xl px-6">
          Batal
        </Button>
        <Button type="submit" disabled={isPending} className="rounded-xl px-6 shadow-lg shadow-primary/25">
          {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </div>
    </form>
  );
}
