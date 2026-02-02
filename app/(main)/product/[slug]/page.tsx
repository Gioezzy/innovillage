import NotFound from '@/app/not-found';
import { getProductBySlug, getRelatedProducts } from '@/lib/actions/product';
import { Button } from '@/components/ui/button';
import { formatRupiah, getProductImage } from '@/lib/utils';
import Breadcrumb from '@/components/layout/breadcrumb';
import AddToCartButton from '@/components/product/add-to-cart-button';
import ProductGrid from '@/components/product/product-grid';
import ProductImageGallery from '@/components/product/product-image-gallery';
import FadeIn from '@/components/animations/fade-in';
import { Sparkles, User, History, ScrollText, Store } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import ProductionTimeline from '@/components/product/production-timeline';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.name} - Songket.id`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    NotFound();
  }

  const relatedProducts = await getRelatedProducts(
    product.id,
    product.category_id,
    4
  );

  const imageUrl = getProductImage(product.image_urls);

  const motif = (product as any).motif;
  const artisan = (product as any).profile;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <Breadcrumb
          items={[
            {
              label: product.category?.name || 'Koleksi',
              href: `/category/${product.category?.slug}`,
            },
            { label: product.name },
          ]}
        />

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <ProductImageGallery
              images={product.image_urls || []}
              defaultImageUrl={imageUrl}
              altText={product.name}
            />
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="lg:sticky lg:top-24 lg:self-start space-y-8">
              <div className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  {product.category && (
                    <Badge variant="outline" className="text-secondary-foreground border-secondary/20">
                      {product.category.name}
                    </Badge>
                  )}
                  {motif && (
                    <Badge variant="secondary" className="gap-1">
                      <Sparkles className="w-3 h-3" />
                      Motif: {motif.name}
                    </Badge>
                  )}
                </div>
                
                <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                  {product.name}
                </h1>

                {product.store && (
                  <div className="flex items-center gap-3 p-3 bg-secondary/5 rounded-lg border border-secondary/10 w-fit">
                    <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center overflow-hidden">
                       <Store className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Dijual oleh</p>
                      <Link href={`/stores/${product.store.slug}`} className="font-medium text-foreground hover:underline">
                        {product.store.name}
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-baseline gap-4 pb-6 border-b border-border">
                <p className="text-4xl font-bold text-primary">
                  {formatRupiah(product.price)}
                </p>
                {product.stock_quantity !== null && product.stock_quantity < 5 && (
                  <span className="text-sm font-medium text-amber-600 animate-pulse">
                     Segera Habis! Sisa {product.stock_quantity}
                  </span>
                )}
              </div>

              {product.description && (
                <div className="prose prose-lg text-muted-foreground leading-relaxed">
                  <p>{product.description}</p>
                </div>
              )}
              
              <div className="p-6 bg-card border border-border rounded-xl shadow-sm space-y-4">
                <div className="space-y-3">
                  <AddToCartButton product={product} />
                  
                  {(product.shopee_url || product.tokopedia_url || product.padiumkm_url) && (
                    <div className="pt-4 border-t border-border mt-2">
                       <p className="text-sm font-medium mb-3">
                         Dapat dibeli di marketplace:
                       </p>
                       <div className="flex gap-2 flex-wrap">
                         {product.shopee_url && (
                           <Link href={product.shopee_url} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="icon" title="Shopee" className="w-10 h-10 border-orange-200 hover:bg-orange-50 hover:text-orange-600 text-orange-600 rounded-full">
                                <span className="font-bold text-xs">Shopee</span>
                              </Button>
                           </Link>
                         )}
                         {product.tokopedia_url && (
                           <Link href={product.tokopedia_url} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="icon" title="Tokopedia" className="w-10 h-10 border-green-200 hover:bg-green-50 hover:text-green-600 text-green-600 rounded-full">
                                <span className="font-bold text-xs">Tokped</span>
                              </Button>
                           </Link>
                         )}
                         {product.padiumkm_url && (
                           <Link href={product.padiumkm_url} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="icon" title="PadiUMKM" className="w-10 h-10 border-blue-200 hover:bg-blue-50 hover:text-blue-600 text-blue-600 rounded-full">
                                <span className="font-bold text-xs">Padi</span>
                              </Button>
                           </Link>
                         )}
                       </div>
                    </div>
                  )}

                </div>
              </div>

              {product.lead_time_days !== null && product.lead_time_days > 0 && (
                <FadeIn delay={0.1}>
                  <ProductionTimeline leadTimeDays={product.lead_time_days} />
                </FadeIn>
              )}

              {motif && motif.philosophy && (
                <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/10">
                  <h3 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <ScrollText className="w-5 h-5 text-primary" />
                    Filosofi Motif
                  </h3>
                  <p className="text-muted-foreground italic leading-relaxed">
                    "{motif.philosophy}"
                  </p>
                  {motif.history && (
                     <div className="mt-4 pt-4 border-t border-primary/10">
                       <p className="text-sm text-muted-foreground">
                         <span className="font-semibold text-primary">Sejarah:</span> {motif.history}
                       </p>
                     </div>
                  )}
                </div>
              )}

            </div>
          </FadeIn>
        </div>

        {relatedProducts.length > 0 && (
          <FadeIn delay={0.3} className="mt-24 pt-12 border-t border-border">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground mb-8">
              Koleksi Serupa
            </h2>
            <ProductGrid products={relatedProducts} />
          </FadeIn>
        )}
      </div>
    </div>
  );
}
