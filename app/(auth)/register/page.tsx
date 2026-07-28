import RegisterForm from '@/components/forms/register-form';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Sparkles, HeartHandshake, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-background">
      {/* HERO / LEFT PANEL WITH HIGH CONTRAST */}
      <div className="hidden lg:flex lg:col-span-5 flex-col justify-between bg-slate-950 text-white p-12 relative overflow-hidden">
        {/* Pattern overlay */}
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-15 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900/60" />

        {/* Brand Header with Large Direct PNG Logo (No White Canvas Box) */}
        <div className="relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-3 transition-transform duration-300 hover:scale-105"
          >
            <Image
              src="/logo.png"
              alt="Songket.id Logo"
              width={320}
              height={100}
              className="h-20 md:h-24 lg:h-28 w-auto object-contain drop-shadow-2xl brightness-110"
              priority
            />
            <span className="font-heading text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
              Songket.id
            </span>
          </Link>
        </div>

        {/* Hero Content & High Contrast Text */}
        <div className="relative z-10 space-y-8 my-auto max-w-md">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Bergabung Bersama Komunitas
            </span>
            <h1 className="font-heading text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight text-white drop-shadow-md">
              Dukung Warisan Budaya & Pengrajin Lokal
            </h1>
            <p className="text-slate-200 text-base leading-relaxed font-normal drop-shadow">
              Daftarkan akun baru Anda untuk berbelanja produk tenun berkualitas tinggi atau mendaftarkan toko pengrajin Anda.
            </p>
          </div>

          {/* Trust Highlights */}
          <div className="space-y-3.5 pt-4 border-t border-white/15">
            <div className="flex items-center gap-3 text-sm text-slate-100 font-medium">
              <div className="p-1.5 rounded-full bg-primary/20 text-primary-foreground border border-primary/30 shrink-0">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <span>Memberdayakan Komunitas Pengrajin Silungkang</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-100 font-medium">
              <div className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span>Pendaftaran Gratis & Terverifikasi Aman</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-slate-400 font-medium">
          © {new Date().getFullYear()} Songket.id · Innovillage Project
        </div>
      </div>

      {/* RIGHT PANEL - AUTH FORM (NO LOGO ON RIGHT) */}
      <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-background relative overflow-y-auto">
        {/* Top Navigation Header with Single Back to Web Button */}
        <div className="flex items-center justify-between w-full max-w-md mx-auto mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors group px-3.5 py-2 rounded-full hover:bg-muted border border-transparent hover:border-border"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Web</span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md mx-auto my-auto space-y-8 animate-in fade-in slide-in-from-left-8 duration-500">
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Buat Akun Baru
            </h2>
            <p className="text-muted-foreground text-sm">
              Lengkapi data diri Anda untuk memulai pengalaman berbelanja.
            </p>
          </div>

          <Card className="border border-border/60 shadow-2xl shadow-black/5 bg-card p-6 sm:p-8 rounded-2xl">
            <CardContent className="p-0">
              <RegisterForm />
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            Sudah punya akun?{' '}
            <Link
              href="/login"
              className="font-bold text-primary hover:underline underline-offset-4"
            >
              Masuk Disini
            </Link>
          </p>
        </div>

        {/* Empty space for flex balance */}
        <div className="h-6" />
      </div>
    </div>
  );
}
