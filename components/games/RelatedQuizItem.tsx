"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

interface RelatedQuizItemProps {
  id: string;
  title: string;
  questions: number;
  plays: string;
  thumbnail: string;
}

export default function RelatedQuizItem({
  id,
  title,
  questions,
  plays,
  thumbnail,
}: RelatedQuizItemProps) {
  const params = useParams();
  const eventId = params._id;

  return (
    <Link 
      href={`/events/${eventId}/games/${id}`}
      className="flex gap-4 items-center group cursor-pointer"
    >
      <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden shadow-sm">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="flex flex-col gap-1">
        <h5 className="text-sm font-bold text-[#1B1818] group-hover:text-[#eb5017] transition-colors leading-tight line-clamp-2">
          {title}
        </h5>
        <div className="text-[10px] font-black text-[#667185] uppercase tracking-wider">
          {questions} QUESTIONS • {plays} PLAYS
        </div>
      </div>
    </Link>
  );
}
