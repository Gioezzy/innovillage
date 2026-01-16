import ForgotPasswordForm from '@/components/forms/forgot-password-form';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center items-center bg-primary text-primary-foreground p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

        <div className="relative z-10 text-center space-y-6 max-w-lg">
          <h1 className="font-heading text-5xl font-bold">Lupa Password?</h1>
          <p className="text-xl text-primary-foreground/80 leading-relaxed">
            Jangan khawatir, kami akan membantu memulihkan akses akun Anda
            dengan cepat dan aman.
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
              Nilam Bordir
            </Link>
          </div>

          <Card className="border-none shadow-none bg-transparent p-0">
            <CardContent className="p-0">
              <ForgotPasswordForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
