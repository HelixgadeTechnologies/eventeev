"use client";

import React, { useState, useEffect } from "react";
import { Users, Calendar, Clock, Loader2 } from "lucide-react";
import SummaryCard from "../ui/SummaryCard";
import { useParams } from "next/navigation";
import { speakersService } from "@/lib/services/speakers.service";

import { SpeakerDataType } from "@/lib/demo-data/speakers";

interface SpeakersSummaryProps {
  speakers?: SpeakerDataType[];
  loading?: boolean;
}

const SpeakersSummary = ({ speakers, loading: externalLoading }: SpeakersSummaryProps) => {
  const params = useParams();
  const eventId = params?._id as string;
  
  const [internalStats, setInternalStats] = useState({
    totalSpeakers: 0,
    totalTopics: 0,
    totalSessions: 0
  });
  const [internalLoading, setInternalLoading] = useState(speakers === undefined);

  useEffect(() => {
    // If speakers were passed from parent component, compute directly
    if (speakers !== undefined) {
      const totalSpeakers = speakers.length;
      const uniqueTopics = new Set(speakers.map(s => s.topic).filter(Boolean)).size;
      setInternalStats({
        totalSpeakers,
        totalTopics: uniqueTopics,
        totalSessions: totalSpeakers,
      });
      return;
    }

    if (!eventId) return;
    let isMounted = true;

    const fetchStats = async () => {
      setInternalLoading(true);
      const { data } = await speakersService.getSpeakerStats(eventId);
      if (isMounted && data) {
        setInternalStats(data);
      }
      if (isMounted) {
        setInternalLoading(false);
      }
    };

    fetchStats();
    return () => {
      isMounted = false;
    };
  }, [eventId, speakers]);

  const isLoading = externalLoading !== undefined ? externalLoading : internalLoading;

  if (isLoading) {
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

  const hoursDisplay = internalStats.totalSpeakers > 0 
    ? `${Math.max(1, Math.round(internalStats.totalSpeakers * 1.5))} hrs` 
    : '0 hrs';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SummaryCard 
        label="Total Speakers" 
        value={internalStats.totalSpeakers.toString()} 
        icon={<Users size={20} />} 
        trendLabel="Active profiles" 
      />
      <SummaryCard 
        label="Sessions Scheduled" 
        value={internalStats.totalSessions.toString()} 
        icon={<Calendar size={20} />} 
        trendLabel="Healthy" 
      />
      <SummaryCard 
        label="Total Speaker Hours" 
        value={hoursDisplay} 
        icon={<Clock size={20} />} 
        trendLabel="Scheduled time" 
      />
    </div>
  );
};

export default SpeakersSummary;
