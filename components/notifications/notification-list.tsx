/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { formatDateTime } from '@/lib/utils';
import { markAllNotificationsAsRead } from '@/lib/actions/notification';
import { getOrderIdByOrderNumber } from '@/lib/actions/order';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  CreditCard,
  Image as ImageIcon,
  Info,
  Bell,
} from 'lucide-react';
import { ORDER_STATUS_LABELS } from '@/lib/constans';
import { toast } from 'sonner';

interface NotificationListProps {
  notifications: any[];
  onUpdate: () => void;
}

export default function NotificationList({
  notifications,
  onUpdate,
}: NotificationListProps) {
  const router = useRouter();

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-5 h-5 text-blue-600" />;
      case 'payment':
        return <CreditCard className="w-5 h-5 text-green-600" />;
      case 'design':
        return <ImageIcon className="w-5 h-5 text-purple-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleClick = async (notification: any) => {
    if (!notification.is_read) {
      await markAllNotificationsAsRead();
      onUpdate();
    }

    if (notification.related_id) {
      switch (notification.type) {
        case 'order':
          const orderId = await getOrderIdByOrderNumber(notification.related_id);
          if (orderId) {
            router.push(`/orders/${orderId}`);
          } else {
            toast.error('Tidak dapat menemukan detail pesanan.');
          }
          break;
        case 'design':
          router.push(`/designs/${notification.related_id}`);
          break;
      }
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>Belum ada notifikasi</p>
      </div>
    );
  }
  return (
    <div className="overflow-y-auto flex-1">
      <div className="space-y-2">
        {notifications.map(notification => (
          <button
            key={notification.id}
            onClick={() => handleClick(notification)}
            className={`w-full text-left p-4 rounded-lg border transition-colors ${
              notification.is_read
                ? 'bg-white hover:bg-gray-50'
                : 'bg-blue-50 hover:bg-blue-100 border-blue-200'
            }`}
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-1">
                {getIcon(notification.type)}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${
                    notification.is_read ? 'text-gray-900' : 'text-gray-900'
                  }`}
                >
                  {notification.title}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {(() => {
                    let formattedMessage = notification.message;
                    Object.entries(ORDER_STATUS_LABELS).forEach(([key, label]) => {
                      if (formattedMessage.includes(key)) {
                        formattedMessage = formattedMessage.replace(key, label);
                      }
                    });
                    return formattedMessage;
                  })()}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {formatDateTime(notification.created_at)}
                </p>
              </div>

              {!notification.is_read && (
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
