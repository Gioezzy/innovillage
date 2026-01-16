'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5" />

      <div className="text-center max-w-2xl bg-card rounded-2xl shadow-2xl border border-destructive/20 p-12 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-destructive/10 rounded-full mb-4 ring-8 ring-destructive/5">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-foreground font-heading mb-4">
          Oops! Terjadi Kesalahan
        </h1>

        <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
          Maaf, sistem mengalami kendala yang tidak terduga. Tim teknis kami
          telah dinotifikasi.
        </p>

        {error.message && (
          <div className="mb-8 p-4 bg-destructive/5 border border-destructive/10 rounded-xl text-left">
            <p className="text-sm text-destructive font-mono break-all">
              Error: {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground mt-2 font-mono">
                ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={reset}
            size="lg"
            className="w-full sm:w-auto rounded-full shadow-lg"
          >
            <RefreshCcw className="w-5 h-5 mr-2" />
            Coba Lagi
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto rounded-full"
            asChild
          >
            <Link href="/">
              <Home className="w-5 h-5 mr-2" />
              Kembali ke Beranda
            </Link>
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            Jika masalah berlanjut, silakan{' '}
            <Link
              href="/about"
              className="text-primary hover:underline font-medium"
            >
              hubungi kami
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
