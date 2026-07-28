'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Store,
  Banknote,
  LogOut,
  FolderOpen,
  Home,
  Menu,
  Activity,
  BookOpen,
  ClipboardList,
  Users,
} from 'lucide-react';
import { logoutAction } from '@/lib/actions/auth';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

interface MenuItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

interface SuperAdminSidebarProps {
  pendingRequestCount?: number;
}

export default function SuperAdminSidebar({ pendingRequestCount = 0 }: SuperAdminSidebarProps) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(true);

  const menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      href: '/super-admin',
      icon: LayoutDashboard,
    },
    {
      title: 'Kelola Toko',
      href: '/super-admin/stores',
      icon: Store,
    },
    {
      title: 'Kelola Users',
      href: '/super-admin/users',
      icon: Users,
    },
    {
      title: 'Request Toko',
      href: '/super-admin/store-requests',
      icon: ClipboardList,
      badge: pendingRequestCount,
    },
    {
      title: 'Pencairan Dana',
      href: '/super-admin/payouts',
      icon: Banknote,
    },
    {
      title: 'Kategori',
      href: '/super-admin/category',
      icon: FolderOpen,
    },
    {
      title: 'Traffic & QoS',
      href: '/super-admin/traffic',
      icon: Activity,
    },
    {
      title: 'Panduan',
      href: '/super-admin/manual',
      icon: BookOpen,
    },
  ];

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
                Platform Manager
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
          
          const isActive = item.href === '/super-admin'
            ? pathname === '/super-admin'
            : pathname === item.href || pathname.startsWith(item.href + '/');

          const hasBadge = !!item.badge && item.badge > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={!open ? item.title : undefined}
              className={cn(
                'flex items-center rounded-xl transition-all duration-300 group relative',
                open ? 'space-x-3 px-4 py-3' : 'justify-center p-3 mx-auto w-12 h-12',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 font-bold'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <div className="relative shrink-0">
                <Icon
                  className={cn(
                    'w-5 h-5 transition-transform group-hover:scale-110',
                    isActive ? 'text-primary-foreground' : ''
                  )}
                />
                {hasBadge && !open && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {item.badge! > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              {open && (
                <div className="flex items-center justify-between flex-1 overflow-hidden">
                  <span className="font-medium truncate">{item.title}</span>
                  {hasBadge && (
                    <span className={cn(
                      'text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ml-1',
                      isActive ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
                    )}>
                      {item.badge! > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
              )}
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
