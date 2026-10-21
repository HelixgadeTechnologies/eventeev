"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { 
  HiOutlineUsers, 
  HiOutlineChevronRight,
  HiOutlineCheck,
  HiOutlineClock
} from "react-icons/hi";
import { quizzesService } from "@/lib/services/quizzes.service";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "https://eventeevapi.onrender.com";

function GamePlayContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const eventId = params._id;
  const quizId = params.quizId as string;
  const qIndex = parseInt(searchParams.get("q") || "0");

  const pin = searchParams.get("pin") || "";
  const isPlayerMode = searchParams.get("mode") === "player";
  const playerNickname = searchParams.get("nickname") || "";

  const [quiz, setQuiz] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(20);
  const [answersCount, setAnswersCount] = useState(0);
  const [showEndModal, setShowEndModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalPlayers, setTotalPlayers] = useState(0);

  // Player state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  const formatPin = (p: string) => {
    if (!p) return "--- ---";
    return p.length > 3 ? `${p.slice(0, 3)} ${p.slice(3)}` : p;
  };

  useEffect(() => {
    if (pin) {
      quizzesService.getLeaderboard(pin).then((res) => {
        if (Array.isArray(res)) {
          setTotalPlayers(res.length);
        }
      }).catch(() => {});
    }
  }, [pin]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await quizzesService.getQuiz(quizId);
        setQuiz(data);
        if (data.questions?.[qIndex]) {
          setTimeLeft(data.questions[qIndex].timeLimit || 20);
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
        toast.error("Failed to load quiz.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId, qIndex]);

  const currentQuestion = quiz?.questions?.[qIndex] || quiz?.questions?.[0];

  const handleNextQuestion = useCallback(async () => {
    if (pin && !isPlayerMode) {
      try {
        await quizzesService.revealAnswer(pin);
      } catch (err) {
        console.warn("Server reveal answer notification:", err);
      }
    }
    const playerParams = isPlayerMode
      ? `&mode=player${playerNickname ? `&nickname=${encodeURIComponent(playerNickname)}` : ""}`
      : "";
    router.push(`/events/${eventId}/games/${quizId}/results?q=${qIndex}${pin ? `&pin=${pin}` : ""}${playerParams}`);
  }, [pin, isPlayerMode, playerNickname, router, eventId, quizId, qIndex]);

  useEffect(() => {
    if (timeLeft > 0 && !showEndModal) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      // Auto-progress to results
      handleNextQuestion();
    }
  }, [timeLeft, showEndModal, handleNextQuestion]);

  useEffect(() => {
    if (!pin) return;
    let socket: Socket | null = null;
    try {
      socket = io(SOCKET_URL, {
        transports: ["websocket", "polling"],
        reconnectionAttempts: 5,
      });
      socket.emit("join_room", pin);
      socket.emit("join", pin);
      socket.emit("join_quiz_session", { pin });

      const onReveal = () => {
        handleNextQuestion();
      };

      socket.on("reveal_answer", onReveal);
      socket.on("answer_revealed", onReveal);
      socket.on("question_ended", onReveal);
      socket.on("round_ended", onReveal);
      socket.on("round_result", onReveal);
      socket.on("question_end", onReveal);
      socket.on("time_up", onReveal);
      socket.on("show_results", onReveal);
      socket.on("answer_submitted", () => {
        setAnswersCount((prev) => prev + 1);
      });

      return () => {
        socket?.disconnect();
      };
    } catch (_) {}
  }, [pin, handleNextQuestion]);

  const handleSelectOption = async (index: number) => {
    if (selectedOption !== null || isAnswerSubmitted || timeLeft === 0) return;
    setSelectedOption(index);
    setIsAnswerSubmitted(true);

    if (typeof window !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(40);
      } catch (_) {}
    }

    toast.success("Answer locked in!");

    if (pin) {
      try {
        const timeLimit = currentQuestion?.timeLimit || 20;
        await quizzesService.submitAnswer(pin, {
          userId: user?.id || (user as any)?._id || playerNickname || "player",
          questionIndex: qIndex,
          answerIndex: index,
          timeTaken: Math.max(1, timeLimit - timeLeft),
        });
      } catch (err) {
        console.warn("Failed to submit answer to server:", err);
      }
    }
  };

  // When the admin projector renders a question, notify the backend so it can
  // emit question_display to all attendees — keeping everyone in lockstep.
  useEffect(() => {
    if (!pin || isPlayerMode || !currentQuestion || !quiz) return;

    let adminSocket: any = null;
    try {
      adminSocket = io(SOCKET_URL, {
        transports: ["websocket", "polling"],
        reconnectionAttempts: 3,
      });
      adminSocket.emit("join_room", pin);
      adminSocket.emit("join_quiz_session", { pin });
    } catch (_) {}

    // Small delay: let React finish painting the question UI before unlocking attendees
    const t = setTimeout(() => {
      try {
        adminSocket?.emit("admin_question_ready", {
          pin,
          questionIndex: qIndex,
          totalQuestions: quiz?.questions?.length ?? 0,
          currentQuestion: currentQuestion,
          options: currentQuestion?.options ?? [],
          timeLimitSeconds: currentQuestion?.timeLimit ?? 20,
          startedAt: Date.now(),
        });
      } catch (_) {}
    }, 300);

    return () => {
      clearTimeout(t);
      adminSocket?.disconnect();
    };
  }, [pin, isPlayerMode, qIndex, currentQuestion, quiz]);

  const handleEndGame = () => {
    setShowEndModal(true);
  };

  const confirmEndGame = () => {
    router.push(`/events/${eventId}/games`);
  };

  if (loading || !quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFFBF7]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#eb5017]"></div>
      </div>
    );
  }

  const colors = ["#EB1D44", "#1368CE", "#D89E00", "#26890C"];
  const borderColors = ["#b01736", "#0e52a7", "#b58400", "#1e6e09"];

  const shapes = [
    <svg key="tri" viewBox="0 0 100 100" className="w-8 h-8 md:w-10 md:h-10">
      <path d="M50 15L85 75H15L50 15Z" fill="none" stroke="white" strokeWidth="10" strokeLinejoin="round" />
    </svg>,
    <svg key="cir" viewBox="0 0 100 100" className="w-8 h-8 md:w-10 md:h-10">
      <path d="M25 25L75 75M75 25L25 75" fill="none" stroke="white" strokeWidth="12" strokeLinecap="round" />
    </svg>,
    <svg key="x" viewBox="0 0 100 100" className="w-8 h-8 md:w-10 md:h-10">
      <circle cx="50" cy="50" r="35" fill="none" stroke="white" strokeWidth="10" />
    </svg>,
    <svg key="sq" viewBox="0 0 100 100" className="w-8 h-8 md:w-10 md:h-10">
      <rect x="20" y="20" width="60" height="60" fill="none" stroke="white" strokeWidth="10" />
    </svg>
  ];

  // ----------------------------------------------------
  // ATTENDEE / PLAYER CONTROLLER VIEW
  // ----------------------------------------------------
  if (isPlayerMode) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#FFFBF7] flex flex-col font-sans overflow-hidden">
        {/* Player Header */}
        <header className="flex items-center justify-between p-4 md:px-8 bg-white/80 backdrop-blur-sm border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <Image src="/logo-black.svg" alt="Eventeev" width={110} height={35} priority />
            <span className="hidden sm:inline-block px-2.5 py-0.5 bg-orange-50 text-[#EB5017] rounded-full text-[10px] font-black uppercase tracking-wider">
              Player
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="truncate max-w-[120px]">{playerNickname || "You"}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1 rounded-full text-xs font-black text-gray-700 shadow-xs">
              <HiOutlineClock className={`text-sm ${timeLeft <= 5 ? "text-red-500 animate-bounce" : "text-[#EB5017]"}`} />
              <span className={timeLeft <= 5 ? "text-red-500 font-black" : ""}>{timeLeft}s</span>
            </div>
          </div>
        </header>

        {/* Question Prompt */}
        <div className="px-6 py-4 text-center shrink-0 bg-white/40 border-b border-gray-100/50">
          <p className="text-[10px] font-black text-[#667185] uppercase tracking-widest mb-1">
            Question {qIndex + 1} of {quiz.questions.length}
          </p>
          <h2 className="text-lg md:text-2xl font-black text-[#1B1818] max-w-2xl mx-auto leading-snug">
            {currentQuestion.text}
          </h2>
        </div>

        {/* Main Answer Area */}
        <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 w-full max-w-4xl mx-auto min-h-0">
          {!isAnswerSubmitted ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 md:gap-5 w-full h-full max-h-[520px]">
              {currentQuestion.options.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleSelectOption(index)}
                  className="rounded-2xl md:rounded-3xl p-5 md:p-6 flex items-center gap-4 text-white font-black text-lg md:text-xl shadow-lg border-b-[6px] active:translate-y-1 active:border-b-[2px] transition-all cursor-pointer group hover:brightness-105"
                  style={{ backgroundColor: colors[index % colors.length], borderColor: borderColors[index % borderColors.length] }}
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/15 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    {shapes[index % shapes.length]}
                  </div>
                  <span className="text-left line-clamp-3 uppercase tracking-tight flex-1">
                    {option}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 bg-white/90 backdrop-blur-md rounded-3xl border border-gray-100 shadow-xl max-w-md w-full mx-4 space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div 
                className="w-20 h-20 md:w-24 md:h-24 rounded-3xl flex items-center justify-center text-white shadow-lg border-b-[6px]"
                style={{
                  backgroundColor: colors[selectedOption! % colors.length],
                  borderColor: borderColors[selectedOption! % borderColors.length]
                }}
              >
                {shapes[selectedOption! % shapes.length]}
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-green-50 text-green-700 text-xs font-black rounded-full border border-green-200 shadow-xs">
                  <HiOutlineCheck className="text-sm stroke-2" />
                  Answer Locked In!
                </div>
                <h3 className="text-xl md:text-2xl font-black text-[#1B1818] uppercase tracking-tight">
                  {currentQuestion.options[selectedOption!]}
                </h3>
                <p className="text-xs font-bold text-gray-400 max-w-xs mx-auto">
                  Watch the main host screen! Results will appear once time runs out.
                </p>
              </div>

              <div className="w-full pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] font-black text-gray-400 uppercase tracking-wider">
                <span>Game PIN: {formatPin(pin)}</span>
                <span className="text-[#EB5017]">{timeLeft}s remaining</span>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // ----------------------------------------------------
  // HOST / ADMIN PROJECTOR VIEW
  // ----------------------------------------------------
  return (
    <div className="fixed inset-0 z-[100] bg-[#FFFBF7] flex flex-col font-sans overflow-hidden">
      {/* Eventeev Logo */}
      <div className="w-full pt-4 px-6 flex justify-start shrink-0">
        <Image src="/logo-black.svg" alt="Eventeev" width={130} height={42} priority />
      </div>

      {/* Question Header */}
      <div className="w-full pt-4 pb-4 px-6 text-center shrink-0">
        <h1 className="text-3xl md:text-4xl font-black text-[#1B1818] max-w-4xl mx-auto leading-tight uppercase font-feather">
          {currentQuestion.text}
        </h1>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-between px-6 md:px-12 gap-8 min-h-0 mb-4">
        {/* Left: Timer */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="relative w-24 h-24 md:w-28 md:h-28 flex items-center justify-center">
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
                strokeDasharray={`${(timeLeft / (currentQuestion.timeLimit || 20)) * 282.7} 282.7`}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <span className="text-3xl md:text-4xl font-black text-[#1B1818] z-10">{timeLeft}</span>
          </div>
          <span className="text-[10px] font-black text-[#667185] uppercase tracking-widest opacity-60">
            Seconds Left
          </span>
        </div>

        {/* Middle: Media Area */}
        <div className="flex-1 max-w-lg max-h-[30vh] relative aspect-video bg-[#1B1818] rounded-[24px] overflow-hidden shadow-2xl group border-[6px] border-white ring-1 ring-gray-100">
          <Image 
            src={currentQuestion.mediaUrl || "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1000&auto=format&fit=crop"} 
            alt="Question Media"
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

      {/* Answer Grid */}
      <div className="px-6 md:px-8 pb-6 grid grid-cols-2 gap-3 md:gap-4 w-full max-w-6xl mx-auto shrink-0">
        {currentQuestion.options.map((option: string, index: number) => {
          return (
            <div 
              key={index}
              className="h-16 md:h-20 rounded-xl flex items-center px-5 gap-4 shadow-lg border-b-[4px]"
              style={{ backgroundColor: colors[index % colors.length], borderColor: borderColors[index % borderColors.length] }}
            >
               <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                  {shapes[index % shapes.length]}
               </div>
               <span className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">{option}</span>
            </div>
          );
        })}
      </div>

      {/* Footer Controls */}
      <footer className="w-full bg-white border-t border-gray-100 px-6 py-3 md:px-12 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
           <div className="bg-gray-100 px-3 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-widest text-[#667185]">
              PIN: <span className="text-[#1B1818]">{formatPin(pin)}</span>
           </div>
           <span className="text-[#667185] font-black text-[9px] uppercase tracking-widest opacity-60">
             Question {qIndex + 1} of {quiz.questions.length}
           </span>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleEndGame} className="px-5 py-2 bg-gray-50 rounded-lg font-black text-[10px] uppercase tracking-widest text-[#667185] hover:bg-gray-100 transition-colors border border-gray-100">
            End Game
          </button>
          <button 
            onClick={handleNextQuestion}
            className="px-8 py-2.5 bg-[#EB5017] text-white rounded-lg font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-[#d64815] transition-all transform active:scale-95 shadow-md shadow-[#EB5017]/10"
          >
            Show Results
            <HiOutlineChevronRight className="text-base" />
          </button>
        </div>
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
    </div>
  );
}

export default function GamePlayPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GamePlayContent />
    </Suspense>
  );
}
