"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface TabType {
  tabName: string;
  id: number;
  icon?: React.ReactNode;
}

type TabProps = {
  data: Array<TabType>;
  renderContent?: (activeTabId: number) => React.ReactNode;
  width?: string;
};

export default function TabComponent({ 
    data,
    renderContent,
    width,
 }: TabProps) {

  const [activeTab, setActiveTab] = useState(1);
  const handleTabChange = (index: number) => {
    setActiveTab(index);
  }

  return (
    <div className="w-full space-y-8">
      {/* Premium Tabs Container */}
      <div className="flex justify-center">
        <div className={`${width ? `w-${width}` : 'w-full max-w-2xl'} p-1.5 bg-white/50 backdrop-blur-md border border-gray-100 rounded-full shadow-sm flex items-center gap-1 overflow-x-auto no-scrollbar`}>
          {data.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative flex-1 flex items-center justify-center gap-2.5 h-10 px-6 rounded-full transition-all duration-300 group ${
                  isActive ? "text-white" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-[#EB5017] rounded-full shadow-lg shadow-[#EB5017]/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className={`relative z-10 text-lg transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {tab.icon}
                </span>
                <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.15em] whitespace-nowrap">
                  {tab.tabName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Animated Content Layer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="min-h-[400px]"
        >
          {renderContent?.(activeTab)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}