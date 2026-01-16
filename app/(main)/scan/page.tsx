import { Button } from "@/components/ui/button";
import FadeIn from "@/components/animations/fade-in";
import { Camera, Upload } from "lucide-react";
import Link from 'next/link';

export default function SmartLensPage() {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-20 min-h-[80vh] flex flex-col justify-center items-center text-center">
      <FadeIn>
        <div className="bg-primary/10 p-6 rounded-full inline-block mb-8">
          <Camera className="w-16 h-16 text-primary" />
        </div>
        <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6">
          Smart <span className="text-primary">Songket</span> Lens
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Identifikasi motif Songket Silungkang secara instan menggunakan kecerdasan buatan (AI).
          Temukan nama motif, filosofi sejarah, dan keasliannya hanya dengan satu kali jepretan.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Button size="lg" className="rounded-full text-lg h-14 px-8 gap-2">
            <Camera className="w-5 h-5" />
            Ambil Foto (Kamera)
          </Button>
          <Button size="lg" variant="outline" className="rounded-full text-lg h-14 px-8 gap-2">
            <Upload className="w-5 h-5" />
            Upload dari Galeri
          </Button>
        </div>
        
        <div className="mt-12 p-6 border border-border rounded-xl bg-card max-w-3xl mx-auto">
          <p className="text-sm text-muted-foreground">
            *Fitur ini masih dalam tahap <span className="font-bold text-primary">Beta Development</span>.
            AI sedang dilatih untuk mengenali motif: <strong>Pucuk Rabuang</strong>, <strong>Itiak Pulang Patang</strong>, dan <strong>Sajamba Makan</strong>.
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
