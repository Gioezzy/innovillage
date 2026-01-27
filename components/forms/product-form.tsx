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
import { Upload, X, Sparkles, Loader2 } from 'lucide-react';
import { scanSongket } from '@/lib/actions/smart-lens';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Category {
  id: string;
  name: string;
}

interface Motif {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: Category[];
  motifs: Motif[];
  initialData?: {
    name: string;
    description?: string;
    price: number;
    category_id: string;
    motif_id?: string;
    material?: string;
    color?: string;
    size?: string;
    stock_quantity: number;
    weaving_time_days: number;
    is_limited: boolean;
    is_active: boolean;
  };
}

export default function ProductForm({
  categories,
  motifs,
  initialData,
}: ProductFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isDetecting, setIsDetecting] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    category_id: initialData?.category_id || '',
    motif_id: initialData?.motif_id || '',
    material: initialData?.material || '',
    color: initialData?.color || '',
    size: initialData?.size || '',
    stock_quantity: initialData?.stock_quantity || 0,
    weaving_time_days: initialData?.weaving_time_days || 3,
    is_limited: initialData?.is_limited || false,
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
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 10MB');
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

    if (!formData.motif_id && files.length > 0) {
        const fileToScan = files[0];
        detectMotif(fileToScan);
    }
  };

  const detectMotif = async (file: File) => {
      setIsDetecting(true);
      try {
          const aiFormData = new FormData();
          aiFormData.append('file', file);
          const result = await scanSongket(aiFormData);
          
          if (result.success && result.data) {
              const detectedName = result.data.motifName;
              const match = motifs.find(m => 
                  m.name.toLowerCase() === detectedName.toLowerCase() || 
                  m.name.toLowerCase().includes(detectedName.toLowerCase())
              );

              if (match) {
                  setFormData(prev => ({ ...prev, motif_id: match.id }));
                  toast.success(`Motif terdeteksi: ${match.name}`, {
                      icon: <Sparkles className="w-4 h-4 text-purple-500" />
                  });
              }
          }
      } catch (error) {
          console.error("AI Detection failed", error);
      } finally {
          setIsDetecting(false);
      }
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
      <Card>
        <CardHeader>
          <CardTitle>Informasi Produk</CardTitle>
          <CardDescription>
            Isi detail dasar produk anda termasuk nama, harga, dan kategori.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            <div className="space-y-2 w-full">
              <Label htmlFor="name">
                Nama Produk <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Contoh: Salempang Barendo"
                required
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

          <div className="space-y-2 w-full">
            <div className="flex items-center justify-between">
                <Label htmlFor="motif">Motif</Label>
                {isDetecting && (
                    <span className="text-xs text-purple-600 flex items-center gap-1 animate-pulse font-medium">
                        <Sparkles className="w-3 h-3" />
                        Mendeteksi motif...
                    </span>
                )}
            </div>
            <Select
              value={formData.motif_id}
              onValueChange={value =>
                setFormData({ ...formData, motif_id: value })
              }
              disabled={isPending}
            >
              <SelectTrigger className="rounded-xl w-full h-11 px-4">
                <SelectValue placeholder="Pilih motif (Opsional)" />
              </SelectTrigger>
              <SelectContent className="z-50 mt-1 shadow-xl border border-gray-200 rounded-xl">
                {motifs.map(motif => (
                  <SelectItem
                    key={motif.id}
                    value={motif.id}
                    className="cursor-pointer text-sm py-2 hover:bg-gray-100 focus:bg-gray-100"
                  >
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
                value={formData.price === 0 ? '' : formData.price}
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
                value={formData.stock_quantity === 0 ? '' : formData.stock_quantity}
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
              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
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
            Upload minimal 1 gambar produk (Maksimal 5). Gambar pertama akan
            menjadi cover.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {imagePreviews.map((preview, index) => (
              <div
                key={index}
                className="relative aspect-square border border-border rounded-xl overflow-hidden group"
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
                  <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-[10px] px-2 py-1 rounded">
                    Utama
                  </span>
                )}
              </div>
            ))}

            {images.length < 5 && (
              <label className="aspect-square border-2 border-dashed border-muted-foreground/25 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition">
                <Upload className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
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
        </CardContent>
      </Card>

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
        <Button
          type="submit"
          disabled={isPending}
          className="rounded-xl px-6 shadow-lg shadow-primary/25"
        >
          {isPending ? 'Menyimpan...' : 'Simpan Produk'}
        </Button>
      </div>
    </form>
  );
}
