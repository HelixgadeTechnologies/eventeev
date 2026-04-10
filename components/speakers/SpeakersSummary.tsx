"use client";

import React, { useState, useEffect } from "react";
import { Users, Calendar, Clock, Loader2 } from "lucide-react";
import SummaryCard from "../ui/SummaryCard";
import { useParams } from "next/navigation";
import { speakersService } from "@/lib/services/speakers.service";

const SpeakersSummary = () => {
  const params = useParams();
  const eventId = params?._id as string;
  
  const [stats, setStats] = useState({
    totalSpeakers: 0,
    totalTopics: 0,
    totalSessions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!eventId) return;
      setLoading(true);
      const { data, error } = await speakersService.getSpeakerStats(eventId);
      if (!error && data) {
        setStats(data);
      }
      setLoading(false);
    };

    fetchStats();
  }, [eventId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-700">
        <div className="bg-white/50 backdrop-blur-sm rounded-[32px] h-[120px] flex items-center justify-center border border-gray-100">
          <Loader2 className="w-6 h-6 text-[#EB5017] animate-spin" />
        </div>
        <div className="bg-white/50 backdrop-blur-sm rounded-[32px] h-[120px] flex items-center justify-center border border-gray-100">
          <Loader2 className="w-6 h-6 text-[#EB5017] animate-spin" />
        </div>
        <div className="bg-white/50 backdrop-blur-sm rounded-[32px] h-[120px] flex items-center justify-center border border-gray-100">
          <Loader2 className="w-6 h-6 text-[#EB5017] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SummaryCard 
        label="Total Speakers" 
        value={stats.totalSpeakers.toString()} 
        icon={<Users size={20} />} 
        trendLabel="Active profiles" 
      />
      <SummaryCard 
        label="Sessions Scheduled" 
        value={stats.totalSessions.toString()} 
        icon={<Calendar size={20} />} 
        trendLabel="Healthy" 
      />
      <SummaryCard 
        label="Total Speaker Hours" 
        value={`${stats.totalSpeakers / 2} hours`} // Placeholder logic for now
        icon={<Clock size={20} />} 
        trendLabel="Recent activity" 
      />
    </div>
  );
};

export default SpeakersSummary;
