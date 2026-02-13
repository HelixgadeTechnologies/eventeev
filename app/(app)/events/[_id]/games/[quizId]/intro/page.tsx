"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { HiOutlineLightBulb, HiOutlineGlobeAlt, HiOutlinePresentationChartBar, HiOutlineBeaker } from "react-icons/hi";

export default function QuestionIntroPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?._id;
  const quizId = params?.quizId;
  const [timeLeft, setTimeLeft] = useState(3);

  useEffect(() => {
    if (timeLeft === 0) {
      router.push(`/events/${eventId}/games/${quizId}/play`);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, eventId, quizId, router]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#FFFBF7] flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="w-full p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/logo-black.svg" alt="Eventeev" width={140} height={45} priority />
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-[#667185] uppercase tracking-widest opacity-60">Game PIN</span>
            <span className="text-lg font-black text-[#1B1818]">EV-2024</span>
          </div>
          <div className="w-12 h-12 bg-white rounded-full border border-gray-100 flex items-center justify-center p-1 shadow-sm">
             <div className="w-full h-full bg-[#F2F4F7] rounded-full overflow-hidden">
                <div className="w-full h-full bg-gray-300 opacity-20" />
             </div>
          </div>
        </div>
      </header>

      {/* Center Content */}
      <main className="flex-1 flex flex-col items-center justify-center relative">
        {/* Background Large Number */}
        <div className="absolute inset-x-0 inset-y-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
          <span className="text-[80vh] font-black leading-none translate-y-20">1</span>
        </div>

        {/* Round Info */}
        <div className="bg-[#FFF2F0] text-[#EB5017] px-6 py-2 rounded-full font-black text-xs uppercase tracking-[0.2em] mb-12 shadow-sm border border-[#EB5017]/10">
          Round 1 of 10
        </div>

        {/* Question Heading */}
        <h1 className="text-[14vw] font-black text-[#EB5017] tracking-tighter leading-none mb-12 drop-shadow-sm">
          QUESTION 1
        </h1>

        {/* Category Card */}
        <div className="bg-white px-10 py-5 rounded-3xl shadow-xl shadow-gray-200/50 flex flex-col items-center gap-1 min-w-[320px] mb-12 border border-gray-100">
          <span className="text-[9px] font-black text-[#667185] uppercase tracking-widest opacity-60 text-center flex items-center gap-2">
            <HiOutlineLightBulb className="text-lg text-[#EB5017]" />
            Category
          </span>
          <span className="text-2xl font-black text-[#1B1818]">General Knowledge</span>
        </div>

        {/* Iconic Placeholders */}
        <div className="flex items-center gap-6 opacity-20">
          <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center">
            <HiOutlineGlobeAlt className="text-3xl text-gray-500" />
          </div>
          <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center">
            <HiOutlinePresentationChartBar className="text-3xl text-gray-500" />
          </div>
          <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center">
            <HiOutlineBeaker className="text-3xl text-gray-500" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full p-12 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-black text-[#1B1818]">Get ready...</span>
              <span className="text-xs font-black text-[#667185] uppercase tracking-widest opacity-60">
                Question starts in {timeLeft} seconds
              </span>
            </div>
            <div className="text-4xl font-black text-[#EB5017]">
              100%
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-4 bg-[#F2F4F7] rounded-full overflow-hidden p-1 shadow-inner border border-gray-100">
            <div 
              className="h-full bg-gradient-to-r from-[#EB5017] to-[#FF7043] rounded-full transition-all duration-1000 ease-linear shadow-lg"
              style={{ width: `${(timeLeft / 3) * 100}%` }}
            />
          </div>
        </div>
      </footer>

      {/* Floating Decorative Elements */}
      <div className="absolute top-40 left-20 w-16 h-16 bg-[#EB5017]/10 rounded-2xl blur-xl" />
      <div className="absolute bottom-60 right-20 w-40 h-40 border-8 border-[#EB5017]/10 rounded-full" />
      <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-[#EB5017] rounded-full opacity-60" />
    </div>
  );
}
