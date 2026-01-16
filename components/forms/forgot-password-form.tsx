'use client';

import { useState, useTransition } from 'react';
import { forgotPasswordAction } from '@/lib/actions/auth';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import Link from 'next/link';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';

export default function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await forgotPasswordAction(formData);

      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
      } else if (result?.success) {
        setSuccess(true);
        toast.success(result.message);
      }
    });
  }

  if (success) {
    return (
      <div className="w-full text-center space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center ring-8 ring-green-50">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="font-heading text-2xl font-bold text-foreground">
            Email Terkirim!
          </h3>
          <p className="text-muted-foreground">
            Kami telah mengirim link reset password ke email anda. Silahkan cek
            inbox atau folder spam.
          </p>
        </div>
        <Link href="/login" className="block pt-4">
          <Button
            variant="outline"
            className="w-full h-12 rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors"
          >
            Kembali ke Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      <div className="space-y-2 text-center lg:text-left">
        <h2 className="font-heading text-3xl font-bold text-foreground">
          Reset Password
        </h2>
        <p className="text-muted-foreground">
          Masukkan email yang terdaftar untuk menerima link reset.
        </p>
      </div>

      <form action={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="nama@email.com"
            className="h-11 rounded-lg"
            required
            disabled={isPending}
          />
        </div>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-11 rounded-lg shadow-lg hover:shadow-primary/25 transition-all"
          disabled={isPending}
        >
          {isPending ? 'Mengirim...' : 'Kirim Link Reset'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground pt-2">
        Ingat password Anda?{' '}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline underline-offset-4"
        >
          Login di sini
        </Link>
      </p>
    </div>
  );
}
