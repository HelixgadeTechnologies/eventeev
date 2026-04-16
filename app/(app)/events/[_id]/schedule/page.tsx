"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa6";
import { LuClock3, LuPlus, LuLoader2 } from "react-icons/lu";
import { Reorder } from "framer-motion";
import Avatar from "@/components/ui/Avatar";
import { publishedEvents, draftedEvents, completedEvents } from "@/lib/demo-data/events";
import AddScheduleModal, { ScheduleItem } from "@/components/events/AddScheduleModal";
import PreviewScheduleModal from "@/components/events/PreviewScheduleModal";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { scheduleService } from "@/lib/services/schedule.service";
import toast from "react-hot-toast";

export default function SchedulePage() {
  const { _id } = useParams();
  const eventId = Array.isArray(_id) ? _id[0] : _id;
  
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<ScheduleItem | null>(null);

  // Fetch schedules from database
  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const data = await scheduleService.getSchedule(eventId);
      // Map backend _id to id if necessary, though our interface uses id
      const normalizedData = data.map((item: any) => ({
        ...item,
        id: item._id || item.id
      }));
      setSchedules(normalizedData);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      toast.error("Failed to load schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchSchedules();
    }
  }, [eventId]);

  // Handle adding new schedule item
  const handleAddSchedule = async (newSchedule: Omit<ScheduleItem, 'id'>) => {
    try {
      await scheduleService.createItem({
        ...newSchedule,
        event: eventId
      });
      toast.success("Schedule item added");
      fetchSchedules();
    } catch (error) {
      console.error("Error adding schedule:", error);
      toast.error("Failed to add schedule item");
    }
  };

  // Handle editing schedule item
  const handleEditSchedule = async (updatedSchedule: ScheduleItem) => {
    try {
      await scheduleService.updateItem(updatedSchedule.id, updatedSchedule);
      toast.success("Schedule item updated");
      fetchSchedules();
    } catch (error) {
      console.error("Error updating schedule:", error);
      toast.error("Failed to update schedule item");
    }
  };

  // Handle deleting schedule item
  const handleDeleteSchedule = async (id: string) => {
    if (!confirm("Are you sure you want to delete this schedule item?")) return;
    try {
      await scheduleService.deleteItem(id);
      toast.success("Schedule item removed");
      setSchedules(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error("Error deleting schedule:", error);
      toast.error("Failed to delete schedule item");
    }
  };

  // Find the current event
  const currentEvent = useMemo(() => {
    const allEvents = [...publishedEvents, ...draftedEvents, ...completedEvents];
    return allEvents.find(e => e._id === eventId);
  }, [eventId]);

  return (
    <div className="space-y-8 pb-20 font-sans max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <div className="px-2">
          <Link
            href={`/events/${eventId}/dashboard`}
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
        onAdd={handleAddSchedule}
        onEdit={handleEditSchedule}
        editItem={editItem}
      />

      {/* Schedule List */}
      <div className="space-y-4 px-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-4">
            <LuLoader2 className="text-4xl animate-spin text-[#EB5017]" />
            <p className="text-sm font-bold uppercase tracking-widest">Loading agenda...</p>
          </div>
        ) : schedules.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-100 rounded-[40px] p-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
              <LuClock3 className="text-2xl text-gray-300" />
            </div>
            <div>
              <p className="text-lg font-black text-[#1B1818]">No sessions yet</p>
              <p className="text-sm text-gray-400 font-medium">Start building your event timeline by adding activities.</p>
            </div>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#1B1818] text-white px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all"
            >
              Add First Activity
            </button>
          </div>
        ) : (
          <Reorder.Group axis="y" values={schedules} onReorder={setSchedules} className="relative border-l-4 border-gray-100/60 ml-4 md:ml-6 space-y-8 py-4">
            {schedules.map((item) => (
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
                    {item.speakers && item.speakers[0] && (
                      <div className="flex items-center gap-4 bg-gray-50/80 hover:bg-white p-4 rounded-[24px] border border-gray-100 shrink-0 md:w-[280px] transition-colors duration-300 shadow-sm">
                        <Avatar name={item.speakers[0].name} isBigger={true} />
                        <div className="overflow-hidden flex-1">
                          <p className="font-black text-xs text-[#1B1818] uppercase tracking-tighter truncate">
                            {item.speakers[0].name}
                          </p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest truncate mt-0.5">
                            {item.speakers[0].role}
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
                        onClick={() => handleDeleteSchedule(item.id)}
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
        )}
      </div>
    </div>
  );
}

