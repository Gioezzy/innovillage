import { getStoreBySlug } from '@/lib/actions/store';
import { getProducts } from '@/lib/actions/product';
import ProductGrid from '@/components/product/product-grid';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Store, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import FadeIn from '@/components/animations/fade-in';

interface StorePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: StorePageProps) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) return { title: 'Toko Tidak Ditemukan' };
  
  return {
    title: `${store.name} - Songket.id`,
    description: store.description || `Koleksi tenun songket terbaik dari ${store.name}`,
  };
}

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);

  if (!store) {
    notFound();
  }

  const { products } = await getProducts({ storeId: store.id });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Store Banner */}
      <div className="relative h-48 md:h-64 lg:h-80 bg-muted overflow-hidden">
        {store.banner_url ? (
          <Image
            src={store.banner_url}
            alt={`${store.name} banner`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 flex items-center justify-center">
            <Store className="w-20 h-20 text-background/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
        <FadeIn>
          <div className="bg-card border border-border/50 rounded-2xl shadow-xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-start">
            {/* Store Logo/Image */}
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden border-4 border-background shadow-md bg-muted flex-shrink-0">
               {store.image_url ? (
                  <Image
                    src={store.image_url}
                    alt={store.name}
                    fill
                    className="object-cover"
                  />
               ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                    <Store className="w-10 h-10" />
                  </div>
               )}
            </div>

            {/* Store Info */}
            <div className="flex-grow space-y-4">
              <div>
                <div className="flex items-center gap-3 flex-wrap mb-1">
                   <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                     {store.name}
                   </h1>
                   {store.is_verified && (
                     <Badge variant="secondary" className="gap-1 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-200">
                       <CheckCircle2 className="w-3.5 h-3.5" />
                       Verified
                     </Badge>
                   )}
                </div>
                {store.description && (
                  <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
                    {store.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Bergabung sejak {new Date(store.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}</span>
                </div>
                {/* Placeholder for location if added later */}
                {/* <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Sawahlunto, Sumatera Barat</span>
                </div> */}
              </div>
            </div>

            {/* Stats or Actions (Optional) */}
            <div className="flex gap-4 md:self-center">
               <div className="text-center px-4 py-2 bg-secondary/10 rounded-lg">
                 <p className="font-bold text-xl text-foreground">{products.length}</p>
                 <p className="text-xs text-muted-foreground">Produk</p>
               </div>
            </div>
          </div>
        </FadeIn>

        {/* Store Products */}
        <div className="mt-12 space-y-8">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Koleksi Produk
            </h2>
            {/* Filter/Sort could go here */}
          </div>

          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
             <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed border-border">
               <Store className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
               <h3 className="text-lg font-medium text-foreground">Belum ada produk</h3>
               <p className="text-muted-foreground">Toko ini belum menambahkan produk koleksi mereka.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
