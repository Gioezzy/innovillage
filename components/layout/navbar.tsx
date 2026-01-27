'use client';

import {
  ShoppingCart,
  ChevronDown,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Camera,
  ShoppingBag,
} from 'lucide-react';
import NotificationBell from '../notifications/notification-bell';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/lib/actions/auth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

type Category = {
    name: string;
    slug: string;
};



const PROTECTED_MENU_ITEMS = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Pesanan Saya', href: '/orders', icon: ShoppingBag },
  { title: 'Smart Lens', href: '/smart-lens', icon: Camera },
  { title: 'Profil', href: '/profile', icon: User },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const shopMenuRef = useRef<HTMLDivElement>(null);

  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchCategories = async () => {
        const { data } = await supabase
            .from('categories')
            .select('name, slug')
            .limit(5); // Limit to 5 for dropdown to keep it clean
        
        if (data) {
            setCategories(data);
        }
    };
    fetchCategories();
  }, []);

  const handleLogout = async () => {
    const res = await logoutAction();

    if (res?.error) {
      toast.error(res.error);
      return;
    }
    toast.success('Anda berhasil logout');
    router.push('/login');
    router.refresh();
    setIsUserMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
      if (
        shopMenuRef.current &&
        !shopMenuRef.current.contains(event.target as Node)
      ) {
        setIsShopOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsShopOpen(false);
  }, [pathname]);

  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/orders') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/smart-lens');

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm supports-[backdrop-filter]:bg-background/60'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link
            href="/"
            className="font-heading text-2xl font-bold text-foreground hover:text-primary transition-colors tracking-tight flex items-center gap-2"
          >
            <span className="bg-primary/10 text-primary p-1 rounded-lg">
              <ShoppingBag className="w-6 h-6" />
            </span>
            Songket.id
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <div className="relative" ref={shopMenuRef}>
              <button
                onClick={() => setIsShopOpen(!isShopOpen)}
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground font-medium transition-colors"
              >
                <span>Koleksi</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isShopOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isShopOpen && (
                <div className="absolute top-full left-0 mt-3 w-56 bg-card border rounded-lg shadow-lg py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {categories.map(category => (
                    <Link
                      key={category.slug}
                      href={`/category/${category.slug}`}
                      className="block px-4 py-2.5 text-foreground/80 hover:bg-secondary hover:text-foreground transition-colors text-sm"
                    >
                      {category.name}
                    </Link>
                  ))}
                  <div className="border-t my-1"></div>
                  <Link
                    href="/shop"
                    className="block px-4 py-2.5 text-primary hover:bg-secondary transition-colors text-sm font-medium"
                  >
                    Lihat Semua Koleksi
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/smart-lens"
              className="text-muted-foreground hover:text-primary font-medium transition-colors flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Smart Lens
            </Link>
            
            <Link
              href="/about"
              className="text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              Tentang Kami
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <NotificationBell />
            <Link
              href="/cart"
              className="relative flex items-center text-muted-foreground hover:text-primary transition-colors group"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {!isLoading && (
              <div className="hidden md:block relative" ref={userMenuRef}>
                {user ? (
                  <>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 text-muted-foreground hover:text-foreground font-medium transition-colors"
                    >
                      <User className="w-6 h-6" />
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isUserMenuOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isUserMenuOpen && (
                      <div className="absolute top-full right-0 mt-3 w-48 bg-card border rounded-lg shadow-lg py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-4 py-2.5 text-foreground/80 hover:bg-secondary hover:text-foreground transition-colors text-sm"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-2.5 text-foreground/80 hover:bg-secondary hover:text-foreground transition-colors text-sm"
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                        <div className="border-t my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors text-sm"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full font-medium text-sm hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                  >
                    Masuk
                  </Link>
                )}
              </div>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-md animate-in slide-in-from-top duration-300 h-screen">
          <div className="flex flex-col px-4 py-4 space-y-1">
            {isProtectedRoute ? (
              <>
                {PROTECTED_MENU_ITEMS.map(item => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground/80 hover:bg-secondary'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
                <div className="border-t my-2"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg font-medium transition-colors text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <div className="pb-2 mb-2 border-b">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-4">
                    Koleksi Songket
                  </div>
                  {categories.map(category => (
                    <Link
                      key={category.slug}
                      href={`/category/${category.slug}`}
                      className="block px-4 py-3 text-foreground/80 hover:bg-secondary rounded-lg transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                  <Link
                    href="/shop"
                    className="block px-4 py-3 text-primary hover:bg-secondary rounded-lg transition-colors font-medium"
                  >
                    Lihat Semua
                  </Link>
                </div>

                <Link
                  href="/smart-lens"
                  className="flex items-center gap-3 px-4 py-3 text-foreground/80 hover:bg-secondary rounded-lg font-medium transition-colors"
                >
                  <Camera className="w-5 h-5 text-primary" />
                  Smart Lens (AI)
                </Link>

                <Link
                  href="/about"
                  className="px-4 py-3 text-foreground/80 hover:bg-secondary rounded-lg font-medium transition-colors block"
                >
                  Tentang Kami
                </Link>

                <div className="border-t my-2"></div>

                {!isLoading && (
                  <>
                    {user ? (
                      <Link
                        href="/dashboard"
                        className="flex items-center space-x-3 px-4 py-3 text-foreground/80 hover:bg-secondary rounded-lg font-medium transition-colors"
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Akun Saya</span>
                      </Link>
                    ) : (
                      <Link
                        href="/login"
                        className="block text-center mt-4 bg-primary text-primary-foreground px-4 py-3 rounded-lg font-medium hover:brightness-110 transition-all"
                      >
                        Masuk / Daftar
                      </Link>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
