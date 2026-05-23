"use client";

import Image from "next/image";
import Link from "next/link";
import {
  bottomNavigations,
  eventNavigations,
  topNavigations,
} from "@/lib/demo-data/sidebar";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import Avatar from "@/components/ui/Avatar";
import { LuLogOut } from "react-icons/lu";
import { useAuth } from "@/context/AuthContext";
import { useEvent } from "@/context/EventContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { mobileOpen, closeMobile } = useSidebar();
  const { user, signOut } = useAuth();
  const { activePowerups } = useEvent();

  const isEventRoute = (pathname: string) => {
    const cleanPath = pathname.replace(/^\/[a-zA-Z]{2}/, "");
    return cleanPath.startsWith("/events/") && cleanPath.split("/").length > 3;
  };

  const match = pathname.match(/(?:\/[a-zA-Z]{2})?\/events\/([^/]+)/);
  const eventId = match ? match[1] : "";
  const dashboardHref = eventId ? `/events/${eventId}/dashboard` : "/dashboard";

  const filteredTopNavigations = topNavigations.filter((nav) => {
    if (!eventId) return true;
    return activePowerups.has(nav.name);
  });

  const currentNavGroup = isEventRoute(pathname)
    ? filteredTopNavigations
    : eventNavigations;

  const fullName = user ? `${user.firstName} ${user.lastName}` : "User";
  const email = user?.email || "";

  return (
    <>
      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeMobile}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-40 flex flex-col items-start p-4 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-all duration-300 ease-in-out`}
      >
        <Link href={dashboardHref} className="flex justify-start mt-2.5">
          <Image
            src="/logo-black.svg"
            alt="Eventeev Logo"
            width={150}
            height={50}
            className={`${isEventRoute(pathname) ? "mb-3" : "mb-6"} object-cover`}
            priority={true}
          />
        </Link>

        {isEventRoute(pathname) && (
          <Link
            href="/events"
            onClick={closeMobile}
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-black mb-4 px-1 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            Back to Events
          </Link>
        )}

        {/* top navigations */}
        <section className="flex flex-col justify-between h-full w-full">
          <div className="border-b border-gray-200 pb-2 space-y-1">
            {currentNavGroup.map((nav, index) => {
              const actualHref = nav.href.replace(":id", eventId);
              const isActive = pathname.startsWith(actualHref);
              const icon = isActive ? nav.iconActive : nav.iconInactive;

              return (
                <Link
                  key={index}
                  href={actualHref}
                  onClick={closeMobile}
                  className={`h-10 w-full px-4 py-2 rounded-[4px] flex items-center gap-2 ${
                    isActive
                      ? "bg-[#FFECE5] text-black"
                      : "hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  <Image src={icon} alt={nav.name} width={18} height={18} />
                  <span className="text-xs">{nav.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="">
            {bottomNavigations.map((nav, index) => {
              const actualHref = nav.href.replace(":id", eventId);
              const isActive = eventId ? pathname.startsWith(actualHref) : pathname.startsWith(nav.href);
              const icon = isActive ? nav.iconActive : nav.iconInactive;
              
              // If it's the settings link and we don't have an event context, 
              // we might want to hide it or point to a default settings page.
              // For now, if :id is in the href and we have no eventId, we'll use a placeholder or hide.
              if (nav.href.includes(":id") && !eventId) return null;

              return (
                <Link
                  key={index}
                  href={actualHref}
                  className={`h-10 w-full px-4 py-2 rounded-[4px] flex items-center gap-2 ${
                    isActive
                      ? "bg-[#FFECE5] text-black"
                      : "hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  <Image src={icon} alt={nav.name} width={18} height={18} />
                  <span className="text-xs">{nav.name}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* footer */}
        <footer className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-100 w-full">
          <Avatar name={fullName} />
          <div className="flex-1 overflow-hidden">
            <p className="text-[13px] font-semibold text-[#101928] truncate">{fullName}</p>
            <p className="text-[11px] font-normal text-[#475367] truncate">{email}</p>
          </div>
          <button 
            onClick={() => signOut()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Log out"
          >
            <LuLogOut className="text-xl text-gray-600" />
          </button>
        </footer>
      </aside>
    </>
  );
}
