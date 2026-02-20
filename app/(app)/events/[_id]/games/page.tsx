"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi";
import { RiLoader4Line } from "react-icons/ri";
import { FaAngleRight } from "react-icons/fa6";

export default function GamesSelectionPage() {
  const { _id } = useParams();
  const router = useRouter();

  const gameTypes = [
    {
      id: "quiz",
      title: "Quiz Game",
      description: "Test your knowledge with trivia and multiple choice questions.",
      icon: HiOutlineQuestionMarkCircle,
      color: "#EB5017",
      bgColor: "bg-[#EB5017]/5",
      borderColor: "border-[#EB5017]/10",
      link: `/events/${_id}/games/quiz`,
    },
    {
      id: "rolling",
      title: "Rolling Game",
      description: "Spin the wheel and pick a winner from checked-in guests and speakers.",
      icon: RiLoader4Line,
      color: "#1B1818",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-100",
      link: `/events/${_id}/games/rolling`,
    },
  ];

  return (
    <div className="p-6 md:p-10 max-w-[1200px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-[#1B1818] tracking-tight">
          Select Your Game
        </h1>
        <p className="text-gray-500 text-sm uppercase tracking-[0.2em] font-black">
          Choose an interactive experience for your event
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
        {gameTypes.map((game) => {
          const Icon = game.icon;
          return (
            <button
              key={game.id}
              onClick={() => router.push(game.link)}
              className={`group flex flex-col p-10 rounded-[40px] border-2 ${game.borderColor} ${game.bgColor} text-left transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/5 relative overflow-hidden active:scale-95`}
            >
              <div 
                className="absolute top-0 right-0 w-64 h-64 -mr-16 -mt-16 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500 scale-150"
                style={{ color: game.color }}
              >
                <Icon size="100%" />
              </div>

              <div 
                className="w-20 h-20 rounded-3xl flex items-center justify-center mb-8 shadow-xl bg-white group-hover:scale-110 transition-transform duration-500"
                style={{ color: game.color }}
              >
                <Icon size={32} />
              </div>

              <div className="space-y-4 relative z-10">
                <h2 className="text-3xl font-black text-[#1B1818] tracking-tight">
                  {game.title}
                </h2>
                <p className="text-gray-500 font-medium leading-relaxed max-w-[280px]">
                  {game.description}
                </p>
              </div>

              <div className="mt-12 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1B1818] group-hover:gap-4 transition-all duration-500">
                Play Game <FaAngleRight size={14} className="text-[#EB5017]" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
