import React from "react";
import Image from "next/image";
import { speakerData } from "@/lib/demo-data/speakers";
import { FolderAdd, MoreCircle } from "iconsax-reactjs";
import Avatar from "../ui/Avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const randomColors = [
  { majorColor: "#B4A3F824", minorColor: "#D4CAFF", iconColor: "#6145D0" },
  { majorColor: "#FFF8F0", minorColor: "#FFE5C2", iconColor: "#E08304" },
  { majorColor: "#FFF0F2", minorColor: "#FCC5CE", iconColor: "#EF5DA8" },
  { majorColor: "#EAF6FC", minorColor: "#D5EDFA", iconColor: "#177AE5" },
  { majorColor: "#F5F8FA", minorColor: "#E1E7EC", iconColor: "#73797F" },
];

const GridList = () => {
  const handleRandomColors = () => {
    const randomColor =
      randomColors[Math.floor(Math.random() * randomColors.length)];
    return randomColor;
  };

  return (
    <div className="py-5 px-2 grid grid-cols-3 gap-[18px]">
      {speakerData.slice(0, 12).map((speaker) => (
        <div
          key={speaker.name}
          className={`font-sans text-[#1A1A1A] px-[26px] py-[18px] rounded-2xl h-[235px] flex flex-col justify-between overflow-hidden relative`}
          style={{ backgroundColor: handleRandomColors().majorColor }}
        >
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-y-1">
              <h6 className="font-bold text-xl">{speaker.name}</h6>
              <p className="font-normal text-sm">{speaker.title}</p>
              <p className="font-normal text-sm">{speaker.twitterHandle}</p>
            </div>
            <button className="cursor-pointer">
              <MoreCircle size="24" color="#73797F" />
            </button>
          </div>
          <div
            className="w-[238px] h-[238px] rounded-full absolute top-5/12 -right-20"
            style={{ backgroundColor: handleRandomColors().minorColor }}
          ></div>
          <div className="w-[100px] h-[100px] rounded-full border border-[#177AE5] absolute top-1/2 -translate-y-1/2 right-[63px]">
            <Image
              src={speaker.avatar}
              alt={speaker.name}
              fill
              className="object-cover rounded-full"
            />
          </div>
          <div className="flex flex-col font-normal text-[10px]">
            <p>Topic: </p>
            <p>{speaker.topic}</p>
          </div>
        </div>
      ))}

      <Dialog>
        <DialogTrigger asChild>
          <button className="bg-[#F0EDFB] rounded-2xl h-[235px] flex flex-col items-center justify-center cursor-pointer">
            <div className="flex flex-col items-center justify-center gap-y-3">
              <FolderAdd size="60" color="#6145D0" />
              <p className="text-[#1A1A1A] font-sans text-lg font-normal">
                Add New Speaker
              </p>
            </div>
          </button>
        </DialogTrigger>
        <DialogContent className="min-w-8/12 px-8">
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription className="flex flex-col">
              <div className="w-full flex">
                <div className="w-4/12 flex flex-col gap-y-1.5">
                  <h4 className="!font-sans text-2xl text-black font-semibold">
                    Add a New Speaker
                  </h4>
                  <h5 className="!font-sans text-base text-[#101928] font-semibold">
                    Profile photo
                  </h5>
                  <p className="!font-sans text-sm text-[#667185] font-normal w-8/12">
                    This image will be displayed on your profile
                  </p>
                  <Input type="file" />
                </div>
                <div className="w-8/12 flex justify-center items-center">
                  <div className="w-[100px] h-[100px] rounded-full border border-[#177AE5]">
                    <Image
                      src="/placeholder.svg"
                      alt="alt"
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                </div>
              </div>
              <form className="flex gap-x-3.5 mt-5">
                <div className="w-4/12">
                  <h5 className="!font-sans text-base text-[#101928] font-semibold">
                    Speaker Information
                  </h5>
                  <p className="!font-sans text-sm text-[#667185] font-normal w-8/12">
                    Update speaker details here.
                  </p>
                  <button className="bg-[#E8562E] flex items-center gap-x-2.5 text-white rounded-[8px] border border-[#E8562E] mt-5 px-3 py-2 font-sans font-semibold text-sm">
                    Save Changes
                  </button>
                </div>
                <div className="w-8/12 flex flex-col gap-y-5">
                  <div className="flex gap-x-5">
                    <div className="flex flex-col gap-y-3">
                      <Label
                        htmlFor="fName"
                        className="text-[#101928] text-sm font-medium"
                      >
                        First Name
                      </Label>
                      <Input
                        id="fName"
                        type="text"
                        className="border border-[#D0D5DD] p-4 rounded-[6px] text-[#101928] text-sm font-medium"
                      />
                    </div>
                    <div className="flex flex-col gap-y-3">
                      <Label
                        htmlFor="lName"
                        className="text-[#101928] text-sm font-medium"
                      >
                        Last Name
                      </Label>
                      <Input
                        id="lName"
                        type="text"
                        className="border border-[#D0D5DD] p-4 rounded-[6px] text-[#101928] text-sm font-medium"
                      />
                    </div>
                  </div>
                  <div className="flex gap-x-5">
                    <div className="flex flex-col gap-y-3">
                      <Label
                        htmlFor="title"
                        className="text-[#101928] text-sm font-medium"
                      >
                        Title
                      </Label>
                      <Input
                        id="title"
                        type="text"
                        className="border border-[#D0D5DD] p-4 rounded-[6px] text-[#101928] text-sm font-medium"
                      />
                    </div>
                    <div className="flex flex-col gap-y-3">
                      <Label
                        htmlFor="cpName"
                        className="text-[#101928] text-sm font-medium"
                      >
                        Company Name
                      </Label>
                      <Input
                        id="cpName"
                        type="text"
                        className="border border-[#D0D5DD] p-4 rounded-[6px] text-[#101928] text-sm font-medium"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-3">
                    <Label
                      htmlFor="bio"
                      className="text-[#101928] text-sm font-medium"
                    >
                      Bio
                    </Label>
                    <Input
                      id="bio"
                      type="text"
                      className="border border-[#D0D5DD] p-4 rounded-[6px] text-[#101928] text-sm font-medium"
                    />
                  </div>
                  <div className="flex flex-col gap-y-3">
                    <Label
                      htmlFor="topic"
                      className="text-[#101928] text-sm font-medium"
                    >
                      Enter Topic  
                    </Label>
                    <Input
                      id="topic"
                      type="text"
                      className="border border-[#D0D5DD] p-4 rounded-[6px] text-[#101928] text-sm font-medium"
                    />
                  </div>
                  <div className="flex gap-x-5">
                    <div className="flex flex-col gap-y-3">
                      <Label
                        htmlFor="twHandle"
                        className="text-[#101928] text-sm font-medium"
                      >
                        Enter Speaker twitter (X) handle
                      </Label>
                      <Input
                        id="twHandle"
                        type="text"
                        className="border border-[#D0D5DD] p-4 rounded-[6px] text-[#101928] text-sm font-medium"
                      />
                    </div>
                    <div className="flex flex-col gap-y-3">
                      <Label
                        htmlFor="cpTwHandle"
                        className="text-[#101928] text-sm font-medium"
                      >
                        Company Twitter (X) handle
                      </Label>
                      <Input
                        id="cpTwHandle"
                        type="text"
                        className="border border-[#D0D5DD] p-4 rounded-[6px] text-[#101928] text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GridList;
