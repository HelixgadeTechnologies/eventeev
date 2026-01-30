"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { 
  HiOutlinePlay, 
  HiOutlineUsers, 
  HiOutlineChevronRight,
  HiOutlineX
} from "react-icons/hi";

export default function GamePlayPage() {
  const router = useRouter();
  const params = useParams();
  const [timeLeft, setTimeLeft] = useState(20);
  const [answersCount, setAnswersCount] = useState(42);
  const totalPlayers = 64;

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      const eventId = params._id;
      const quizId = params.quizId;
      router.push(`/events/${eventId}/games/${quizId}/results`);
    }
  }, [timeLeft, params, router]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#FFFBF7] flex flex-col font-sans overflow-hidden">
      {/* Question Header - Increased padding below */}
      <div className="w-full pt-16 pb-12 px-6 text-center shrink-0">
        <h1 className="text-4xl md:text-5xl font-black text-[#1B1818] max-w-4xl mx-auto leading-tight">
          Which planet is known as the Red Planet?
        </h1>
      </div>

      {/* Main Content Area - Added more vertical gap/padding to push buttons down */}
      <div className="flex-1 flex items-center justify-between px-6 md:px-12 gap-8 min-h-0 mb-12">
        {/* Left: Timer */}
        <div className="flex flex-col items-center gap-4 shrink-0">
          <div className="relative w-28 h-28 md:w-36 md:h-36 flex items-center justify-center">
            {/* Progress Circle Backdrop */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="white"
                stroke="#F2F4F7"
                strokeWidth="12"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="#EB5017"
                strokeWidth="12"
                strokeDasharray={`${(timeLeft / 20) * 282.7} 282.7`}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <span className="text-4xl md:text-5xl font-black text-[#1B1818] z-10">{timeLeft}</span>
          </div>
          <span className="text-[10px] md:text-xs font-black text-[#667185] uppercase tracking-widest opacity-60">
            Seconds Left
          </span>
        </div>

        {/* Middle: Media Area - Removed play button, ensured clean container */}
        <div className="flex-1 max-w-xl relative aspect-video bg-[#1B1818] rounded-[32px] overflow-hidden shadow-2xl group border-[8px] border-white">
          <Image 
            src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1000&auto=format&fit=crop" 
            alt="Space Preview"
            fill
            className="object-cover opacity-90"
          />
        </div>

        {/* Right: Answer Stats */}
        <div className="flex flex-col items-center gap-6 shrink-0">
          <div className="bg-white border border-gray-100 p-8 rounded-[32px] shadow-xl shadow-gray-200/50 flex flex-col items-center gap-1 min-w-[160px]">
            <span className="text-5xl font-black text-[#1B1818]">{answersCount}</span>
            <span className="text-[10px] font-black text-[#667185] uppercase tracking-widest opacity-60 text-center">Answers<br/>Received</span>
          </div>
          <div className="flex items-center gap-2 text-[#667185] font-black text-[12px] opacity-70">
            <HiOutlineUsers className="text-lg" />
            {totalPlayers} Players Participating
          </div>
        </div>
      </div>

      {/* Answer Grid */}
      <div className="p-6 md:p-8 grid grid-cols-2 gap-4 md:gap-6 w-full max-w-7xl mx-auto shrink-0">
        {/* Red / Triangle */}
        <button className="h-20 md:h-28 bg-[#EB1D44] rounded-2xl flex items-center px-6 gap-6 hover:brightness-110 transition-all shadow-lg active:scale-[0.98] border-b-[6px] border-[#b01736]">
           <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-10 h-10 md:w-14 md:h-14">
                <path d="M50 15L85 75H15L50 15Z" fill="none" stroke="white" strokeWidth="10" strokeLinejoin="round" />
              </svg>
           </div>
           <span className="text-2xl md:text-3xl font-black text-white">Mars</span>
        </button>

        {/* Yellow / Circle */}
        <button className="h-20 md:h-28 bg-[#FFC20E] rounded-2xl flex items-center px-6 gap-6 hover:brightness-110 transition-all shadow-lg active:scale-[0.98] border-b-[6px] border-[#cc9b0b]">
           <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-10 h-10 md:w-14 md:h-14">
                <circle cx="50" cy="50" r="35" fill="none" stroke="white" strokeWidth="10" />
              </svg>
           </div>
           <span className="text-2xl md:text-3xl font-black text-white">Jupiter</span>
        </button>

        {/* Blue / X */}
        <button className="h-20 md:h-28 bg-[#1368CE] rounded-2xl flex items-center px-6 gap-6 hover:brightness-110 transition-all shadow-lg active:scale-[0.98] border-b-[6px] border-[#0e4da1]">
           <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-10 h-10 md:w-14 md:h-14">
                <path d="M25 25L75 75M75 25L25 75" fill="none" stroke="white" strokeWidth="12" strokeLinecap="round" />
              </svg>
           </div>
           <span className="text-2xl md:text-3xl font-black text-white">Venus</span>
        </button>

        {/* Green / Square */}
        <button className="h-20 md:h-28 bg-[#26890C] rounded-2xl flex items-center px-6 gap-6 hover:brightness-110 transition-all shadow-lg active:scale-[0.98] border-b-[6px] border-[#1d6b0a]">
           <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-10 h-10 md:w-14 md:h-14">
                <rect x="20" y="20" width="60" height="60" fill="none" stroke="white" strokeWidth="10" />
              </svg>
           </div>
           <span className="text-2xl md:text-3xl font-black text-white">Saturn</span>
        </button>
      </div>

      {/* Footer Controls */}
      <footer className="w-full bg-white border-t border-gray-100 p-4 md:px-12 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-8">
           <div className="bg-gray-100 px-4 py-2 rounded-lg font-black text-[11px] uppercase tracking-widest text-[#667185]">
              PIN: <span className="text-[#1B1818]">452 9012</span>
           </div>
           <span className="text-[#667185] font-black text-[10px] uppercase tracking-widest opacity-60">Question 4 of 12</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-6 py-2.5 bg-gray-100 rounded-xl font-black text-[11px] uppercase tracking-widest text-[#1B1818] hover:bg-gray-200 transition-colors">
            End Game
          </button>
          <button className="px-10 py-3 bg-[#EB5017] text-white rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-[#d64815] transition-all transform active:scale-95 shadow-lg shadow-[#EB5017]/20">
            Skip
            <HiOutlineChevronRight className="text-lg" />
            <HiOutlineChevronRight className="text-lg -ml-3" />
          </button>
        </div>
      </footer>
    </div>
  );
}
