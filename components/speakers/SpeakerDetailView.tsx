"use client";

import React from "react";
import Image from "next/image";
import { SpeakerDataType } from "@/lib/demo-data/speakers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FaTwitter, FaLinkedin, FaGlobe } from "react-icons/fa6";
import { LuMic, LuCalendar, LuClock3, LuMapPin } from "react-icons/lu";

interface SpeakerDetailViewProps {
  speaker: SpeakerDataType | null;
  isOpen: boolean;
  onClose: () => void;
}

const SpeakerDetailView = ({ speaker, isOpen, onClose }: SpeakerDetailViewProps) => {
  if (!speaker) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[110rem] bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl rounded-[32px] p-0 overflow-y-auto overflow-x-hidden font-sans border max-h-[90vh] custom-scrollbar selection:bg-[#EB5017]/10">
        <div className="relative h-48 w-full bg-[#EB5017]/10 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#EB5017] rounded-full blur-3xl" />
            <div className="absolute top-12 -left-12 w-48 h-48 bg-[#EB5017] rounded-full blur-3xl" />
          </div>
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white/50 backdrop-blur-md flex items-center justify-center text-[#1B1818] hover:bg-white transition-all shadow-sm"
          >
            <span className="sr-only">Close</span>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4"><path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
          </button>
        </div>

        <div className="px-8 pb-10 -mt-16 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-end md:items-center">
            <div className="relative group">
              <div className="w-40 h-40 rounded-[40px] border-8 border-white shadow-2xl overflow-hidden bg-gray-50 ring-1 ring-gray-100">
                <Image
                  src={speaker.avatar}
                  alt={speaker.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-[#EB5017]/10 text-[#EB5017] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#EB5017]/20">Featured Speaker</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-gray-200">{speaker.company}</span>
              </div>
              <h2 className="text-4xl font-black text-[#1B1818] tracking-tight">{speaker.name}</h2>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{speaker.title}</p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="lg:col-span-1 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#EB5017]" />
                  <h3 className="text-sm font-black text-[#1B1818] uppercase tracking-widest">About Speaker</h3>
                </div>
                <p className="text-gray-500 font-medium leading-relaxed">
                  {speaker.name} is a renowned expert in the field of {speaker.topic.split(' ').slice(-2).join(' ')}. With over a decade of experience at {speaker.company}, they have been at the forefront of innovation and industry leadership. Their work has consistently pushed boundaries and set new standards for excellence.
                </p>
                <div className="flex gap-4 pt-2">
                  <a href={`https://x.com/${speaker.twitterHandle.replace('@', '')}`} target="_blank" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#EB5017] hover:bg-[#EB5017]/5 transition-all border border-gray-100">
                    <FaTwitter size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#EB5017] hover:bg-[#EB5017]/5 transition-all border border-gray-100">
                    <FaLinkedin size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#EB5017] hover:bg-[#EB5017]/5 transition-all border border-gray-100">
                    <FaGlobe size={18} />
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#EB5017]" />
                  <h3 className="text-sm font-black text-[#1B1818] uppercase tracking-widest">Speaker Session</h3>
                </div>
                <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100 group hover:border-[#EB5017]/30 transition-all duration-500">
                   <div className="flex items-start gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100 group-hover:scale-110 transition-transform duration-500">
                        <LuMic className="text-2xl text-[#EB5017]" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-lg font-black text-[#1B1818] tracking-tight leading-tight">{speaker.topic}</h4>
                        <div className="flex flex-wrap gap-4 pt-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            <LuCalendar size={14} className="text-[#EB5017]" /> Oct 12, 2026
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            <LuClock3 size={14} className="text-[#EB5017]" /> 10:30 AM - 11:30 AM
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            <LuMapPin size={14} className="text-[#EB5017]" /> Grand Ballroom
                          </div>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-8">
               <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm space-y-6">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Contact Information</h4>
                  <div className="space-y-6">
                    <div className="space-y-1.5">
                      <p className="text-[9px] font-black text-[#EB5017] uppercase tracking-widest leading-none">Official Website</p>
                      <p className="text-sm font-bold text-[#1B1818] break-all leading-tight">
                        www.{speaker.name.toLowerCase().replace(' ', '')}.com
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[9px] font-black text-[#EB5017] uppercase tracking-widest leading-none">Business Email</p>
                      <p className="text-sm font-bold text-[#1B1818] break-all leading-tight">
                        {speaker.name.toLowerCase().replace(' ', '.')}@{speaker.company.toLowerCase().replace(' ', '')}.com
                      </p>
                    </div>
                  </div>
                  <button className="w-full bg-[#EB5017] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#d64815] transition-all transform active:scale-95 shadow-xl shadow-[#EB5017]/20 mt-4">
                    Book a Meeting
                  </button>
               </div>

               <div className="bg-gray-900 rounded-[32px] p-8 text-white space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Next Session</p>
                  <p className="text-sm font-bold leading-relaxed">
                    Don't miss the Q&A workshop following the main keynote.
                  </p>
                  <div className="flex items-center gap-2 pt-2 text-[#EB5017] text-[10px] font-black uppercase tracking-widest cursor-pointer hover:translate-x-1 transition-transform">
                    Add to Calendar <LuCalendar size={14} />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SpeakerDetailView;
