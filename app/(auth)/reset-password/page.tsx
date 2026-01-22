'use client';

import { useState, useTransition } from 'react';
import { resetPasswordAction } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { toast } from 'sonner';
import PasswordField from '@/components/forms/password-field';

export default function ResetPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);

    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      toast.error('Password tidak cocok');
      return;
    }

    startTransition(async () => {
      const result = await resetPasswordAction(formData);

      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center items-center bg-primary text-primary-foreground p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

        <div className="relative z-10 text-center space-y-6 max-w-lg">
          <h1 className="font-heading text-5xl font-bold">
            Buat Password Baru
          </h1>
          <p className="text-xl text-primary-foreground/80 leading-relaxed">
            Pastikan password baru Anda kuat dan mudah diingat.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-background p-8 sm:p-12 lg:p-24">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
          <div className="text-center lg:text-left">
            <Link
              href="/"
              className="lg:hidden font-heading text-3xl font-bold text-primary mb-8 inline-block"
            >
              Songket.id
            </Link>
            <h2 className="font-heading text-3xl font-bold text-foreground">
              Reset Password
            </h2>
            <p className="text-muted-foreground mt-2">
              Masukkan password baru untuk akun Anda.
            </p>
          </div>

          <Card className="border-none shadow-none bg-transparent p-0">
            <CardContent className="p-0">
              <form action={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <PasswordField
                    id="password"
                    name="password"
                    label="Password Baru"
                    required
                    disabled={isPending}
                    showForgotPassword={false}
                  />
                </div>

                <div className="space-y-2">
                  <PasswordField
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Konfirmasi Password"
                    required
                    disabled={isPending}
                    showForgotPassword={false}
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
                  {isPending ? 'Menyimpan...' : 'Simpan Password Baru'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            Ingat password Anda?{' '}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline underline-offset-4"
            >
              Login di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
