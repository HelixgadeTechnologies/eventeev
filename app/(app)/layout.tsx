"use client";

import Sidebar from "@/components/display/Sidebar";
import Navigation from "@/components/display/Navigation";
import Breadcrumb from "@/components/ui/BreadcrumbComponent";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Routes that should be full-screen (game playback)
  const isGameView = pathname.includes("/games/") && (
    pathname.includes("/play") || 
    pathname.includes("/results") || 
    pathname.includes("/leaderboard") ||
    pathname.includes("/intro")
  );

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#F56630] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-black text-[#1B1818] uppercase tracking-widest animate-pulse">Verifying Session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  if (isGameView) {
    return (
      <div className="min-h-screen bg-[#F8F7F5]">
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-64 flex-none transition-all duration-300 ease-in-out">
        <Sidebar />
      </div>

      {/* Main content */}
      <section className="flex-grow flex flex-col overflow-hidden">
        <Navigation />
        <div className="flex-grow overflow-y-auto p-6 bg-gray-50">
          <Breadcrumb />
          <div className="my-5">
            {children}
          </div>
        </div>
      </section>
    </div>
  );
}
