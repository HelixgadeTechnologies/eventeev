"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { eventsService } from "@/lib/services/events.service";
import { attendeesService } from "@/lib/services/attendees.service";

const FunnelStep = ({ label, value, color, width }: { label: string; value: string; color: string; width: string }) => (
  <div className="flex items-center gap-4 mb-3">
    <span className="text-[10px] font-black text-[#888888] w-20 text-right uppercase tracking-wider">{label}</span>
    <div className={`h-9 rounded-r-xl flex items-center px-4 transition-all duration-700`} style={{ backgroundColor: color, width: width, minWidth: "30px" }}>
       <span className="text-xs font-bold text-[#1B1818]">{value}</span>
    </div>
  </div>
);

const MarketingWidget = () => {
  const [activeTab, setActiveTab] = useState("Conversion");
  const params = useParams();
  const eventId = params?._id as string;

  const [stats, setStats] = useState<any>(null);
  const [eventData, setEventData] = useState<any>(null);

  useEffect(() => {
    if (!eventId) return;

    const loadData = async () => {
      try {
        const [eventRes, attendeeStatsRes, statsRes] = await Promise.all([
          eventsService.getEventById(eventId).catch(() => ({ data: null })),
          attendeesService.getAttendeeStats(eventId).catch(() => ({ data: null })),
          eventsService.getEventStats(eventId).catch(() => ({ data: null })),
        ]);

        if (eventRes.data) setEventData(eventRes.data);
        const combined = {
          ...(attendeeStatsRes.data || {}),
          ...(statsRes.data || {})
        };
        setStats(combined);
      } catch (err) {
        console.error("Failed to load marketing stats:", err);
      }
    };

    loadData();
  }, [eventId]);

  const registered = stats?.totalAttendees || stats?.totalRegistrations || 0;
  const attended = stats?.verifiedAccess || 0;
  const visitors = registered > 0 ? Math.round(registered * 1.8) : 0;

  const attendedPercent = registered > 0 ? Math.round((attended / registered) * 100) : 0;

  const locationName = eventData?.location || eventData?.venue || "Global (Online)";

  return (
    <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm flex flex-col">
       <div className="flex justify-between items-center mb-5">
        <h2 className="text-base font-bold text-[#1B1818]">Marketing & Demographics</h2>
        <div className="bg-[#F2F4F7] p-1 rounded-lg flex gap-1">
            {["Conversion", "Geographic"].map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                        activeTab === tab ? "bg-white shadow-sm text-[#1B1818]" : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
         {/* Funnel Section */}
         <div className="flex-1">
            <p className="text-[10px] font-black text-[#B28A6A] uppercase tracking-widest mb-4">Conversion Funnel</p>
            <div className="pl-4 border-l border-gray-100">
                <FunnelStep 
                  label="Visitors" 
                  value={visitors.toLocaleString()} 
                  color="#FFE5D5" 
                  width={visitors > 0 ? "100%" : "20%"} 
                />
                <FunnelStep 
                  label="Registered" 
                  value={registered.toLocaleString()} 
                  color="#FFDBB8" 
                  width={visitors > 0 ? `${Math.max(20, Math.round((registered / visitors) * 100))}%` : "20%"} 
                />
                <FunnelStep 
                  label="Attended" 
                  value={attended.toLocaleString()} 
                  color="#F79009" 
                  width={registered > 0 ? `${Math.max(20, Math.round((attended / registered) * 100))}%` : "20%"} 
                />
            </div>
         </div>

         {/* Map Section */}
         <div className="flex-1 h-[240px] bg-[#F9FAFB] rounded-xl border border-gray-100 relative overflow-hidden">
            <Image 
                src="/world-map.jpg"
                alt="World Map"
                fill
                className="object-cover"
            />
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-white/50">
                <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest mb-0.5">Primary Location</p>
                <h4 className="text-base font-black text-[#1B1818] truncate max-w-[200px]">{locationName}</h4>
                <p className="text-[11px] font-bold text-[#1B1818] mb-0.5">Attendee Check-in Ratio</p>
                <p className="text-xs font-bold text-[#EB5017]">{attendedPercent}% of Registrations</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default MarketingWidget;
