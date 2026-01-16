'use server';

import { createClient } from "../supabase/server";
import { revalidatePath } from "next/cache";

export async function getUserNotifications(limit = 10) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { notifications: [], unreadCount: 0 };
  }

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  const { count: unreadCount } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_read', false);

  return {
    notifications: notifications || [],
    unreadCount: unreadCount || 0
  };
}

export async function markNotificationAsRead(notificationId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .eq('user_id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  return { success: true };
}

export async function markAllNotificationsAsRead() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', user.id)
    .eq('is_read', false);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  return { success: true };
}

export async function createNotification(input: {
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'system';
  relatedId?: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('notifications')
    .insert({
      user_id: input.userId,
      title: input.title,
      message: input.message,
      type: input.type,
      related_id: input.relatedId,
    });

  if (error) {
    console.error('Error creating notification:', error);
    return { error: error.message };
  }

  return { success: true };
}