'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ShoppingBag,
  User,
  Upload,
  LogOut,
  Image as ImageIcon,
} from 'lucide-react';
import { logoutAction } from '@/lib/actions/auth';
import { useTransition } from 'react';
import { toast } from 'sonner';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Pesanan Saya',
    href: '/orders',
    icon: ShoppingBag,
  },
  {
    title: 'Profil',
    href: '/profile',
    icon: User,
  },
];

export default function ProtectedSidebar() {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      const result = await logoutAction();
      if (result?.error) {
        toast.error(result.error);
      }
    });
  };

  return (
    <aside className="w-64 bg-card border-r border-border/50 min-h-screen p-6 hidden lg:block sticky top-0 h-screen">
      <div className="space-y-1">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group',
                isActive
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-muted-foreground hover:bg-secondary/10 hover:text-secondary'
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground group-hover:text-secondary'
                )}
              />
              <span>{item.title}</span>
            </Link>
          );
        })}

        <button
          onClick={handleLogout}
          disabled={isPending}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors mt-8"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">
            {isPending ? 'Logging out...' : 'Logout'}
          </span>
        </button>
      </div>
    </aside>
  );
}
