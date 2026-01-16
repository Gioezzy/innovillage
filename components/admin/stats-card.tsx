import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  description?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  className,
}: StatsCardProps & { className?: string }) {
  return (
    <div
      className={cn(
        'bg-card rounded-2xl border border-border/50 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold text-foreground font-heading">
            {value}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
