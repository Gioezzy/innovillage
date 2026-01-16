'use client';

import { ArrowLeftIcon, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <section className="flex items-center justify-center min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="w-full px-4 mx-auto max-w-2xl text-center relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl p-12">
          <div className="mb-8 relative">
            <div className="w-32 h-32 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-6xl font-bold font-heading text-secondary">
                404
              </span>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-foreground font-heading mb-4">
            Halaman Tidak Ditemukan
          </h1>

          <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
            Maaf, halaman yang Anda cari mungkin telah dipindahkan atau tidak
            tersedia saat ini.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="rounded-full shadow-lg hover:shadow-primary/25"
              asChild
            >
              <Link href="/">
                <Home className="w-5 h-5 mr-2" />
                Kembali ke Beranda
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.history.back()}
              className="rounded-full"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Kembali
            </Button>
          </div>

          <div className="mt-12 pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Butuh bantuan?{' '}
              <Link
                href="/about"
                className="text-primary hover:underline font-medium"
              >
                Hubungi kami
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
