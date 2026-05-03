"use client";

import { useState } from "react";
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
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa6";
import QuizCard from "@/components/games/QuizCard";
import CreateQuizModal from "@/components/games/CreateQuizModal";

const categories = [
  { id: "all", name: "All", icon: RiInfinityLine, active: true },
  { id: "science", name: "Science", icon: HiOutlineBeaker },
  { id: "trivia", name: "Trivia", icon: HiOutlineQuestionMarkCircle },
  { id: "music", name: "Music", icon: HiOutlineMusicNote },
  { id: "history", name: "History", icon: HiOutlineBookOpen },
  { id: "geography", name: "Geography", icon: HiOutlineGlobeAlt },
  { id: "pop-culture", name: "Pop Culture", icon: HiOutlineFilm },
];

const featuredQuizzes = [
  {
    id: "space-trivia",
    title: "The Ultimate Space Trivia",
    category: "Science",
    questions: 10,
    author: "SARAH J.",
    thumbnail: "/thumbnails/space_trivia.png",
  },
  {
    id: "modern-art",
    title: "Modern Art Masterpieces",
    category: "Art",
    questions: 12,
    author: "ALEX RIVERS",
    thumbnail: "/thumbnails/modern_art.png",
  },
  {
    id: "pop-hits",
    title: "2000s Pop Hits Quiz",
    category: "Music",
    questions: 20,
    author: "DJ MIKE",
    thumbnail: "/thumbnails/pop_hits.png",
  },
  {
    id: "mountain-ranges",
    title: "Mountain Ranges World Tour",
    category: "Geography",
    questions: 10,
    author: "EXPLORER SAM",
    thumbnail: "/thumbnails/mountain_ranges.png",
  },
  {
    id: "ancient-civilizations",
    title: "Ancient Civilizations 101",
    category: "History",
    questions: 18,
    author: "DR. HISTORY",
    thumbnail: "/thumbnails/ancient_civilizations.png",
  },
  {
    id: "video-game-lore",
    title: "Video Game Lore Expert",
    category: "Gaming",
    questions: 25,
    author: "GAMERTAG99",
    thumbnail: "/thumbnails/video_game_lore.png",
  },
];

// interface GamesPageProps {
//   params?: Promise<{ _id: string }>;
// }

export default function GamesPage() {
  const params = useParams();
  const eventId = params._id;
  const [activeCategory, setActiveCategory] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

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

      {/* Featured Quizzes Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-black text-[#1B1818] tracking-tight font-sans">
            Featured Quizzes
          </h2>
          <span className="bg-[#FFF2F0] text-[#FF4D4F] px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
            NEW
          </span>
        </div>
        <button className="text-[#eb5017] font-bold text-sm hover:underline flex items-center gap-1 group">
          View All <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredQuizzes.map((quiz, index) => (
          <QuizCard key={index} {...quiz} />
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center pt-8">
        <button className="border-2 border-[#eb5017] text-[#eb5017] px-12 py-4 rounded-2xl font-black tracking-tight hover:bg-[#eb5017] hover:text-white transition-all transform active:scale-95">
          Load More Quizzes
        </button>
      </div>

      <CreateQuizModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onNext={handleModalNext}
        categories={categories}
      />
    </div>
  );
}
