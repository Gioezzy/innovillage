/**
 * Notification Service
 * 
 * Handles creation and management of in-app notifications for marketplace orders.
 * Provides graceful error handling and ensures notifications are sent within 5 seconds.
 */

import { createClient } from "../supabase/server";

export interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'system';
  relatedId?: string;
}

export interface CreateNotificationResult {
  success: boolean;
  error?: string;
  notificationId?: string;
}

/**
 * Creates an in-app notification for a user
 * 
 * @param input - Notification details including userId, title, message, type, and optional relatedId
 * @returns Result object with success status and optional error message
 * 
 * Requirements:
 * - 7.5: Send notification within 5 seconds of status update
 * - 7.6: Send notification for order status changes
 * - 7.9: Handle notification failures gracefully
 */
export async function createNotification(
  input: CreateNotificationInput
): Promise<CreateNotificationResult> {
  try {
    const supabase = await createClient();

    // Set a timeout to ensure notification is sent within 5 seconds
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Notification creation timeout after 5 seconds')), 5000);
    });

    // Create notification with timeout
    const insertPromise = supabase
      .from('notifications')
      .insert({
        user_id: input.userId,
        title: input.title,
        message: input.message,
        type: input.type,
        related_id: input.relatedId,
        is_read: false,
      })
      .select('id')
      .single();

    const { data, error } = await Promise.race([insertPromise, timeoutPromise]);

    if (error) {
      console.error('[NotificationService] Error creating notification:', error);
      return {
        success: false,
        error: error.message || 'Failed to create notification'
      };
    }

    return {
      success: true,
      notificationId: data?.id
    };
  } catch (error) {
    // Handle timeout or other unexpected errors gracefully
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('[NotificationService] Exception creating notification:', errorMessage);
    
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Creates a notification for order status updates
 * 
 * @param userId - The user ID to send the notification to
 * @param orderNumber - The order number for display in the notification
 * @param status - The new order status ('confirmed' or 'completed')
 * @returns Result object with success status and optional error message
 * 
 * Requirements:
 * - 7.5: Notification for 'confirmed' status
 * - 7.6: Notification for 'completed' status
 * - 7.7: Confirmed notification message
 * - 7.8: Completed notification message
 * - 7.9: Handle notification failures gracefully
 */
export async function createOrderStatusNotification(
  userId: string,
  orderNumber: string,
  orderId: string,
  status: 'confirmed' | 'completed'
): Promise<CreateNotificationResult> {
  // Define notification messages based on status
  const notificationMessages: Record<'confirmed' | 'completed', string> = {
    confirmed: 'Your order has been confirmed and is being processed',
    completed: 'Your order has been completed and is ready for pickup or has been shipped'
  };

  const message = notificationMessages[status];

  return createNotification({
    userId,
    title: 'Order Status Update',
    message: `Order #${orderNumber}: ${message}`,
    type: 'order',
    relatedId: orderId
  });
}

/**
 * Gets unread notification count for a user
 * 
 * @param userId - The user ID to get notification count for
 * @returns The count of unread notifications
 */
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  try {
    const supabase = await createClient();

    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('[NotificationService] Error getting unread count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('[NotificationService] Exception getting unread count:', error);
    return 0;
  }
}

/**
 * Marks a notification as read
 * 
 * @param notificationId - The notification ID to mark as read
 * @param userId - The user ID (for authorization)
 * @returns Result object with success status
 */
export async function markNotificationAsRead(
  notificationId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('user_id', userId);

    if (error) {
      console.error('[NotificationService] Error marking notification as read:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('[NotificationService] Exception marking notification as read:', errorMessage);
    
    return {
      success: false,
      error: errorMessage
    };
  }
}
