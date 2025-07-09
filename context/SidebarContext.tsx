"use client";

// if using collapsed state, import useEffect
import { createContext, useContext, useState } from "react";

type SidebarContextType = {
//   collapsed: boolean;
//   toggleCollapse: () => void;
//   setCollapsed: (val: boolean) => void;
  mobileOpen: boolean;
  openMobile: () => void;
  closeMobile: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
//   const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Persist to localStorage
//   useEffect(() => {
//     const saved = localStorage.getItem("sidebar-collapsed");
//     if (saved) setCollapsed(saved === "true");
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("sidebar-collapsed", String(collapsed));
//   }, [collapsed]);

//   const toggleCollapse = () => setCollapsed((prev) => !prev);
  const openMobile = () => setMobileOpen(true);
  const closeMobile = () => setMobileOpen(false);

  return (
    <SidebarContext.Provider value={{ 
        // collapsed, 
        // toggleCollapse, 
        // setCollapsed, 
        mobileOpen, 
        openMobile, 
        closeMobile 
    }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within SidebarProvider");
  return context;
};