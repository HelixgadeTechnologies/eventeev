"use client";

import { HiOutlineBell, HiOutlinePlus, HiOutlineCalendar } from "react-icons/hi";
import { useState } from "react";

const MOCK_REMINDERS = [
  {
    id: 1,
    title: "Final Venue Walkthrough",
    date: "Feb 14, 2026",
    time: "10:00 AM",
    type: "task",
    priority: "high",
    description: "Complete final walkthrough of all event areas with the venue manager",
  },
  {
    id: 2,
    title: "Speaker Rehearsal — Keynote",
    date: "Feb 14, 2026",
    time: "2:00 PM",
    type: "rehearsal",
    priority: "high",
    description: "Tech check and run-through with keynote speaker",
  },
  {
    id: 3,
    title: "Catering Confirmation",
    date: "Feb 15, 2026",
    time: "9:00 AM",
    type: "task",
    priority: "medium",
    description: "Confirm final headcount and menu selections with caterer",
  },
  {
    id: 4,
    title: "Social Media Blast — 48hr Countdown",
    date: "Feb 15, 2026",
    time: "12:00 PM",
    type: "marketing",
    priority: "medium",
    description: "Schedule and publish countdown posts across all platforms",
  },
  {
    id: 5,
    title: "Volunteer Briefing",
    date: "Feb 16, 2026",
    time: "8:00 AM",
    type: "task",
    priority: "low",
    description: "Morning briefing with all event volunteers before doors open",
  },
  {
    id: 6,
    title: "Event Day — Doors Open",
    date: "Feb 17, 2026",
    time: "9:00 AM",
    type: "milestone",
    priority: "high",
    description: "Main event day! Doors open for early arrivals and VIP guests",
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
  const [reminders] = useState(MOCK_REMINDERS);

  // Group by date
  const groupedByDate = reminders.reduce((acc, reminder) => {
    if (!acc[reminder.date]) acc[reminder.date] = [];
    acc[reminder.date].push(reminder);
    return acc;
  }, {} as Record<string, typeof MOCK_REMINDERS>);

  return (
    <section className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-[#eb5017] uppercase tracking-[0.2em]">Power-up</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-[#EB5017] text-white px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#d64815] transition-all active:scale-95 shadow-xl shadow-[#EB5017]/20 shrink-0">
          <HiOutlinePlus className="text-lg" />
          Add Reminder
        </button>
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {Object.entries(groupedByDate).map(([date, items]) => (
          <div key={date}>
            {/* Date Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#EB5017]/10 flex items-center justify-center shrink-0">
                <HiOutlineCalendar className="text-lg text-[#EB5017]" />
              </div>
              <h3 className="text-sm font-black text-[#1B1818] uppercase tracking-wider">{date}</h3>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Reminders for this date */}
            <div className="space-y-3 ml-5 border-l-2 border-gray-100 pl-8">
              {items.map((reminder) => (
                <div
                  key={reminder.id}
                  className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group relative"
                >
                  {/* Timeline dot */}
                  <div className={`absolute -left-[41px] top-6 w-3 h-3 rounded-full border-2 border-white shadow-sm ${typeDotColors[reminder.type]}`} />

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-black text-sm text-[#1B1818] tracking-tight">{reminder.title}</h4>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${priorityColors[reminder.priority]}`}>
                          {reminder.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 font-medium mb-2">{reminder.description}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                          <HiOutlineBell className="text-sm text-[#EB5017]" />
                          {reminder.time}
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                          <span className={`w-1.5 h-1.5 rounded-full ${typeDotColors[reminder.type]}`} />
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
      </div>
    </section>
  );
}
