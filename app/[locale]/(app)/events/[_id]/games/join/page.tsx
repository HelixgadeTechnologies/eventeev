"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { HiOutlineArrowLeft, HiOutlinePlay, HiOutlineSparkles, HiOutlineUser, HiOutlineDesktopComputer, HiOutlineClipboardCopy } from "react-icons/hi";
import { quizzesService } from "@/lib/services/quizzes.service";
import { eventsService } from "@/lib/services/events.service";
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
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  useEffect(() => {
    async function checkOwnership() {
      if (!user || !eventId) {
        setIsCheckingRole(false);
        return;
      }
      try {
        const { data } = await eventsService.getEventById(eventId);
        if (data) {
          const ownerId = typeof data.userId === "object" ? (data.userId?.id || data.userId?._id) : data.userId;
          const currentUserId = user.id || (user as any)?._id;
          if (ownerId && currentUserId && ownerId === currentUserId) {
            setIsOrganizer(true);
          }
        }
      } catch (err) {
        console.error("Failed to verify event ownership:", err);
      } finally {
        setIsCheckingRole(false);
      }
    }
    checkOwnership();
  }, [user, eventId]);

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

    if (isOrganizer) {
      toast.error("Event organizers cannot participate as contestants.");
      return;
    }

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
        {isCheckingRole ? (
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EB5017]"></div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Verifying access...</span>
          </div>
        ) : isOrganizer ? (
          <div className="w-full max-w-md bg-white rounded-[32px] p-8 md:p-10 border border-gray-100 shadow-xl shadow-orange-950/5 space-y-6 animate-in fade-in zoom-in-95 duration-500 text-center">
            <div className="w-16 h-16 bg-[#FFF2F0] text-[#EB5017] rounded-3xl mx-auto flex items-center justify-center text-3xl font-black shadow-inner">
              <HiOutlineDesktopComputer />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-orange-50 text-[#EB5017] border border-orange-100">
                Organizer / Host Mode
              </span>
              <h1 className="text-2xl font-black text-[#1B1818] tracking-tight">
                Event Host Access
              </h1>
              <p className="text-gray-500 text-xs font-semibold leading-relaxed max-w-xs mx-auto">
                You are the organizer of this event. Hosts manage the game sessions and project questions on the presentation display, and cannot participate as contestants.
              </p>
            </div>

            {pin && (
              <div className="bg-[#FFFBF7] border border-orange-100 rounded-2xl p-4 text-left space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Game Session PIN</span>
                  <span className="text-base font-black font-mono text-[#EB5017] tracking-widest">{pin}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const origin = typeof window !== "undefined" ? window.location.origin : "";
                    const joinUrl = `${origin}/events/${eventId}/games/join?pin=${pin}`;
                    navigator.clipboard.writeText(joinUrl);
                    toast.success("Attendee join link copied to clipboard!");
                  }}
                  className="w-full bg-white border border-gray-200 hover:border-[#EB5017] hover:text-[#EB5017] text-gray-700 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <HiOutlineClipboardCopy className="text-sm" />
                  Copy Attendee Link
                </button>
              </div>
            )}

            <div className="space-y-2.5 pt-2">
              <Link
                href={`/events/${eventId}/games/quiz`}
                className="w-full bg-[#EB5017] hover:bg-[#d64815] text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#EB5017]/25 active:scale-95"
              >
                Go to Quizzes & Games Hub
              </Link>
              <Link
                href={`/events/${eventId}/dashboard`}
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        ) : (
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
        )}
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
