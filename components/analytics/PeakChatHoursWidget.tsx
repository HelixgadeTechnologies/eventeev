"use client";

import React from "react";
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from "recharts";

const data = [
  { time: "08:00", value: 40, active: false },
  { time: "10:00", value: 65, active: false },
  { time: "12:00", value: 85, active: true },
  { time: "14:00", value: 100, active: true },
  { time: "16:00", value: 75, active: true },
  { time: "18:00", value: 50, active: false },
  { time: "20:00", value: 30, active: false },
];

const PeakChatHoursWidget = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-[24px] p-4 shadow-sm h-full flex flex-col">
      <h2 className="text-[13px] font-black text-[#B28A6A] uppercase tracking-widest mb-3">PEAK CHAT HOURS</h2>
      
      <div className="flex-1 w-full overflow-hidden">
         <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#8D6950', fontWeight: 800 }} // Brownish color for text
                ticks={['08:00', '12:00', '16:00', '20:00']}
                dy={5}
              />
              <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={32}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.active ? "#F79009" : "#FFE5D5"} 
                  />
                ))}
              </Bar>
            </BarChart>
         </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PeakChatHoursWidget;
