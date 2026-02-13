"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { HiOutlineChevronRight, HiOutlineCheckCircle } from "react-icons/hi";

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

  // const totalPlayers = 42; // Removed to fix lint error
  const maxCount = Math.max(...results.map(r => r.count));
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showEndModal, setShowEndModal] = useState(false);
  const totalDuration = 4000; // 4 seconds

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / totalDuration) * 100, 100);
      setLoadingProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        router.push(`/events/${eventId}/games/${quizId}/leaderboard`);
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [router, eventId, quizId]);

  const handleNextQuestion = () => {
    router.push(`/events/${eventId}/games/${quizId}/leaderboard`);
  };

  const handleEndGame = () => {
    setShowEndModal(true);
  };

  const confirmEndGame = () => {
    router.push(`/events/${eventId}/games`);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#FFFBF7] flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="w-full px-6 py-3 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2">
          <Image src="/logo-black.svg" alt="Eventeev" width={130} height={42} priority />
        </div>
        
        <div className="flex items-center gap-10">
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-black text-[#667185] uppercase tracking-[0.2em] opacity-40">Join PIN</span>
            <span className="text-xl font-black text-[#1B1818] tracking-tight">882 104</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-black text-[#667185] uppercase tracking-[0.2em] opacity-40">Progress</span>
            <span className="text-xl font-black text-[#1B1818] tracking-tight">5 / 10</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleEndGame} className="px-5 py-2 border-2 border-red-100 text-[#EB1D44] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-colors">
              End Game
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full border-2 border-white shadow-lg flex items-center justify-center overflow-hidden">
               <div className="w-full h-full bg-gray-300 opacity-20" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-between pt-12 pb-4 px-2 text-center overflow-hidden">
        <h1 className="text-[36px] md:text-[42px] font-black text-[#1B1818] tracking-tight leading-none max-w-5xl font-feather uppercase">
          What is the capital of France?
        </h1>

        {/* Bar Chart Container */}
        <div className="w-full max-w-5xl flex items-end justify-between gap-6 relative px-8 mb-0">
          {results.map((res, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              {/* Correct Indicator & Count (Floating above) */}
              <div className="flex flex-col items-center mb-2">
                {res.isCorrect && (
                  <div className="w-8 h-8 bg-[#26890C] rounded-full flex items-center justify-center mb-1 shadow-lg shadow-[#26890C]/30 animate-bounce">
                    <HiOutlineCheckCircle className="text-white text-xl" />
                  </div>
                )}
                <span className={`text-[36px] font-black leading-none transition-all duration-500 delay-300 ${res.isCorrect ? 'text-[#EB5017]' : 'text-[#1B1818]'}`}>
                  {res.count}
                </span>
              </div>

              {/* Bar (Relative Height Area) */}
              <div className="w-full h-[25vh] min-h-[120px] max-h-[250px] flex items-end">
                <div 
                  className={`w-full rounded-xl transition-all duration-1000 ease-out shadow-lg ${res.isCorrect ? 'shadow-2xl shadow-[#667185]/20 ring-[3px] ring-[#EB5017]/5' : ''}`}
                  style={{ 
                    backgroundColor: res.color,
                    height: `${(res.count / maxCount) * 100}%`,
                    opacity: res.isCorrect ? 1 : 0.8
                  }}
                />
              </div>

              {/* Answer Label */}
              <div className="mt-4 flex flex-col items-center">
                <span className={`text-lg font-black tracking-tight uppercase ${res.isCorrect ? 'text-[#EB5017]' : 'text-[#667185]'}`}>
                  {res.label}
                </span>
              </div>
            </div>
          ))}

          {/* Baseline */}
          <div className="absolute -bottom-1 inset-x-0 h-1 bg-[#1B1818] rounded-full" />
        </div>
      </main>

      {/* Footer Stats & Actions */}
      <footer className="w-full px-8 py-6 md:px-12 md:py-8 flex items-center justify-between mt-auto bg-white/40 border-t border-gray-50 shrink-0">
        <div className="flex items-center gap-8">
           {/* Total Players Card */}
           <div className="bg-white border border-gray-100 p-4 rounded-[24px] shadow-xl shadow-gray-200/40 flex flex-col min-w-[200px]">
              <span className="text-[9px] font-black text-[#667185] opacity-40 uppercase tracking-[0.2em]">Total Players</span>
              <div className="flex items-center gap-4 mt-0.5">
                <span className="text-[32px] font-black text-[#1B1818] leading-none text-orange-600">42</span>
                <span className="bg-[#E7F8ED] text-[#26890C] px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase">
                  +12% vs Q4
                </span>
              </div>
           </div>

           {/* Insights */}
           <div className="flex flex-col -gap-1">
              <span className="text-lg font-black text-[#1B1818]">85% Correct Answers</span>
              <span className="text-[10px] font-black text-[#667185] uppercase tracking-widest opacity-60">
                Top Performer: <span className="text-[#EB5017] border-b border-[#EB5017]/20 uppercase">Alex_W</span>
              </span>
           </div>
        </div>

        {/* Next Action */}
        <button 
          onClick={handleNextQuestion}
          className="bg-[#EB5017] text-white px-8 py-3.5 rounded-[20px] font-black text-[18px] uppercase tracking-tight flex items-center gap-3 hover:bg-[#d64815] transition-all transform active:scale-[0.98] shadow-2xl shadow-[#EB5017]/30"
        >
          Next Question
          <HiOutlineChevronRight className="text-xl" />
        </button>
      </footer>

      {/* End Game Confirmation Modal */}
      {showEndModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EB1D44" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-[#1B1818]">End Game?</h3>
              <p className="text-sm text-[#667185]">Are you sure you want to end this game? All progress will be lost and players will be disconnected.</p>
              <div className="flex gap-3 w-full mt-2">
                <button
                  onClick={() => setShowEndModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-[#667185] font-bold text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmEndGame}
                  className="flex-1 px-4 py-3 rounded-xl bg-[#EB1D44] text-white font-bold text-sm hover:bg-[#d41a3d] transition-colors shadow-lg shadow-[#EB1D44]/20"
                >
                  Yes, End Game
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Bar at the bottom */}
      <div className="absolute bottom-0 left-0 h-3 bg-gray-100 w-full overflow-hidden">
        <div 
          className="h-full bg-[#EB5017] shadow-[0_0_20px_rgba(235,80,23,0.5)] transition-all duration-100 ease-linear"
          style={{ width: `${loadingProgress}%` }}
        />
      </div>
    </div>
  );
}
