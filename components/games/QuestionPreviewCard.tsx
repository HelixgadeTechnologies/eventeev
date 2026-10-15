"use client";

import Image from "next/image";
import { LuClock3 } from "react-icons/lu";

interface QuestionPreviewCardProps {
  number: number;
  timeLimit: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  thumbnail?: string | null;
  showAnswer?: boolean;
}

export default function QuestionPreviewCard({
  number,
  timeLimit,
  question,
  options,
  correctOptionIndex,
  thumbnail,
  showAnswer = false,
}: QuestionPreviewCardProps) {
  const hasValidThumbnail = typeof thumbnail === "string" && thumbnail.trim().length > 0;

  return (
    <div className="bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm p-5 md:p-6 flex flex-col md:flex-row gap-6 font-sans">
      {/* Thumbnail */}
      {hasValidThumbnail ? (
        <div className="relative w-full md:w-[120px] h-32 md:h-[120px] flex-shrink-0 rounded-2xl overflow-hidden bg-gray-100">
          <Image
            src={thumbnail}
            alt={`Question ${number}`}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-full md:w-[120px] h-32 md:h-[120px] flex-shrink-0 rounded-2xl bg-gradient-to-br from-[#FFF2F0] to-[#FFF8E6] flex flex-col items-center justify-center text-[#EB5017] border border-[#EB5017]/10 shadow-inner">
          <span className="text-2xl font-black">{number}</span>
          <span className="text-[9px] font-black tracking-widest uppercase opacity-70">Question</span>
        </div>
      )}

      {/* Content */}
      <div className="flex-grow space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase text-[#eb5017] tracking-wider">
            QUESTION {number}
          </span>
          <div className="flex items-center gap-1.5 text-[#667185] text-xs font-semibold">
            <LuClock3 className="text-sm" />
            <span>{timeLimit}</span>
          </div>
        </div>

        <h4 className="text-xl font-bold text-[#1B1818] leading-tight">
          {question}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {options.map((option, idx) => (
            <div 
              key={idx}
              className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                showAnswer && idx === correctOptionIndex 
                  ? "border-[#eb5017] text-[#eb5017] bg-[#FFF2F0]" 
                  : "border-gray-100 text-[#667185] bg-white"
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
