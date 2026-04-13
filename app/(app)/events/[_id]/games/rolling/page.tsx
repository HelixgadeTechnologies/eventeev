"use client";

import React, { useState, useMemo, useEffect } from 'react';
import SpinningWheel from "@/components/games/SpinningWheel";
import { HiOutlineTrophy } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FaAngleLeft, FaExpand, FaCompress } from "react-icons/fa6";
import { useRef } from "react";
import confetti from 'canvas-confetti';
import { useParams } from 'next/navigation';
import rollingGameService from '@/lib/services/rolling-game.service';

export default function RollingGamePage() {
  const params = useParams();
  const eventId = params._id as string;
  const [winner, setWinner] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [winnersList, setWinnersList] = useState<any[]>([]);

  const fetchWinners = async () => {
    if (!eventId) return;
    try {
      const data = await rollingGameService.getWinners(eventId);
      setWinnersList(data || []);
    } catch (err) {
      console.error("Failed to load winners:", err);
    }
  };

  useEffect(() => {
    if (eventId) {
      rollingGameService.getParticipants(eventId)
        .then((res) => {
          setParticipants(res || []);
        })
        .catch((err) => {
          console.error("Failed to load participants:", err);
        });
        
      fetchWinners();
    }
  }, [eventId]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen change events (e.g. Esc key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const eligibleUsers = useMemo(() => {
    return participants
      .map(p => `${p.firstName} ${p.lastName}`.trim())
      .filter(name => name !== "")
      .sort(() => Math.random() - 0.5);
  }, [participants]);

  const handleWinner = async (name: string) => {
    setWinner(name);
    
    // Find the participant to get their ID
    const matchedUser = participants.find(p => `${p.firstName} ${p.lastName}`.trim() === name);
    if (matchedUser && matchedUser._id && eventId) {
      try {
        await rollingGameService.recordWinner(eventId, { 
          userId: matchedUser._id, 
          prizeWon: 'Mystery Prize' 
        });
        fetchWinners();
      } catch (err) {
        console.error("Failed to record winner:", err);
      }
    }

    // Trigger celebratory confetti
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 200 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

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
  };

  return (
    <div 
        ref={containerRef}
        className={`p-4 md:p-8 max-w-[1400px] mx-auto flex flex-col items-center gap-6 animate-in fade-in duration-1000 font-sans relative overflow-hidden bg-white ${isFullscreen ? 'h-screen w-screen max-w-none p-12' : 'min-h-[80vh]'}`}
    >
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-white">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#EB5017]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#1B1818]/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full flex justify-between items-center px-4 md:px-0">
        <Link 
            href="../games" 
            className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#EB5017] transition-all group"
        >
            <FaAngleLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
            Back to Selection
        </Link>
        <button 
          onClick={toggleFullscreen}
          className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#EB5017] transition-all bg-gray-50 hover:bg-[#EB5017]/5 px-4 py-2 rounded-xl"
        >
          {isFullscreen ? <FaCompress className="text-sm" /> : <FaExpand className="text-sm" />}
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      <header className={`text-center space-y-2 max-w-2xl px-4 ${isFullscreen ? 'mb-4' : ''}`}>
        <h1 className={`${isFullscreen ? 'text-5xl md:text-6xl' : 'text-3xl md:text-4xl'} font-black text-[#1B1818] tracking-tight`}>
          The Lucky <span className="text-[#EB5017]">Roll</span>
        </h1>
        <p className="text-gray-500 font-medium text-xs md:text-sm leading-relaxed uppercase tracking-[0.1em]">
          Spin the wheel for all checked-in attendees to pick a lucky winner!
        </p>
      </header>

      <div className="relative z-10 w-full flex flex-col items-center">
        <SpinningWheel names={eligibleUsers} onWinner={handleWinner} />
      </div>

      {/* Winners Board */}
      <div className={`absolute left-4 top-24 md:left-8 w-64 bg-white/80 backdrop-blur-md rounded-[32px] p-5 shadow-2xl shadow-black/5 border border-white hidden lg:block transition-all duration-500 z-20 ${isFullscreen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-[#1B1818] mb-5 flex items-center gap-2">
          <HiOutlineTrophy className="text-[#EB5017] text-lg" />
          Recent Winners
        </h3>
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
          {winnersList.length === 0 ? (
             <div className="text-center py-8">
               <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No winners yet</p>
             </div>
          ) : (
            winnersList.map((w, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={w._id || idx} 
                className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/50 hover:bg-gray-100 transition-colors border border-gray-100/50"
              >
                <div className="w-8 h-8 rounded-full bg-[#EB5017]/10 text-[#EB5017] font-black flex items-center justify-center text-[10px]">
                  #{idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-[#1B1818] truncate">
                    {w.userId?.firstName} {w.userId?.lastName}
                  </p>
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest truncate mt-0.5">
                    {w.prizeWon}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Winner Modal/Display */}
      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <div className="bg-white rounded-[48px] p-10 md:p-16 max-w-lg w-full text-center space-y-8 shadow-2xl relative overflow-hidden">
                {/* Confetti-like background effects could be added here */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#EB5017]/5 to-transparent pointer-events-none" />
                
                <div className="relative">
                    <div className="w-24 h-24 bg-[#EB5017]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <HiOutlineTrophy size={48} className="text-[#EB5017]" />
                    </div>
                    
                    <div className="space-y-4">
                        <p className="text-[#EB5017] font-black text-[10px] uppercase tracking-[0.3em]">We have a winner!</p>
                        <h2 className="text-4xl md:text-5xl font-black text-[#1B1818] tracking-tight leading-tight">
                        {winner}
                        </h2>
                    </div>
                </div>

                <div className="pt-4">
                    <button 
                        onClick={() => setWinner(null)}
                        className="w-full bg-[#1B1818] text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-black/10 active:scale-95"
                    >
                        Great! Next Roll
                    </button>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className={`w-full flex flex-col md:flex-row justify-center gap-10 ${isFullscreen ? 'mt-auto pb-8' : 'mt-4'}`}>
        <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Participants</span>
            <span className="text-2xl font-black text-[#1B1818]">{eligibleUsers.length}</span>
        </div>
      </footer>
    </div>
  );
}

