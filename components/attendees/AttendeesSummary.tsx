import React from "react";
import { Users, UserCheck, Clock } from "lucide-react";
import SummaryCard from "../ui/SummaryCard";

const AttendeesSummary = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-in fade-in slide-in-from-top-8 duration-1000">
      <SummaryCard 
        label="Global Attendees" 
        value="1,569" 
        icon={<Users size={22} />} 
        trend="+12%" 
        trendLabel="vs last month" 
      />
      <SummaryCard 
        label="Verified Access" 
        value="850" 
        icon={<UserCheck size={22} />} 
        trend="+8%" 
        trendLabel="Active check-ins" 
      />
      <SummaryCard 
        label="Recent Activity" 
        value="350" 
        icon={<Clock size={22} />} 
        trend="Live" 
        trendLabel="Last 30 Mins" 
      />
    </div>
  );
};


export default AttendeesSummary;

