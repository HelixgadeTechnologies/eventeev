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
  <div className={`bg-white border border-gray-100 rounded-[16px] p-6 flex flex-col justify-between h-[140px] shadow-sm ${className}`}>
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <h3 className="text-3xl font-bold text-[#101828]">{value}</h3>
      </div>
      <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-500">
        {icon}
      </div>
    </div>
    {(trend || trendLabel) && (
      <div className="flex items-center gap-2 text-xs font-medium">
        {trend && (
          <span className="bg-[#ECFDF3] text-[#027A48] px-1.5 py-0.5 rounded flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.5 7.5L3.5 5.5L5 7L8.5 3.5M8.5 3.5H6.5M8.5 3.5V5.5" stroke="#12B76A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {trend}
          </span>
        )}
        {trendLabel && <span className="text-gray-500">{trendLabel}</span>}
      </div>
    )}
  </div>
);

export default SummaryCard;
