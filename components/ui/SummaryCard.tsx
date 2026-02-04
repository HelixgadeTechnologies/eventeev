import React from "react";

interface SummaryCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendLabel?: string;
  className?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ 
  label, 
  value, 
  icon, 
  trend, 
  trendLabel,
  className = ""
}) => (
  <div className={`bg-white/95 backdrop-blur-xl border border-gray-100 rounded-[32px] p-8 flex justify-between items-center gap-4 shadow-sm hover:shadow-xl transition-all duration-500 group ${className}`}>
    <div className="flex flex-col flex-1">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none mb-3">{label}</p>
      <h3 className="text-3xl font-black text-[#1B1818] tracking-tighter leading-none mb-3">{value}</h3>
      {(trend || trendLabel) && (
        <div className="flex items-center gap-2">
          {trend && (
            <div className="flex items-center gap-0.5 text-[#26890C] font-black text-[10px]">
              <span className="bg-[#26890C]/10 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.5 7.5L3.5 5.5L5 7L8.5 3.5M8.5 3.5H6.5M8.5 3.5V5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {trend}
              </span>
            </div>
          )}
          {trendLabel && <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{trendLabel}</span>}
        </div>
      )}
    </div>
    <div className="h-14 w-14 rounded-2xl flex justify-center items-center bg-gray-50/80 border border-gray-100 group-hover:scale-110 group-hover:bg-white transition-all duration-500 shadow-sm">
      <div className="text-gray-400 group-hover:text-[#EB5017] transition-colors duration-500">
        {icon}
      </div>
    </div>
  </div>
);


export default SummaryCard;
