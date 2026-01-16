'use client';

import { motion } from 'framer-motion';
import { Palette, Combine } from 'lucide-react';
import {
  PaintBucket,
  GalleryVerticalEnd,
  Settings2,
  ScrollText,
  Scissors,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductionTimelineProps {
  leadTimeDays?: number | null;
  className?: string;
}

const steps = [
  {
    icon: PaintBucket,
    title: 'Pewarnaan (Dyeing)',
    description:
      'Benang sutra/katun dicelup warna alami/sintetis sesuai desain.',
    durationPercentage: 15,
  },
  {
    icon: GalleryVerticalEnd,
    title: 'Menghani (Warping)',
    description:
      'Menyusun helai benang lungsi memanjang untuk dipasang di alat tenun.',
    durationPercentage: 20,
  },
  {
    icon: Settings2,
    title: 'Pencucukan & Penyetelan',
    description:
      'Memasukkan benang ke mata gun dan sisir, menyetel motif di alat tenun.',
    durationPercentage: 25,
  },
  {
    icon: ScrollText,
    title: 'Penenunan (Weaving)',
    description:
      'Proses inti memasukkan benang pakan (emas/perak) membentuk motif.',
    durationPercentage: 35,
  },
  {
    icon: Scissors,
    title: 'Finishing & Quality Control',
    description:
      'Pembersihan sisa benang, pengecekan kerapian, dan pengemasan.',
    durationPercentage: 5,
  },
];

export default function ProductionTimeline({
  leadTimeDays = 7,
  className,
}: ProductionTimelineProps) {
  const totalDays = leadTimeDays || 7;

  return (
    <div className={cn('w-full py-6', className)}>
      <h3 className="font-heading text-xl font-bold mb-6 flex items-center gap-2">
        <ScrollText className="w-5 h-5 text-primary" />
        Proses & Estimasi Pengerjaan
      </h3>

      <div className="relative border-l-2 border-muted md:border-l-0 md:border-t-2 md:grid md:grid-cols-5 md:gap-4 md:pt-8 ml-4 md:ml-0">
        {steps.map((step, index) => {
          const stepDays = Math.max(
            1,
            Math.round((step.durationPercentage / 100) * totalDays)
          );

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8 pb-8 md:pl-0 md:pb-0 md:text-center group"
            >
              {/* Dot visualizer */}
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-primary md:left-1/2 md:-top-[39px] md:-translate-x-1/2 z-10 group-hover:scale-125 transition-transform" />

              {/* Icon */}
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center mb-3 md:mx-auto text-primary">
                <step.icon className="w-5 h-5" />
              </div>

              {/* Text Content */}
              <h4 className="font-bold text-sm text-foreground">
                {step.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1 leading-snug">
                {step.description}
              </p>

              {/* Duration pill */}
              <span className="inline-block mt-2 px-2 py-0.5 bg-muted rounded text-[10px] font-medium text-muted-foreground">
                ~{stepDays} Hari
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3 text-amber-800 text-sm">
        <div className="shrink-0 pt-0.5">⚠️</div>
        <p>
          <span className="font-bold">Estimasi Total: {totalDays} Hari.</span>{' '}
          Waktu dapat bervariasi tergantung kerumitan motif dan cuaca (untuk
          proses pewarnaan/pengeringan).
        </p>
      </div>
    </div>
  );
}
