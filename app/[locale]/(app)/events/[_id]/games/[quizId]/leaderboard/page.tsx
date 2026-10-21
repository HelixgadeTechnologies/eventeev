"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { HiOutlineChevronRight, HiOutlineTrophy, HiOutlineFire, HiOutlineArrowTrendingUp } from "react-icons/hi2";
import { quizzesService } from "@/lib/services/quizzes.service";

interface LeaderboardItem {
  rank: number;
  name: string;
  points: string;
  gained: string;
  avatar: string;
  message: string;
  isLeader?: boolean;
}

function LeaderboardContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const eventId = params?._id;
  const quizId = params?.quizId as string;
  const pin = searchParams.get("pin") || "";
  const qIndex = parseInt(searchParams.get("q") || "0");

  const [quiz, setQuiz] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await quizzesService.getQuiz(quizId);
        setQuiz(data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (pin) {
      quizzesService.getLeaderboard(pin).then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          const items: LeaderboardItem[] = res.map((p, idx) => ({
            rank: idx + 1,
            name: p.nickname || p.name || `Player ${idx + 1}`,
            points: (p.score ?? 0).toLocaleString(),
            gained: p.gained ? `+${p.gained}` : "+0",
            avatar: p.avatar || "/icons/avatar-placeholder.png",
            message: idx === 0 ? "Current Leader!" : "Keep pushing!",
            isLeader: idx === 0,
          }));
          setLeaderboard(items);
        } else {
          setLeaderboard([]);
        }
      }).catch(() => {
        setLeaderboard([]);
      });
    }
  }, [pin]);

  const handleNextQuestion = useCallback(async () => {
    if (!quiz) return;
    if (pin) {
      try {
        await quizzesService.nextQuestion(pin);
      } catch (err) {
        console.warn("Server next question notification:", err);
      }
    }
    if (qIndex < quiz.questions.length - 1) {
      router.push(`/events/${eventId}/games/${quizId}/intro?q=${qIndex + 1}${pin ? `&pin=${pin}` : ""}`);
    } else {
      // Game finished, go to winner screen
      router.push(`/events/${eventId}/games/${quizId}/winner${pin ? `?pin=${pin}` : ""}`);
    }
  }, [router, eventId, quizId, qIndex, quiz, pin]);

  useEffect(() => {
    // Start progress animation
    const timer = setTimeout(() => {
      setProgress(100);
    }, 100);

    // Auto navigate after 5 seconds
    const navigationTimer = setTimeout(() => {
      handleNextQuestion();
    }, 5100);

    return () => {
      clearTimeout(timer);
      clearTimeout(navigationTimer);
    };
  }, [handleNextQuestion]);

  const firstPlace = leaderboard[0];

  return (
    <div className="fixed inset-0 bg-[#F8F7F5] flex flex-col font-sans text-[#1c140d] overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-8">
        <div className="max-w-[760px] w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1 mb-1 text-center">
            <h2 className="text-[48px] font-black leading-none tracking-tight font-feather uppercase">Leaderboard</h2>
            <p className="text-[#9c7349] text-base font-bold opacity-70">
              Question {qIndex + 1} of {quiz?.questions?.length || 10} • Standings updated
            </p>
          </div>

          {leaderboard.length === 0 ? (
            <div className="bg-white border border-[#f4ede7] rounded-[28px] p-12 text-center shadow-sm space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-50 flex items-center justify-center text-[#f48c25]">
                <HiOutlineTrophy className="text-3xl" />
              </div>
              <h3 className="text-xl font-black font-feather uppercase text-[#1c140d]">No scores recorded yet</h3>
              <p className="text-sm text-[#9c7349] max-w-sm mx-auto">
                As players submit their answers during the live session, standings and points will appear here.
              </p>
            </div>
          ) : (
            <>
              {/* 1st Place Highlight Card */}
              {firstPlace && (
                <div className="relative rounded-[28px] overflow-hidden shadow-2xl shadow-[#f48c25]/20 bg-[#f48c25] text-white flex flex-col md:flex-row ring-6 ring-[#f48c25]/10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                   <div className="md:w-[28%] aspect-square relative bg-gray-200">
                     <Image 
                       src={firstPlace.avatar} 
                       alt="Leader Avatar"
                       fill
                       className="object-cover"
                     />
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#f48c25]/20" />
                   </div>
                   
                   <div className="flex-1 p-6 md:p-7 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-1">
                         <HiOutlineTrophy className="text-yellow-300 size-5" />
                         <span className="text-[10px] font-black tracking-widest uppercase opacity-80">CURRENT LEADER</span>
                      </div>
                      <h3 className="text-2xl font-black font-feather mb-3 uppercase">{firstPlace.name}</h3>
                      
                      <div className="flex items-end justify-between">
                        <div className="flex flex-col">
                          <span className="text-4xl font-black leading-none tracking-tight">{firstPlace.points} pts</span>
                          <div className="flex items-center gap-2 mt-1.5 text-white font-bold">
                             <HiOutlineArrowTrendingUp className="size-4" />
                             <span className="text-xs">{firstPlace.gained} Points</span>
                          </div>
                        </div>
                        
                        <div className="bg-white/20 px-4 py-1.5 rounded-xl border border-white/30 backdrop-blur-md">
                           <span className="text-[9px] font-black opacity-60 uppercase tracking-widest">STREAK</span>
                           <div className="flex items-center gap-2 mt-0">
                              <HiOutlineFire className="text-orange-200 size-4" />
                              <span className="text-lg font-black">🔥</span>
                           </div>
                        </div>
                      </div>
                   </div>
                </div>
              )}

              {/* Ranks 2-5 List */}
              <div className="flex flex-col gap-2.5">
                {leaderboard.slice(1).map((player) => (
                  <div 
                    key={player.rank}
                    className="flex items-center gap-4 bg-white border border-[#f4ede7] rounded-[20px] p-4 shadow-sm hover:shadow-lg hover:scale-[1.005] transition-all duration-300 animate-in fade-in slide-in-from-left-8"
                    style={{ animationDelay: `${player.rank * 100}ms` }}
                  >
                    <div className="flex items-center gap-5 flex-1">
                      <span className="text-xl font-black text-[#9c7349]/40 w-6">{player.rank}</span>
                      <div className="size-11 rounded-full overflow-hidden border-2 border-[#f4ede7] relative shrink-0">
                        <Image src={player.avatar} alt={player.name} fill className="object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-lg font-black font-feather uppercase">{player.name}</span>
                        <span className="text-[#9c7349] text-xs font-bold opacity-60">{player.message}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <span className="text-xl font-black leading-none">{player.points} pts</span>
                      <span className="text-[#26890C] font-black text-[10px] mt-0.5">{player.gained}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Bottom Nav / Host Control */}
      <div className="fixed bottom-10 right-10 z-20 flex items-center animate-in slide-in-from-right-12 duration-1000">
        <div className="hidden md:flex flex-col items-end mr-5">
          <span className="text-[10px] font-black text-[#f48c25] tracking-[0.2em] uppercase mb-1">Host Control</span>
          <span className="text-xs font-medium opacity-40">Ready for next question?</span>
        </div>
        <button 
          onClick={handleNextQuestion}
          className="flex items-center justify-center gap-3 bg-[#f48c25] text-white px-8 py-4 rounded-2xl shadow-2xl shadow-[#f48c25]/40 hover:scale-105 hover:bg-[#d67a1d] active:scale-95 transition-all duration-300 group"
        >
          <span className="text-base font-black tracking-wider uppercase">
            {qIndex < (quiz?.questions?.length || 10) - 1 ? "NEXT QUESTION" : "FINISH GAME"}
          </span>
          <HiOutlineChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Decorative Bottom Bar */}
      <div 
        className="fixed bottom-0 left-0 h-2 bg-[#f48c25] rounded-r-full shadow-lg z-10 transition-all duration-[5000ms] ease-linear" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LeaderboardContent />
    </Suspense>
  );
}
