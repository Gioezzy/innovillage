'use client';

import Link from 'next/link';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background pt-16 pb-20 md:pt-24 md:pb-32">
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] bg-primary/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 -z-10 h-[300px] w-[300px] bg-secondary/20 blur-[80px] rounded-full -translate-x-1/2 translate-y-1/2" />

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-sm font-medium text-primary"
          >
            <Star className="mr-2 h-3.5 w-3.5 fill-primary text-primary" />
            Warisan Budaya & Teknologi Modern
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-heading text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl text-foreground"
          >
            Tenun Songket <span className="text-primary italic">Silungkang</span>{' '}
            Dalam Genggaman
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">
              Digital & Autentik
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 pb-4"
          >
            Jelajahi keindahan motif Songket Silungkang dengan cerita filosofinya.
            Didukung teknologi AI untuk mengenali motif asli dan menghubungkan Anda langsung dengan pengrajin.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Button
              size="lg"
              className="rounded-full text-lg px-8 h-12 shadow-lg hover:shadow-primary/25 bg-primary text-primary-foreground hover:bg-primary/90"
              asChild
            >
              <Link href="/shop">
                Lihat Koleksi <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full text-lg px-8 h-12 border-2 gap-2"
              asChild
            >
              <Link href="/smart-lens">
                <Sparkles className="w-4 h-4" />
                Coba AI Lens
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
