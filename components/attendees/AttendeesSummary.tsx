import React, { useState, useEffect } from "react";
import { Users, UserCheck, Clock, Loader2 } from "lucide-react";
import SummaryCard from "../ui/SummaryCard";
import { useParams } from "next/navigation";
import { attendeesService } from "@/lib/services/attendees.service";

const AttendeesSummary = () => {
  const params = useParams();
  const eventId = params?._id as string;
  
  const [stats, setStats] = useState<{
    totalAttendees: number;
    checkedInCount: number;
    pendingCount: number;
  }>({
    totalAttendees: 0,
    checkedInCount: 0,
    pendingCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (eventId) {
      fetchStats();
    }
  }, [eventId]);

  const fetchStats = async () => {
    setLoading(true);
    const { data, error } = await attendeesService.getAttendeeStats(eventId);
    if (!error && data) {
      setStats({
        totalAttendees: data.totalAttendees || 0,
        checkedInCount: data.verifiedAccess || 0,
        pendingCount: (data.totalAttendees || 0) - (data.verifiedAccess || 0)
      });
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 h-32 items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#EB5017] animate-spin mx-auto col-span-3" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-in fade-in slide-in-from-top-8 duration-1000">
      <SummaryCard 
        label="Total Attendees" 
        value={stats.totalAttendees.toLocaleString()} 
        icon={<Users size={22} />} 
        trendLabel="Registered" 
      />
      <SummaryCard 
        label="Verified Access" 
        value={stats.checkedInCount.toLocaleString()} 
        icon={<UserCheck size={22} />} 
        trendLabel="Active check-ins" 
      />
      <SummaryCard 
        label="Pending Check-in" 
        value={stats.pendingCount.toLocaleString()} 
        icon={<Clock size={22} />} 
        trendLabel="Awaiting verification" 
      />
    </div>
  );
};


export default AttendeesSummary;

