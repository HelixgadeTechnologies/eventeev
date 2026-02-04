import AnalyticsCard from "@/components/display/AnalyticsCard";
import { publishedEvents } from "@/lib/demo-data/events";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import { FaAngleRight } from "react-icons/fa6";
import { services } from "@/lib/demo-data/dashboard-services";
import Image from "next/image";
import { formatDate } from "@/lib/utils/configure-date";
import { LuClock3 } from "react-icons/lu";
import { IoCalendarClearOutline } from "react-icons/io5";
import Calendar from "@/components/ui/Calendar";

interface EventDetailsProps {
  params: Promise<{
    _id: string;
  }>;
}

export async function generateStaticParams() {
  return publishedEvents.map((events) => ({
    _id: events._id,
  }));
}

export async function generateMetadata({ params }: EventDetailsProps) {
  const { _id } = await params; // Await the params Promise
  const event = publishedEvents.find((events) => events._id === _id);

  return {
    title: event ? `${event.name} | Dashboard - Eventeev` : "Dashboard - Eventeev",
    description: event?.description || "Explore and manage your events on Eventeev.",
  };
}

export default async function EventsDashboard({ params }: EventDetailsProps) {
  const { _id } = await params;
  const currentEvent = publishedEvents.find((eve) => eve._id === _id);

  if (!currentEvent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-24 h-24 bg-gray-50/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-gray-100 shadow-sm animate-pulse">
          <Image src="/logo-black.svg" alt="Eventeev" width={48} height={48} className="opacity-10" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-[#1B1818] tracking-tight mb-2">Event Not Found</h2>
          <p className="text-gray-400 font-medium max-w-sm mx-auto uppercase text-[10px] tracking-widest">
            The requested event ID &quot;{_id}&quot; does not exist in our database.
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
      value: 1240,
      percentage: 12,
      icon: "/icons/thermometer.svg",
      text: "Trending Up",
      isCurrency: false,
    },
    {
      title: "Actual Check-ins",
      value: 856,
      percentage: 8,
      icon: "/icons/3d.svg",
      text: "Stable Flow",
      isCurrency: false,
    },
    {
      title: "Revenue Forecast",
      value: 450000,
      percentage: 15,
      icon: "/icons/sun.svg",
      text: "Growth Phase",
      isCurrency: true,
    },
  ];

  return (
    <section className="flex flex-col lg:flex-row gap-8 font-sans">
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
              href={`/events/${currentEvent._id}/attendees`}
            >
              See all attendees
              <FaAngleRight className="text-lg" />
            </Link>
          </div>
          <div className="relative group">
            <div className="h-44 w-full rounded-[32px] bg-white/95 backdrop-blur-xl border border-gray-100 shadow-sm flex items-center overflow-hidden">
              {currentEvent.attendees.length === 0 ? (
                <div className="w-full text-center space-y-2">
                  <p className="font-extrabold text-[#1B1818] text-sm uppercase tracking-wider">Empty Horizon</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                    New attendees will materialize here soon! 😊
                  </p>
                </div>
              ) : (
                <div className="flex gap-8 items-center overflow-x-auto w-full px-8 py-4 custom-scrollbar">
                  {currentEvent.attendees.slice(0, 8).map((attendee) => (
                    <div
                      key={attendee.id}
                      className="flex flex-col shrink-0 items-center justify-center space-y-3 group/item cursor-pointer"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-[#eb5017] rounded-full scale-0 group-hover/item:scale-110 transition-transform duration-300 opacity-20" />
                        <Avatar name={attendee.username} isBigger={true} />
                      </div>
                      <div className="text-center">
                        <p className="font-black text-[11px] text-[#1B1818] uppercase tracking-tight truncate w-20">
                          {attendee.username}
                        </p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter w-20 truncate">
                          Peep #{attendee.id.toString().slice(-4)}
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
                href={`/events/${currentEvent._id}/${service.href}`}
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
              <div className="h-14 w-14 rounded-2xl bg-[#eb5017]/5 flex flex-col items-center justify-center border border-[#eb5017]/10">
                <span className="text-[10px] font-black text-[#eb5017] uppercase">{formatDate(currentEvent.startDate).split(' ')[0]}</span>
                <span className="text-xl font-black text-[#eb5017] -mt-1">{formatDate(currentEvent.startDate).split(' ')[1]}</span>
              </div>
              <div>
                <h4 className="font-black text-[#1B1818] tracking-tight text-lg leading-tight uppercase">
                  {formatDate(currentEvent.startDate)}
                </h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                  Main Event Day
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <LuClock3 className="text-lg text-[#eb5017]" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Aura Duration</p>
                  <p className="text-xs font-black text-[#1B1818] uppercase tracking-tighter">
                    {currentEvent.startTime} — {currentEvent.endTime}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <IoCalendarClearOutline className="text-lg text-[#eb5017]" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Base Camp</p>
                  <p className="text-xs font-black text-[#1B1818] uppercase tracking-tighter truncate w-48">
                    {currentEvent.location}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50">
               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4 text-center">Master of Ceremony</p>
               <div className="flex items-center justify-center gap-4">
                  <Avatar name={"Richard Edem"} isBigger={true} />
                  <div>
                    <p className="font-black text-sm text-[#1B1818] uppercase tracking-tighter leading-none">
                      Dr. Richard Edem
                    </p>
                    <p className="text-[10px] text-[#eb5017] font-black uppercase tracking-widest mt-1">
                      Event Architect
                    </p>
                  </div>
               </div>
            </div>

            <div className="flex flex-col gap-3">
              <button className="w-full bg-[#eb5017] text-white py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#d64815] transition-all transform active:scale-95 shadow-xl shadow-[#eb5017]/20">
                Edit Protocol
              </button>
              <button className="w-full bg-white border border-gray-100 text-[#1B1818] py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all transform active:scale-95 shadow-sm">
                Broadcast Link
              </button>
            </div>
          </div>
        </div>
        
        <div className="rounded-[32px] overflow-hidden shadow-sm border border-gray-100 bg-white p-2">
            <Calendar eventDate={currentEvent.startDate} />
        </div>
      </div>
    </section>
  );
}

