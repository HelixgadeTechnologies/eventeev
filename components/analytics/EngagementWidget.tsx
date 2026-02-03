"use client";
import React from "react";
import { MoreVertical } from "lucide-react";

interface WinnerStat {
  rank: number;
  name: string;
  score: string;
  color: string;
}

const winners: WinnerStat[] = [
  { rank: 1, name: "Alex Johnson", score: "2,450 pts", color: "#FFF2F0" },
  { rank: 2, name: "Sarah Williams", score: "2,110 pts", color: "#FFF8F2" },
  { rank: 3, name: "David Chen", score: "1,890 pts", color: "#F9FAFB" },
];

const EngagementWidget = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base font-bold text-[#1B1818]">Engagement & Games</h2>
        <button className="text-gray-400 hover:text-[#EB5017]"><MoreVertical size={20} /></button>
      </div>

      <p className="text-[10px] font-black text-[#B28A6A] uppercase tracking-widest mb-4">Top 3 Winners</p>
      
      <div className="space-y-4 flex-1">
        {winners.map((winner) => (
          <div key={winner.rank} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-[#EB5017]"
                style={{ backgroundColor: winner.color }}
              >
                {winner.rank}
              </div>
              <span className="text-sm font-bold text-[#1B1818]">{winner.name}</span>
            </div>
            <span className="text-xs font-bold text-gray-400">{winner.score}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-[#FFF8F2] border border-[#FFD9B3] rounded-[16px] p-5">
        <div className="flex justify-between items-center mb-2">
           <span className="text-[10px] font-black text-[#EB5017] uppercase tracking-wide">Avg. Completion Rate</span>
           <span className="text-2xl font-black text-[#EB5017]">78%</span>
        </div>
        <div className="h-2 w-full bg-[#FFE5D5] rounded-full overflow-hidden">
          <div className="h-full bg-[#EB5017] w-[78%] rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default EngagementWidget;
