import HeroSection from '@/components/home/hero-section';
import CategoryShowcase from '@/components/home/category-showcase';
import HowItWorks from '@/components/home/how-it-works';
import { getFeaturedProducts } from '@/lib/actions/product';
import ProductGrid from '@/components/product/product-grid';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import FadeIn from '@/components/animations/fade-in';

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts(4);

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      <FadeIn delay={0.2}>
        <CategoryShowcase />
      </FadeIn>

      {featuredProducts.length > 0 && (
        <FadeIn delay={0.3} className="max-w-7xl mx-auto px-4 py-20">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
             <div>
              <span className="text-secondary font-medium tracking-wider text-sm uppercase block mb-2">Katalog Terbaru</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Produk Unggulan</h2>
            </div>
            <Button variant="outline" className="rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary" asChild>
              <Link href="/shop" className="group">
                Lihat Semua <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </Button>
          </div>
          <ProductGrid products={featuredProducts} imageQuality={60} />
        </FadeIn>
      )}

      <FadeIn delay={0.4}>
        <HowItWorks />
      </FadeIn>

      <FadeIn delay={0.2} className="max-w-7xl mx-auto px-4 py-20">
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-primary">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-[position:0_0,0_0] animate-[shimmer_3s_infinite_linear]" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10 p-12 md:p-20 text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-primary-foreground">
              Kenali Motif Songket Anda
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
              Gunakan teknologi AI kami untuk mengidentifikasi motif, mengetahui sejarahnya,
              dan memastikan keaslian Songket Silungkang yang Anda miliki.
            </p>
            <Button size="lg" variant="secondary" className="rounded-full text-lg px-8 h-14 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300" asChild>
              <Link href="/smart-lens">
                Coba Smart Lens Sekarang
              </Link>
            </Button>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
