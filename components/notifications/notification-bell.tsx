/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '../ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import {
  getUserNotifications,
  markAllNotificationsAsRead,
} from '@/lib/actions/notification';
import NotificationList from './notification-list';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(loadNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    const { notifications, unreadCount } = await getUserNotifications();
    setNotifications(notifications);
    setUnreadCount(unreadCount);
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();
    await loadNotifications();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative group">
          <Bell className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-md max-h-[600px] overflow-hidden flex flex-col">
        <AlertDialogHeader>
          <div className="flex items-center justify-between">
            <AlertDialogTitle>Notifikasi</AlertDialogTitle>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllRead}
                className="text-xs"
              >
                Tandai Semua Dibaca
              </Button>
            )}
          </div>
        </AlertDialogHeader>

        <NotificationList
          notifications={notifications}
          onUpdate={loadNotifications}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}
