"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa6";
import { FiSearch, FiMoreHorizontal, FiBell, FiTrash2, FiCheckCircle } from "react-icons/fi";
import Avatar from "@/components/ui/Avatar";
import { notificationService, ApiNotification } from "@/lib/services/notification.service";
import {
  HiOutlineTicket,
  HiOutlineUserAdd,
  HiOutlineChatAlt2,
  HiOutlineCash,
  HiOutlineSpeakerphone,
  HiOutlineCog,
  HiOutlineChartBar,
} from "react-icons/hi";
import { formatDistanceToNow } from "date-fns";

// ─── Icon mapping ──────────────────────────────────────────────────────
const typeConfig: Record<string, { icon: React.ReactNode; bg: string; dot: string }> = {
  ticket: {
    icon: <HiOutlineTicket className="text-lg" />,
    bg: "bg-green-50 text-green-600",
    dot: "bg-green-500",
  },
  attendee: {
    icon: <HiOutlineUserAdd className="text-lg" />,
    bg: "bg-blue-50 text-blue-600",
    dot: "bg-blue-500",
  },
  message: {
    icon: <HiOutlineChatAlt2 className="text-lg" />,
    bg: "bg-purple-50 text-purple-600",
    dot: "bg-purple-500",
  },
  payment: {
    icon: <HiOutlineCash className="text-lg" />,
    bg: "bg-amber-50 text-amber-600",
    dot: "bg-amber-500",
  },
  announcement: {
    icon: <HiOutlineSpeakerphone className="text-lg" />,
    bg: "bg-pink-50 text-pink-600",
    dot: "bg-pink-500",
  },
  system: {
    icon: <HiOutlineCog className="text-lg" />,
    bg: "bg-gray-100 text-gray-500",
    dot: "bg-gray-400",
  },
  poll: {
    icon: <HiOutlineChartBar className="text-lg" />,
    bg: "bg-[#EB5017]/10 text-[#EB5017]",
    dot: "bg-[#EB5017]",
  },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchNotifications(1, true);
  }, []);

  const fetchNotifications = async (pageNum: number, isInitial = false) => {
    setLoading(true);
    const { data, error } = await notificationService.getNotifications(pageNum, 50);
    
    if (!error && data) {
      if (isInitial) {
        setNotifications(data.notifications);
      } else {
        setNotifications(prev => [...prev, ...data.notifications]);
      }
      setTotal(data.pagination.total);
      setPage(data.pagination.page);
      setHasMore(data.pagination.page < data.pagination.pages);
    }
    setLoading(false);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchNotifications(page + 1);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const { error } = await notificationService.deleteNotification(id);
    if (!error) {
      setNotifications(notifications.filter((n) => n._id !== id));
      setTotal(prev => prev - 1);
    }
  };

  const handleMarkRead = async (id: string, isRead: boolean) => {
    if (isRead) return;
    const { error } = await notificationService.markAsRead(id);
    if (!error) {
      setNotifications(notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    }
  };

  const handleMarkAllRead = async () => {
    const { error } = await notificationService.markAllAsRead();
    if (!error) {
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 font-sans">
      {/* Back Link */}
      <div className="mb-4">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#EB5017] transition-all group"
        >
          <FaAngleLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
          Back to Events
        </Link>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden min-h-[600px]">
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-gray-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
              <FiBell className="text-xl text-gray-900" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-[#1B1818] tracking-tight whitespace-nowrap">
              List Notification
            </h2>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 flex-1 max-w-2xl lg:justify-end">
            <div className="relative w-full md:w-80">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Name Product"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#EB5017]/20 transition-all outline-none"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#EB5017]/10 text-[#EB5017] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#EB5017] hover:text-white transition-all whitespace-nowrap"
                >
                  <FiCheckCircle className="text-sm" />
                  Mark all read
                </button>
              )}
              <button className="p-2.5 hover:bg-gray-50 rounded-xl transition-all">
                <FiMoreHorizontal className="text-xl text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="mb-6">
            <p className="text-sm font-bold text-gray-900">
              {total} Notification{total !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="space-y-4">
            {notifications.length === 0 && !loading ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                  <FiBell className="text-4xl text-gray-200" />
                </div>
                <div>
                  <p className="font-black text-gray-300 uppercase tracking-widest text-sm">All clear!</p>
                  <p className="text-xs text-gray-300">No notifications to show right now.</p>
                </div>
              </div>
            ) : (
              <>
                {notifications.map((notification) => {
                  const config = typeConfig[notification.type] || typeConfig.system;
                  const date = new Date(notification.createdAt);
                  
                  return (
                    <div
                      key={notification._id}
                      onClick={() => handleMarkRead(notification._id, notification.isRead)}
                      className={`group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                        notification.isRead
                          ? "bg-white border-gray-50 hover:border-gray-100"
                          : "bg-gray-50/50 border-transparent hover:border-gray-100"
                      }`}
                    >
                      {/* Status Dot */}
                      <div className="absolute left-1.5 top-1/2 -translate-y-1/2">
                        {!notification.isRead && (
                          <span className={`block w-1.5 h-1.5 rounded-full ${config.dot}`} />
                        )}
                      </div>

                      {/* Icon */}
                      <div className="shrink-0 pl-1">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.bg}`}>
                          {config.icon}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-sm text-gray-600 leading-relaxed truncate">
                          <span className="font-bold text-gray-900 mr-1">
                            {notification.title}:
                          </span>
                          {notification.message}
                        </p>
                      </div>

                      {/* Meta & Actions */}
                      <div className="flex items-center gap-6 shrink-0">
                        <span className="text-[10px] md:text-xs font-medium text-gray-400 whitespace-nowrap">
                          {formatDistanceToNow(date, { addSuffix: true })}
                        </span>
                        
                        <button
                          onClick={(e) => handleDelete(notification._id, e)}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        >
                          <FiTrash2 className="text-lg" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {hasMore && (
                  <div className="pt-6 flex justify-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={loading}
                      className="px-8 py-3 bg-white border border-gray-100 text-[#1B1818] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-[#EB5017] hover:text-[#EB5017] transition-all disabled:opacity-50"
                    >
                      {loading ? 'Loading...' : 'Load More Notifications'}
                    </button>
                  </div>
                )}
              </>
            )}

            {loading && notifications.length === 0 && (
              <div className="py-20 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EB5017]"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

