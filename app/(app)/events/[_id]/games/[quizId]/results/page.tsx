"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { HiOutlineUserGroup, HiOutlineChevronRight, HiOutlineCheckCircle } from "react-icons/hi";

export default function QuestionResultsPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?._id;
  const quizId = params?.quizId;

  // Mock data matching the design
  const results = [
    { label: "Lyon", count: 4, color: "#EB1D44", isCorrect: false },
    { label: "Marseille", count: 8, color: "#FFC20E", isCorrect: false },
    { label: "PARIS", count: 28, color: "#1368CE", isCorrect: true },
    { label: "Bordeaux", count: 2, color: "#26890C", isCorrect: false },
  ];

  const totalPlayers = 42;
  const maxCount = Math.max(...results.map(r => r.count));

  const handleNextQuestion = () => {
    router.push(`/events/${eventId}/games/${quizId}/intro`);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#FFFBF7] flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="w-full p-6 flex items-center justify-between border-b border-gray-100 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#EB5017] rounded-xl flex items-center justify-center shadow-lg shadow-[#EB5017]/20">
            <div className="w-4 h-4 bg-white transform rotate-45" />
          </div>
          <span className="text-xl font-black text-[#1B1818] tracking-tight">Eventeev</span>
          <span className="text-[10px] font-black text-[#667185] uppercase tracking-widest opacity-60 ml-2">Host Dashboard</span>
        </div>
        
        <div className="flex items-center gap-12">
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-black text-[#667185] uppercase tracking-[0.2em] opacity-40">Join PIN</span>
            <span className="text-xl font-black text-[#1B1818] tracking-tight">882 104</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-black text-[#667185] uppercase tracking-[0.2em] opacity-40">Progress</span>
            <span className="text-xl font-black text-[#1B1818] tracking-tight">5 / 10</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-6 py-2.5 border border-gray-200 text-[#EB1D44] rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-red-50 transition-colors">
              End Game
            </button>
            <div className="w-10 h-10 bg-[#F2F4F7] rounded-full border border-gray-100 overflow-hidden">
               <div className="w-full h-full bg-gray-300 opacity-20" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center pt-16 px-12">
        <h1 className="text-5xl md:text-6xl font-black text-[#1B1818] mb-8 tracking-tight">
          What is the capital of France?
        </h1>

        {/* Status Badge */}
        <div className="bg-gradient-to-r from-[#EB5017] to-[#FF7043] text-white px-8 py-2.5 rounded-full font-black text-[11px] uppercase tracking-[0.2em] mb-20 shadow-xl shadow-[#EB5017]/30 transform -rotate-1">
          TIME'S UP!
        </div>

        {/* Bar Chart Container */}
        <div className="w-full max-w-5xl flex items-end justify-between h-[400px] gap-8 relative">
          {results.map((res, i) => (
            <div key={i} className="flex-1 flex flex-col items-center group">
              {/* Correct Indicator */}
              {res.isCorrect && (
                <div className="mb-4 animate-bounce">
                  <HiOutlineCheckCircle className="text-[#26890C] text-5xl" />
                </div>
              )}
              
              {/* Count Label */}
              <span className={`text-4xl font-black mb-4 transition-all duration-500 delay-300 ${res.isCorrect ? 'text-[#1B1818] scale-110' : 'text-[#667185] opacity-40'}`}>
                {res.count}
              </span>

              {/* Bar */}
              <div 
                className={`w-full rounded-t-3xl transition-all duration-1000 ease-out shadow-lg ${res.isCorrect ? 'shadow-[#667185]/20 ring-4 ring-offset-4 ring-[#EB5017]/10' : ''}`}
                style={{ 
                  backgroundColor: res.color,
                  height: `${(res.count / maxCount) * 100}%`,
                  opacity: res.isCorrect ? 1 : 0.6
                }}
              />

              {/* Label */}
              <div className="mt-8 flex flex-col items-center gap-1">
                <span className={`text-lg font-black tracking-tight ${res.isCorrect ? 'text-[#EB5017]' : 'text-[#1B1818] opacity-60'}`}>
                  {res.label}
                </span>
              </div>
            </div>
          ))}

          {/* Baseline */}
          <div className="absolute -bottom-2 inset-x-0 h-1 bg-[#1B1818] rounded-full" />
        </div>
      </main>

      {/* Footer Stats & Actions */}
      <footer className="w-full p-12 flex items-center justify-between">
        <div className="flex items-center gap-8">
           {/* Total Players Card */}
           <div className="bg-white border border-gray-100 p-6 rounded-[32px] shadow-xl shadow-gray-200/50 flex flex-col min-w-[200px] relative overflow-hidden">
              <span className="text-[10px] font-black text-[#667185] uppercase tracking-widest opacity-60">Total Players</span>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-5xl font-black text-[#1B1818]">{totalPlayers}</span>
                <span className="bg-[#E7F8ED] text-[#26890C] px-2 py-1 rounded-lg text-[10px] font-black">
                  +12% vs Q4
                </span>
              </div>
           </div>

           {/* Insights */}
           <div className="flex flex-col gap-1">
              <span className="text-lg font-black text-[#1B1818]">85% Correct Answers</span>
              <span className="text-xs font-black text-[#667185] uppercase tracking-widest opacity-60">
                Top Performer: <span className="text-[#EB5017]">Alex_W</span>
              </span>
           </div>
        </div>

        {/* Next Action */}
        <button 
          onClick={handleNextQuestion}
          className="bg-[#EB5017] text-white px-12 py-6 rounded-[32px] font-black text-2xl uppercase tracking-tighter flex items-center gap-4 hover:bg-[#d64815] transition-all transform active:scale-95 shadow-2xl shadow-[#EB5017]/40 ring-4 ring-[#EB5017]/10"
        >
          Next Question
          <HiOutlineChevronRight className="text-3xl" />
        </button>
      </footer >

      {/* Decorative Bottom Bar */}
      <div className="absolute bottom-0 left-0 h-2 bg-[#EB5017] w-1/2 rounded-r-full shadow-lg" />
    </div>
  );
}
