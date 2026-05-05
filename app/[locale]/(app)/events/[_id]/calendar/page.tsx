"use client";

import { HiOutlineBell, HiOutlinePlus, HiOutlineCalendar, HiOutlineMail, HiOutlineTrash, HiOutlineSparkles, HiOutlineDownload } from "react-icons/hi";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import AddReminderModal from "@/components/calendar/AddReminderModal";
import { checklistService } from "@/lib/services/checklist.service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";

const priorityColors: Record<string, string> = {
  high: "bg-red-50 text-red-600 border-red-100",
  medium: "bg-amber-50 text-amber-600 border-amber-100",
  low: "bg-green-50 text-green-600 border-green-100",
};

const typeLabels: Record<string, string> = {
  task: "Task",
  rehearsal: "Rehearsal",
  marketing: "Marketing",
  milestone: "Milestone",
};

const typeDotColors: Record<string, string> = {
  task: "bg-blue-400",
  rehearsal: "bg-purple-400",
  marketing: "bg-pink-400",
  milestone: "bg-[#EB5017]",
};

export default function CalendarPage() {
  const { _id } = useParams();
  const eventId = (Array.isArray(_id) ? _id[0] : _id) || "";

  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  
  const [taskToEdit, setTaskToEdit] = useState<any>(null);
  const [taskToDelete, setTaskToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchReminders = useCallback(async () => {
    try {
      if (!eventId) return;
      setLoading(true);
      const data = await checklistService.getChecklist(eventId);
      
      // Normalize data: ensure category maps to type, and handle date formats
      const normalizedData = data.map((item: any) => ({
        ...item,
        id: item._id || item.id,
        type: item.category || 'task', // Map category to type
        // Ensure UI formatting for dates if not already formatted
        displayDate: item.date || new Date(item.createdAt).toLocaleDateString("en-US", {
           month: "short",
           day: "numeric",
           year: "numeric"
        }),
        displayTime: item.time || new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
      
      setReminders(normalizedData);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      toast.error("Failed to load event timeline");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const handleSaveReminder = async (data: any) => {
    try {
      const payload = {
        ...data,
        event: eventId,
        category: data.type
      };
      
      if (taskToEdit) {
        await checklistService.updateItem(taskToEdit._id || taskToEdit.id, payload);
        toast.success("Reminder updated");
      } else {
        await checklistService.createItem(payload);
        toast.success("Reminder added to timeline");
      }
      
      setTaskToEdit(null);
      fetchReminders();
    } catch (error) {
      console.error("Error saving reminder:", error);
      toast.error("Failed to save reminder");
    }
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      setIsDeleting(true);
      await checklistService.deleteItem(taskToDelete._id || taskToDelete.id);
      toast.success("Reminder removed");
      setReminders(prev => prev.filter(r => (r._id || r.id) !== (taskToDelete._id || taskToDelete.id)));
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    } catch (error) {
      toast.error("Failed to delete reminder");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleInitialize = async (type: string) => {
     try {
       setIsInitializing(true);
       await checklistService.initializeChecklist(eventId, type);
       toast.success(`Checklist initialized for ${type}`);
       setShowTemplates(false);
       fetchReminders();
     } catch (error) {
       toast.error("Failed to initialize timeline");
     } finally {
       setIsInitializing(false);
     }
  };

  // Group by date
  const groupedByDate = reminders.reduce((acc, reminder) => {
    const key = reminder.displayDate;
    if (!acc[key]) acc[key] = [];
    acc[key].push(reminder);
    return acc;
  }, {} as Record<string, any[]>);

  // Sort dates
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#EB5017]" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading Timeline...</p>
      </div>
    );
  }

  return (
    <section className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-[#eb5017] uppercase tracking-[0.2em] mb-1">Power-up</p>
          <h2 className="text-3xl font-black text-[#1B1818] tracking-tight">Event Timeline</h2>
          <p className="text-sm text-gray-400 font-medium leading-relaxed">Keep track of key milestones, rehearsals, and task deadlines for your event.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setShowTemplates(!showTemplates)}
              className="inline-flex items-center gap-2 bg-white border-2 border-gray-100 text-[#1B1818] px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:border-[#EB5017] hover:text-[#EB5017] transition-all active:scale-95 shadow-sm shrink-0"
            >
              <HiOutlineDownload className="text-lg" />
              Import Template
            </button>
            
            {showTemplates && (
               <div className="absolute top-[calc(100%+12px)] right-0 w-[420px] bg-white rounded-3xl shadow-2xl border border-gray-50 z-[100] p-6 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-black text-[#1B1818] uppercase tracking-widest">Select Template</h3>
                    <div className="p-1.5 rounded-lg bg-orange-50 text-[#EB5017]">
                       <HiOutlineSparkles size={16} className="animate-pulse" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {['conference', 'concert', 'party', 'wedding', 'default'].map((type) => (
                      <button
                        key={type}
                        onClick={() => handleInitialize(type)}
                        disabled={isInitializing}
                        className="flex flex-col items-start p-4 rounded-2xl border border-gray-100 font-sans group hover:border-[#EB5017] hover:bg-[#FFF8F2] transition-all text-left disabled:opacity-50"
                      >
                        <span className="text-[11px] font-black uppercase tracking-widest text-[#1B1818] group-hover:text-[#EB5017] mb-1">{type}</span>
                        <span className="text-[10px] text-gray-400 font-bold group-hover:text-[#EB5017]/70">Ready to populate</span>
                      </button>
                    ))}
                  </div>
               </div>
            )}
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#EB5017] text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#d64815] transition-all active:scale-95 shadow-xl shadow-[#EB5017]/30 shrink-0"
          >
            <HiOutlinePlus className="text-lg" />
            Add Reminder
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {sortedDates.map((date) => (
          <div key={date}>
            {/* Date Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#EB5017]/5 border border-[#EB5017]/10 flex items-center justify-center shrink-0 shadow-sm">
                <HiOutlineCalendar className="text-xl text-[#EB5017]" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#1B1818] uppercase tracking-wider">{date}</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  {groupedByDate[date].length} {groupedByDate[date].length === 1 ? 'Event' : 'Events'} Scheduled
                </p>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-100 to-transparent" />
            </div>

            {/* Reminders for this date */}
            <div className="space-y-4 ml-6 border-l-2 border-dashed border-gray-100 pl-10">
              {groupedByDate[date].map((reminder: any) => (
                <div
                  key={reminder.id}
                  className="bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group relative"
                >
                  {/* Timeline dot */}
                  <div className={`absolute -left-[49px] top-8 w-4 h-4 rounded-full border-4 border-white shadow-md z-10 ${typeDotColors[reminder.type]}`} />
                  
                  {/* Connecting Line Extension (decorative) */}
                  <div className="absolute -left-[41px] top-8 w-8 h-px bg-gray-100 -z-0" />

                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h4 className="font-black text-lg text-[#1B1818] tracking-tight group-hover:text-[#EB5017] transition-colors">{reminder.title}</h4>
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${priorityColors[reminder.priority]}`}>
                            {reminder.priority} Priority
                          </span>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setTaskToEdit(reminder);
                                setIsModalOpen(true);
                              }}
                              className="p-2 rounded-full hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-all"
                              title="Edit Reminder"
                            >
                              <HiOutlineSparkles size={16} />
                            </button>
                            <button 
                              onClick={() => {
                                setTaskToDelete(reminder);
                                setIsDeleteModalOpen(true);
                              }}
                              className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
                            >
                              <HiOutlineTrash size={16} />
                            </button>
                          </div>
                           {reminder.sendEmail && (
                             <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shadow-sm" title="Email Notification Enabled">
                               <HiOutlineMail size={14} />
                             </div>
                           )}
                           {reminder.syncToCalendar && (
                             <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500 shadow-sm" title="Calendar Sync Enabled">
                               <HiOutlineCalendar size={14} />
                             </div>
                           )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-400 font-medium mb-4 leading-relaxed line-clamp-2">{reminder.description}</p>
                      
                      <div className="flex items-center gap-6 pt-2 border-t border-gray-50">
                        <span className="text-[11px] font-black text-[#1B1818] flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-orange-50 text-[#EB5017]">
                            <HiOutlineBell size={14} />
                          </div>
                          {reminder.displayTime}
                        </span>
                        <span className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                          <span className={`w-2 h-2 rounded-full shadow-sm ${typeDotColors[reminder.type]}`} />
                          {typeLabels[reminder.type]}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {sortedDates.length === 0 && (
          <div className="py-16 px-8 text-center bg-gray-50/50 rounded-[48px] border-2 border-dashed border-gray-100 flex flex-col items-center max-w-4xl mx-auto">
             <div className="w-20 h-20 bg-white rounded-[32px] shadow-xl flex items-center justify-center text-[#EB5017] mb-8 ring-8 ring-white/50">
                <HiOutlineCalendar className="text-3xl" />
             </div>
             <h3 className="text-2xl font-black text-[#1B1818] tracking-tight mb-2 uppercase">Your Timeline is Empty</h3>
             <p className="text-sm text-gray-400 font-medium leading-relaxed mb-12 max-w-sm mx-auto">
                Get started by adding individual tasks or use a pre-built template to populate your milestones instantly.
             </p>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {['Conference', 'Concert', 'Wedding'].map((type) => (
                   <button 
                    key={type}
                    onClick={() => handleInitialize(type.toLowerCase())}
                    disabled={isInitializing}
                    className="group bg-white p-8 rounded-[36px] shadow-xl shadow-gray-200/50 border border-transparent hover:border-[#EB5017] transition-all duration-500 hover:-translate-y-2 text-left disabled:opacity-50"
                   >
                     <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 mb-6 group-hover:bg-[#FFF8F2] group-hover:text-[#EB5017] transition-colors">
                        <HiOutlineSparkles size={24} />
                     </div>
                     <h4 className="font-black text-sm text-[#1B1818] uppercase tracking-widest mb-2">{type}</h4>
                     <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest group-hover:text-[#EB5017]/60">Apply Template</p>
                   </button>
                ))}
             </div>
          </div>
        )}
      </div>

      <AddReminderModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTaskToEdit(null);
        }}
        onSave={handleSaveReminder}
        editData={taskToEdit}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={confirmDelete}
        title={taskToDelete?.title || "this reminder"}
        isDeleting={isDeleting}
      />
    </section>
  );
}
