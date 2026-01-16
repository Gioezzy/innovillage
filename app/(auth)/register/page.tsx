import RegisterForm from '@/components/forms/register-form';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center items-center bg-secondary text-secondary-foreground p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative z-10 text-center space-y-6 max-w-lg">
          <h1 className="font-heading text-5xl font-bold">Gabung Sekarang</h1>
          <p className="text-xl text-secondary-foreground/80 leading-relaxed">
            Dukung pengrajin lokal dan lestarikan warisan budaya Songket Silungkang dengan setiap pesanan.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-background p-8 sm:p-12 lg:p-24">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-left-8 duration-500">
          <div className="text-center lg:text-left">
            <Link
              href="/"
              className="lg:hidden font-heading text-3xl font-bold text-primary mb-8 inline-block"
            >
              Songket.id
            </Link>
            <h2 className="font-heading text-3xl font-bold text-foreground">
              Buat Akun Baru
            </h2>
            <p className="text-muted-foreground mt-2">
              Lengkapi data diri untuk mendaftar akun baru.
            </p>
          </div>

          <Card className="border-none shadow-none bg-transparent p-0">
            <CardContent className="p-0">
              <RegisterForm />
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            Sudah punya akun?{' '}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline underline-offset-4"
            >
              Masuk Disini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
