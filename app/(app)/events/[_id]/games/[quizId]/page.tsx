"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  HiOutlineChevronRight, 
  HiOutlineUsers, 
  HiOutlinePlay, 
  HiOutlineEye,
  HiOutlineSparkles,
  HiOutlineQuestionMarkCircle
} from "react-icons/hi";
import { LuClock3, LuChartBar } from "react-icons/lu";
import { FiShare2, FiBookmark, FiAlertTriangle } from "react-icons/fi";
import QuestionPreviewCard from "@/components/games/QuestionPreviewCard";
import RelatedQuizItem from "@/components/games/RelatedQuizItem";
import Button from "@/components/ui/Button";

export default function QuizDetailPage() {
  const params = useParams();
  const eventId = params._id;
  const quizId = params.quizId;

  const [showAnswers, setShowAnswers] = useState(false);

  // Mock Quiz Data
  const quiz = {
    title: "Space Exploration: The Final Frontier",
    category: "SPACE SCIENCE",
    description: "Journey through the stars! Test your knowledge about the solar system, famous galaxies, and the incredible history of human space travel.",
    author: "AstroProfessor",
    isVerified: true,
    thumbnail: "/thumbnails/space_trivia.png",
    stats: {
      questions: 20,
      avgTime: "15m",
      plays: "15.2k",
      level: "Med",
    },
    questions: [
      {
        number: 1,
        timeLimit: "30s",
        question: "Which planet is known as the 'Red Planet'?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctOptionIndex: 1,
        thumbnail: "/thumbnails/mars.png",
      },
      {
        number: 2,
        timeLimit: "60s",
        question: "In what year did the first human land on the moon?",
        options: ["1965", "1972", "1969", "1961"],
        correctOptionIndex: 2,
        thumbnail: "/thumbnails/moon_landing.png",
      },
    ],
    relatedQuizzes: [
      {
        id: "the-solar-system-challenge",
        title: "The Solar System Challenge",
        questions: 12,
        plays: "5.1k",
        thumbnail: "/thumbnails/solar_system.png",
      },
      {
        id: "black-holes-time-travel",
        title: "Black Holes & Time Travel",
        questions: 15,
        plays: "2.8k",
        thumbnail: "/thumbnails/black_hole.png",
      },
    ]
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 font-sans space-y-8 bg-gray-50/50 min-h-screen">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm font-semibold text-[#667185]">
        <Link href={`/events/${eventId}/dashboard`} className="hover:text-[#eb5017]">Home</Link>
        <HiOutlineChevronRight className="text-gray-400" />
        <Link href={`/events/${eventId}/games`} className="hover:text-[#eb5017]">Science</Link>
        <HiOutlineChevronRight className="text-gray-400" />
        <span className="text-[#1B1818] truncate">{quiz.title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-grow space-y-12">
          {/* Hero Section */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="relative w-full md:w-[320px] lg:w-[400px] h-[320px] lg:h-[400px] flex-shrink-0 rounded-[32px] overflow-hidden shadow-xl shadow-gray-200">
              <Image src={quiz.thumbnail} alt={quiz.title} fill className="object-cover" />
            </div>

            <div className="flex-grow space-y-6 py-2">
              <div className="space-y-2">
                <span className="text-xs font-black text-[#eb5017] uppercase tracking-[0.1em]">
                  {quiz.category}
                </span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#1B1818] leading-[1.1] tracking-tight">
                  {quiz.title}
                </h1>
              </div>

              <p className="text-base md:text-lg text-[#667185] leading-relaxed font-medium max-w-2xl">
                {quiz.description}
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden">
                   <Image src="/icons/avatar-placeholder.png" alt={quiz.author} width={40} height={40} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#1B1818]">By {quiz.author}</span>
                  {quiz.isVerified && (
                    <span className="text-[10px] font-black text-[#667185] uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Verified Creator
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button className="bg-[#eb5017] text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-[#d64815] transition-all transform active:scale-95 shadow-lg shadow-[#eb5017]/20">
                  <HiOutlinePlay className="text-xl" />
                  Play Now
                </button>
                <button className="bg-white text-[#1B1818] border-2 border-gray-100 px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:border-[#eb5017] hover:text-[#eb5017] transition-all">
                  <HiOutlineUsers className="text-xl" />
                  Host Game
                </button>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-[#eb5017]">
                <HiOutlineQuestionMarkCircle className="text-lg bg-[#FFF2F0] p-1 rounded w-6 h-6" />
                <span className="text-[10px] font-black uppercase tracking-wider">Questions</span>
              </div>
              <p className="text-2xl font-black text-[#1B1818]">{quiz.stats.questions}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-[#eb5017]">
                <LuClock3 className="text-lg bg-[#FFF2F0] p-1 rounded w-6 h-6" />
                <span className="text-[10px] font-black uppercase tracking-wider">Avg. Time</span>
              </div>
              <p className="text-2xl font-black text-[#1B1818]">{quiz.stats.avgTime}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-[#eb5017]">
                <HiOutlinePlay className="text-lg bg-[#FFF2F0] p-1 rounded w-6 h-6" />
                <span className="text-[10px] font-black uppercase tracking-wider">Plays</span>
              </div>
              <p className="text-2xl font-black text-[#1B1818]">{quiz.stats.plays}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-[#eb5017]">
                <LuChartBar className="text-lg bg-[#FFF2F0] p-1 rounded w-6 h-6" />
                <span className="text-[10px] font-black uppercase tracking-wider">Level</span>
              </div>
              <p className="text-2xl font-black text-[#1B1818]">{quiz.stats.level}</p>
            </div>
          </div>

          {/* Questions Preview */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-[#1B1818] tracking-tight">Questions Preview</h2>
              <button 
                onClick={() => setShowAnswers(!showAnswers)}
                className="bg-white border border-gray-100 px-4 py-2 rounded-xl text-xs font-bold text-[#667185] flex items-center gap-2 hover:border-[#eb5017] transition-all"
              >
                <HiOutlineEye className="text-lg" />
                {showAnswers ? "Hide Answers" : "Show Answers"}
              </button>
            </div>

            <div className="space-y-4">
              {quiz.questions.map((q) => (
                <QuestionPreviewCard key={q.number} {...q} />
              ))}
            </div>

            <div className="flex justify-center pt-4">
              <button className="bg-white border-2 border-gray-100 px-8 py-3 rounded-xl font-bold text-sm text-[#667185] flex items-center gap-2 hover:border-[#eb5017] hover:text-[#eb5017] transition-all">
                <HiOutlineChevronRight className="rotate-90" />
                Load more questions
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[360px] space-y-6">
          {/* Related Quizzes */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3">
              <HiOutlineSparkles className="text-2xl text-[#eb5017]" />
              <h3 className="text-lg font-black text-[#1B1818] tracking-tight">Related Quizzes</h3>
            </div>
            <div className="space-y-6">
              {quiz.relatedQuizzes.map((q) => (
                <RelatedQuizItem key={q.id} {...q} />
              ))}
            </div>
            <button className="w-full bg-gray-50 text-[#667185] py-3.5 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all border border-gray-100">
              Explore All Science Quizzes
            </button>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button className="w-full bg-white border border-gray-100 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-3 hover:border-[#eb5017] transition-all group">
              <FiShare2 className="text-xl text-[#eb5017]" />
              Share with friends
            </button>
            <button className="w-full bg-white border border-gray-100 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-3 hover:border-[#eb5017] transition-all group">
              <FiBookmark className="text-xl text-[#eb5017]" />
              Save to Library
            </button>
            <div className="flex justify-center">
              <button className="text-xs font-bold text-[#667185] flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                <FiAlertTriangle />
                Report this Content
              </button>
            </div>
          </div>

          {/* Rewards Card */}
          <div className="bg-[#FFF8E6] rounded-[24px] border border-[#FFE58F] p-8 space-y-4">
            <h4 className="text-[10px] font-black text-[#eb5017] uppercase tracking-widest">Eventeev Rewards</h4>
            <p className="text-sm font-medium text-[#1B1818] leading-relaxed">
              Complete this quiz with a score over 80% to earn the exclusive <span className="text-[#eb5017] font-black">Star Gazer</span> badge for your profile!
            </p>
          </div>
        </div>
      </div>

      {/* Footer (Simplified as per design) */}
      <footer className="pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 pb-8">
        <div className="flex items-center rotate-[-1deg]">
            <Image src="/logo.svg" alt="Eventeev" width={100} height={24} />
        </div>
        <div className="flex items-center gap-8 text-xs font-bold text-[#667185]">
          <Link href="/about" className="hover:text-[#eb5017]">About Us</Link>
          <Link href="/community" className="hover:text-[#eb5017]">Community</Link>
          <Link href="/privacy" className="hover:text-[#eb5017]">Privacy Policy</Link>
          <Link href="/help" className="hover:text-[#eb5017]">Help Center</Link>
        </div>
        <div className="text-xs font-bold text-[#667185] opacity-60">
          © 2024 Eventeev Platforms Inc.
        </div>
      </footer>
    </div>
  );
}
