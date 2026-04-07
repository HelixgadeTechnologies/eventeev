"use client";

import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useParams } from "next/navigation";
import { ticketsService, ApiTicket } from "@/lib/services/tickets.service";
import { attendeesService } from "@/lib/services/attendees.service";
import { Loader2 } from "lucide-react";

const data = [
  { name: "Week 1", revenue: 4000 },
  { name: "Week 1.5", revenue: 3000 },
  { name: "Week 2", revenue: 5000 },
  { name: "Week 2.5", revenue: 4500 },
  { name: "Week 3", revenue: 8000 },
  { name: "Week 3.5", revenue: 7000 },
  { name: "Week 4", revenue: 9500 },
];

const ProgressBar = ({ label, percentage, color }: { label: string; percentage: number; color: string }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-xs font-bold text-[#1B1818]">
      <span className="uppercase tracking-widest">{label}</span>
      <span>{percentage}%</span>
    </div>
    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
      <div 
        className="h-full rounded-full transition-all duration-1000" 
        style={{ width: `${percentage}%`, backgroundColor: color }}
      />
    </div>
  </div>
);

const SalesAttendance = () => {
  const params = useParams();
  const eventId = params?._id as string;
  
  const [tickets, setTickets] = useState<ApiTicket[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (eventId) {
      fetchAnalytics();
    }
  }, [eventId]);

  const fetchAnalytics = async () => {
    setLoading(true);
    const [ticketsRes, statsRes] = await Promise.all([
      ticketsService.getTickets(eventId),
      attendeesService.getAttendeeStats(eventId)
    ]);
    
    if (ticketsRes.data) setTickets(ticketsRes.data);
    if (statsRes.data) setStats(statsRes.data);
    setLoading(false);
  };

  const ticketStats = React.useMemo(() => {
    if (!tickets.length || !stats) return { paid: 0, free: 0, donation: 0 };
    
    const total = stats.totalAttendees || 1; // Avoid division by zero
    // Ideally we'd have attendee counts per tier. For now, we'll use the quantity distributed.
    const paid = tickets.filter(t => t.type === 'paid').reduce((acc, t) => acc + (t.quantity || 0), 0);
    const free = tickets.filter(t => t.type === 'free').reduce((acc, t) => acc + (t.quantity || 0), 0);
    const donation = tickets.filter(t => t.type === 'donation').reduce((acc, t) => acc + (t.quantity || 0), 0);
    
    return {
      paid: Math.round((paid / total) * 100),
      free: Math.round((free / total) * 100),
      donation: Math.round((donation / total) * 100),
    };
  }, [tickets, stats]);

  if (loading) {
    return (
      <div className="bg-white border border-gray-100 rounded-[24px] p-12 shadow-sm flex flex-col items-center justify-center space-y-4 min-h-[300px]">
        <Loader2 className="w-10 h-10 text-[#EB5017] animate-spin" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Loading Analytics...</p>
      </div>
    );
  }
  return (
    <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-base font-bold text-[#1B1818]">Sales & Attendance</h2>
          <p className="text-xs text-gray-400 font-medium">Daily trend performance across all venues</p>
        </div>
        <button className="text-[#EB5017] text-xs font-bold hover:underline">Export Details</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Chart Area */}
        <div className="flex-1 min-h-[250px]">
           <p className="text-[10px] font-black text-[#B28A6A] uppercase tracking-widest mb-3">Revenue Growth Trend</p>
           <ResponsiveContainer width="100%" height={260}>
             <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
               <defs>
                 <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#EB5017" stopOpacity={0.2}/>
                   <stop offset="95%" stopColor="#EB5017" stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <CartesianGrid vertical={false} stroke="#F2F4F7" strokeDasharray="3 3" />
               <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#98A2B3', fontWeight: 600 }} 
                dy={10}
               />
               <YAxis hide />
               <Tooltip 
                 contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                 itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#EB5017' }}
               />
               <Area 
                 type="monotone" 
                 dataKey="revenue" 
                 stroke="#EB5017" 
                 strokeWidth={3}
                 fillOpacity={1} 
                 fill="url(#colorRevenue)" 
               />
             </AreaChart>
           </ResponsiveContainer>
        </div>

        {/* Ticket Types - Right Side */}
        <div className="w-full lg:w-1/2 lg:border-l lg:border-gray-50 lg:pl-5 flex flex-col gap-5 pt-3">
           <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest mb-1">Ticket Distribution %</p>
           
           <ProgressBar label="Paid" percentage={ticketStats.paid} color="#EB5017" />
           <ProgressBar label="Free" percentage={ticketStats.free} color="#E06C00" />
           <ProgressBar label="Donation" percentage={ticketStats.donation} color="#E3A021" />
        </div>
      </div>
    </div>
  );
};

export default SalesAttendance;
