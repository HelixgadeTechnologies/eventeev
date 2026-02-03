"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { HiOutlineCog, HiOutlinePuzzlePiece, HiOutlineChatBubbleLeftRight, HiOutlineShare, HiOutlineCreditCard } from "react-icons/hi2";

const settingsNav = [
  {
    name: "General Event",
    href: "",
    icon: HiOutlineCog,
  },
  {
    name: "Game Settings",
    href: "/games",
    icon: HiOutlinePuzzlePiece,
  },
  {
    name: "Chat Settings",
    href: "/chat",
    icon: HiOutlineChatBubbleLeftRight,
  },
  {
    name: "Integrations",
    href: "/integrations",
    icon: HiOutlineShare,
  },
  {
    name: "Payment Settings",
    href: "/payments",
    icon: HiOutlineCreditCard,
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const eventId = params._id;

  return (
    <div className="flex bg-white rounded-2xl border border-gray-100 h-[calc(100vh-140px)] overflow-hidden shadow-sm font-sans max-w-[1400px] mx-auto">
      {/* Internal Settings Sidebar */}
      <aside className="w-60 border-r border-gray-100 p-6 flex flex-col gap-6 flex-none bg-white">
        <div>
          <h2 className="text-lg font-bold text-[#1B1818] tracking-tight">Master Settings</h2>
          <p className="text-[11px] font-medium text-[#B28A6A] mt-0.5">Configure your global platform</p>
        </div>

        <nav className="flex flex-col gap-1">
          {settingsNav.map((item) => {
            const fullHref = `/events/${eventId}/settings${item.href}`;
            const isActive = pathname === fullHref || (item.href === "" && pathname === `/events/${eventId}/settings`);
            
            return (
              <Link
                key={item.name}
                href={fullHref}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? "bg-[#FFF2F0] text-[#EB5017]" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-[#1B1818]"
                }`}
              >
                <item.icon className={`text-xl ${isActive ? "text-[#EB5017]" : "text-gray-900 group-hover:text-[#1B1818]"}`} />
                <span className={`text-sm font-bold ${isActive ? "text-[#EB5017]" : ""}`}>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-white overflow-hidden">
        {children}
      </main>
    </div>
  );
}
