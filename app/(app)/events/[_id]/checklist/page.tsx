"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaAngleLeft } from "react-icons/fa6";
import { 
  HiOutlineCheckCircle as HiCheck,
  HiOutlineClipboardList as HiList,
  HiOutlineSparkles as HiSparkles,
  HiOutlineFlag as HiFlag,
  HiOutlineTicket as HiTicket,
  HiOutlineUserGroup as HiUsers,
  HiOutlineLink as HiLink,
  HiOutlineInformationCircle as HiInfo
} from "react-icons/hi";

interface ChecklistTask {
  id: string;
  title: string;
  description: string;
  category: "Setup" | "Marketing" | "Engagement" | "Logistics";
  completed: boolean;
}

// Predefined templates for different event categories
const EVENT_TEMPLATES: Record<string, ChecklistTask[]> = {
  conference: [
    { id: "c1", title: "Speaker Onboarding", description: "Add profiles for all keynote and session speakers.", category: "Setup", completed: true },
    { id: "c2", title: "Ticketing & Tiers", description: "Set up early bird, standard, and VIP ticket tiers.", category: "Setup", completed: false },
    { id: "c3", title: "Sponsor Packages", description: "Finalize sponsor logos and virtual booth setups.", category: "Marketing", completed: false },
    { id: "c4", title: "Session Schedule", description: "Create detailed agenda with tracks and rooms.", category: "Logistics", completed: false },
    { id: "c5", title: "Networking Hub", description: "Configure attendee matchmaking and networking lounges.", category: "Engagement", completed: false },
  ],
  concert: [
    { id: "m1", title: "Artist Lineup", description: "Publish the performing artist lineup and set times.", category: "Setup", completed: false },
    { id: "m2", title: "Merch Store", description: "Set up the online store for event merchandise.", category: "Setup", completed: false },
    { id: "m3", title: "Teaser Campaign", description: "Launch artist teaser videos on social media.", category: "Marketing", completed: false },
    { id: "m4", title: "Stage & AV Specs", description: "Finalize lighting, sound, and stage layout requirements.", category: "Logistics", completed: false },
    { id: "m5", title: "Fan Q&A", description: "Set up live Q&A sessions or meet & greets.", category: "Engagement", completed: false },
  ],
  party: [
    { id: "p1", title: "Guest List", description: "Import and finalize the VIP and general guest list.", category: "Setup", completed: false },
    { id: "p2", title: "Theme & Decor", description: "Finalize the party theme, colors, and decorations.", category: "Setup", completed: false },
    { id: "p3", title: "Digital Invitations", description: "Send out customized digital invites with RSVPs.", category: "Marketing", completed: false },
    { id: "p4", title: "Catering & Menu", description: "Confirm food menu and drink selections.", category: "Logistics", completed: false },
    { id: "p5", title: "Playlist & Games", description: "Curate the music playlist and prepare party games.", category: "Engagement", completed: false },
  ],
  wedding: [
    { id: "w1", title: "Guest Accommodations", description: "Set up hotel blocks and travel information.", category: "Setup", completed: false },
    { id: "w2", title: "Gift Registry", description: "Link the couple's gift registries.", category: "Setup", completed: false },
    { id: "w3", title: "Wedding Website", description: "Publish the wedding story, schedule, and FAQs.", category: "Marketing", completed: false },
    { id: "w4", title: "Seating Chart", description: "Finalize the seating arrangements for the reception.", category: "Logistics", completed: false },
    { id: "w5", title: "Photo Booth & Hashtag", description: "Set up the photo booth and promote the wedding hashtag.", category: "Engagement", completed: false },
  ],
  default: [
    { id: "t1", title: "Event Branding", description: "Upload event banner, logo and set primary theme colors.", category: "Setup", completed: true },
    { id: "t2", title: "Ticket Configuration", description: "Set up free and paid ticket tiers with availability limits.", category: "Setup", completed: false },
    { id: "t4", title: "Social Promotion", description: "Connect social media handles and schedule announcements.", category: "Marketing", completed: false },
    { id: "t7", title: "Engagement Tools", description: "Prepare session polls and interactive games.", category: "Engagement", completed: false },
    { id: "t8", title: "Venue & Schedule", description: "Finalize event location and detailed session timeline.", category: "Logistics", completed: true }
  ]
};

// Map categories to templates
const getTemplateForCategory = (category?: string) => {
  if (!category) return EVENT_TEMPLATES.default;
  const cat = category.toLowerCase();
  if (cat.includes("music") || cat.includes("concert")) return EVENT_TEMPLATES.concert;
  if (cat.includes("tech") || cat.includes("conference")) return EVENT_TEMPLATES.conference;
  if (cat.includes("birthday") || cat.includes("party")) return EVENT_TEMPLATES.party;
  if (cat.includes("wedding")) return EVENT_TEMPLATES.wedding;
  
  // Try exact match or fallback to default
  return EVENT_TEMPLATES[cat] || EVENT_TEMPLATES.default;
};

import { publishedEvents, draftedEvents, completedEvents } from "@/lib/demo-data/events";

