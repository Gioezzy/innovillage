'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
  Home,
  Menu,
  TrendingUp,
  Store,
  Users,
  Banknote,
  BookOpen,
} from 'lucide-react';
import { logoutAction } from '@/lib/actions/auth';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

const allMenuItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    roles: ['admin', 'artisan'],
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: TrendingUp,
    roles: ['admin', 'artisan'],
  },
  {
    title: 'Produk',
    href: '/admin/product',
    icon: Package,
    roles: ['admin', 'artisan'],
  },
  {
    title: 'Pesanan',
    href: '/admin/orders',
    icon: ShoppingBag,
    roles: ['admin', 'artisan'],
  },
  {
    title: 'Pengaturan Toko',
    href: '/admin/store/settings',
    icon: Store,
    roles: ['artisan', 'admin'], 
  },
  {
    title: 'Staff',
    href: '/admin/staff',
    icon: Users,
    roles: ['admin'],
  },
  {
    title: 'Keuangan',
    href: '/admin/finance',
    icon: Banknote,
    roles: ['admin'],
  },
  {
    title: 'Panduan',
    href: '/admin/manual',
    icon: BookOpen,
    roles: ['admin', 'artisan'],
  },
];

interface AdminSidebarProps {
  userRole?: string | null;
}

export default function AdminSidebar({ userRole }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(true);

  const menuItems = allMenuItems.filter(item => 
    !item.roles || (userRole && item.roles.includes(userRole))
  );

  const handleLogout = () => {
    startTransition(async () => {
      const result = await logoutAction();
      if (result?.error) {
        toast.error(result.error);
      }
    });
  };

  return (
    <aside
      className={cn(
        'bg-card border-r border-border/50 min-h-screen p-4 flex flex-col transition-all duration-300 relative overflow-hidden shrink-0',
        open ? 'w-72' : 'w-20'
      )}
    >
      <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

      {/* Header Container */}
      <div className={cn("flex items-center mb-8 relative z-10", open ? "justify-between" : "flex-col gap-3 justify-center")}>
        {open ? (
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Songket.id Logo"
              width={140}
              height={40}
              className="h-10 w-auto object-contain shrink-0"
              priority
            />
            <div className="overflow-hidden">
              <h1 className="text-xl font-bold whitespace-nowrap font-heading text-foreground">
                Songket.id
              </h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest truncate">
                {userRole === 'super_admin' ? 'Platform Manager' : 
                 userRole === 'admin' ? 'Store Owner' : 
                 userRole === 'artisan' ? 'Store Staff' : 'User'}
              </p>
            </div>
          </div>
        ) : (
          <Image
            src="/logo.png"
            alt="Songket.id Logo"
            width={48}
            height={48}
            className="h-10 w-auto object-contain shrink-0"
            priority
          />
        )}

        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
          title={open ? "Perkecil Sidebar" : "Perbesar Sidebar"}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 relative z-10 flex-1">
        {menuItems.map(item => {
          const Icon = item.icon;
          
          const isActive = item.href === '/admin'
            ? pathname === '/admin'
            : pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              title={!open ? item.title : undefined}
              className={cn(
                'flex items-center rounded-xl transition-all duration-300 group',
                open ? 'space-x-3 px-4 py-3' : 'justify-center p-3 mx-auto w-12 h-12',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 font-bold'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 shrink-0 transition-transform group-hover:scale-110',
                  isActive ? 'text-primary-foreground' : ''
                )}
              />
              {open && <span className="font-medium truncate">{item.title}</span>}
            </Link>
          );
        })}

        <div className="border-t border-border/50 my-6" />

        <Link
          href="/"
          title={!open ? "Ke Website" : undefined}
          className={cn(
            'flex items-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-300 group',
            open ? 'space-x-3 px-4 py-3' : 'justify-center p-3 mx-auto w-12 h-12'
          )}
        >
          <Home className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
          {open && <span className="font-medium truncate">Ke Website</span>}
        </Link>
      </nav>

      {/* Footer / Logout */}
      <div className="pt-4 border-t border-border/50 relative z-10">
        <button
          onClick={handleLogout}
          disabled={isPending}
          title={!open ? "Logout" : undefined}
          className={cn(
            'flex items-center rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-300 group',
            open ? 'w-full space-x-3 px-4 py-3' : 'justify-center p-3 mx-auto w-12 h-12'
          )}
        >
          <LogOut className="w-5 h-5 shrink-0 group-hover:rotate-180 transition-transform" />
          {open && (
            <span className="font-medium truncate">
              {isPending ? 'Logging out...' : 'Logout'}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
