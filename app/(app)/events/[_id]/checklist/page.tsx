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
  HiOutlineInformationCircle as HiInfo,
  HiOutlineDownload,
  HiOutlinePlus
} from "react-icons/hi";
import { checklistService } from "@/lib/services/checklist.service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import AddReminderModal from "@/components/calendar/AddReminderModal";

interface ChecklistTask {
  id: string;
  _id?: string;
  title: string;
  description: string;
  category: string;
  status: 'Complete' | 'Incomplete';
}

// Removed PREDEFINED TEMPLATES (now handled by backend)


export default function ChecklistPage() {
  const { _id } = useParams();
  const eventId = (Array.isArray(_id) ? _id[0] : _id) || "";
  
  const [tasks, setTasks] = useState<ChecklistTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      if (!eventId) return;
      setIsLoading(true);
      const data = await checklistService.getChecklist(eventId);
      setTasks(data);
    } catch (error) {
      console.error("Error fetching checklist:", error);
      toast.error("Failed to load checklist");
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const categories = ["All", "Setup", "Marketing", "Engagement", "Logistics"];

  const filteredTasks = tasks.filter(task => 
    activeCategory === "All" ? true : task.category === activeCategory
  );

  const toggleTask = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Complete' ? 'Incomplete' : 'Complete';
    try {
      // Optimistic update
      setTasks(prev => prev.map(task => 
        (task._id === taskId || task.id === taskId) ? { ...task, status: newStatus as any } : task
      ));

      await checklistService.updateItem(taskId, { status: newStatus });
      toast.success(newStatus === 'Complete' ? "Task marked as done" : "Task marked as pending");
    } catch (error) {
      // Revert on error
      fetchTasks();
      toast.error("Failed to update task status");
    }
  };

  const handleInitialize = async (type: string) => {
    try {
      setIsInitializing(true);
      await checklistService.initializeChecklist(eventId, type);
      toast.success(`Checklist initialized for ${type}`);
      setShowTemplates(false);
      fetchTasks();
    } catch (error) {
      toast.error("Failed to initialize checklist");
    } finally {
      setIsInitializing(false);
    }
  };

  const handleAddTask = async (data: any) => {
    try {
      const payload = {
        ...data,
        event: eventId,
        category: data.type.charAt(0).toUpperCase() + data.type.slice(1), // Capitalize
        status: 'Incomplete'
      };
      
      await checklistService.createItem(payload);
      toast.success("Task added to checklist");
      fetchTasks();
    } catch (error) {
      toast.error("Failed to save task");
    }
  };

  const completedCount = tasks.filter(t => t.status === 'Complete').length;
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const categoryProgress = useMemo(() => {
    return categories.slice(1).reduce((acc, cat) => {
      const catTasks = tasks.filter(t => t.category === cat);
      const completed = catTasks.filter(t => t.status === 'Complete').length;
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
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="bg-white border border-gray-100 rounded-3xl px-6 py-3 flex items-center gap-4 shadow-sm">
                <div className="relative w-8 h-8 shrink-0">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="16" cy="16" r="14" fill="none" stroke="#F3F4F6" strokeWidth="3" />
                    <circle cx="16" cy="16" r="14" fill="none" stroke="#EB5017" strokeWidth="3" strokeDasharray={2 * Math.PI * 14} strokeDashoffset={2 * Math.PI * 14 * (1 - progress / 100)} strokeLinecap="round" className="transition-all duration-1000" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black">{progress}%</div>
                </div>
                <div className="hidden sm:block">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{completedCount}/{tasks.length}</p>
                  <p className="text-[10px] font-black text-[#1B1818] uppercase tracking-tighter">Done</p>
                </div>
              </div>

              <div className="relative">
                <button 
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="bg-white border-2 border-gray-100 text-[#1B1818] px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:border-[#EB5017] hover:text-[#EB5017] transition-all active:scale-95 flex items-center gap-2"
                >
                  <HiOutlineDownload size={16} />
                  Templates
                </button>
                {showTemplates && (
                  <div className="absolute top-[calc(100%+12px)] right-0 w-[240px] bg-white rounded-3xl shadow-2xl border border-gray-50 z-[100] p-4 animate-in fade-in slide-in-from-top-4">
                    <div className="space-y-1">
                      {['conference', 'concert', 'wedding', 'default'].map((type) => (
                        <button
                          key={type}
                          onClick={() => handleInitialize(type)}
                          disabled={isInitializing}
                          className="w-full text-left p-4 rounded-2xl hover:bg-[#FFF8F2] hover:text-[#EB5017] transition-all border border-transparent hover:border-[#EB5017]/20"
                        >
                          <span className="text-[10px] font-black uppercase tracking-widest">{type}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#EB5017] text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-[#d64815] transition-all active:scale-95 shadow-xl shadow-[#EB5017]/30 flex items-center gap-2"
              >
                <HiOutlinePlus size={16} />
                Add Task
              </button>
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
            key={task._id || task.id}
            onClick={() => toggleTask((task._id || task.id), task.status)}
            className={`group relative bg-white border rounded-3xl p-6 transition-all duration-300 cursor-pointer hover:shadow-xl ${
              task.status === 'Complete' 
                ? "border-[#EB5017]/20 bg-[#EB5017]/[0.02]" 
                : "border-gray-100 hover:border-[#EB5017]/40"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`mt-1 shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                task.status === 'Complete' 
                  ? "bg-[#EB5017] border-[#EB5017]" 
                  : "border-gray-200 group-hover:border-[#EB5017]"
              }`}>
                {task.status === 'Complete' && <HiCheck className="text-white text-lg" />}
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
                  {task.status === 'Complete' && (
                    <span className="text-[8px] font-black text-[#EB5017] uppercase tracking-widest">Done</span>
                  )}
                </div>
                <h4 className={`text-base font-black tracking-tight transition-all duration-300 ${
                  task.status === 'Complete' ? "text-gray-400 line-through" : "text-[#1B1818]"
                }`}>
                  {task.title}
                </h4>
                <p className={`text-xs font-medium leading-relaxed transition-all duration-300 ${
                  task.status === 'Complete' ? "text-gray-300" : "text-gray-400"
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

        {filteredTasks.length === 0 && !isLoading && (
          <div className="md:col-span-2 py-20 text-center bg-gray-50/50 rounded-[48px] border-2 border-dashed border-gray-100 flex flex-col items-center max-w-4xl mx-auto w-full">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-[#EB5017] mb-6">
              <HiOutlineDownload size={32} />
            </div>
            <h3 className="text-xl font-black text-[#1B1818] tracking-tight mb-2 uppercase">Awaiting Checklist Items</h3>
            <p className="text-sm text-gray-400 font-medium leading-relaxed mb-8 max-w-sm mx-auto">
              Ready to launch? Start by adding tasks or use our pre-built templates to populate your event checklist instantly.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['conference', 'concert', 'wedding'].map((type) => (
                <button 
                  key={type}
                  onClick={() => handleInitialize(type)}
                  disabled={isInitializing}
                  className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-[#EB5017] hover:text-[#EB5017] transition-all disabled:opacity-50"
                >
                  {type} Template
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="md:col-span-2 py-20 flex flex-col items-center justify-center space-y-4">
             <Loader2 className="w-10 h-10 animate-spin text-[#EB5017]" />
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading Checklist...</p>
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
      {/* Modal Integration */}
      <AddReminderModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTask}
      />
    </div>
  );
}
