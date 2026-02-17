import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SpeakerDataType } from "@/lib/demo-data/speakers";
import { MoreCircle } from "iconsax-reactjs";
import { FaTwitter } from "react-icons/fa6";



const GridList = ({ data, onSpeakerClick, onEditClick }: { data: SpeakerDataType[], onSpeakerClick: (speaker: SpeakerDataType) => void, onEditClick: (speaker: SpeakerDataType) => void }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
      {data.map((speaker) => (
        <div
          key={speaker.name}
          onClick={() => onSpeakerClick(speaker)}
          className="group relative bg-white/70 backdrop-blur-xl border border-gray-100 rounded-[32px] p-6 hover:shadow-2xl hover:shadow-[#EB5017]/10 transition-all duration-500 overflow-hidden cursor-pointer active:scale-[0.98]"
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#EB5017]/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-[#EB5017]/10 transition-colors duration-500" />
          
          <div className="flex justify-between items-start relative z-10">
            <div className="space-y-4 flex-1 pr-4">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-[#1B1818] tracking-tight leading-loose">{speaker.name}</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{speaker.title}</p>
                <Link 
                  href={`https://x.com/${speaker.twitterHandle.replace('@', '')}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-[10px] font-black text-[#EB5017] uppercase tracking-widest mt-2 hover:opacity-70 transition-opacity"
                >
                  <FaTwitter size={10} /> {speaker.twitterHandle}
                </Link>
              </div>

              <div className="pt-4 border-t border-gray-50">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 leading-none">Presentation Topic</p>
                <p className="text-xs font-bold text-[#1B1818] leading-relaxed">
                  {speaker.topic}
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-[#EB5017] rounded-3xl scale-0 group-hover:scale-110 transition-transform duration-500 opacity-20" />
              <div className="relative w-24 h-24 rounded-3xl overflow-hidden border-2 border-white shadow-xl bg-gray-50 ring-1 ring-gray-100">
                <Image
                  src={speaker.avatar}
                  alt={speaker.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEditClick(speaker);
            }}
            className="absolute bottom-6 right-6 z-20 w-10 h-10 rounded-full bg-gray-50/50 flex items-center justify-center text-gray-400 hover:text-[#EB5017] hover:bg-white transition-all shadow-sm"
          >
            <MoreCircle size="20" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default GridList;

