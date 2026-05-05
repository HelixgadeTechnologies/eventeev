"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { HiOutlineArrowLeft, HiOutlinePlay, HiOutlineArrowsExpand } from "react-icons/hi";
import { quizzesService } from "@/lib/services/quizzes.service";
import { toast } from "sonner";

// Mock data removed in favor of real API calls

export default function WaitingRoomPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = params._id;
  const quizId = params.quizId;
  const pin = searchParams.get("pin") || (quizId === "space-trivia" ? "452901" : "");

  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Format PIN for display (e.g., 482910 -> 482 910)
  const formatPin = (p: string) => {
    if (!p) return "--- ---";
    return p.length > 3 ? `${p.slice(0, 3)} ${p.slice(3)}` : p;
  };

  useEffect(() => {
    if (!pin) return;

    const fetchParticipants = async () => {
      try {
        const data = await quizzesService.getLeaderboard(pin);
        // Leaderboard typically returns an array of { nickname, score, etc. }
        setPlayers(data || []);
      } catch (error) {
        console.error("Error fetching participants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
    const interval = setInterval(fetchParticipants, 3000); // Poll every 3 seconds

    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      clearInterval(interval);
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [pin]);

  const handleBack = () => {
    router.push(`/events/${eventId}/games/${quizId}`);
  };

  const handleStartGame = () => {
    router.push(`/events/${eventId}/games/${quizId}/countdown`);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#FFFBF7] flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between p-4 md:px-12 shrink-0 bg-white/50 backdrop-blur-sm border-b border-gray-100/50">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2.5 text-[#1B1818] hover:text-[#EB5017] font-black transition-all group px-4 py-2 rounded-xl hover:bg-white shadow-sm hover:shadow-md border border-transparent hover:border-gray-100"
        >
          <HiOutlineArrowLeft className="text-xl group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm uppercase tracking-wider">Leave Room</span>
        </button>

        <Image src="/logo-black.svg" alt="Eventeev" width={130} height={42} priority />

        <div className="flex items-center gap-4">
          <div className="bg-white/80 backdrop-blur-sm text-[#EB5017] px-5 py-2.5 rounded-2xl flex items-center gap-2.5 font-black text-xs shadow-sm border border-gray-100">
            <div className="w-2 h-2 bg-[#EB5017] rounded-full animate-pulse" />
            {players.length} Players Active
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-[#EB5017] overflow-hidden shadow-md">
             <Image src="/icons/avatar-placeholder.png" alt="User" width={40} height={40} />
          </div>
        </div>
      </header>

      {/* Main Content Area - Scroll restricted to this area if needed */}
      <main className="flex-1 flex flex-col items-center px-6 pb-24 w-full min-h-0 overflow-hidden">
        <div className="text-center space-y-1 mb-6 shrink-0 pt-4">
          <h1 className="text-2xl md:text-3xl font-black text-[#EB5017] tracking-tight opacity-90">
            Join Game
          </h1>
          <div className="inline-flex flex-col items-center">
            <span className="text-[10px] font-black text-[#667185] uppercase tracking-[0.2em] opacity-40">Game PIN</span>
            <div className="text-5xl md:text-7xl font-black text-[#1B1818] tracking-widest leading-none">
              {formatPin(pin)}
            </div>
          </div>
        </div>

        {/* Start Game Action */}
        <div className="mb-6 w-full max-w-sm shrink-0">
          <button 
            onClick={handleStartGame}
            className="w-full bg-[#EB5017] text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-[#d64815] transition-all transform active:scale-95 shadow-xl shadow-[#EB5017]/20"
          >
            <HiOutlinePlay className="text-xl" />
            Start Game
          </button>
          <p className="text-center text-[#667185] text-[10px] mt-2 font-bold opacity-60">
            Click start when everyone has joined
          </p>
        </div>

        {/* Waiting Room Section - Grows to fill available space */}
        <div className="w-full max-w-5xl flex flex-col flex-1 min-h-0 bg-white/50 rounded-[32px] p-6 md:p-8 border border-gray-100 mb-2 shadow-sm">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <div className="flex items-center gap-3">
              <h3 className="text-base font-black text-[#1B1818] uppercase tracking-wider opacity-70">Waiting Room</h3>
              <div className="bg-[#FFF2F0] text-[#EB5017] px-2 py-0.5 rounded-lg text-[10px] font-black">
                {players.length} Total
              </div>
            </div>
            <span className="text-[#EB5017] font-bold text-[10px] animate-pulse flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#EB5017] rounded-full" />
              Live update
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 overflow-y-auto pr-1 flex-1 custom-scrollbar">
            {players.length > 0 ? (
              players.map((player, index) => (
                <div 
                  key={index}
                  className={`px-2 py-1.5 rounded-lg font-black text-xs transition-all flex items-center justify-center text-center shadow-sm border ${
                    player.isQuizMaster 
                      ? "bg-[#FFF2F0] text-[#EB5017] border-[#EB5017]/30" 
                      : "bg-white text-[#1B1818] border-gray-100"
                  }`}
                >
                  {player.nickname || player.name || `Player ${index + 1}`}
                </div>
              ))
            ) : (
              <div className="col-span-full flex items-center justify-center py-10 text-gray-400 font-bold text-sm">
                {loading ? "Loading players..." : "Waiting for players to join..."}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 p-4 flex items-center justify-center relative px-12 h-[72px] shrink-0">
        {/* Centered Text */}
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 bg-[#EB5017]/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 bg-[#EB5017]/70 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 bg-[#EB5017] rounded-full animate-bounce" />
          </div>
          <span className="text-[#1B1818] text-base font-black tracking-tight opacity-60 uppercase text-xs tracking-[0.1em]">Waiting for host to start...</span>
        </div>

        {/* Action Button (Right aligned) */}
        <div className="absolute right-6 md:right-12">
          <button 
            onClick={toggleFullScreen}
            className="flex items-center gap-2 bg-[#EB5017] text-white px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-wider hover:bg-[#d64815] transition-all shadow-lg shadow-[#EB5017]/20"
          >
            <HiOutlineArrowsExpand className={`text-lg transition-transform ${isFullScreen ? "rotate-180" : ""}`} />
            {isFullScreen ? "Exit full screen" : "Go full screen"}
          </button>
        </div>
      </footer>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E4E7EC;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D0D5DD;
        }
      `}</style>
    </div>
  );
}
