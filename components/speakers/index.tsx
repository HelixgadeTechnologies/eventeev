"use client";

import React, { useState } from "react";
import Image from "next/image";
import { speakerData } from "@/lib/demo-data/speakers";
import GridList from "./gridList";
import TableList from "./tableList";
import { RxDashboard } from "react-icons/rx";
import { List, CirclePlus } from "lucide-react";
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
import { FolderAdd } from "iconsax-reactjs";

const Speakers = () => {
  const [isGrid, setIsGrid] = useState(true);

  const handleToggleGrid = () => setIsGrid(!isGrid);
  const speakersCount = speakerData.length;
  return (
    <div className="border border-[#e4e7ec] bg-white rounded-[10px] overflow-hidden">
      <div className="border-b border-b-[#f0f2f5] p-4 flex justify-between items-center">
        <p className="text-[#475367] font-sans font-semibold text-base">
          Speakers {speakersCount}
        </p>
        <div className="flex items-center">
          <div className="border-r-[0.25px] border-r-[#E4E7EC] px-2">
            <button
              onClick={handleToggleGrid}
              className={`text-[#667185] rounded-tl-[8px] rounded-bl-[8px] p-2 shadow-sm border border-[#D0D5DD] ${
                isGrid && "bg-[#F0F2F5] text-[#101928]"
              }`}
            >
              <RxDashboard size={20} />
            </button>
            <button
              onClick={handleToggleGrid}
              className={`text-[#667185] rounded-tr-[8px] rounded-br-[8px] p-2 shadow-sm border border-[#D0D5DD] ${
                !isGrid && "bg-[#F0F2F5] text-[#101928]"
              }`}
            >
              <List size={20} />
            </button>
          </div>
          <div className="border-l-[0.25px] border-r-[#E4E7EC] px-2">
            <Dialog>
              <DialogTrigger asChild>
                <button className="bg-[#E8562E] flex items-center gap-x-2.5 text-white rounded-[8px] border border-[#D0D5DD] shadow-sm px-3 py-2 font-sans font-semibold text-sm">
                  <CirclePlus /> Add New Speaker
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
        </div>
      </div>
      {isGrid ? <GridList /> : <TableList />}
    </div>
  );
};

export default Speakers;
