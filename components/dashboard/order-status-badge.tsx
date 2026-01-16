import { Badge } from '../ui/badge';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/lib/constans';

interface OrderStatusBadgeProps {
  status: string;
  className?: string;
}

export default function OrderStatusBadge({
  status,
  className,
}: OrderStatusBadgeProps) {
  const label = ORDER_STATUS_LABELS[status] || status;
  const colorClass = ORDER_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';

  return (
    <Badge
      variant="secondary"
      className={`${colorClass} border ${className || ''}`}
    >
      {label}
    </Badge>
  );
}
