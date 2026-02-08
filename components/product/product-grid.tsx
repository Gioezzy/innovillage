/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import ProductCard from './product-card';
import { motion } from 'framer-motion';

interface Product {
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
  shopee_url?: string | null;
  tokopedia_url?: string | null;
  padiumkm_url?: string | null;
}

interface ProductGridProps {
  products: Product[];
  imageQuality?: number;
}

export default function ProductGrid({ products, imageQuality = 75 }: ProductGridProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {products.map(product => (
        <motion.div key={product.id} variants={item}>
          <ProductCard product={product} imageQuality={imageQuality} />
        </motion.div>
      ))}
    </motion.div>
  );
}
