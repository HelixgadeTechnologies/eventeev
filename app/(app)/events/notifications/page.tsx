"use client";

import { useState } from "react";
import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa6";
import Avatar from "@/components/ui/Avatar";
import {
  HiOutlineTicket,
  HiOutlineUserAdd,
  HiOutlineChatAlt2,
  HiOutlineCash,
  HiOutlineSpeakerphone,
  HiOutlineCog,
  HiOutlineCheck,
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
    description: "VIP Pass — Tech Summit 2026",
    time: "2 min ago",
    read: false,
    actor: "Sarah Chen",
    amount: "₦45,000",
  },
  {
    id: 2,
    type: "attendee",
    title: "New Attendee Registered",
    description: "Registered for Tech Summit 2026 via free ticket",
    time: "8 min ago",
    read: false,
    actor: "Marcus Johnson",
  },
  {
    id: 3,
    type: "payment",
    title: "Payment Received",
    description: "Standard Ticket — Tech Summit 2026",
    time: "15 min ago",
    read: false,
    actor: "Aisha Patel",
    amount: "₦25,000",
  },
  {
    id: 4,
    type: "ticket",
    title: "Bulk Tickets Purchased",
    description: "5x Early Bird Tickets — Tech Summit 2026",
    time: "32 min ago",
    read: false,
    actor: "Helixgade Technologies",
    amount: "₦100,000",
  },
  {
    id: 5,
    type: "attendee",
    title: "New Attendee Registered",
    description: "Registered for Tech Summit 2026 via referral link",
    time: "1 hr ago",
    read: true,
    actor: "Elena Rodriguez",
  },
  {
    id: 6,
    type: "message",
    title: "New Chat Message",
    description: "\"Hey, can I get more info about the VIP lounge?\"",
    time: "1 hr ago",
    read: true,
    actor: "David Kim",
  },
  {
    id: 7,
    type: "poll",
    title: "Poll Response Milestone",
    description: "\"Which session topic are you most excited about?\" reached 100 responses",
    time: "2 hrs ago",
    read: true,
  },
  {
    id: 8,
    type: "announcement",
    title: "Speaker Confirmed",
    description: "Dr. Amina Obi confirmed for the AI & ML Workshop panel",
    time: "3 hrs ago",
    read: true,
  },
  {
    id: 9,
    type: "payment",
    title: "Refund Processed",
    description: "Standard Ticket refund — Tech Summit 2026",
    time: "4 hrs ago",
    read: true,
    actor: "James Okonkwo",
    amount: "-₦25,000",
  },
  {
    id: 10,
    type: "system",
    title: "Event Settings Updated",
    description: "Registration deadline extended to Feb 16, 2026",
    time: "5 hrs ago",
    read: true,
  },
  {
    id: 11,
    type: "attendee",
    title: "New Attendee Registered",
    description: "Registered for Tech Summit 2026 via direct link",
    time: "6 hrs ago",
    read: true,
    actor: "Tunde Adeyemi",
  },
  {
    id: 12,
    type: "ticket",
    title: "New Ticket Purchased",
    description: "Standard Pass — Tech Summit 2026",
    time: "7 hrs ago",
    read: true,
    actor: "Priya Sharma",
    amount: "₦25,000",
  },
  {
    id: 13,
    type: "system",
    title: "Daily Summary",
    description: "Yesterday: 12 tickets sold, 8 new registrations, ₦380,000 revenue",
    time: "1 day ago",
    read: true,
  },
];

