/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import Image from 'next/image';
import { formatRupiah, getProductImage } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { User, Sparkles, Store } from 'lucide-react';

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
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = getProductImage(product.image_urls);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative bg-card rounded-xl overflow-hidden border border-border/50 hover:border-primary/50 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full"
    >
      <div className="relative aspect-[4/5] bg-muted overflow-hidden">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
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
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="font-heading text-lg font-medium text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          {product.profile?.full_name && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Store className="w-3.5 h-3.5" />
              <span>{product.store?.name || product.profile?.full_name}</span>

            </div>
          )}
        </div>

        <div className="pt-3 border-t border-border/50 flex items-center justify-between mt-auto">
          <p className="text-lg font-bold text-primary">
            {formatRupiah(product.price)}
          </p>
          <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
            Lihat Detail →
          </span>
        </div>
      </div>
    </Link>
  );
}
