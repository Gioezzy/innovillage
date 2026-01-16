import Link from 'next/link';
import Image from 'next/image';
import { getCategories } from '@/lib/actions/category';

export default async function CategoryShowcase() {
  const categories = await getCategories();

  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      <div className="flex flex-col items-center mb-12 space-y-4">
        <span className="text-secondary font-medium tracking-wider text-sm uppercase">
          Koleksi Kami
        </span>
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center text-foreground">
          Kategori Produk
        </h2>
        <div className="w-20 h-1 bg-secondary rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map(category => (
          <Link
            href={`/category/${category.slug}`}
            key={category.id}
            className="group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-border/50 hover:border-secondary/30"
          >
            <div className="relative h-72 bg-muted overflow-hidden">
              {category.image_url ? (
                <Image
                  src={category.image_url}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                  No Image
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

              <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-2xl font-heading font-bold text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-200 text-sm mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {category.description}
                </p>
                <div className="flex items-center text-secondary font-semibold text-sm tracking-wide bg-white/10 backdrop-blur-sm w-fit px-3 py-1 rounded-full border border-white/10">
                  Lihat Koleksi
                  <svg
                    className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
