"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { HiOutlineDocumentText, HiOutlinePlay } from "react-icons/hi";
import { quizzesService } from "@/lib/services/quizzes.service";
import { toast } from "sonner";

interface QuizCardProps {
  id: string;
  title: string;
  category: string;
  questions: number;
  author: string;
  thumbnail: string;
  categoryColor?: string;
}

const categoryColors: Record<string, string> = {
  SCIENCE: "bg-[#E6F9F4] text-[#0FAF94]",
  ART: "bg-[#FFF2F5] text-[#FF4D81]",
  MUSIC: "bg-[#F0F5FF] text-[#2F54EB]",
  GEOGRAPHY: "bg-[#FFF7E6] text-[#FA8C16]",
  HISTORY: "bg-[#F9F0FF] text-[#722ED1]",
  GAMING: "bg-[#E6FFFB] text-[#13C2C2]",
};

export default function QuizCard({
  id,
  title,
  category,
  questions,
  author,
  thumbnail,
}: QuizCardProps) {
  const params = useParams();
  const router = useRouter();
  const eventId = params._id;
  const colorClass = categoryColors[category.toUpperCase()] || "bg-gray-100 text-gray-600";
  const [isStarting, setIsStarting] = useState(false);

  const handlePlayGame = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsStarting(true);
    try {
      const response = await quizzesService.hostQuiz(id);
      const pin = response?.pin || Math.floor(100000 + Math.random() * 900000).toString();
      toast.success(`Game PIN generated: ${pin}`);
      router.push(`/events/${eventId}/games/${id}/waiting-room?pin=${pin}`);
    } catch (err) {
      const fallbackPin = Math.floor(100000 + Math.random() * 900000).toString();
      router.push(`/events/${eventId}/games/${id}/waiting-room?pin=${fallbackPin}`);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <Link 
      href={`/events/${eventId}/games/${id}`}
      className="bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer h-full flex flex-col font-sans"
    >
      {/* Thumbnail */}
      <div className="relative h-[220px] w-full overflow-hidden bg-gray-100">
        <Image
          src={thumbnail && thumbnail.trim() !== "" ? thumbnail : "/thumbnails/space_trivia.png"}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${colorClass}`}>
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-[#1B1818] mb-4 leading-tight group-hover:text-[#eb5017] transition-colors">
          {title}
        </h3>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-[#667185] font-semibold text-xs">
              <HiOutlineDocumentText className="text-sm" />
              <span>{questions} Questions</span>
            </div>
            <div className="text-[9px] font-black text-gray-400 uppercase tracking-wider mt-0.5">
              BY {author}
            </div>
          </div>

          <button
            onClick={handlePlayGame}
            disabled={isStarting}
            className="bg-[#eb5017] hover:bg-[#d64815] text-white text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all transform active:scale-95 shadow-md shadow-[#eb5017]/20 disabled:opacity-50 cursor-pointer"
          >
            <HiOutlinePlay className="text-sm" />
            {isStarting ? "PIN..." : "Play Game"}
          </button>
        </div>
      </div>
    </Link>
  );
}
