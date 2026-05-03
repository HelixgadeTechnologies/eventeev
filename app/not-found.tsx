"use client";

import Link from "next/link";
import Image from "next/image";
import { HiOutlineArrowLeft } from "react-icons/hi2";

export default function NotFound() {
  const stickers = [
    { text: "404 Page not found", rotation: "-2deg", bottom: "10%", left: "40%" },
    { text: "Event logic missing", rotation: "15deg", bottom: "15%", left: "10%" },
    { text: "Where experiences happen", rotation: "-10deg", bottom: "5%", right: "15%" },
    { text: "Lost in the crowd?", rotation: "5deg", top: "20%", left: "5%" },
    { text: "Create a lasting impact", rotation: "-45deg", bottom: "20%", left: "12%" },
    { text: "Oops! Wrong Venue", rotation: "12deg", bottom: "8%", right: "40%" },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-[#EB5017] flex flex-col font-sans overflow-hidden text-white">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {/* Large 404 in Background */}
        <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-[40vw] font-black opacity-[0.08] leading-none tracking-tighter">
                404
            </h1>
        </div>
        
        {/* Animated Orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-[120px] opacity-20 animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-black rounded-full blur-[120px] opacity-20" />
      </div>

      {/* Header */}
      <header className="w-full p-8 flex items-center justify-between relative z-10">
        <Image src="/logo-white.svg" alt="Eventeev" width={140} height={45} priority className="brightness-0 invert" />
        <nav className="hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-widest opacity-80">
           <Link href="/events" className="hover:opacity-100 transition-opacity">Work</Link>
           <Link href="/events" className="hover:opacity-100 transition-opacity">Services</Link>
           <Link href="/events" className="hover:opacity-100 transition-opacity">About</Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 text-center">
        <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <h2 className="text-4xl md:text-[64px] font-black tracking-tighter leading-none mb-6 font-feather uppercase italic">
            You're in uncharted <br/>
            <span className="text-black">event territory!</span>
          </h2>
          <p className="text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed opacity-90 mb-10">
            Looks like you took a wrong turn. But don't worry, <br className="hidden md:block"/>
            even the best event planners get lost sometimes!
          </p>
          
          <Link 
            href="/events"
            className="inline-flex items-center gap-3 bg-white text-[#EB5017] px-10 py-5 rounded-[24px] font-black text-lg uppercase tracking-widest hover:bg-black hover:text-white transition-all transform active:scale-95 shadow-2xl"
          >
            <HiOutlineArrowLeft className="text-2xl" />
            Return home
          </Link>
        </div>
      </main>

      {/* Floating Stickers/Labels */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {stickers.map((sticker, index) => (
          <div 
            key={index}
            className="absolute bg-white text-black px-6 py-3 font-black text-[10px] md:text-xs uppercase tracking-wider shadow-xl animate-in fade-in zoom-in duration-700"
            style={{ 
              top: sticker.top,
              bottom: sticker.bottom,
              left: sticker.left,
              right: sticker.right,
              transform: `rotate(${sticker.rotation})`,
              delay: `${index * 100}ms`
            }}
          >
            {sticker.text}
          </div>
        ))}
      </div>

      {/* Corner UI Elements */}
      <div className="absolute bottom-8 right-8 flex gap-4 z-20">
         <div className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center group cursor-pointer hover:bg-white hover:text-[#EB5017] transition-all">
            <span className="text-lg">←</span>
         </div>
         <div className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center group cursor-pointer hover:bg-white hover:text-[#EB5017] transition-all">
            <span className="text-lg">↓</span>
         </div>
      </div>
    </div>
  );
}