export default function ChecklistPage() {
  const { _id } = useParams();
  
  // Find the current event
  const currentEvent = useMemo(() => {
    const allEvents = [...publishedEvents, ...draftedEvents, ...completedEvents];
    return allEvents.find(e => e._id === _id);
  }, [_id]);

  const [tasks, setTasks] = useState<ChecklistTask[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Initialize tasks based on event category
  useMemo(() => {
    const template = getTemplateForCategory(currentEvent?.category || currentEvent?.name);
    setTasks(template);
  }, [currentEvent]);

  const categories = ["All", "Setup", "Marketing", "Engagement", "Logistics"];

  const filteredTasks = tasks.filter(task => 
    activeCategory === "All" ? true : task.category === activeCategory
  );

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const categoryProgress = useMemo(() => {
    return categories.slice(1).reduce((acc, cat) => {
      const catTasks = tasks.filter(t => t.category === cat);
      const completed = catTasks.filter(t => t.completed).length;
      acc[cat] = catTasks.length > 0 ? Math.round((completed / catTasks.length) * 100) : 0;
      return acc;
    }, {} as Record<string, number>);
  }, [tasks]);

  return (
    <div className="space-y-8 pb-20 font-sans">
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
            <p className="text-[10px] font-black text-[#eb5017] uppercase tracking-[0.2em]">Preparation</p>
            <h2 className="text-4xl font-black text-[#1B1818] tracking-tight">Event Checklist</h2>
            <p className="text-sm text-gray-400 font-medium">Complete these essential steps to ensure a successful event launch.</p>
          </div>
          
          <div className="bg-white border border-gray-100 rounded-3xl p-6 flex items-center gap-6 shadow-sm min-w-[280px]">
            <div className="relative w-16 h-16 shrink-0">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="#F3F4F6"
                  strokeWidth="6"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="#EB5017"
                  strokeWidth="6"
                  strokeDasharray={2 * Math.PI * 28}
                  strokeDashoffset={2 * Math.PI * 28 * (1 - progress / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-black text-[#1B1818]">{progress}%</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Overall Progress</p>
              <p className="text-lg font-black text-[#1B1818] tracking-tight">{completedCount} of {tasks.length} Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 px-2 overflow-x-auto pb-2 custom-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeCategory === cat
                ? "bg-[#1B1818] text-white shadow-lg"
                : "bg-white text-gray-400 border border-gray-100 hover:border-[#EB5017] hover:text-[#EB5017]"
            }`}
          >
            {cat}
            {cat !== "All" && (
              <span className={`ml-2 ${activeCategory === cat ? "text-gray-400" : "text-gray-300"}`}>
                {categoryProgress[cat]}%
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`group relative bg-white border rounded-3xl p-6 transition-all duration-300 cursor-pointer hover:shadow-xl ${
              task.completed 
                ? "border-[#EB5017]/20 bg-[#EB5017]/[0.02]" 
                : "border-gray-100 hover:border-[#EB5017]/40"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`mt-1 shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                task.completed 
                  ? "bg-[#EB5017] border-[#EB5017]" 
                  : "border-gray-200 group-hover:border-[#EB5017]"
              }`}>
                {task.completed && <HiCheck className="text-white text-lg" />}
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                    task.category === "Setup" ? "bg-blue-50 text-blue-500" :
                    task.category === "Marketing" ? "bg-purple-50 text-purple-500" :
                    task.category === "Engagement" ? "bg-orange-50 text-orange-500" :
                    "bg-teal-50 text-teal-500"
                  }`}>
                    {task.category}
                  </span>
                  {task.completed && (
                    <span className="text-[8px] font-black text-[#EB5017] uppercase tracking-widest">Done</span>
                  )}
                </div>
                <h4 className={`text-base font-black tracking-tight transition-all duration-300 ${
                  task.completed ? "text-gray-400 line-through" : "text-[#1B1818]"
                }`}>
                  {task.title}
                </h4>
                <p className={`text-xs font-medium leading-relaxed transition-all duration-300 ${
                  task.completed ? "text-gray-300" : "text-gray-400"
                }`}>
                  {task.description}
                </p>
              </div>
            </div>

            {/* Hover Indicator */}
            <div className={`absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity ${
              task.completed ? "text-gray-400" : "text-[#EB5017]"
            }`}>
              <HiInfo className="text-lg" />
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="md:col-span-2 py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
              <HiList className="text-2xl text-gray-300" />
            </div>
            <p className="text-sm text-gray-400 font-medium italic">No tasks found in this category.</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-[#1B1818] rounded-[32px] p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#EB5017]/10 rounded-full blur-[80px]" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-black tracking-tight">Ready to Launch?</h3>
            <p className="text-gray-400 text-sm font-medium">Complete all tasks to unlock your pre-event marketing kit.</p>
          </div>
          <button 
            disabled={progress < 100}
            className={`px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all ${
              progress === 100 
                ? "bg-[#EB5017] text-white hover:bg-[#d64815] shadow-xl shadow-[#EB5017]/20 active:scale-95"
                : "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
            }`}
          >
            {progress === 100 ? "Get Marketing Kit" : "Launch Pending"}
          </button>
        </div>
      </div>
    </div>
  );
}
