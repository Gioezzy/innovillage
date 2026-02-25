'use client';

import Link from 'next/link';
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
        'bg-card border-r border-border/50 min-h-screen p-4 flex flex-col transition-all duration-300 relative overflow-hidden',
        open ? 'w-72' : 'w-20'
      )}
    >
      <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

      <div className="flex items-center justify-between mb-8 relative z-10">
        {open ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold font-heading">
              S
            </div>
            <div>
              <h1 className="text-xl font-bold whitespace-nowrap font-heading text-foreground">
                Songket.id
              </h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                Platform Manager
              </p>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold font-heading mx-auto">
            S
          </div>
        )}
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors absolute right-2 top-3"
          style={{ display: open ? 'block' : 'none' }}
        >
          <Menu size={18} />
        </button>

        {!open && (
          <button
            onClick={() => setOpen(!open)}
            className="mt-4 mx-auto p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <Menu size={20} />
          </button>
        )}
      </div>

      <nav className="space-y-2 relative z-10 flex-1">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/');
          const hasBadge = !!item.badge && item.badge > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group relative',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
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
                <div className="flex items-center justify-between flex-1">
                  <span className="font-medium">{item.title}</span>
                  {hasBadge && (
                    <span className={cn(
                      'text-xs font-bold px-2 py-0.5 rounded-full',
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
          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-300 group"
        >
          <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
          {open && <span className="font-medium">Ke Website</span>}
        </Link>
      </nav>

      <div className="pt-4 border-t border-border/50 relative z-10">
        <button
          onClick={handleLogout}
          disabled={isPending}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform" />
          {open && (
            <span className="font-medium">
              {isPending ? 'Logging out...' : 'Logout'}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
