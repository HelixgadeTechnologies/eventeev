import axiosInstance from '@/lib/axios';
import { io, Socket } from 'socket.io-client';

export interface Notification {
  _id: string;
  recipient: string;
  sender?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  type: 'info' | 'success' | 'warning' | 'error' | 'message' | 'event' | 'ticket';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

class NotificationService {
  private socket: Socket | null = null;

  /**
   * Initialize socket connection for real-time notifications
   */
  initSocket(userId: string) {
    if (this.socket) return;

    this.socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');

    this.socket.on('connect', () => {
      console.log('Connected to notification socket');
      this.socket?.emit('join_user_notifications', userId);
    });

    return this.socket;
  }

  /**
   * Listen for new notifications
   */
  onNewNotification(callback: (notification: Notification) => void) {
    this.socket?.on('new_notification', callback);
  }

  /**
   * Get all notifications for the current user
   */
  async getNotifications() {
    try {
      const response = await axiosInstance.get('/api/notification');
      return { data: response.data as Notification[], error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data || { message: 'Failed to fetch notifications' } };
    }
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(id: string) {
    try {
      const response = await axiosInstance.put(`/api/notification/${id}/read`);
      return { data: response.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data || { message: 'Failed to mark as read' } };
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    try {
      const response = await axiosInstance.put('/api/notification/read-all');
      return { data: response.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data || { message: 'Failed to mark all as read' } };
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(id: string) {
    try {
      const response = await axiosInstance.delete(`/api/notification/${id}`);
      return { data: response.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data || { message: 'Failed to delete notification' } };
    }
  }

  /**
   * Cleanup socket connection
   */
  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const notificationService = new NotificationService();