// ─── Icon & color mapping ──────────────────────────────────────────────
const typeConfig: Record<string, { icon: React.ReactNode; bg: string; dot: string }> = {
  ticket: {
    icon: <HiOutlineTicket className="text-base" />,
    bg: "bg-green-50 text-green-600",
    dot: "bg-green-500",
  },
  attendee: {
    icon: <HiOutlineUserAdd className="text-base" />,
    bg: "bg-blue-50 text-blue-600",
    dot: "bg-blue-500",
  },
  message: {
    icon: <HiOutlineChatAlt2 className="text-base" />,
    bg: "bg-purple-50 text-purple-600",
    dot: "bg-purple-500",
  },
  payment: {
    icon: <HiOutlineCash className="text-base" />,
    bg: "bg-amber-50 text-amber-600",
    dot: "bg-amber-500",
  },
  announcement: {
    icon: <HiOutlineSpeakerphone className="text-base" />,
    bg: "bg-pink-50 text-pink-600",
    dot: "bg-pink-500",
  },
  system: {
    icon: <HiOutlineCog className="text-base" />,
    bg: "bg-gray-50 text-gray-500",
    dot: "bg-gray-400",
  },
  poll: {
    icon: <HiOutlineChartBar className="text-base" />,
    bg: "bg-[#EB5017]/10 text-[#EB5017]",
    dot: "bg-[#EB5017]",
  },
};

// ─── Main Component ────────────────────────────────────────────────────
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread" | "ticket" | "attendee" | "payment">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    return n.type === filter;
  });

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleMarkRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <div className="space-y-8 pb-20 font-sans">
      {/* Back */}
      <div className="px-2">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#EB5017] transition-all group"
        >
          <FaAngleLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
          Back to Events
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-[#eb5017] uppercase tracking-[0.2em]">Activity Feed</p>
          <h2 className="text-3xl font-black text-[#1B1818] tracking-tight">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-3 inline-flex items-center justify-center bg-[#EB5017] text-white text-xs font-black w-7 h-7 rounded-full align-middle">
                {unreadCount}
              </span>
            )}
          </h2>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-[#1B1818] px-5 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95 shrink-0"
          >
            <HiOutlineCheck className="text-sm text-[#EB5017]" />
            Mark All Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {(
          [
            { key: "all", label: "All" },
            { key: "unread", label: "Unread" },
            { key: "ticket", label: "Tickets" },
            { key: "attendee", label: "Attendees" },
            { key: "payment", label: "Payments" },
          ] as const
        ).map((f) => {
          const count =
            f.key === "all"
              ? notifications.length
              : f.key === "unread"
              ? unreadCount
              : notifications.filter((n) => n.type === f.key).length;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === f.key
                  ? "bg-[#1B1818] text-white shadow-lg"
                  : "bg-white border border-gray-100 text-gray-400 hover:border-gray-200"
              }`}
            >
              {f.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center space-y-3">
            <HiOutlineSpeakerphone className="text-4xl text-gray-200 mx-auto" />
            <p className="font-black text-sm text-gray-300 uppercase tracking-wider">No notifications</p>
            <p className="text-xs text-gray-300">You&apos;re all caught up!</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const config = typeConfig[notification.type] || typeConfig.system;
            return (
              <div
                key={notification.id}
                onClick={() => handleMarkRead(notification.id)}
                className={`group flex items-start gap-4 p-5 rounded-2xl border transition-all duration-200 cursor-pointer hover:shadow-md ${
                  notification.read
                    ? "bg-white border-gray-100"
                    : "bg-[#EB5017]/[0.02] border-[#EB5017]/10 shadow-sm"
                }`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.bg} group-hover:scale-110 transition-transform`}>
                  {config.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    {!notification.read && (
                      <span className={`w-2 h-2 rounded-full ${config.dot} shrink-0`} />
                    )}
                    <h4 className={`text-sm tracking-tight truncate ${notification.read ? "font-bold text-gray-600" : "font-black text-[#1B1818]"}`}>
                      {notification.title}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-400 font-medium truncate">{notification.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    {notification.actor && (
                      <div className="flex items-center gap-1.5">
                        <Avatar name={notification.actor} />
                        <span className="text-[10px] font-bold text-gray-500">{notification.actor}</span>
                      </div>
                    )}
                    <span className="text-[10px] font-bold text-gray-300">{notification.time}</span>
                  </div>
                </div>

                {/* Amount badge */}
                {notification.amount && (
                  <div className="shrink-0 text-right">
                    <span
                      className={`text-sm font-black ${
                        notification.amount.startsWith("-")
                          ? "text-red-500"
                          : "text-green-600"
                      }`}
                    >
                      {notification.amount}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
