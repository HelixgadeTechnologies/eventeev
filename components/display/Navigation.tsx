"use client";

import Avatar from "@/components/ui/Avatar";
import NotificationsComponent from "@/components/ui/NotificationsTab";
import { FiMenu } from "react-icons/fi";
import { useSidebar } from "@/context/SidebarContext";

export default function Navigation() {
    const { openMobile } = useSidebar();
    return (
        <div className="flex justify-end items-center gap-1.5 md:gap-3 bg-white px-4 md:px-6 py-2 md:py-3">
          <NotificationsComponent />
          <Avatar src="" name="Richard Edem" />
          <FiMenu onClick={openMobile} className="text-xl md:hidden" />
        </div>
    )
}