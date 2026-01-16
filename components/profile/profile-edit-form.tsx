'use client';

import { useState, useTransition } from 'react';
import { UpdateProfileInput } from '@/lib/actions/profile';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

interface ProfileEditFormProps {
  profile: {
    full_name: string | null;
    phone: string | null;
    address: string | null;
  };
}

export default function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    fullName: profile.full_name || '',
    phone: profile.phone || '',
    address: profile.address || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error('Nama lengkap wajib diisi', { id: 'profile-validation' });
      return;
    }

    if (!formData.phone.trim()) {
      toast.error('Nomor telepon wajib diisi', {
        id: 'profile-phone-validation',
      });
      return;
    }

    startTransition(async () => {
      const result = await UpdateProfileInput(formData);

      if (result.error) {
        toast.error(result.error, { id: 'profile-update-error' });
      } else {
        toast.success('Profil berhasil diupdate', { id: 'profile-update' });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Nama Lengkap *</Label>
        <Input
          id="fullName"
          type="text"
          value={formData.fullName}
          onChange={e => setFormData({ ...formData, fullName: e.target.value })}
          placeholder="John Doe"
          required
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Nomor Telepon *</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={e => setFormData({ ...formData, phone: e.target.value })}
          placeholder="08123456789"
          required
          disabled={isPending}
        />
        <p className="text-xs text-gray-500">
          Format: 08123456789 atau +628123456789
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Alamat</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={e => setFormData({ ...formData, address: e.target.value })}
          placeholder="Masukkan alamat lengkap Anda"
          rows={4}
          disabled={isPending}
        />
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
      </Button>
    </form>
  );
}
