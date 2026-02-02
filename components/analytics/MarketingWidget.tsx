"use client";

import React, { useState } from "react";
import Image from "next/image";

const FunnelStep = ({ label, value, color, width }: { label: string; value: string; color: string; width: string }) => (
  <div className="flex items-center gap-4 mb-4">
    <span className="text-[10px] font-black text-[#888888] w-20 text-right uppercase tracking-wider">{label}</span>
    <div className={`h-10 rounded-r-full flex items-center px-4`} style={{ backgroundColor: color, width: width }}>
       <span className="text-sm font-bold text-[#1B1818]">{value}</span>
    </div>
  </div>
);

const MarketingWidget = () => {
    const [activeTab, setActiveTab] = useState("Conversion");

  return (
    <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm h-full flex flex-col">
       <div className="flex justify-between items-center mb-8">
        <h2 className="text-base font-bold text-[#1B1818]">Marketing & Demographics</h2>
        <div className="bg-[#F2F4F7] p-1 rounded-lg flex gap-1">
            {["Conversion", "Geographic"].map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                        activeTab === tab ? "bg-white shadow-sm text-[#1B1818]" : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
         {/* Funnel Section */}
         <div className="flex-1">
            <p className="text-[10px] font-black text-[#B28A6A] uppercase tracking-widest mb-6">Conversion Funnel</p>
            <div className="pl-4 border-l border-gray-100">
                <FunnelStep label="Visitors" value="142,500" color="#FFE5D5" width="100%" />
                <FunnelStep label="Registered" value="45,200" color="#FFDBB8" width="60%" />
                <FunnelStep label="Attended" value="18,540" color="#F79009" width="35%" />
            </div>
         </div>

         {/* Map Section Placeholder */}
         <div className="flex-1 h-[240px] bg-[#F9FAFB] rounded-xl border border-gray-100 relative overflow-hidden">
            <Image 
                src="/world-map.jpg"
                alt="World Map"
                fill
                className="object-cover"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/50">
                <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest mb-1">Top Region</p>
                <h4 className="text-lg font-black text-[#1B1818]">North America</h4>
                <p className="text-[11px] font-bold text-[#1B1818] mb-0.5">United States, New York</p>
                <p className="text-xs font-bold text-[#EB5017]">42% of Total</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default MarketingWidget;
