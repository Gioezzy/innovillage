/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import Image from 'next/image';
import { formatRupiah, getProductImage } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { User, Sparkles, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    image_urls: string[];
    category?: {
      name: string;
    };
    motif?: {
      name: string;
    } | null;
    profile?: {
      full_name: string;
    } | null;
    store?: {
      name: string;
      slug: string;
    } | null;
    shopee_url?: string | null;
    tokopedia_url?: string | null;
    padiumkm_url?: string | null;
  };
  imageQuality?: number;
  priority?: boolean;
}

export default function ProductCard({ product, imageQuality = 75, priority = false }: ProductCardProps) {
  const imageUrl = getProductImage(product.image_urls);

  return (
    <div className="group relative bg-card rounded-xl overflow-hidden border border-border/50 hover:border-primary/50 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full">
      <Link href={`/product/${product.slug}`} className="block relative aspect-[4/5] bg-muted overflow-hidden">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          quality={imageQuality}
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-2">
           {product.category && (
            <Badge className="bg-background/90 backdrop-blur-md text-foreground hover:bg-background border-0 w-fit">
              {product.category.name}
            </Badge>
          )}
          {product.motif && (
            <Badge variant="secondary" className="backdrop-blur-md border-0 w-fit gap-1">
              <Sparkles className="w-3 h-3" />
              {product.motif.name}
            </Badge>
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-heading text-lg font-medium text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          
          {product.profile?.full_name && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Store className="w-3.5 h-3.5" />
              <span>{product.store?.name || product.profile?.full_name}</span>

            </div>
          )}
        </div>

        <div className="pt-3 border-t border-border/50 space-y-3 mt-auto">
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-primary">
              {formatRupiah(product.price)}
            </p>
          </div>

          {(product.shopee_url || product.tokopedia_url || product.padiumkm_url) && (
            <div className="flex gap-2">
              {product.shopee_url && (
                <Link href={product.shopee_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                   <Button variant="outline" size="sm" className="w-full h-8 text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700 p-0">
                     <span className="text-[10px] font-bold">Shopee</span>
                   </Button>
                </Link>
              )}
              {product.tokopedia_url && (
                <Link href={product.tokopedia_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                   <Button variant="outline" size="sm" className="w-full h-8 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 p-0">
                     <span className="text-[10px] font-bold">Tokped</span>
                   </Button>
                </Link>
              )}
              {product.padiumkm_url && (
                <Link href={product.padiumkm_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                   <Button variant="outline" size="sm" className="w-full h-8 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 p-0">
                     <span className="text-[10px] font-bold">Padi</span>
                   </Button>
                </Link>
              )}
            </div>
          )}
           <Link href={`/product/${product.slug}`} className="block">
              <Button className="w-full rounded-lg" size="sm">
                Lihat Detail
              </Button>
           </Link>
        </div>
      </div>
    </div>
  );
}
