'use client';

import { useState, useTransition } from 'react';
import { registerAction, signInWithGoogleAction } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Mail } from 'lucide-react';
import PasswordField from './password-field';

export default function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setError(null);
    const emailValue = formData.get('email') as string;
    setEmail(emailValue);

    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      toast.error('Password tidak cocok', { id: 'register-password-mismatch' });
      return;
    }

    startTransition(async () => {
      const result = await registerAction(formData);

      if (result?.error) {
        setError(result.error);
        toast.error(result.error, { id: 'register-error' });
      } else if (result?.success) {
        if (result.autoLogin) {
          toast.success('Registrasi berhasil! Mengalihkan...', {
            id: 'register-success',
          });
          setTimeout(() => {
            router.push('/dashboard');
          }, 1000);
        } else {
          setSuccess(true);
          toast.success(result.message, { id: 'register-email-sent' });
        }
      }
    });
  }

  async function handleGoogleSignIn() {
    startTransition(async () => {
      const result = await signInWithGoogleAction();
      if (result?.error) {
        toast.error(result.error, { id: 'google-register-error' });
      }
    });
  }

  if (success) {
    return (
      <div className="w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-4">
            <Mail className="w-12 h-12 text-green-600" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Cek Email Anda!</h3>
          <p className="text-gray-600">
            Kami telah mengirimkan link verifikasi ke:
          </p>
          <p className="font-semibold text-gray-900">{email}</p>
          <p className="text-sm text-gray-600">
            Silakan klik link di email untuk mengaktifkan akun Anda.
          </p>
        </div>
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.location.reload()}
          >
            Daftar dengan Email Lain
          </Button>
          <Link href="/login">
            <Button variant="link" className="w-full">
              Kembali ke Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nama Lengkap</Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="John Doe"
            required
            disabled={isPending}
            minLength={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="nama@email.com"
            required
            disabled={isPending}
          />
        </div>

        <PasswordField
          id="password"
          name="password"
          label="Password"
          required
          disabled={isPending}
          showForgotPassword={false}
        />

        <PasswordField
          id="confirmPassword"
          name="confirmPassword"
          label="Konfirmasi Password"
          required
          disabled={isPending}
          showForgotPassword={false}
        />

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Loading...' : 'Daftar'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">
            Atau lanjutkan dengan
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={isPending}
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Google
      </Button>
    </div>
  );
}
