"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaAngleLeft } from "react-icons/fa6";
import { LuClock3, LuPlus } from "react-icons/lu";
import { Reorder } from "framer-motion";
import Avatar from "@/components/ui/Avatar";
import { publishedEvents, draftedEvents, completedEvents } from "@/lib/demo-data/events";
import AddScheduleModal, { ScheduleItem } from "@/components/events/AddScheduleModal";
import PreviewScheduleModal from "@/components/events/PreviewScheduleModal";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";

const SCHEDULE_DATA: ScheduleItem[] = [
  {
    id: "s1",
    startTime: "09:00",
    endTime: "09:45",
    title: "Registration & Breakfast",
    description: "Check-in, grab your badge, and enjoy some morning refreshments before we kick off.",
    type: "Break"
  },
  {
    id: "s2",
    startTime: "09:45",
    endTime: "11:00",
    title: "Opening Keynote: The Future is Now",
    description: "A deep dive into upcoming trends and what to expect in the tech landscape.",
    speaker: {
      name: "Dr. Richard Edem",
      role: "Lead Innovator"
    },
    type: "Keynote"
  },
  {
    id: "s3",
    startTime: "11:00",
    endTime: "12:00",
    title: "Interactive Workshop: Building Scalable Systems",
    description: "Learn hands-on techniques for designing architectures that scale effortlessly.",
    speaker: {
      name: "Sarah Jenkins",
      role: "Senior Systems Engineer"
    },
    type: "Workshop"
  },
  {
    id: "s4",
    startTime: "12:00",
    endTime: "13:30",
    title: "Lunch & Networking",
    description: "Connect with fellow attendees over a catered lunch.",
    type: "Networking"
  },
  {
    id: "s5",
    startTime: "13:30",
    endTime: "14:15",
    title: "Panel Discussion: AI in the Modern Workplace",
    description: "Industry experts discuss the practical applications and ethical implications of AI.",
    speaker: {
      name: "Daniel Foster",
      role: "Chief Technology Officer"
    },
    type: "Activity"
  },
  {
    id: "s6",
    startTime: "14:15",
    endTime: "15:15",
    title: "Product Showcase & Demos",
    description: "Get a first look at new products and feature releases from our sponsors.",
    type: "Activity"
  },
  {
    id: "s7",
    startTime: "15:15",
    endTime: "15:45",
    title: "Closing Remarks & Awards",
    description: "Wrapping up the event and recognizing outstanding contributions.",
    speaker: {
      name: "Dr. Richard Edem",
      role: "Lead Innovator"
    },
    type: "Keynote"
  }
];

