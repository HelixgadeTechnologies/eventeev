import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SpeakerDataType } from "@/lib/demo-data/speakers";
import { FaTwitter } from "react-icons/fa6";
import { Pencil, Trash2 } from "lucide-react";

const GridList = ({
  data,
  onSpeakerClick,
  onEditClick,
  onDeleteClick,
}: {
  data: SpeakerDataType[];
  onSpeakerClick: (speaker: SpeakerDataType) => void;
  onEditClick: (speaker: SpeakerDataType) => void;
  onDeleteClick: (speaker: SpeakerDataType) => void;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
      {data.map((speaker) => (
        <div
          key={speaker.id || speaker.name}
          className="group relative bg-white/70 backdrop-blur-xl border border-gray-100 rounded-[32px] overflow-hidden hover:shadow-2xl hover:shadow-[#EB5017]/10 transition-all duration-500"
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#EB5017]/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-[#EB5017]/10 transition-colors duration-500 pointer-events-none" />

          {/* Main clickable card area */}
          <div
            onClick={() => onSpeakerClick(speaker)}
            className="p-6 cursor-pointer active:scale-[0.99] transition-transform"
          >
            <div className="flex justify-between items-start relative z-10">
              <div className="space-y-4 flex-1 pr-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-[#1B1818] tracking-tight leading-loose">{speaker.name}</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{speaker.title}</p>
                  <Link
                    href={`https://x.com/${speaker.twitterHandle.replace("@", "")}`}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 text-[10px] font-black text-[#EB5017] uppercase tracking-widest mt-2 hover:opacity-70 transition-opacity"
                  >
                    <FaTwitter size={10} /> {speaker.twitterHandle}
                  </Link>
                </div>

                <div className="pt-4 border-t border-gray-50">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 leading-none">Presentation Topic</p>
                  <p className="text-xs font-bold text-[#1B1818] leading-relaxed">{speaker.topic}</p>
                </div>
              </div>

              <div className="relative shrink-0">
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
          </div>

          {/* Action bar — always visible at bottom, clearer on hover */}
          <div className="flex items-center border-t border-gray-100 divide-x divide-gray-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditClick(speaker);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#EB5017] hover:bg-[#EB5017]/5 transition-all group/btn"
              title="Edit Speaker"
            >
              <Pencil size={13} className="group-hover/btn:scale-110 transition-transform" />
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteClick(speaker);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all group/btn"
              title="Delete Speaker"
            >
              <Trash2 size={13} className="group-hover/btn:scale-110 transition-transform" />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GridList;
