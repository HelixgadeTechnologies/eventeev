"use client";

import React from "react";
import { BarChart, Bar, ResponsiveContainer, Cell } from "recharts";

const data = [
  { name: "10am", value: 30 },
  { name: "11am", value: 45 },
  { name: "12pm", value: 70 },
  { name: "1pm", value: 100 }, // Peak
  { name: "2pm", value: 65 },
  { name: "3pm", value: 20 },
];

const topics = [
  { name: "Innovation", color: "#FFF2F0", text: "#EB5017" },
  { name: "Sustainability", color: "#F2F4F7", text: "#344054" },
  { name: "Networking", color: "#EB5017", text: "#FFFFFF" },
  { name: "Speaker Panel", color: "#F2F4F7", text: "#344054" },
  { name: "Tech Trends", color: "#FFF8F2", text: "#B28A6A" },
  { name: "Workshops", color: "#F2F4F7", text: "#344054" },
];

const ChatInteractionWidget = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm h-full flex flex-col">
       <div className="flex justify-between items-center mb-6">
        <h2 className="text-base font-bold text-[#1B1818]">Chat & Interaction</h2>
        <button className="text-[#EB5017] text-xs font-bold hover:underline">View Logs</button>
      </div>

      <div>
        <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest mb-4">Discussed Topics</p>
        <div className="flex flex-wrap gap-2">
            {topics.map((topic, idx) => (
                <span 
                key={idx}
                className="px-3 py-1.5 rounded-full text-[11px] font-bold"
                style={{ backgroundColor: topic.color, color: topic.text }}
                >
                {topic.name}
                </span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ChatInteractionWidget;
