import LoginForm from '@/components/forms/login-form';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    registered?: string;
    reset?: string;
    error?: string;
  }>;
}) {
  const params = await searchParams;
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center items-center bg-primary text-primary-foreground p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

        <div className="relative z-10 text-center space-y-6 max-w-lg">
          <h1 className="font-heading text-5xl font-bold">Songket.id</h1>
          <p className="text-xl text-primary-foreground/80 leading-relaxed">
            Marketplace digital pertama yang menghubungkan Anda langsung dengan
            pengrajin Songket Silungkang.
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
              Selamat Datang
            </h2>
            <p className="text-muted-foreground mt-2">
              Masuk ke akun Anda untuk melanjutkan pesanan.
            </p>
          </div>

          <Card className="border-none shadow-none bg-transparent p-0">
            <CardContent className="p-0">
              {params.registered && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-800 dark:text-green-300">
                    Registrasi berhasil! Silahkan login dengan akun Anda.
                  </p>
                </div>
              )}

              {params.reset && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-800 dark:text-green-300">
                    Password berhasil direset! Silahkan login dengan password
                    baru.
                  </p>
                </div>
              )}

              {params.error && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">
                    Terjadi kesalahan. Silahkan coba lagi.
                  </p>
                </div>
              )}

              <LoginForm />
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            Belum punya akun?{' '}
            <Link
              href="/register"
              className="font-semibold text-primary hover:underline underline-offset-4"
            >
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
