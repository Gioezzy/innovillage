import Link from 'next/link';
import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ShoppingBag
} from 'lucide-react';

const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    icon: Instagram,
    url: '#',
  },
  { name: 'Facebook', icon: Facebook, url: '#' },
  { name: 'Twitter', icon: Twitter, url: '#' },
];

import { createClient } from '@/lib/supabase/server';

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const supabase = await createClient();
  
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .limit(4);

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-heading text-2xl font-bold text-foreground">
              <span className="bg-primary/10 text-primary p-1 rounded-lg">
                <ShoppingBag className="w-6 h-6" />
              </span>
              Songket.id
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Platform digital pelestarian Songket Silungkang berbasis AI. 
              Menghubungkan pengrajin lokal dengan pasar global, menjahit cerita dalam setiap helai benang.
            </p>
            <div className="flex space-x-4 pt-2">
              {SOCIAL_LINKS.map(social => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-secondary/10 p-2 rounded-full text-secondary-foreground/70 hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:-translate-y-1"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-6 tracking-wide text-lg">
              Navigasi
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { name: 'Beranda', href: '/' },
                { name: 'Tentang Kami', href: '/about' },
                { name: 'Koleksi', href: '/shop' },
                { name: 'Smart Lens (AI)', href: '/scan' },
              ].map(item => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="group flex items-center text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-6 tracking-wide text-lg">
              Koleksi Populer
            </h4>
            <ul className="space-y-3 text-sm">
              {categories?.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-muted-foreground hover:text-primary transition-colors hover:underline decoration-primary decoration-2 underline-offset-4"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                  <Link
                    href="/shop"
                    className="text-muted-foreground hover:text-primary transition-colors hover:underline decoration-primary decoration-2 underline-offset-4 font-medium"
                  >
                    Semua Produk
                  </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-6 tracking-wide text-lg">
              Hubungi Kami
            </h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-md mr-3 mt-0.5">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                    WhatsApp
                  </span>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    +62 812-3456-7890
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-md mr-3 mt-0.5">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                    Email
                  </span>
                  <a
                    href="mailto:hello@songket.id"
                    className="hover:text-foreground transition-colors break-all"
                  >
                    hello@songket.id
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-md mr-3 mt-0.5">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                    Lokasi
                  </span>
                  <span>Silungkang, Sawahlunto, Sumatera Barat</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
          <p>&copy; {currentYear} Songket.id (Innovillage 2025). All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
