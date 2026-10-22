"use client";

import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useParams } from "next/navigation";
import { ticketsService, ApiTicket } from "@/lib/services/tickets.service";
import { attendeesService } from "@/lib/services/attendees.service";
import { eventsService } from "@/lib/services/events.service";
import { Loader2 } from "lucide-react";

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

interface SalesAttendanceProps {
  tickets?: ApiTicket[];
  stats?: any;
  attendees?: any[];
  currency?: string;
  totalRevenue?: number;
}

const SalesAttendance: React.FC<SalesAttendanceProps> = ({
  tickets: propTickets,
  stats: propStats,
  attendees: propAttendees,
  currency = "USD",
  totalRevenue: propTotalRevenue
}) => {
  const params = useParams();
  const eventId = params?._id as string;
  
  const [internalTickets, setInternalTickets] = useState<ApiTicket[]>([]);
  const [internalStats, setInternalStats] = useState<any>(null);
  const [loading, setLoading] = useState(!propTickets && !propStats);

  const tickets = propTickets || internalTickets;
  const stats = propStats || internalStats;

  useEffect(() => {
    if (propTickets || propStats) {
      setLoading(false);
      return;
    }
    if (eventId) {
      fetchAnalytics();
    }
  }, [eventId, propTickets, propStats]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [ticketsRes, statsRes] = await Promise.all([
        ticketsService.getTickets(eventId),
        attendeesService.getAttendeeStats(eventId)
      ]);
      
      if (ticketsRes.data) setInternalTickets(ticketsRes.data);
      const combinedStats = statsRes.data || {};
      setInternalStats(combinedStats);
    } catch (e) {
      console.warn("Failed fetching internal analytics:", e);
    } finally {
      setLoading(false);
    }
  };

  const revenueData = React.useMemo(() => {
    const totalRev = typeof propTotalRevenue === 'number' ? propTotalRevenue : (stats?.totalRevenue || 0);
    const attendeesList = propAttendees || [];

    if (attendeesList.length > 0) {
      // Sort attendees chronologically
      const sorted = [...attendeesList].sort((a, b) => {
        const tA = new Date(a.createdAt || a.registrationDate || 0).getTime();
        const tB = new Date(b.createdAt || b.registrationDate || 0).getTime();
        return tA - tB;
      });

      // Split into 4 progress milestones
      const step = Math.max(1, Math.floor(sorted.length / 4));
      const points = [
        { name: "P1", count: Math.min(step, sorted.length) },
        { name: "P2", count: Math.min(step * 2, sorted.length) },
        { name: "P3", count: Math.min(step * 3, sorted.length) },
        { name: "Final", count: sorted.length }
      ];

      return points.map((p, idx) => ({
        name: idx === 3 ? "Current" : `Stage ${idx + 1}`,
        revenue: totalRev > 0 
          ? Math.round((p.count / sorted.length) * totalRev) 
          : p.count,
        registrations: p.count
      }));
    }

    if (totalRev === 0) {
      return [
        { name: "Week 1", revenue: 0, registrations: 0 },
        { name: "Week 2", revenue: 0, registrations: 0 },
        { name: "Week 3", revenue: 0, registrations: 0 },
        { name: "Week 4", revenue: 0, registrations: 0 },
      ];
    }
    return [
      { name: "Week 1", revenue: Math.round(totalRev * 0.15), registrations: 1 },
      { name: "Week 2", revenue: Math.round(totalRev * 0.35), registrations: 2 },
      { name: "Week 3", revenue: Math.round(totalRev * 0.70), registrations: 4 },
      { name: "Week 4", revenue: totalRev, registrations: 5 },
    ];
  }, [stats, propTotalRevenue, propAttendees]);

  const ticketStatsList = React.useMemo(() => {
    const ticketList = tickets || [];
    const colors = ["#EB5017", "#F79009", "#1368CE", "#26890C", "#8B5CF6", "#EC4899"];
    const totalAttendeesCount = propAttendees?.length || stats?.totalAttendees || 0;

    if (!ticketList.length) {
      return [
        { label: "General Admission", percentage: totalAttendeesCount > 0 ? 100 : 0, color: "#EB5017" },
        { label: "VIP Access", percentage: 0, color: "#F79009" },
        { label: "Free Pass", percentage: 0, color: "#1368CE" }
      ];
    }

    return ticketList.map((t, idx) => {
      const tId = t.id || (t as any)._id;
      const count = propAttendees 
        ? propAttendees.filter((a: any) => a.ticketId === tId).length 
        : 0;
      
      const pct = totalAttendeesCount > 0 && count > 0
        ? Math.round((count / totalAttendeesCount) * 100)
        : t.quantity > 0 && totalAttendeesCount > 0
        ? Math.min(100, Math.round(((t.quantity / 2) / totalAttendeesCount) * 100))
        : idx === 0 && totalAttendeesCount > 0
        ? 100
        : 0;

      return {
        label: t.name || `${t.type || 'Standard'} Tier`,
        percentage: pct,
        color: colors[idx % colors.length],
        price: t.price,
        type: t.type
      };
    });
  }, [tickets, propAttendees, stats]);

  const handleExportDetails = () => {
    const attendeesList = propAttendees || [];
    if (!attendeesList.length) {
      alert("No attendee records available to export for this event yet.");
      return;
    }
    const headers = ["ID", "Name", "Email", "CheckedIn", "RegistrationDate"];
    const rows = attendeesList.map(a => [
      a.id || a._id || "",
      `"${(a.name || "").replace(/"/g, '""')}"`,
      `"${(a.email || "").replace(/"/g, '""')}"`,
      a.isCheckedIn ? "Yes" : "No",
      a.createdAt || a.registrationDate || ""
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `event_${eventId || 'analytics'}_sales_attendance.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          <p className="text-xs text-gray-400 font-medium">Daily trend performance and ticket breakdown</p>
        </div>
        <button 
          onClick={handleExportDetails}
          className="text-[#EB5017] text-xs font-bold hover:underline cursor-pointer"
        >
          Export Details
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Chart Area */}
        <div className="flex-1 min-h-[250px]">
           <p className="text-[10px] font-black text-[#B28A6A] uppercase tracking-widest mb-3">
             {typeof propTotalRevenue === 'number' && propTotalRevenue > 0 ? "Revenue Growth Trend" : "Registration Acquisition Trend"}
           </p>
           <ResponsiveContainer width="100%" height={260}>
             <AreaChart data={revenueData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
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
        <div className="w-full lg:w-1/2 lg:border-l lg:border-gray-50 lg:pl-5 flex flex-col gap-4 pt-3">
           <div className="flex justify-between items-center mb-1">
             <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest">Ticket Distribution</p>
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
               {tickets.length} {tickets.length === 1 ? "Tier" : "Tiers"}
             </span>
           </div>
           
           <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
             {ticketStatsList.map((t, idx) => (
               <ProgressBar 
                 key={idx} 
                 label={t.label} 
                 percentage={t.percentage} 
                 color={t.color} 
               />
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAttendance;
