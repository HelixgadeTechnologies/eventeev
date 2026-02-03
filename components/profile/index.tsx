import React from "react";
import Image from "next/image";
import ProfileDisabled from "./profileDisabled";
import avatar from "@/public/avatar.png";

const ShowProfile = () => {
  return (
    <div className="max-w-[800px] mx-auto">
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[24px] overflow-hidden">
        {/* Header/Cover background (subtle gradient) */}
        <div className="h-32 bg-gradient-to-r from-[#eb5017]/10 via-[#F56630]/5 to-transparent w-full" />
        
        <div className="px-8 pb-12 -mt-12">
          <div className="flex flex-col md:flex-row gap-6 items-end mb-10">
            <div className="relative group">
              <div className="w-[120px] h-[120px] rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-white">
                <Image src={avatar} alt="profile picture" className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-2xl cursor-pointer">
                <span className="text-white text-xs font-medium">Change Photo</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-y-1 mb-2">
              <h1 className="text-[#1D2739] font-sans font-bold text-2xl tracking-tight">
                Esther Tracy
              </h1>
              <p className="text-base font-normal text-[#667185]">
                esthertracy@gmail.com
              </p>
            </div>
          </div>

          <div className="border-t border-[#F0F2F5] pt-10">
            <ProfileDisabled />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowProfile;
