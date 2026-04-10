import axiosInstance from "../axios";

export interface ApiNotification {
  _id: string;
  recipient: string;
  sender?: string;
  type: "info" | "success" | "warning" | "error" | "message" | "event" | "ticket";
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface PaginatedNotifications {
  notifications: ApiNotification[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

class NotificationService {
  /**
   * Fetch paginated notifications for the logged-in user
   */
  async getNotifications(page = 1, limit = 50) {
    try {
      const response = await axiosInstance.get<PaginatedNotifications>(
        `/api/notification?page=${page}&limit=${limit}`
      );
      return { data: response.data, error: null };
    } catch (error: any) {
      console.error("Failed to fetch notifications:", error);
      return {
        data: null,
        error: error.response?.data || { message: "Failed to fetch notifications" },
      };
    }
  }

  /**
   * Mark a specific notification as read
   */
  async markAsRead(id: string) {
    try {
      const response = await axiosInstance.put(`/api/notification/${id}/read`);
      return { data: response.data, error: null };
    } catch (error: any) {
      console.error("Failed to mark notification as read:", error);
      return {
        data: null,
        error: error.response?.data || { message: "Failed to mark as read" },
      };
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    try {
      const response = await axiosInstance.put("/api/notification/read-all");
      return { data: response.data, error: null };
    } catch (error: any) {
      console.error("Failed to mark all as read:", error);
      return {
        data: null,
        error: error.response?.data || { message: "Failed to mark all as read" },
      };
    }
  }

  /**
   * Permanently delete a notification
   */
  async deleteNotification(id: string) {
    try {
      const response = await axiosInstance.delete(`/api/notification/${id}`);
      return { data: response.data, error: null };
    } catch (error: any) {
      console.error("Failed to delete notification:", error);
      return {
        data: null,
        error: error.response?.data || { message: "Failed to delete notification" },
      };
    }
  }
}

export const notificationService = new NotificationService();
