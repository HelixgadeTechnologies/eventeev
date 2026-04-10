"use client";

import { useState } from "react";
import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa6";
import { FiSearch, FiMoreHorizontal, FiBell, FiTrash2 } from "react-icons/fi";
import Avatar from "@/components/ui/Avatar";
import {
  HiOutlineTicket,
  HiOutlineUserAdd,
  HiOutlineChatAlt2,
  HiOutlineCash,
  HiOutlineSpeakerphone,
  HiOutlineCog,
  HiOutlineChartBar,
} from "react-icons/hi";

// ─── Types ─────────────────────────────────────────────────────────────
interface Notification {
  id: number;
  type: "ticket" | "attendee" | "message" | "payment" | "announcement" | "system" | "poll";
  title: string;
  description: string;
  time: string;
  read: boolean;
  actor?: string;
  amount?: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────────
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: "ticket",
    title: "New Ticket Purchased",
    description: "Sarah Chen purchased a VIP Pass for Tech Summit 2026",
    time: "Just Now",
    read: false,
    actor: "Sarah Chen",
    amount: "₦45,000",
  },
  {
    id: 2,
    type: "attendee",
    title: "New Attendee Registered",
    description: "Marcus Johnson registered for Tech Summit 2026 via free ticket",
    time: "30 min ago",
    read: false,
    actor: "Marcus Johnson",
  },
  {
    id: 3,
    type: "payment",
    title: "Payment Received",
    description: "Standard Ticket payment received from Aisha Patel for Tech Summit 2026",
    time: "2 days ago",
    read: false,
    actor: "Aisha Patel",
    amount: "₦25,000",
  },
  {
    id: 4,
    type: "ticket",
    title: "Bulk Tickets Purchased",
    description: "Helixgade Technologies purchased 5x Early Bird Tickets",
    time: "5 days ago",
    read: false,
    actor: "Helixgade Technologies",
    amount: "₦100,000",
  },
  {
    id: 5,
    type: "attendee",
    title: "New Attendee Registered",
    description: "Elena Rodriguez registered for Tech Summit 2026 via referral link",
    time: "07 Feb, 2024",
    read: true,
    actor: "Elena Rodriguez",
  },
  {
    id: 6,
    type: "message",
    title: "New Chat Message",
    description: "David Kim sent a message: \"Hey, can I get more info about the VIP lounge?\"",
    time: "01 Feb, 2024",
    read: true,
    actor: "David Kim",
  },
  {
    id: 11,
    type: "attendee",
    title: "New Attendee Registered",
    description: "Tunde Adeyemi registered for Tech Summit 2026 via direct link",
    time: "28 Jan, 2024",
    read: true,
    actor: "Tunde Adeyemi",
  },
  {
    id: 12,
    type: "ticket",
    title: "New Ticket Purchased",
    description: "Priya Sharma purchased a Standard Pass for Tech Summit 2026",
    time: "27 Jan, 2024",
    read: true,
    actor: "Priya Sharma",
    amount: "₦25,000",
  },
];

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
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState("");

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleMarkRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

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
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
              <FiBell className="text-xl text-gray-900" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-[#1B1818] tracking-tight">
              List Notification
            </h2>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 flex-1 max-w-2xl justify-end">
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
            <button className="p-2.5 hover:bg-gray-50 rounded-xl transition-all">
              <FiMoreHorizontal className="text-xl text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="mb-6">
            <p className="text-sm font-bold text-gray-900">
              {notifications.length} Notification
            </p>
          </div>

          <div className="space-y-4">
            {notifications.length === 0 ? (
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
              notifications.map((notification) => {
                const config = typeConfig[notification.type] || typeConfig.system;
                return (
                  <div
                    key={notification.id}
                    onClick={() => handleMarkRead(notification.id)}
                    className={`group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                      notification.read
                        ? "bg-white border-gray-50"
                        : "bg-gray-50/50 border-transparent hover:border-gray-100"
                    }`}
                  >
                    {/* Status Dot */}
                    <div className="absolute left-1.5 top-1/2 -translate-y-1/2">
                      {!notification.read && (
                        <span className={`block w-1.5 h-1.5 rounded-full ${config.dot}`} />
                      )}
                    </div>

                    {/* Icon/Avatar */}
                    <div className="shrink-0 pl-1">
                      {notification.actor ? (
                        <Avatar name={notification.actor} size="md" />
                      ) : (
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.bg}`}>
                          {config.icon}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-sm text-gray-600 leading-relaxed truncate">
                        <span className="font-bold text-gray-900 mr-1">
                          {notification.title}:
                        </span>
                        {notification.description}
                      </p>
                    </div>

                    {/* Meta & Actions */}
                    <div className="flex items-center gap-6 shrink-0">
                      <span className="text-xs font-medium text-gray-400 whitespace-nowrap">
                        {notification.time}
                      </span>
                      
                      <button
                        onClick={(e) => handleDelete(notification.id, e)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      >
                        <FiTrash2 className="text-lg" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
