"use client";

import { useState, useEffect, use } from "react";
import AnalyticsCard from "@/components/display/AnalyticsCard";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { services } from "@/lib/demo-data/dashboard-services";
import Image from "next/image";
import { formatDate, formatDay } from "@/lib/utils/configure-date";
import { LuClock3 } from "react-icons/lu";
import { IoCalendarClearOutline } from "react-icons/io5";
import Calendar from "@/components/ui/Calendar";
import DashboardActionButtons from "@/components/events/DashboardActionButtons";
import { eventsService } from "@/lib/services/events.service";
import { attendeesService, ApiAttendee } from "@/lib/services/attendees.service";

interface EventDetailsProps {
  params: Promise<{
    _id: string;
  }>;
}

export default function EventsDashboard({ params }: EventDetailsProps) {
  const resolvedParams = use(params);
  const _id = resolvedParams._id;

  const [event, setEvent] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [attendees, setAttendees] = useState<ApiAttendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [eventRes, statsRes, attendeesRes] = await Promise.all([
          eventsService.getEventById(_id),
          attendeesService.getAttendeeStats(_id),
          attendeesService.getAttendees(_id)
        ]);

        if (eventRes.error) {
          setError(eventRes.error.message);
        } else {
          setEvent(eventRes.data);
          setStats(statsRes.data);
          setAttendees(attendeesRes.data.slice(0, 8));
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [_id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#eb5017]"></div>
        <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Loading Dashboard...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-24 h-24 bg-gray-50/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-gray-100 shadow-sm">
          <Image src="/logo-black.svg" alt="Eventeev" width={48} height={48} className="opacity-10" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-[#1B1818] tracking-tight mb-2">
            {error === "Event not found" ? "Event Not Found" : "Connection Issue"}
          </h2>
          <p className="text-gray-400 font-medium max-w-sm mx-auto uppercase text-[10px] tracking-widest leading-relaxed">
            {error || "We encountered an issue retrieving the dashboard information."}
          </p>
        </div>
        <Link 
          href="/events"
          className="bg-[#eb5017] text-white px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#d64815] transition-all transform active:scale-95 shadow-xl shadow-[#eb5017]/20"
        >
          Back to My Events
        </Link>
      </div>
    );
  }

  const analytics = [
    {
      title: "Expected RSVP",
      value: stats?.totalAttendees || 0,
      percentage: Math.min(100, Math.floor((stats?.totalAttendees / 1000) * 100)) || 0, // Mock comparison if no target exists
      icon: "/icons/thermometer.svg",
      text: "Total Registered",
      isCurrency: false,
    },
    {
      title: "Actual Check-ins",
      value: stats?.verifiedAccess || 0,
      percentage: stats?.totalAttendees > 0 ? Math.floor((stats.verifiedAccess / stats.totalAttendees) * 100) : 0,
      icon: "/icons/3d.svg",
      text: "Verified Peeps",
      isCurrency: false,
    },
    {
      title: "Recent Activity",
      value: stats?.recentActivity || 0,
      percentage: stats?.recentActivity > 0 ? 10 : 0, // Mock growth
      icon: "/icons/sun.svg",
      text: "Last 30 Mins",
      isCurrency: false,
    },
  ];

  return (
    <section className="flex flex-col gap-10 font-sans">
      {/* Back Navigation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
          <div className="space-y-2">
              <Link 
                  href="/events" 
                  className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#EB5017] transition-all group"
              >
                  <FaAngleLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
                  Back to events
              </Link>
          </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-10">
        {/* Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {analytics.map((a, index) => (
            <AnalyticsCard
              key={index}
              icon={a.icon}
              title={a.title}
              value={a.value}
              percentage={a.percentage}
              text={a.text}
              isCurrency={a.isCurrency}
            />
          ))}
        </div>

        {/* Newest Attendees Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-end px-2">
            <div>
              <p className="text-[10px] font-black text-[#eb5017] uppercase tracking-[0.2em] mb-1">Activity</p>
              <h3 className="text-2xl font-black text-[#1B1818] tracking-tight">Recent Peeps</h3>
            </div>
            <Link
              className="text-[10px] font-black primary flex items-center gap-1 uppercase tracking-widest group hover:translate-x-1 transition-transform"
              href={`/events/${event._id}/attendees`}
            >
              See all attendees
              <FaAngleRight className="text-lg" />
            </Link>
          </div>
          <div className="relative group">
            <div className="h-44 w-full rounded-[32px] bg-white/95 backdrop-blur-xl border border-gray-100 shadow-sm flex items-center overflow-hidden">
              {attendees.length === 0 ? (
                <div className="w-full text-center space-y-2">
                  <p className="font-extrabold text-[#1B1818] text-sm uppercase tracking-wider">Empty Horizon</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                    New attendees will materialize here soon! 😊
                  </p>
                </div>
              ) : (
                <div className="flex gap-8 items-center overflow-x-auto w-full px-8 py-4 custom-scrollbar">
                  {attendees.map((attendee) => (
                    <div
                      key={attendee.id}
                      className="flex flex-col shrink-0 items-center justify-center space-y-3 group/item cursor-pointer"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-[#eb5017] rounded-full scale-0 group-hover/item:scale-110 transition-transform duration-300 opacity-20" />
                        <Avatar name={attendee.name} isBigger={true} />
                      </div>
                      <div className="text-center">
                        <p className="font-black text-[11px] text-[#1B1818] uppercase tracking-tight truncate w-24">
                          {attendee.name}
                        </p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter w-24 truncate">
                          {attendee.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Services Grid Section */}
        <div className="space-y-6">
          <div className="px-2">
            <p className="text-[10px] font-black text-[#eb5017] uppercase tracking-[0.2em] mb-1">Extensions</p>
            <h3 className="text-2xl font-black text-[#1B1818] tracking-tight">Power-ups</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {services.map((service, idx) => (
              <Link
                href={`/events/${event._id}/${service.href}`}
                key={idx}
                className="group relative overflow-hidden rounded-[28px] h-40 bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
              >
                <div 
                  className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity" 
                  style={{ backgroundColor: service.bg }} 
                />
                <div className="relative h-full w-full flex flex-col justify-between p-7">
                  <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500 bg-opacity-70 backdrop-blur-sm border border-gray-50">
                    <div className="h-5 w-5 relative">
                      <Image src={service.icon} alt={service.name} fill className="object-contain" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Module</p>
                    <p className="text-sm font-black text-[#1B1818] uppercase tracking-tighter leading-none">
                      {service.name}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar Section */}
      <div className="w-full lg:w-[380px] space-y-8">
        <div className="bg-white/95 backdrop-blur-xl border border-gray-100 rounded-[32px] shadow-2xl shadow-gray-200/50 overflow-hidden">
          <div className="p-8 pb-0">
             <p className="text-[10px] font-black text-[#eb5017] uppercase tracking-[0.2em] mb-1">Timeline</p>
             <h3 className="text-2xl font-black text-[#1B1818] tracking-tight">Event Snapshot</h3>
          </div>
          
          <div className="p-8 space-y-8">
            <div className="flex items-center gap-6">
              <div className="h-14 w-14 rounded-2xl bg-[#eb5017]/10 flex flex-col items-center justify-center border border-[#eb5017]/20 shrink-0">
                <span className="text-xl font-black text-[#eb5017]">{event.startDate !== 'N/A' ? formatDay(event.startDate) : '--'}</span>
              </div>
              <div>
                <h4 className="font-black text-[#1B1818] tracking-tight text-lg leading-tight uppercase">
                  {event.startDate !== 'N/A' ? formatDate(event.startDate) : 'Date Pending'}
                </h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                  Main Event Day
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <LuClock3 className="text-lg text-[#eb5017]" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Duration</p>
                  <p className="text-[10px] font-black text-[#1B1818] uppercase tracking-tighter">
                    {event.startTime} — {event.endTime || 'Late'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <IoCalendarClearOutline className="text-lg text-[#eb5017]" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Venue</p>
                  <p className="text-[10px] font-black text-[#1B1818] uppercase tracking-tighter truncate w-full">
                    {event.location || 'Multiple Venues'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50">
               <div className="flex items-center justify-center gap-4">
                  <Avatar name={event.organizer_name || "Host"} isBigger={true} />
                  <div>
                    <p className="font-black text-sm text-[#1B1818] uppercase tracking-tighter leading-none">
                      {event.organizer_name || "Event Organiser"}
                    </p>
                    <p className="text-[10px] text-[#eb5017] font-black uppercase tracking-widest mt-1">
                      Verified Host
                    </p>
                  </div>
               </div>
            </div>

            <DashboardActionButtons 
              eventId={event._id} 
              eventName={event.name} 
            />
          </div>
        </div>
        
        <div className="rounded-[32px] overflow-hidden shadow-sm border border-gray-100 bg-white p-2 text-center py-10">
            <Calendar eventDate={event.startDate !== 'N/A' ? event.startDate : new Date().toISOString()} />
        </div>
        </div>
      </div>
    </section>
  );
}
