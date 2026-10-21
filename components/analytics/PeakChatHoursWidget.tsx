"use client";

import React from "react";
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";

interface PeakChatHoursWidgetProps {
  data?: Array<{ time: string; value: number; active?: boolean }>;
}

const defaultData = [
  { time: "08:00", value: 0, active: false },
  { time: "10:00", value: 0, active: false },
  { time: "12:00", value: 0, active: false },
  { time: "14:00", value: 0, active: false },
  { time: "16:00", value: 0, active: false },
  { time: "18:00", value: 0, active: false },
  { time: "20:00", value: 0, active: false },
];

const PeakChatHoursWidget: React.FC<PeakChatHoursWidgetProps> = ({ data = defaultData }) => {
  const hasActivity = data.some(d => d.value > 0);
  const peakItem = [...data].sort((a, b) => b.value - a.value)[0];

  return (
    <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-[13px] font-black text-[#B28A6A] uppercase tracking-widest">PEAK CHAT HOURS</h2>
          {hasActivity && peakItem && peakItem.value > 0 && (
            <p className="text-[11px] text-gray-500 font-medium">
              Busiest at <span className="font-bold text-[#F79009]">{peakItem.time}</span> ({peakItem.value} msgs)
            </p>
          )}
        </div>
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{hasActivity ? "Live" : "No Activity"}</span>
      </div>
      
      <div className="flex-1 w-full min-h-[140px] overflow-hidden">
         <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <Tooltip 
                cursor={{ fill: '#F9FAFB' }}
                contentStyle={{ borderRadius: '12px', border: '1px solid #F2F4F7', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                formatter={(val: any) => [`${val} messages`, "Chat Volume"]}
              />
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#8D6950', fontWeight: 800 }}
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
