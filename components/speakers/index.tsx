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
import { FiSearch } from "react-icons/fi";
import SpeakersSummary from "./SpeakersSummary";

const Speakers = () => {
  const [isGrid, setIsGrid] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSpeakers = speakerData.filter((speaker) =>
    speaker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    speaker.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    speaker.company.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <SpeakersSummary />
      
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full bg-white/50 backdrop-blur-md rounded-full shadow-sm border border-gray-100 p-1.5 flex items-center group focus-within:ring-2 focus-within:ring-[#EB5017]/10 focus-within:border-[#EB5017] transition-all">
          <div className="pl-5 pr-3">
            <FiSearch className="text-[#98A2B3] text-lg group-focus-within:text-[#EB5017] transition-colors" />
          </div>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search speakers, topics, or companies..."
            className="flex-grow bg-transparent border-none shadow-none focus-visible:ring-0 text-[#1B1818] text-sm font-medium placeholder:text-gray-400 h-10"
          />
          <button className="bg-[#EB5017] text-white px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#d64815] transition-all transform active:scale-95 shadow-lg shadow-[#eb5017]/10">
            Search
          </button>
        </div>

        <div className="flex items-center gap-2 bg-gray-50/50 backdrop-blur-sm p-1.5 rounded-full border border-gray-100">
          <button
            onClick={() => setIsGrid(true)}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
              isGrid ? "bg-white text-[#EB5017] shadow-sm" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <RxDashboard size={18} />
          </button>
          <button
            onClick={() => setIsGrid(false)}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
              !isGrid ? "bg-white text-[#EB5017] shadow-sm" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <List size={18} />
          </button>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <button className="bg-[#EB5017] flex items-center gap-2 text-white h-[54px] rounded-full px-8 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#EB5017]/20 hover:scale-[1.02] active:scale-95 transition-all">
              <CirclePlus size={18} /> Add New Speaker
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl rounded-[32px] p-0 overflow-hidden font-sans border">
            {/* Modal content remains the same as it was already modernized in previous steps or is consistent with the design */}
            <DialogHeader className="p-8 pb-0">
              <DialogTitle className="text-2xl font-black text-[#1B1818] tracking-tight">Add New Speaker</DialogTitle>
              <DialogDescription className="text-sm text-gray-500 font-medium">
                Create a professional profile for your event speakers.
              </DialogDescription>
            </DialogHeader>

            <div className="p-8 pt-6 overflow-y-auto max-h-[80vh] custom-scrollbar">
              <form className="space-y-8">
                {/* Profile Photo Section */}
                <section className="flex flex-col md:flex-row gap-8 items-start pb-8 border-b border-gray-100">
                  <div className="w-full md:w-1/3 space-y-2">
                    <h4 className="text-sm font-bold text-[#1B1818] uppercase tracking-wider">Profile Photo</h4>
                    <p className="text-xs text-gray-400 leading-relaxed font-medium">
                      Upload a high-quality headshot. Supports JPG, PNG. Max 2MB.
                    </p>
                  </div>
                  <div className="flex-1 flex items-center gap-6">
                    <div className="relative group">
                      <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-50 ring-1 ring-gray-100">
                        <Image
                          src="/placeholder.svg"
                          alt="Profile Preview"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <span className="text-[10px] text-white font-bold uppercase tracking-widest">Change</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="cursor-pointer bg-white border border-gray-200 text-[#1B1818] px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all shadow-sm active:scale-95 text-center">
                        Upload New
                        <input type="file" className="hidden" />
                      </label>
                      <button type="button" className="text-red-500 text-[10px] font-bold uppercase tracking-wider hover:underline text-left px-4">
                        Remove
                      </button>
                    </div>
                  </div>
                </section>

                {/* Basic Info Section */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#EB5017]" />
                    <h4 className="text-xs font-bold text-[#1B1818] uppercase tracking-[0.15em]">Speaker Information</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="fName" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">First Name</Label>
                      <Input
                        id="fName"
                        placeholder="e.g. Sarah"
                        className="bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-[#EB5017]/10 focus:border-[#EB5017] transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="lName" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Last Name</Label>
                      <Input
                        id="lName"
                        placeholder="e.g. Jenkins"
                        className="bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-[#EB5017]/10 focus:border-[#EB5017] transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="title" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Professional Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g. Senior UI Designer"
                        className="bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-[#EB5017]/10 focus:border-[#EB5017] transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="cpName" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Company / Organization</Label>
                      <Input
                        id="cpName"
                        placeholder="e.g. TechFlow Inc."
                        className="bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-[#EB5017]/10 focus:border-[#EB5017] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="bio" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Short Bio</Label>
                    <textarea
                      id="bio"
                      placeholder="Tell us about the speaker's background..."
                      rows={3}
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-[#EB5017]/10 focus:border-[#EB5017] transition-all outline-none resize-none"
                    />
                  </div>
                </section>

                {/* Socials & Topic Section */}
                <section className="space-y-6 pt-2">
                   <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#EB5017]" />
                    <h4 className="text-xs font-bold text-[#1B1818] uppercase tracking-[0.15em]">Content & Socials</h4>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="topic" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Presentation Topic</Label>
                    <Input
                      id="topic"
                      placeholder="e.g. The Future of Generative AI in Creative Industries"
                      className="bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-[#EB5017]/10 focus:border-[#EB5017] transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="twHandle" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Speaker X (Twitter)</Label>
                      <div className="relative flex items-center">
                        <span className="absolute left-4 text-xs font-bold text-gray-400">@</span>
                        <Input
                          id="twHandle"
                          placeholder="username"
                          className="bg-gray-50/50 border-gray-100 rounded-xl pl-8 pr-4 py-3 text-sm font-medium focus:ring-1 focus:ring-[#EB5017]/10 focus:border-[#EB5017] transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="cpTwHandle" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Company X (Twitter)</Label>
                      <div className="relative flex items-center">
                        <span className="absolute left-4 text-xs font-bold text-gray-400">@</span>
                        <Input
                          id="cpTwHandle"
                          placeholder="company_x"
                          className="bg-gray-50/50 border-gray-100 rounded-xl pl-8 pr-4 py-3 text-sm font-medium focus:ring-1 focus:ring-[#EB5017]/10 focus:border-[#EB5017] transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                  <button type="button" className="px-6 py-3 rounded-full text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all active:scale-95">
                    Cancel
                  </button>
                  <button type="submit" className="bg-[#EB5017] text-white px-8 py-3 rounded-full text-sm font-black shadow-xl shadow-[#EB5017]/20 hover:bg-[#d64815] transition-all transform active:scale-95 uppercase tracking-widest">
                    Save Speaker
                  </button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-4">
        {isGrid ? <GridList data={filteredSpeakers} /> : <TableList data={filteredSpeakers} />}
      </div>
    </div>
  );
};


export default Speakers;
