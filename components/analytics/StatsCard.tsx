"use client";
import React from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface StatsCardProps {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: React.ReactNode;
  data: { value: number }[];
  chartHeaderColor: string; // Hex for chart and icon
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, trend, trendUp, icon, data, chartHeaderColor }) => {
  return (
    <div className="bg-white/95 backdrop-blur-xl border border-gray-100 rounded-[32px] p-6 flex flex-col justify-between h-[170px] shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
      <div className="flex justify-between items-start z-10">
        <div className="space-y-3">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none mb-1">{title}</p>
          <h3 className="text-2xl font-black text-[#1B1818] tracking-tighter leading-none">{value}</h3>

           <div className="flex items-center gap-1.5 pt-1">
             <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${trendUp ? "text-[#26890C]" : "text-[#D92D20]"}`}>
               <span className="bg-current opacity-10 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                 {trendUp ? "↑" : "↓"} {trend}
               </span>
             </span>
           </div>
        </div>
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:scale-110 transition-all duration-500 shadow-sm shadow-black/5"
          style={{ backgroundColor: `${chartHeaderColor}10`, color: chartHeaderColor }}
        >
          {icon}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 opacity-40 group-hover:opacity-60 transition-opacity duration-700">
         <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartHeaderColor} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={chartHeaderColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={chartHeaderColor} 
                strokeWidth={3}
                fill={`url(#gradient-${title})`} 
                animationDuration={2000}
              />
            </AreaChart>
         </ResponsiveContainer>
      </div>
    </div>
  );
};


export default StatsCard;