export default function SchedulePage() {
  const { _id } = useParams();
  
  const [schedules, setSchedules] = useState<ScheduleItem[]>(SCHEDULE_DATA);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<ScheduleItem | null>(null);

  // Find the current event
  const currentEvent = useMemo(() => {
    const allEvents = [...publishedEvents, ...draftedEvents, ...completedEvents];
    return allEvents.find(e => e._id === _id);
  }, [_id]);

  return (
    <div className="space-y-8 pb-20 font-sans max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <div className="px-2">
          <Link
            href={`/events/${_id}/dashboard`}
            className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#EB5017] transition-all group"
          >
            <FaAngleLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-[#eb5017] uppercase tracking-[0.2em]">Agenda</p>
            <h2 className="text-4xl font-black text-[#1B1818] tracking-tight">Event Schedule</h2>
            <p className="text-sm text-gray-400 font-medium">Detailed timeline of activities, sessions, and speakers.</p>
          </div>
          
          <div className="flex flex-col gap-4">
             <div className="bg-white border border-gray-100 rounded-3xl p-6 flex items-center justify-between shadow-sm min-w-[280px]">
               <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Activities</p>
                 <p className="text-lg font-black text-[#1B1818] tracking-tight">{schedules.length} Sessions</p>
               </div>
               <div className="h-12 w-12 rounded-full bg-[#EB5017]/10 flex items-center justify-center">
                   <LuClock3 className="text-xl text-[#EB5017]" />
               </div>
             </div>
             
             <div className="flex gap-2 w-full">
               <button
                 onClick={() => setIsPreviewModalOpen(true)}
                 className="flex-1 bg-white hover:bg-gray-50 border border-gray-100 text-[#1B1818] px-4 py-4 rounded-full font-black text-[10px] uppercase tracking-widest shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
               >
                 <FiEye className="text-lg" />
                 Preview
               </button>
               <button
                 onClick={() => setIsAddModalOpen(true)}
                 className="flex-[2] bg-[#1B1818] hover:bg-black text-white px-6 py-4 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl shadow-black/10 active:scale-95 transition-all flex items-center justify-center gap-2"
               >
                 <LuPlus className="text-lg" />
                 Add Schedule
               </button>
             </div>
          </div>
        </div>
      </div>

      <PreviewScheduleModal 
        isOpen={isPreviewModalOpen} 
        onClose={() => setIsPreviewModalOpen(false)} 
        schedules={schedules} 
        eventName={currentEvent?.name}
      />

      <AddScheduleModal 
        isOpen={isAddModalOpen} 
        onClose={() => {
          setIsAddModalOpen(false);
          setEditItem(null);
        }} 
        onAdd={(newSchedule) => setSchedules([...schedules, newSchedule])}
        onEdit={(updatedSchedule) => setSchedules(schedules.map(s => s.id === updatedSchedule.id ? updatedSchedule : s))}
        editItem={editItem}
      />

      {/* Schedule List */}
      <div className="space-y-4 px-2">
        <Reorder.Group axis="y" values={schedules} onReorder={setSchedules} className="relative border-l-4 border-gray-100/60 ml-4 md:ml-6 space-y-8 py-4">
          {schedules.map((item, index) => (
            <Reorder.Item value={item} key={item.id} className="relative pl-8 md:pl-12 group cursor-grab active:cursor-grabbing">
              {/* Timeline dot */}
              <div className={`absolute -left-[14px] top-6 h-6 w-6 rounded-full border-[6px] border-white transition-colors duration-300 shadow-sm ${
                item.type === "Break" || item.type === "Networking" ? "bg-gray-300" : "bg-[#EB5017]"
              } group-hover:scale-125 z-10`} />
              
              <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  
                  {/* Left Side: Time & Info */}
                  <div className="space-y-4 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm font-black text-[#EB5017] bg-[#EB5017]/10 px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-inner">
                        {item.startTime}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
                        <LuClock3 className="text-sm" />
                        {item.endTime}
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${
                          item.type === "Keynote" ? "bg-purple-50 text-purple-600 border-purple-100" :
                          item.type === "Workshop" ? "bg-blue-50 text-blue-600 border-blue-100" :
                          item.type === "Break" ? "bg-gray-100 text-gray-500 border-gray-200" :
                          item.type === "Networking" ? "bg-teal-50 text-teal-600 border-teal-100" :
                          "bg-orange-50 text-orange-600 border-orange-100"
                      }`}>
                          {item.type}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-black text-[#1B1818] tracking-tight">{item.title}</h3>
                      <p className="text-sm text-gray-500 font-medium leading-relaxed mt-1 max-w-2xl">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Speaker */}
                  {item.speaker && (
                    <div className="flex items-center gap-4 bg-gray-50/80 hover:bg-white p-4 rounded-[24px] border border-gray-100 shrink-0 md:w-[280px] transition-colors duration-300 shadow-sm">
                      <Avatar name={item.speaker.name} isBigger={true} />
                      <div className="overflow-hidden flex-1">
                        <p className="font-black text-xs text-[#1B1818] uppercase tracking-tighter truncate">
                          {item.speaker.name}
                        </p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest truncate mt-0.5">
                          {item.speaker.role}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Actions (Edit / Delete) */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => {
                        setEditItem(item);
                        setIsAddModalOpen(true);
                      }}
                      className="w-8 h-8 rounded-full bg-white border border-gray-100 text-gray-400 hover:text-blue-500 hover:border-blue-100 hover:bg-blue-50 flex items-center justify-center transition-all shadow-sm"
                    >
                      <FiEdit2 className="text-sm" />
                    </button>
                    <button
                      onClick={() => setSchedules(schedules.filter(s => s.id !== item.id))}
                      className="w-8 h-8 rounded-full bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 flex items-center justify-center transition-all shadow-sm"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
    </div>
  );
}
