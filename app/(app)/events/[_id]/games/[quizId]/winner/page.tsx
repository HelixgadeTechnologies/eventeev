"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import confetti from "canvas-confetti";
import { HiOutlineTrophy, HiOutlineHome, HiOutlineShare } from "react-icons/hi2";
import { quizzesService } from "@/lib/services/quizzes.service";

export default function WinnerPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?._id;
  const quizId = params?.quizId as string;

  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const winners = [
    { rank: 2, name: "RocketMan", points: "8,420", avatar: "/icons/avatar-placeholder.png", color: "#E2E8F0" },
    { rank: 1, name: "SpaceExplorer", points: "9,850", avatar: "/icons/avatar-placeholder.png", color: "#FFD700" },
    { rank: 3, name: "StarGazer", points: "7,900", avatar: "/icons/avatar-placeholder.png", color: "#CD7F32" },
  ];

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await quizzesService.getQuiz(quizId);
        setQuiz(data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();

    // Initial confetti burst
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, [quizId]);

  const handleFinish = () => {
    router.push(`/events/${eventId}/games`);
  };

  if (loading || !quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFFBF7]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#eb5017]"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#FFFBF7] flex flex-col font-sans overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
         <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#EB5017] rounded-full blur-[120px]" />
         <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#FFC20E] rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="w-full p-8 flex items-center justify-between relative z-10">
        <Image src="/logo-black.svg" alt="Eventeev" width={140} height={45} priority />
        <div className="flex items-center gap-4">
           <button className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-400 hover:text-[#EB5017] transition-colors">
              <HiOutlineShare className="text-2xl" />
           </button>
        </div>
      </header>

      {/* Winner Content */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-12 duration-1000">
          <div className="inline-flex items-center gap-3 bg-[#FFF2F0] text-[#EB5017] px-6 py-2 rounded-full font-black text-xs uppercase tracking-[0.3em] mb-6 border border-[#EB5017]/10 shadow-sm">
            <HiOutlineTrophy className="text-lg" />
            Quiz Completed
          </div>
          <h1 className="text-[64px] md:text-[80px] font-black text-[#1B1818] tracking-tighter leading-none mb-4 font-feather uppercase italic">
            WE HAVE A WINNER!
          </h1>
          <p className="text-lg text-[#667185] font-medium max-w-lg mx-auto leading-relaxed">
            Congratulations to all participants. {quiz.title} was a blast!
          </p>
        </div>

        {/* Podium */}
        <div className="flex items-end justify-center gap-4 md:gap-12 w-full max-w-5xl mb-20">
          {winners.map((winner, index) => (
            <div 
              key={winner.rank} 
              className={`flex flex-col items-center animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-${index * 200}`}
              style={{ order: index === 0 ? 2 : index === 1 ? 1 : 3 }}
            >
              {/* Avatar Circle */}
              <div className={`relative mb-6 ${winner.rank === 1 ? 'w-32 h-32 md:w-40 md:h-40' : 'w-24 h-24 md:w-28 md:h-28'}`}>
                <div className={`absolute inset-0 rounded-full border-[6px] shadow-2xl z-10`} style={{ borderColor: winner.color }}>
                   <div className="w-full h-full rounded-full overflow-hidden bg-gray-200">
                      <Image src={winner.avatar} alt={winner.name} fill className="object-cover" />
                   </div>
                </div>
                {winner.rank === 1 && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FFC20E" stroke="#FFC20E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
                {/* Rank Badge */}
                <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black text-white shadow-lg`} style={{ backgroundColor: winner.color, color: winner.rank === 1 ? '#1B1818' : 'white' }}>
                   {winner.rank}
                </div>
              </div>

              {/* Name and Points */}
              <div className="text-center mb-6">
                <h3 className={`font-black text-[#1B1818] uppercase tracking-tight ${winner.rank === 1 ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'}`}>
                  {winner.name}
                </h3>
                <span className="text-sm font-black text-[#667185] opacity-60 uppercase tracking-widest">
                  {winner.points} PTS
                </span>
              </div>

              {/* Podium Block */}
              <div 
                className={`w-32 md:w-48 rounded-t-[32px] shadow-2xl transition-all duration-1000 delay-500`}
                style={{ 
                  height: winner.rank === 1 ? '240px' : winner.rank === 2 ? '180px' : '140px',
                  backgroundColor: 'white',
                  borderTop: `8px solid ${winner.color}`,
                  background: 'linear-gradient(to bottom, white, rgba(255,255,255,0.8))'
                }}
              />
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button 
          onClick={handleFinish}
          className="bg-[#1B1818] text-white px-12 py-5 rounded-[24px] font-black text-lg uppercase tracking-widest flex items-center gap-3 hover:bg-[#eb5017] transition-all transform active:scale-95 shadow-2xl shadow-black/20 group"
        >
          <HiOutlineHome className="text-2xl group-hover:-translate-y-1 transition-transform" />
          Finish Session
        </button>
      </main>

      {/* Confetti Canvas Placeholder */}
      <div className="fixed inset-0 pointer-events-none z-[100]" id="confetti-holder" />
    </div>
  );
}
