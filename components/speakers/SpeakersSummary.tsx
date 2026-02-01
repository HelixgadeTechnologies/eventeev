import React from "react";
import { Users, Calendar, Clock } from "lucide-react";
import SummaryCard from "../ui/SummaryCard";

const SpeakersSummary = () => {
  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      <SummaryCard 
        label="Total Speakers" 
        value="8" 
        icon={<Users size={20} />} 
        trend="0%" 
        trendLabel="Increase" 
      />
      <SummaryCard 
        label="Sessions Scheduled" 
        value="42" 
        icon={<Calendar size={20} />} 
        trend="0%" 
        trendLabel="Healthy" 
      />
      <SummaryCard 
        label="Total Speaker Hours" 
        value="4 hours" 
        icon={<Clock size={20} />} 
        trend="0%" 
        trendLabel="Recent Activity" 
      />
    </div>
  );
};

export default SpeakersSummary;
