"use client";

import { useState, useEffect, useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import { 
  HiOutlineBeaker, 
  HiOutlineQuestionMarkCircle, 
  HiOutlineMusicNote, 
  HiOutlineBookOpen, 
  HiOutlineGlobeAlt,
  HiOutlineFilm,
  HiOutlineDocumentText,
  HiOutlineSparkles,
  HiOutlineDuplicate
} from "react-icons/hi";
import { RiInfinityLine } from "react-icons/ri";
import { IoAdd } from "react-icons/io5";
import { usePathname, useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import QuizCard from "@/components/games/QuizCard";
import CreateQuizModal from "@/components/games/CreateQuizModal";
import { quizzesService } from "@/lib/services/quizzes.service";

const categories = [
  { id: "all", name: "All", icon: RiInfinityLine, active: true },
  { id: "science", name: "Science", icon: HiOutlineBeaker },
  { id: "trivia", name: "Trivia", icon: HiOutlineQuestionMarkCircle },
  { id: "music", name: "Music", icon: HiOutlineMusicNote },
  { id: "history", name: "History", icon: HiOutlineBookOpen },
  { id: "geography", name: "Geography", icon: HiOutlineGlobeAlt },
  { id: "pop-culture", name: "Pop Culture", icon: HiOutlineFilm },
];

const categoryColors: Record<string, string> = {
  SCIENCE: "bg-[#E6F9F4] text-[#0FAF94]",
  ART: "bg-[#FFF2F5] text-[#FF4D81]",
  MUSIC: "bg-[#F0F5FF] text-[#2F54EB]",
  GEOGRAPHY: "bg-[#FFF7E6] text-[#FA8C16]",
  HISTORY: "bg-[#F9F0FF] text-[#722ED1]",
  GAMING: "bg-[#E6FFFB] text-[#13C2C2]",
  TRIVIA: "bg-[#FFF2F0] text-[#EB5017]",
  GENERAL: "bg-gray-100 text-gray-700",
};

export default function GamesPage() {
  const params = useParams();
  const eventId = params._id as string;
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [templateQuizzes, setTemplateQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"event" | "templates">("event");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [cloningId, setCloningId] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const fetchQuizzes = async () => {
    if (!eventId) return;
    try {
      setLoading(true);
      const [eventData, templatesData] = await Promise.all([
        quizzesService.getQuizzesByEvent(eventId),
        quizzesService.getTemplateQuizzes()
      ]);
      setQuizzes(Array.isArray(eventData) ? eventData : []);
      setTemplateQuizzes(Array.isArray(templatesData) ? templatesData : []);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [eventId]);

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((q) => {
      const matchesCategory = activeCategory === "all" || q.category?.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch = !searchQuery || q.title?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [quizzes, activeCategory, searchQuery]);

  const filteredTemplates = useMemo(() => {
    return templateQuizzes.filter((q) => {
      const matchesCategory = activeCategory === "all" || q.category?.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch = !searchQuery || 
        q.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [templateQuizzes, activeCategory, searchQuery]);

  const handleCreateQuiz = () => {
    setIsCreateModalOpen(true);
  };

  const handleModalNext = (data: { title: string; description: string; category: string; coverImage: string }) => {
    const targetEventId = eventId || (() => {
      const segments = pathname.split("/").filter(Boolean);
      const eventsIndex = segments.indexOf("events");
      return eventsIndex !== -1 && segments[eventsIndex + 1] ? segments[eventsIndex + 1] : "";
    })();
    
    const queryParams = new URLSearchParams({
      title: data.title,
      description: data.description,
      category: data.category,
      coverImage: data.coverImage
    }).toString();

    router.push(`/events/${targetEventId}/games/create?${queryParams}`);
  };

  const handleUseTemplate = (template: any) => {
    const targetEventId = eventId || (() => {
      const segments = pathname.split("/").filter(Boolean);
      const eventsIndex = segments.indexOf("events");
      return eventsIndex !== -1 && segments[eventsIndex + 1] ? segments[eventsIndex + 1] : "";
    })();

    const queryParams = new URLSearchParams({
      templateId: template._id,
      title: template.title || "",
      category: template.category || "",
      description: template.description || "",
      coverImage: template.thumbnail || template.coverImage || ""
    }).toString();

    router.push(`/events/${targetEventId}/games/create?${queryParams}`);
  };

  const handleCloneTemplate = async (templateId: string) => {
    try {
      setCloningId(templateId);
      await quizzesService.cloneQuiz(templateId, eventId);
      toast.success("Quiz added to your event!");
      const eventData = await quizzesService.getQuizzesByEvent(eventId);
      setQuizzes(Array.isArray(eventData) ? eventData : []);
      setActiveTab("event");
    } catch (err: any) {
      console.error("Failed to clone quiz:", err);
      toast.error(err?.response?.data?.message || "Failed to add quiz to event.");
    } finally {
      setCloningId(null);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto space-y-10 font-sans">

      {/* Header with Create Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#1B1818] tracking-tight">Trivia & Quizzes</h1>
          <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">Discover and deploy interactive games for your event</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/events/${eventId}/games/join`}
            className="bg-white border border-gray-200 text-[#1B1818] px-5 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:border-[#eb5017] hover:text-[#eb5017] transition-all whitespace-nowrap shadow-xs cursor-pointer text-sm"
          >
            <HiOutlineDocumentText className="text-xl text-[#eb5017]" />
            Join with PIN
          </Link>
          <button 
            onClick={() => setActiveTab("templates")}
            className="bg-white border border-gray-200 text-[#1B1818] px-6 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:border-[#eb5017] hover:text-[#eb5017] transition-all whitespace-nowrap shadow-xs cursor-pointer text-sm"
          >
            <HiOutlineSparkles className="text-xl text-[#eb5017]" />
            Pick from Templates
          </button>
          <button 
            onClick={handleCreateQuiz}
            className="bg-[#eb5017] text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[#d64815] transition-all transform active:scale-95 shadow-xl shadow-[#eb5017]/30 whitespace-nowrap cursor-pointer text-sm"
          >
            <IoAdd className="text-2xl" />
            Create New Quiz
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="w-full bg-white rounded-[40px] shadow-sm border border-gray-100 p-2 pl-6 flex items-center md:max-w-4xl mx-auto">
        <FiSearch className="text-[#98A2B3] text-xl" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Find a quiz on science, history, tech, or pop culture..."
          className="flex-grow px-4 outline-none text-[#1B1818] text-base placeholder:text-[#98A2B3] font-normal"
        />
        <button className="bg-[#eb5017] text-white px-8 py-3.5 rounded-[32px] font-bold hover:bg-[#d64815] transition-all transform active:scale-95 shadow-lg shadow-[#eb5017]/20 ml-2 cursor-pointer">
          Search
        </button>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 cursor-pointer ${
                isActive 
                  ? "bg-[#eb5017] text-white shadow-lg shadow-[#eb5017]/20 scale-105" 
                  : "bg-white text-[#667185] border border-gray-100 hover:border-[#eb5017] hover:text-[#eb5017]"
              }`}
            >
              <Icon className="text-lg" />
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab("event")}
            className={`pb-3 text-sm font-black uppercase tracking-wider transition-all relative flex items-center gap-2 cursor-pointer ${
              activeTab === "event" ? "text-[#EB5017]" : "text-gray-400 hover:text-gray-700"
            }`}
          >
            <span>My Event Quizzes</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
              activeTab === "event" ? "bg-[#FFF2F0] text-[#EB5017]" : "bg-gray-100 text-gray-500"
            }`}>
              {quizzes.length}
            </span>
            {activeTab === "event" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#EB5017] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("templates")}
            className={`pb-3 text-sm font-black uppercase tracking-wider transition-all relative flex items-center gap-2 cursor-pointer ${
              activeTab === "templates" ? "text-[#EB5017]" : "text-gray-400 hover:text-gray-700"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <HiOutlineSparkles className="text-base text-amber-500" />
              Featured Quiz Templates
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
              activeTab === "templates" ? "bg-amber-50 text-amber-600" : "bg-gray-100 text-gray-500"
            }`}>
              {templateQuizzes.length}
            </span>
            {activeTab === "templates" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#EB5017] rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#eb5017]"></div>
        </div>
      ) : activeTab === "event" ? (
        /* Event Quizzes View */
        filteredQuizzes.length === 0 ? (
          <div className="bg-white rounded-[32px] border border-dashed border-gray-200 p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-[#FFF2F0] text-[#EB5017] rounded-full flex items-center justify-center text-2xl font-black">
              🎮
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[#1B1818]">No Event Quizzes Created Yet</h3>
              <p className="text-gray-400 text-sm max-w-md">
                Create a customized quiz or pick from our ready-made trivia library to get started right away.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={handleCreateQuiz}
                className="bg-[#eb5017] text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#d64815] transition-all transform active:scale-95 shadow-md shadow-[#eb5017]/20 cursor-pointer"
              >
                Create From Scratch
              </button>
              {templateQuizzes.length > 0 && (
                <button 
                  onClick={() => setActiveTab("templates")}
                  className="bg-white border border-gray-200 text-[#1B1818] px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:border-[#eb5017] hover:text-[#eb5017] transition-all cursor-pointer"
                >
                  Explore {templateQuizzes.length} Templates
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredQuizzes.map((quiz, index) => (
              <QuizCard 
                key={quiz._id || quiz.id || index}
                id={quiz._id || quiz.id}
                title={quiz.title}
                category={quiz.category || "General"}
                questions={quiz.questions?.length || 0}
                author={quiz.author || "Organizer"}
                thumbnail={quiz.coverImage || quiz.thumbnail || "/thumbnails/space_trivia.png"}
              />
            ))}
          </div>
        )
      ) : (
        /* Templates View */
        filteredTemplates.length === 0 ? (
          <div className="bg-white rounded-[32px] border border-dashed border-gray-200 p-12 text-center flex flex-col items-center justify-center space-y-2">
            <p className="text-gray-500 font-bold text-sm">No template quizzes found matching your filters.</p>
            <p className="text-gray-400 text-xs">Try selecting a different category or searching for another keyword.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => {
              const colorClass = categoryColors[template.category?.toUpperCase()] || "bg-gray-100 text-gray-700";
              const isCloning = cloningId === template._id;

              return (
                <div 
                  key={template._id}
                  className="bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col font-sans group"
                >
                  {/* Thumbnail Banner */}
                  <div className="relative h-[200px] w-full overflow-hidden bg-gray-100">
                    <Image
                      src={template.thumbnail && template.thumbnail.trim() !== "" ? template.thumbnail : "/thumbnails/space_trivia.png"}
                      alt={template.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${colorClass}`}>
                        {template.category}
                      </span>
                      {template.level && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-xs text-white">
                          {template.level} • {template.avgTime || "15m"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-[#1B1818] mb-2 leading-tight">
                      {template.title}
                    </h3>
                    {template.description && (
                      <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                        {template.description}
                      </p>
                    )}

                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500 mb-5">
                      <div className="flex items-center gap-1.5 font-bold">
                        <HiOutlineDocumentText className="text-base text-gray-400" />
                        <span>{template.questions?.length || 0} Questions</span>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                        BY {template.author || "Staff"}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleUseTemplate(template)}
                        className="w-full py-2.5 rounded-xl bg-[#EB5017] hover:bg-[#d64815] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#EB5017]/20 cursor-pointer"
                      >
                        <HiOutlineSparkles size={14} />
                        <span>Use Quiz</span>
                      </button>

                      <button
                        disabled={isCloning}
                        onClick={() => handleCloneTemplate(template._id)}
                        className="w-full py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#1B1818] font-bold text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        <HiOutlineDuplicate size={14} />
                        <span>{isCloning ? "Adding..." : "Quick Add"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      <CreateQuizModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onNext={handleModalNext}
        categories={categories}
      />
    </div>
  );
}
