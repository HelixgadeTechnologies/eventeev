"use client";

import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Week 1", revenue: 4000 },
  { name: "Week 1.5", revenue: 3000 },
  { name: "Week 2", revenue: 5000 },
  { name: "Week 2.5", revenue: 4500 },
  { name: "Week 3", revenue: 8000 },
  { name: "Week 3.5", revenue: 7000 },
  { name: "Week 4", revenue: 9500 },
];

const ProgressBar = ({ label, percentage, color }: { label: string; percentage: number; color: string }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-xs font-bold text-[#1B1818]">
      <span>{label}</span>
      <span>{percentage}%</span>
    </div>
    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
      <div 
        className="h-full rounded-full" 
        style={{ width: `${percentage}%`, backgroundColor: color }}
      />
    </div>
  </div>
);

const SalesAttendance = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-base font-bold text-[#1B1818]">Sales & Attendance</h2>
          <p className="text-xs text-gray-400 font-medium">Daily trend performance across all venues</p>
        </div>
        <button className="text-[#EB5017] text-xs font-bold hover:underline">Export Details</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Chart Area */}
        <div className="flex-1 min-h-[250px]">
           <p className="text-[10px] font-black text-[#B28A6A] uppercase tracking-widest mb-3">Revenue Growth Trend</p>
           <ResponsiveContainer width="100%" height={260}>
             <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
               <defs>
                 <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#EB5017" stopOpacity={0.2}/>
                   <stop offset="95%" stopColor="#EB5017" stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <CartesianGrid vertical={false} stroke="#F2F4F7" strokeDasharray="3 3" />
               <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#98A2B3', fontWeight: 600 }} 
                dy={10}
               />
               <YAxis hide />
               <Tooltip 
                 contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                 itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#EB5017' }}
               />
               <Area 
                 type="monotone" 
                 dataKey="revenue" 
                 stroke="#EB5017" 
                 strokeWidth={3}
                 fillOpacity={1} 
                 fill="url(#colorRevenue)" 
               />
             </AreaChart>
           </ResponsiveContainer>
        </div>

        {/* Ticket Types - Right Side */}
        <div className="w-full lg:w-1/2 lg:border-l lg:border-gray-50 lg:pl-5 flex flex-col gap-5 pt-3">
           <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest mb-1">Ticket Types %</p>
           
           <ProgressBar label="Paid" percentage={65} color="#EB5017" />
           <ProgressBar label="Free" percentage={25} color="#E06C00" />
           <ProgressBar label="Donation" percentage={10} color="#E3A021" />
        </div>
      </div>
    </div>
  );
};

export default SalesAttendance;
