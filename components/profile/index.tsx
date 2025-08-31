import React from "react";
import Image from "next/image";
import ProfileDisabled from "./profileDisabled";
import avatar from "@/public/avatar.png";

const ShowProfile = () => {
  return (
    <div className="bg-white border border-[#F0F2F5] rounded-[10px] px-10 py-20">
      <div className="flex gap-x-6 items-center mb-16">
        <div className="w-[100px] h-[100px] rounded-full overflow-hidden">
          <Image src={avatar} alt="profile picture" className="w-full h-full" />
        </div>
        <div className="flex flex-col gap-y-1.5">
          <p className="text-black font-sans font-medium text-xl">
            Esther Tracy
          </p>
          <p className="text-base font-normal text-black">
            esthertracy@gmail.com
          </p>
        </div>
      </div>
      <ProfileDisabled />
    </div>
  );
};

export default ShowProfile;
