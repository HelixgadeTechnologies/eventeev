"use client";

import React, { useState } from "react";
import { 
  HiOutlineInformationCircle,
  HiOutlineChevronDown
} from "react-icons/hi2";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function GameSettings() {
  const [showLeaderboard, setShowLeaderboard] = useState(true);
  const [enableBonusPoints, setEnableBonusPoints] = useState(true);
  const [questionMusic, setQuestionMusic] = useState(false);
  const [randomizeOrder, setRandomizeOrder] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(true);
  const [enableGameChat, setEnableGameChat] = useState(false);
  
  const [timePerQuestion, setTimePerQuestion] = useState("20");
  const [gameTheme, setGameTheme] = useState("modern-sunset");

  return (
    <div className="h-full flex flex-col overflow-hidden p-4 md:p-6 bg-white select-none">
      {/* Header */}
      <header className="mb-4">
        <h1 className="text-xl font-bold text-[#1B1818] leading-tight tracking-tight">Game Settings</h1>
        <p className="text-[10px] font-medium text-[#C27E33] mt-0.5 opacity-90 leading-relaxed max-w-2xl">
          Configure gameplay mechanics, question rules, and interactive elements for your sessions.
        </p>
      </header>

      {/* Main Content Areas */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-6">
        <div className="flex flex-col lg:flex-row gap-6 min-w-0">
          {/* Left Column: Rules & Controls */}
          <div className="flex-1 min-w-0 space-y-6">
            
            {/* Gameplay Controls */}
            <section className="space-y-3">
              <h3 className="text-xs font-bold text-[#1B1818] tracking-tight">Gameplay Controls</h3>
              <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-[#1B1818]">Show Leaderboard</Label>
                    <p className="text-[9px] font-medium text-gray-400">Display top performers during and after the game</p>
                  </div>
                  <Switch checked={showLeaderboard} onCheckedChange={setShowLeaderboard} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-[#1B1818]">Enable Bonus Points</Label>
                    <p className="text-[9px] font-medium text-gray-400">Award extra points for speed and accuracy streaks</p>
                  </div>
                  <Switch checked={enableBonusPoints} onCheckedChange={setEnableBonusPoints} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-[#1B1818]">Question Music</Label>
                    <p className="text-[9px] font-medium text-gray-400">Play background tracks during active questions</p>
                  </div>
                  <Switch checked={questionMusic} onCheckedChange={setQuestionMusic} />
                </div>
              </div>
            </section>

            {/* Question Rules */}
            <section className="space-y-3">
              <h3 className="text-xs font-bold text-[#1B1818] tracking-tight">Question Rules</h3>
              <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-5 shadow-sm">
                <div className="space-y-1.5 min-w-0">
                  <Label className="text-xs font-bold text-[#1B1818]">Time per Question</Label>
                  <div className="relative">
                    <select 
                      value={timePerQuestion}
                      onChange={(e) => setTimePerQuestion(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-[#1B1818] focus:ring-1 focus:ring-[#EB5017]/10 focus:border-[#EB5017] transition-all outline-none appearance-none pr-8"
                    >
                      <option value="10">10 seconds</option>
                      <option value="20">20 seconds</option>
                      <option value="30">30 seconds</option>
                      <option value="60">60 seconds</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <HiOutlineChevronDown className="text-xs" />
                    </div>
                  </div>
                  <p className="text-[9px] font-medium text-[#B28A6A] mt-1">The duration players have to submit their answers</p>
                </div>
                
                <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-[#1B1818]">Randomize Question Order</Label>
                    <p className="text-[9px] font-medium text-gray-400">Shuffle questions so every session feels fresh</p>
                  </div>
                  <Switch checked={randomizeOrder} onCheckedChange={setRandomizeOrder} />
                </div>
              </div>
            </section>

            {/* Interactivity */}
            <section className="space-y-3">
              <h3 className="text-xs font-bold text-[#1B1818] tracking-tight">Interactivity</h3>
              <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-[#1B1818]">Show Correct Answer</Label>
                    <p className="text-[9px] font-medium text-gray-400">Reveal the correct choice immediately after timer ends</p>
                  </div>
                  <Switch checked={showCorrectAnswer} onCheckedChange={setShowCorrectAnswer} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-[#1B1818]">Enable Game Chat</Label>
                    <p className="text-[9px] font-medium text-gray-400">Allow players to message each other in the game room</p>
                  </div>
                  <Switch checked={enableGameChat} onCheckedChange={setEnableGameChat} />
                </div>
              </div>
            </section>

            {/* Visual Style */}
            <section className="space-y-3 pb-4">
              <h3 className="text-xs font-bold text-[#1B1818] tracking-tight">Visual Style</h3>
              <div className="space-y-1.5 min-w-0">
                <Label className="text-xs font-bold text-[#1B1818]">Game Theme</Label>
                <div className="relative">
                  <select 
                    value={gameTheme}
                    onChange={(e) => setGameTheme(e.target.value)}
                    className="w-full bg-white border border-gray-100 rounded-lg px-3 py-3 text-xs font-medium text-[#1B1818] focus:ring-1 focus:ring-[#EB5017]/10 focus:border-[#EB5017] transition-all outline-none appearance-none pr-8 shadow-sm"
                  >
                    <option value="modern-sunset">Modern Sunset (Default)</option>
                    <option value="ocean-breeze">Ocean Breeze</option>
                    <option value="midnight-pulse">Midnight Pulse</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <HiOutlineChevronDown className="text-xs" />
                  </div>
                </div>
                <p className="text-[9px] font-medium text-[#B28A6A] mt-1 pl-1">The overall color palette and UI style applied to the player interface</p>
              </div>
            </section>
          </div>

          {/* Right Column: Preview & Stats */}
          <div className="w-full lg:w-[280px] flex-none space-y-4">
            {/* Game Preview card */}
            <div className="bg-[#FFFBF7] border border-orange-50 rounded-2xl p-4 space-y-4 shadow-sm">
               <div className="flex items-center gap-2">
                 <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                   <HiOutlineInformationCircle className="text-sm" />
                 </div>
                 <h4 className="text-xs font-bold text-[#C27E33]">Game Preview</h4>
               </div>
               
               <div className="aspect-[16/10] bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden group">
                  <div className="w-8 h-8 rounded-lg bg-orange-100/50 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                    <span className="text-lg">⊕</span>
                  </div>
                  {/* Subtle decorative elements to mimic a UI preview */}
                  <div className="absolute inset-x-2 top-2 h-1 bg-gray-200/50 rounded-full" />
                  <div className="absolute inset-x-2 bottom-2 flex gap-1 justify-center">
                    <div className="w-4 h-1 bg-gray-200/40 rounded-full" />
                    <div className="w-4 h-1 bg-orange-200/40 rounded-full" />
                    <div className="w-4 h-1 bg-gray-200/40 rounded-full" />
                  </div>
               </div>
               
               <p className="text-[9px] font-medium text-[#B28A6A] leading-relaxed">
                  Your settings determine how competitive and engaging your event is. Most organizers prefer 20s question timers for optimal pacing.
               </p>
            </div>

            {/* Quick Stats card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-4 shadow-sm">
               <h4 className="text-xs font-bold text-[#1B1818]">Quick Stats</h4>
               
               <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px]">
                     <span className="font-medium text-gray-400">Total Questions</span>
                     <span className="font-bold text-[#1B1818]">12</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                     <span className="font-medium text-gray-400">Est. Duration</span>
                     <span className="font-bold text-[#1B1818]">~15 mins</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                     <span className="font-medium text-gray-400">Points Potential</span>
                     <span className="font-bold text-[#1B1818]">2,400</span>
                  </div>
               </div>
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
