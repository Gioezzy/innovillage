'use client';

import { useState, useTransition } from 'react';
import { updatePasswordAction } from '@/lib/actions/profile';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

export default function ChangePasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
      toast.error('Password konfirmasi tidak cocok', {
        id: 'password-mismatch',
      });
      return;
    }

    startTransition(async () => {
      const result = await updatePasswordAction(formData);

      if (result.error) {
        toast.error(result.error, { id: 'password-change-error' });
      } else {
        toast.success('Password berhasil diubah', { id: 'password-change' });
        form.reset();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Password Lama *</Label>
        <div className="relative">
          <Input
            id="currentPassword"
            name="currentPassword"
            type={showPassword.current ? 'text' : 'password'}
            placeholder="••••••••"
            required
            disabled={isPending}
            minLength={6}
          />
          <button
            type="button"
            onClick={() =>
              setShowPassword({
                ...showPassword,
                current: !showPassword.current,
              })
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword.current ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">Password Baru *</Label>
        <div className="relative">
          <Input
            id="newPassword"
            name="newPassword"
            type={showPassword.new ? 'text' : 'password'}
            placeholder="••••••••"
            required
            disabled={isPending}
            minLength={6}
          />
          <button
            type="button"
            onClick={() =>
              setShowPassword({ ...showPassword, new: !showPassword.new })
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword.new ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500">Minimal 6 karakter</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Konfirmasi Password Baru *</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword.confirm ? 'text' : 'password'}
            placeholder="••••••••"
            required
            disabled={isPending}
            minLength={6}
          />
          <button
            type="button"
            onClick={() =>
              setShowPassword({
                ...showPassword,
                confirm: !showPassword.confirm,
              })
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword.confirm ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Mengubah...' : 'Ubah Password'}
      </Button>
    </form>
  );
}
