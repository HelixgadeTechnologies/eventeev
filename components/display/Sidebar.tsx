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

export default function Sidebar() {
  const pathname = usePathname();
  const { mobileOpen, closeMobile } = useSidebar();

  const isEventRoute = (pathname: string) => {
    const pattern = /^\/user\/events\/[^/]+\/[^/]+$/;
    return pattern.test(pathname);
  };

  const eventId = pathname.match(/^\/user\/events\/([^/]+)/)?.[1] || "";

  const currentNavGroup = isEventRoute(pathname)
    ? topNavigations
    : eventNavigations;

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
        <Link href="/" className="flex justify-start mt-2.5">
          <Image
            src="/logo-black.svg"
            alt="Eventeev Logo"
            width={150}
            height={50}
            className="mb-6 object-cover"
            priority={true}
          />
        </Link>

        {/* top navigations */}
        <section className="flex flex-col justify-between h-full w-full">
          <div className="space-y-1 border-b border-gray-200 pb-2">
            {currentNavGroup.map((nav, index) => {
              const actualHref = nav.href.replace(":id", eventId);
              const isActive = pathname.startsWith(actualHref);
              const icon = isActive ? nav.iconActive : nav.iconInactive;

              return (
                <Link
                  key={index}
                  href={actualHref}
                  onClick={closeMobile}
                  className={`h-11 w-full px-4 py-2 rounded-[4px] flex items-center gap-2 ${
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

          <div className="space-y-1">
            {bottomNavigations.map((nav, index) => {
              const isActive = pathname.startsWith(nav.href);
              const icon = isActive ? nav.iconActive : nav.iconInactive;
              return (
                <Link
                  key={index}
                  href={nav.href}
                  className={`h-11 w-full px-4 py-2 rounded-[4px] flex items-center gap-2 ${
                    isActive
                      ? "bg-[FFECE5] text-black"
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
        <footer></footer>
      </aside>
    </>
  );
}
