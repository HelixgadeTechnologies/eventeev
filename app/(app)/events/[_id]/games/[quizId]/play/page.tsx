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
      {/* Question Header - Reduced padding */}
      <div className="w-full pt-8 pb-4 px-6 text-center shrink-0">
        <h1 className="text-3xl md:text-4xl font-black text-[#1B1818] max-w-4xl mx-auto leading-tight uppercase font-feather">
          Which planet is known as the Red Planet?
        </h1>
      </div>

      {/* Main Content Area - Reduced vertical gap/padding */}
      <div className="flex-1 flex items-center justify-between px-6 md:px-12 gap-8 min-h-0 mb-4">
        {/* Left: Timer */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="relative w-24 h-24 md:w-28 md:h-28 flex items-center justify-center">
            {/* Progress Circle Backdrop */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="white"
                stroke="#F2F4F7"
                strokeWidth="10"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="#EB5017"
                strokeWidth="10"
                strokeDasharray={`${(timeLeft / 20) * 282.7} 282.7`}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <span className="text-3xl md:text-4xl font-black text-[#1B1818] z-10">{timeLeft}</span>
          </div>
          <span className="text-[10px] font-black text-[#667185] uppercase tracking-widest opacity-60">
            Seconds Left
          </span>
        </div>

        {/* Middle: Media Area - Ensured max-height to prevent overflow */}
        <div className="flex-1 max-w-lg max-h-[30vh] relative aspect-video bg-[#1B1818] rounded-[24px] overflow-hidden shadow-2xl group border-[6px] border-white ring-1 ring-gray-100">
          <Image 
            src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1000&auto=format&fit=crop" 
            alt="Space Preview"
            fill
            className="object-cover opacity-90"
          />
        </div>

        {/* Right: Answer Stats */}
        <div className="flex flex-col items-center gap-4 shrink-0">
          <div className="bg-white border border-gray-100 p-6 rounded-[24px] shadow-xl shadow-gray-200/40 flex flex-col items-center gap-0.5 min-w-[140px]">
            <span className="text-4xl font-black text-[#1B1818] text-orange-600">{answersCount}</span>
            <span className="text-[9px] font-black text-[#667185] uppercase tracking-widest opacity-60 text-center leading-tight">Answers<br/>Received</span>
          </div>
          <div className="flex items-center gap-2 text-[#667185] font-black text-[10px] opacity-70 uppercase tracking-tight">
            <HiOutlineUsers className="text-base" />
            {totalPlayers} Players Participating
          </div>
        </div>
      </div>

      {/* Answer Grid - Reduced button height and gaps */}
      <div className="px-6 md:px-8 pb-6 grid grid-cols-2 gap-3 md:gap-4 w-full max-w-6xl mx-auto shrink-0">
        {/* Red / Triangle */}
        <button className="h-16 md:h-20 bg-[#EB1D44] rounded-xl flex items-center px-5 gap-4 hover:brightness-110 transition-all shadow-lg active:scale-[0.98] border-b-[4px] border-[#b01736]">
           <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-8 h-8 md:w-10 md:h-10">
                <path d="M50 15L85 75H15L50 15Z" fill="none" stroke="white" strokeWidth="10" strokeLinejoin="round" />
              </svg>
           </div>
           <span className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Mars</span>
        </button>

        {/* Yellow / Circle */}
        <button className="h-16 md:h-20 bg-[#FFC20E] rounded-xl flex items-center px-5 gap-4 hover:brightness-110 transition-all shadow-lg active:scale-[0.98] border-b-[4px] border-[#cc9b0b]">
           <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-8 h-8 md:w-10 md:h-10">
                <circle cx="50" cy="50" r="35" fill="none" stroke="white" strokeWidth="10" />
              </svg>
           </div>
           <span className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Jupiter</span>
        </button>

        {/* Blue / X */}
        <button className="h-16 md:h-20 bg-[#1368CE] rounded-xl flex items-center px-5 gap-4 hover:brightness-110 transition-all shadow-lg active:scale-[0.98] border-b-[4px] border-[#0e4da1]">
           <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-8 h-8 md:w-10 md:h-10">
                <path d="M25 25L75 75M75 25L25 75" fill="none" stroke="white" strokeWidth="12" strokeLinecap="round" />
              </svg>
           </div>
           <span className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Venus</span>
        </button>

        {/* Green / Square */}
        <button className="h-16 md:h-20 bg-[#26890C] rounded-xl flex items-center px-5 gap-4 hover:brightness-110 transition-all shadow-lg active:scale-[0.98] border-b-[4px] border-[#1d6b0a]">
           <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-8 h-8 md:w-10 md:h-10">
                <rect x="20" y="20" width="60" height="60" fill="none" stroke="white" strokeWidth="10" />
              </svg>
           </div>
           <span className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Saturn</span>
        </button>
      </div>

      {/* Footer Controls - Reduced padding */}
      <footer className="w-full bg-white border-t border-gray-100 px-6 py-3 md:px-12 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
           <div className="bg-gray-100 px-3 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-widest text-[#667185]">
              PIN: <span className="text-[#1B1818]">452 9012</span>
           </div>
           <span className="text-[#667185] font-black text-[9px] uppercase tracking-widest opacity-60">Question 4 of 12</span>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-5 py-2 bg-gray-50 rounded-lg font-black text-[10px] uppercase tracking-widest text-[#667185] hover:bg-gray-100 transition-colors border border-gray-100">
            End Game
          </button>
          <button className="px-8 py-2.5 bg-[#EB5017] text-white rounded-lg font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-[#d64815] transition-all transform active:scale-95 shadow-md shadow-[#EB5017]/10">
            Skip Question
            <HiOutlineChevronRight className="text-base" />
          </button>
        </div>
      </footer>
    </div>
  );
}
