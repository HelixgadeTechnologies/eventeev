"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { HiOutlineVolumeUp, HiOutlineCog } from "react-icons/hi";

export default function CountdownPage() {
  const router = useRouter();
  const params = useParams();
  const [count, setCount] = useState(5);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(() => {
          setCount(count - 1);
          setIsAnimating(true);
        }, 50);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Navigate to the play page
      const eventId = params._id;
      const quizId = params.quizId;
      router.push(`/events/${eventId}/games/${quizId}/intro`);
    }
  }, [count, params._id, params.quizId, router]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#EB5017] flex flex-col font-sans overflow-hidden items-center justify-center text-white">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] border border-white rounded-full rotate-12" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] border border-white rounded-full -rotate-12" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[1px] bg-white opacity-40 rotate-45" />
        <div className="absolute bottom-[20%] left-[10%] w-[30%] h-[1px] bg-white opacity-40 -rotate-45" />
      </div>

      {/* Header Area */}
      <header className="absolute top-0 left-0 right-0 p-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rotate-45 flex items-center justify-center">
            <div className="w-4 h-4 bg-[#EB5017] -rotate-45" />
          </div>
          <span className="text-xl font-black text-white tracking-tight">Eventeev</span>
        </div>
        <div className="bg-white/10 backdrop-blur-md text-white px-4 py-1.5 rounded-full flex items-center gap-2 font-black text-xs uppercase tracking-widest border border-white/20">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            Live Syncing
        </div>
      </header>

      {/* Main Countdown Area */}
      <div className="flex flex-col items-center gap-8 relative z-10">
        <span className="text-white/80 font-black tracking-[0.3em] uppercase text-sm md:text-base">
          Get Ready!
        </span>

        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
          {/* Inner Circle Glow */}
          <div className="absolute inset-4 rounded-full bg-white/10 blur-3xl" />
          
          {/* Circular Frame */}
          <div className="absolute inset-0 rounded-full border-2 border-white/20" />
          <div className="absolute inset-8 rounded-full border border-white/10" />
          
          {/* Progress Ring Simulation */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="48%"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeDasharray="10 20"
              className="opacity-30"
            />
          </svg>

          {/* Large Countdown Number */}
          <div 
            className={`text-[12rem] md:text-[16rem] font-black text-white leading-none transition-all duration-300 drop-shadow-2xl ${
              isAnimating ? "scale-100 opacity-100 rotate-0" : "scale-110 opacity-0 -rotate-12"
            }`}
             style={{ 
               textShadow: '0 0 60px rgba(255, 255, 255, 0.3)',
               fontFamily: 'system-ui, -apple-system, sans-serif'
             }}
          >
            {count}
          </div>
        </div>

        <p className="text-white font-bold text-lg md:text-xl opacity-80 tracking-tight">
          The competition is about to begin...
        </p>
      </div>

      {/* Players Ready Status */}
      <div className="mt-12 bg-white/10 backdrop-blur-2xl border border-white/20 px-12 py-6 rounded-[32px] shadow-2xl flex flex-col items-center gap-1.5 min-w-[240px]">
        <span className="text-white text-4xl md:text-5xl font-black tracking-tight leading-none">128</span>
        <div className="flex items-center gap-2 text-white/60 font-black text-[10px] uppercase tracking-[0.2em]">
           <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
           </svg>
           Players Ready
        </div>
      </div>

      {/* Footer Area */}
      <footer className="absolute bottom-0 left-0 right-0 p-8 flex items-center justify-between">
        <div className="text-white font-black text-[10px] uppercase tracking-widest opacity-60">
           Room Code: <span className="text-white font-black">EV-7721</span>
        </div>
        
        <div className="flex items-center gap-4">
           <button className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-sm">
              <HiOutlineVolumeUp className="text-xl" />
           </button>
           <button className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-sm">
              <HiOutlineCog className="text-xl" />
           </button>
        </div>
      </footer>
    </div>
  );
}
