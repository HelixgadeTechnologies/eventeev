"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { HiOutlineArrowLeft, HiOutlinePlay, HiOutlineSparkles, HiOutlineUser } from "react-icons/hi";
import { quizzesService } from "@/lib/services/quizzes.service";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

function JoinGameContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = params._id as string;
  const { user } = useAuth();

  const initialPin = searchParams.get("pin") || "";
  const [pin, setPin] = useState(initialPin);
  const [nickname, setNickname] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (user?.name && !nickname) {
      setNickname(user.name);
    }
  }, [user]);

  useEffect(() => {
    if (initialPin) {
      setPin(initialPin.replace(/\s+/g, ""));
    }
  }, [initialPin]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pin.replace(/\s+/g, "").trim();

    if (!cleanPin) {
      toast.error("Please enter the 6-digit Game PIN.");
      return;
    }

    if (cleanPin.length !== 6 || !/^\d{6}$/.test(cleanPin)) {
      toast.error("The Game PIN must be a 6-digit number.");
      return;
    }

    if (!nickname.trim()) {
      toast.error("Please enter a nickname so the host can identify you.");
      return;
    }

    setIsJoining(true);
    try {
      const session = await quizzesService.joinSession(
        cleanPin,
        nickname.trim(),
        user?.id || (user as any)?._id
      );

      toast.success("Connected to game lobby!");

      const targetQuizId =
        session?.quizId?._id ||
        session?.quizId?.id ||
        (typeof session?.quizId === "string" ? session.quizId : "") ||
        "";

      if (targetQuizId) {
        router.push(
          `/events/${eventId}/games/${targetQuizId}/waiting-room?pin=${cleanPin}&mode=player&nickname=${encodeURIComponent(
            nickname.trim()
          )}`
        );
      } else {
        // Fallback: If quizId is embedded in local session
        router.push(
          `/events/${eventId}/games/quiz?pin=${cleanPin}`
        );
      }
    } catch (err: any) {
      console.error("Failed to join game session:", err);
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to join game. Please verify the PIN."
      );
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF7] flex flex-col font-sans">
      {/* Top Header */}
      <header className="p-6 md:px-12 flex items-center justify-between border-b border-gray-100 bg-white/70 backdrop-blur-sm">
        <Link
          href={`/events/${eventId}/games`}
          className="inline-flex items-center gap-2 text-xs font-black text-gray-500 hover:text-[#EB5017] uppercase tracking-wider transition-all"
        >
          <HiOutlineArrowLeft className="text-base" />
          Back to Games
        </Link>
        <Image src="/logo-black.svg" alt="Eventeev" width={110} height={36} priority />
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-[32px] p-8 md:p-10 border border-gray-100 shadow-xl shadow-orange-950/5 space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-[#FFF2F0] text-[#EB5017] rounded-2xl mx-auto flex items-center justify-center text-2xl font-black shadow-inner">
              <HiOutlineSparkles />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-[#1B1818] tracking-tight">
              Join Event Game
            </h1>
            <p className="text-gray-400 text-xs font-bold leading-relaxed max-w-xs mx-auto">
              Enter the 6-digit Game PIN displayed on the presenter screen to connect and play live!
            </p>
          </div>

          <form onSubmit={handleJoin} className="space-y-5">
            {/* PIN Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">
                6-Digit Game PIN
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  autoFocus
                  className="w-full text-center text-3xl md:text-4xl font-mono font-black tracking-[0.3em] py-4 px-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-[#EB5017] focus:bg-white text-[#1B1818] transition-all placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* Nickname Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">
                Your Nickname
              </label>
              <div className="relative flex items-center">
                <HiOutlineUser className="absolute left-4 text-gray-400 text-lg" />
                <input
                  type="text"
                  maxLength={24}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. StarPlayer"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#EB5017] focus:bg-white text-sm font-bold text-[#1B1818] transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isJoining}
              className="w-full bg-[#EB5017] hover:bg-[#d64815] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all transform active:scale-95 shadow-xl shadow-[#EB5017]/25 disabled:opacity-50 cursor-pointer"
            >
              <HiOutlinePlay className="text-xl" />
              {isJoining ? "Connecting..." : "Connect & Play"}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-gray-50">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Live Interactive Experience
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function JoinGamePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFFBF7] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#EB5017]"></div>
        </div>
      }
    >
      <JoinGameContent />
    </Suspense>
  );
}
