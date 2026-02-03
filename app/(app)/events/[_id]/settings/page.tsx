"use client";

import React, { useState } from "react";
import { 
  HiOutlineInformationCircle,
} from "react-icons/hi2";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import Calendar from "@/components/ui/Calendar";
import { Label } from "@/components/ui/label";

export default function GeneralSettings() {
  const [eventName, setEventName] = useState("Summer Gala 2024");
  const [customUrl, setCustomUrl] = useState("summer-gala-2024");
  const [visibility, setVisibility] = useState("public");
  const [showLeaderboard, setShowLeaderboard] = useState(true);
  const [enableChat, setEnableChat] = useState(false);
  const [theme, setTheme] = useState("modern-sunset");

  return (
    <div className="h-full flex flex-col overflow-hidden p-4 md:p-6 bg-white select-none">
      {/* Compact Header */}
      <header className="mb-4">
        <h1 className="text-xl font-bold text-[#1B1818] leading-tight tracking-tight">General Event Settings</h1>
        <p className="text-[10px] font-medium text-[#C27E33] mt-0.5 opacity-90 leading-relaxed max-w-2xl">
          Manage the high-level configuration for your upcoming event. Changes here will propagate instantly to all active sessions.
        </p>
      </header>

      {/* Main Content Rows */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
        {/* Row 1: Basic Settings & Date */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-[#1B1818] uppercase tracking-wider">Event Name</Label>
              <input 
                type="text" 
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-[#1B1818] focus:ring-1 focus:ring-[#EB5017]/10 focus:border-[#EB5017] transition-all outline-none"
                placeholder="Enter event name"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-[#1B1818] uppercase tracking-wider">Custom URL</Label>
              <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-[#EB5017]/10 focus-within:border-[#EB5017] transition-all">
                <span className="bg-[#FAF9F6] px-3 py-1.5 text-gray-400 font-medium text-[9px] border-r border-gray-200 flex items-center shrink-0">eventeev.com/e/</span>
                <input 
                  type="text" 
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs font-bold text-[#1B1818] outline-none bg-transparent"
                  placeholder="custom-url"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-[#1B1818] uppercase tracking-wider">Event Visibility</Label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setVisibility("public")}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border transition-all text-left group ${
                    visibility === "public" ? "bg-white border-[#EB5017] ring-1 ring-[#EB5017]" : "bg-white border-gray-100"
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${visibility === "public" ? "border-[#EB5017]" : "border-gray-200"}`}>
                    <div className={`w-1.5 h-1.5 rounded-full bg-[#EB5017] transition-transform ${visibility === "public" ? "scale-100" : "scale-0"}`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1B1818] text-[11px]">Public</h4>
                    <p className="text-[9px] font-medium text-gray-400">Searchable</p>
                  </div>
                </button>
                <button 
                  onClick={() => setVisibility("private")}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border transition-all text-left group ${
                    visibility === "private" ? "bg-white border-[#EB5017] ring-1 ring-[#EB5017]" : "bg-white border-gray-100"
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${visibility === "private" ? "border-[#EB5017]" : "border-gray-200"}`}>
                    <div className={`w-1.5 h-1.5 rounded-full bg-[#EB5017] transition-transform ${visibility === "private" ? "scale-100" : "scale-0"}`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1B1818] text-[11px]">Private</h4>
                    <p className="text-[9px] font-medium text-gray-400">Link only</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="w-[260px] lg:w-[280px] flex-none">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-[#1B1818] uppercase tracking-wider">Event Date</Label>
              <div className="bg-white border border-gray-100 rounded-xl overflow-hidden pb-1 scale-[0.8] origin-top-left -mt-1 shadow-sm">
                 <Calendar eventDate={new Date(2024, 9, 5)} />
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Secondary Modules & Helpful Tip */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Card alignment: Secondary Modules aligned with Helpful Tip */}
          <div className="flex-1 space-y-3">
             <h3 className="text-xs font-bold text-[#1B1818] uppercase tracking-wider mb-2">Secondary Modules</h3>
             <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4 shadow-sm h-full">
               <div className="flex items-center justify-between">
                 <div className="space-y-0 text-left">
                   {/* Size matched exactly with Event Name input text size (text-xs) */}
                   <h4 className="font-bold text-[#1B1818] text-xs">Show Leaderboard</h4>
                   <p className="text-[9px] font-medium text-orange-950/30">Display top performers</p>
                 </div>
                 <Switch checked={showLeaderboard} onCheckedChange={setShowLeaderboard} className="scale-75 origin-right" />
               </div>

               <div className="flex items-center justify-between">
                 <div className="space-y-0 text-left">
                   <h4 className="font-bold text-[#1B1818] text-xs">Enable Chat</h4>
                   <p className="text-[9px] font-medium text-orange-950/30">Live communication</p>
                 </div>
                 <Switch checked={enableChat} onCheckedChange={setEnableChat} className="scale-75 origin-right" />
               </div>

               <div className="space-y-1.5 pt-1 border-t border-gray-50">
                 <Label className="text-[10px] font-bold text-[#1B1818] uppercase tracking-wider">Game Theme</Label>
                 <Select value={theme} onValueChange={setTheme}>
                   <SelectTrigger className="w-full bg-white border border-gray-100 h-7 rounded-lg px-2 text-[11px] font-medium text-[#1B1818] focus:ring-0">
                     <SelectValue placeholder="Select a theme" />
                   </SelectTrigger>
                   <SelectContent className="rounded-lg border-gray-100">
                     <SelectItem value="modern-sunset" className="py-1 text-[11px] font-bold">Modern Sunset</SelectItem>
                     <SelectItem value="ocean-breeze" className="py-1 text-[11px] font-bold">Ocean Breeze</SelectItem>
                     <SelectItem value="midnight-city" className="py-1 text-[11px] font-bold">Midnight City</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
             </div>
          </div>

          <div className="w-[260px] lg:w-[280px] flex-none pt-7">
            <div className="bg-[#FFF4ED] rounded-xl p-3 border border-orange-100 shadow-sm flex flex-col gap-2 min-h-[120px] justify-center">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#EB5017] flex items-center justify-center text-white shrink-0">
                  <HiOutlineInformationCircle className="text-xs" />
                </div>
                <h4 className="font-bold text-[#EB5017] text-[11px]">Helpful Tip</h4>
              </div>
              <p className="text-[9px] font-medium text-[#C27E33] leading-relaxed opacity-80">
                Setting your event to &quot;Private&quot; will prevent search engines from indexing your event page, adding an extra layer of security and privacy.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2DBD4;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
