"use client";

import { HiOutlineBell, HiOutlinePlus, HiOutlineCalendar, HiOutlineMail } from "react-icons/hi";
import { useState } from "react";
import AddReminderModal from "@/components/calendar/AddReminderModal";

const MOCK_REMINDERS = [
  {
    id: 1,
    title: "Final Venue Walkthrough",
    date: "Feb 14, 2026",
    time: "10:00 AM",
    type: "task",
    priority: "high",
    description: "Complete final walkthrough of all event areas with the venue manager",
    sendEmail: true,
    syncToCalendar: true,
  },
  {
    id: 2,
    title: "Speaker Rehearsal — Keynote",
    date: "Feb 14, 2026",
    time: "2:00 PM",
    type: "rehearsal",
    priority: "high",
    description: "Tech check and run-through with keynote speaker",
    sendEmail: true,
    syncToCalendar: true,
  },
  {
    id: 3,
    title: "Catering Confirmation",
    date: "Feb 15, 2026",
    time: "09:00 AM",
    type: "task",
    priority: "medium",
    description: "Confirm final headcount and menu selections with caterer",
    sendEmail: false,
    syncToCalendar: false,
  },
  {
    id: 4,
    title: "Social Media Blast — 48hr Countdown",
    date: "Feb 15, 2026",
    time: "12:00 PM",
    type: "marketing",
    priority: "medium",
    description: "Schedule and publish countdown posts across all platforms",
    sendEmail: true,
    syncToCalendar: false,
  },
  {
    id: 5,
    title: "Volunteer Briefing",
    date: "Feb 16, 2026",
    time: "08:00 AM",
    type: "task",
    priority: "low",
    description: "Morning briefing with all event volunteers before doors open",
    sendEmail: true,
    syncToCalendar: true,
  },
  {
    id: 6,
    title: "Event Day — Doors Open",
    date: "Feb 17, 2026",
    time: "09:00 AM",
    type: "milestone",
    priority: "high",
    description: "Main event day! Doors open for early arrivals and VIP guests",
    sendEmail: true,
    syncToCalendar: true,
  },
];

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
  const [reminders, setReminders] = useState(MOCK_REMINDERS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddReminder = (data: any) => {
    // Format date from YYYY-MM-DD to "MMM DD, YYYY"
    const dateObj = new Date(data.date);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    // Format 24h time to 12h AM/PM
    const [hours, minutes] = data.time.split(":");
    const hourInt = parseInt(hours);
    const ampm = hourInt >= 12 ? "PM" : "AM";
    const displayHour = hourInt % 12 || 12;
    const formattedTime = `${displayHour}:${minutes} ${ampm}`;

    const newReminder = {
      ...data,
      date: formattedDate,
      time: formattedTime,
    };

    setReminders((prev) => [...prev, newReminder]);
  };

  // Group by date
  const groupedByDate = reminders.reduce((acc, reminder) => {
    if (!acc[reminder.date]) acc[reminder.date] = [];
    acc[reminder.date].push(reminder);
    return acc;
  }, {} as Record<string, typeof MOCK_REMINDERS>);

  // Sort dates (approximation for mock data)
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });

  return (
    <section className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-[#eb5017] uppercase tracking-[0.2em] mb-1">Power-up</p>
          <h2 className="text-3xl font-black text-[#1B1818] tracking-tight">Event Timeline</h2>
          <p className="text-sm text-gray-400 font-medium leading-relaxed">Keep track of key milestones, rehearsals, and task deadlines for your event.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#EB5017] text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#d64815] transition-all active:scale-95 shadow-xl shadow-[#EB5017]/30 shrink-0"
        >
          <HiOutlinePlus className="text-lg" />
          Add Reminder
        </button>
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
                        
                        {/* Status Badges */}
                        <div className="flex items-center gap-1.5">
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
                          {reminder.time}
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
          <div className="py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
             <HiOutlineCalendar className="text-4xl text-gray-300 mx-auto mb-4" />
             <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">No reminders scheduled yet</p>
          </div>
        )}
      </div>

      <AddReminderModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddReminder}
      />
    </section>
  );
}
