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
    <div className="bg-white border border-gray-100 rounded-[20px] p-6 flex flex-col justify-between h-[160px] shadow-sm relative overflow-hidden">
      <div className="flex justify-between items-start z-10">
        <div>
          <p className="text-[11px] font-black text-[#888888] uppercase tracking-wider mb-2">{title}</p>
          <h3 className="text-3xl font-black text-[#1B1818] tracking-tight">{value}</h3>
           <div className="flex items-center gap-1 mt-1">
             <span className={`text-[11px] font-bold ${trendUp ? "text-[#027A48]" : "text-[#D92D20]"}`}>
               {trendUp ? "↑" : "↓"} {trend}
             </span>
           </div>
        </div>
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${chartHeaderColor}20`, color: chartHeaderColor }}
        >
          {icon}
        </div>
      </div>

      <div className="absolute bottom-0 right-0 w-32 h-16">
         <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartHeaderColor} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={chartHeaderColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={chartHeaderColor} 
                strokeWidth={2}
                fill={`url(#gradient-${title})`} 
              />
            </AreaChart>
         </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatsCard;
