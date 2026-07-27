import { getAllStores } from '@/lib/actions/store';
import Link from 'next/link';
import Image from 'next/image';
import { Store, CheckCircle2, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import FadeIn from '@/components/animations/fade-in';

export const metadata = {
  title: 'Daftar Toko & Pengrajin - Songket.id',
  description:
    'Jelajahi berbagai toko pengrajin tenun songket lokal di platform Innovillage.',
};

export default async function StoresDirectoryPage() {
  const stores = await getAllStores();

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <Badge variant="secondary" className="px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border-primary/20">
              Pengrajin & UMKM Desa
            </Badge>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              Direktori Toko Songket
            </h1>
            <p className="text-muted-foreground text-lg">
              Jelajahi toko pengrajin lokal dan temukan produk tenun songket autentik berkualitas langsung dari sumbernya.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          {stores && stores.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stores.map((store) => (
                <div
                  key={store.id}
                  className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                >
                  <div className="relative h-40 bg-muted overflow-hidden">
                    {store.banner_url ? (
                      <Image
                        src={store.banner_url}
                        alt={`${store.name} banner`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-primary/80 to-primary/30 flex items-center justify-center">
                        <Store className="w-12 h-12 text-background/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>

                  <div className="p-6 pt-0 relative flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-end justify-between -mt-10 mb-2">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden border-4 border-card shadow-md bg-muted flex-shrink-0">
                          {store.image_url ? (
                            <Image
                              src={store.image_url}
                              alt={store.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                              <Store className="w-8 h-8" />
                            </div>
                          )}
                        </div>

                        {store.is_verified && (
                          <Badge variant="secondary" className="gap-1 bg-blue-500/10 text-blue-600 border-blue-200 text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Verified
                          </Badge>
                        )}
                      </div>

                      <div>
                        <h3 className="font-heading font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                          {store.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          /{store.slug}
                        </p>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {store.description || 'Toko pengrajin tenun songket tradisional.'}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border/50">
                      <Link href={`/stores/${store.slug}`}>
                        <Button className="w-full rounded-xl group-hover:shadow-lg group-hover:shadow-primary/20 transition-all">
                          <span>Kunjungi Toko</span>
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border p-8">
              <Store className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-40" />
              <h3 className="text-xl font-bold text-foreground font-heading">
                Belum Ada Toko Terdaftar
              </h3>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Saat ini belum ada toko pengrajin aktif. Silakan kembali lagi nanti atau daftarkan toko Anda.
              </p>
            </div>
          )}
        </FadeIn>
      </div>
    </div>
  );
}
