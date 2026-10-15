"use client";

import { useState, useEffect, useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import { 
  HiOutlineBeaker, 
  HiOutlineQuestionMarkCircle, 
  HiOutlineMusicNote, 
  HiOutlineBookOpen, 
  HiOutlineGlobeAlt,
  HiOutlineFilm
} from "react-icons/hi";
import { RiInfinityLine } from "react-icons/ri";
import { IoAdd } from "react-icons/io5";
import { usePathname, useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa6";
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

export default function GamesPage() {
  const params = useParams();
  const eventId = params._id as string;
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!eventId) return;
    const fetchEventQuizzes = async () => {
      try {
        setLoading(true);
        const data = await quizzesService.getQuizzesByEvent(eventId);
        setQuizzes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching event quizzes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEventQuizzes();
  }, [eventId]);

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((q) => {
      const matchesCategory = activeCategory === "all" || q.category?.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch = !searchQuery || q.title?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [quizzes, activeCategory, searchQuery]);

  const handleCreateQuiz = () => {
    setIsCreateModalOpen(true);
  };

  const handleModalNext = (data: { title: string; description: string; category: string; coverImage: string }) => {
    const pathSegments = pathname.split("/");
    const eventId = pathSegments[2];
    const quizId = crypto.randomUUID();
    
    const queryParams = new URLSearchParams({
      id: quizId,
      title: data.title,
      description: data.description,
      category: data.category,
      coverImage: data.coverImage
    }).toString();

    router.push(`/events/${eventId}/games/create?${queryParams}`);
  };

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto space-y-12 font-sans">
      <div className="w-full flex flex-col gap-4 justify-start">
        <Link 
            href={`/events/${eventId}/dashboard`} 
            className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#EB5017] transition-all group"
        >
            <FaAngleLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
        </Link>
        <Link 
            href="../games" 
            className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#EB5017] transition-all group"
        >
            <FaAngleLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
            Back to Selection
        </Link>
      </div>
      {/* Header with Create Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#1B1818] tracking-tight">Games</h1>
          <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">Discover and create interactive quizzes</p>
        </div>
        <button 
          onClick={handleCreateQuiz}
          className="bg-[#eb5017] text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[#d64815] transition-all transform active:scale-95 shadow-xl shadow-[#eb5017]/30 whitespace-nowrap"
        >
          <IoAdd className="text-2xl" />
          Create New Quiz
        </button>
      </div>
      {/* Search Bar */}
      <div className="w-full bg-white rounded-[40px] shadow-sm border border-gray-100 p-2 pl-6 flex items-center md:max-w-4xl mx-auto">
        <FiSearch className="text-[#98A2B3] text-xl" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Find a quiz on science, history, or pop culture..."
          className="flex-grow px-4 outline-none text-[#1B1818] text-base placeholder:text-[#98A2B3] font-normal"
        />
        <button className="bg-[#eb5017] text-white px-8 py-3.5 rounded-[32px] font-bold hover:bg-[#d64815] transition-all transform active:scale-95 shadow-lg shadow-[#eb5017]/20 ml-2">
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
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${
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

      {/* Event Quizzes Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-black text-[#1B1818] tracking-tight font-sans">
            Event Quizzes
          </h2>
          {quizzes.length > 0 && (
            <span className="bg-[#FFF2F0] text-[#EB5017] px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
              {quizzes.length} Total
            </span>
          )}
        </div>
      </div>

      {/* Quizzes Grid or Empty State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#eb5017]"></div>
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="bg-white rounded-[32px] border border-dashed border-gray-200 p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-[#FFF2F0] text-[#EB5017] rounded-full flex items-center justify-center text-2xl font-black">
            🎮
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-[#1B1818]">No Quizzes Created Yet</h3>
            <p className="text-gray-400 text-sm max-w-md">
              Create interactive trivia, games, and quizzes to engage your event participants.
            </p>
          </div>
          <button 
            onClick={handleCreateQuiz}
            className="bg-[#eb5017] text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#d64815] transition-all transform active:scale-95 shadow-md shadow-[#eb5017]/20"
          >
            Create Your First Quiz
          </button>
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
