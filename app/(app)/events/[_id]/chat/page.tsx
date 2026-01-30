"use client";

import { useState } from "react";
import Image from "next/image";
import { FiSearch, FiMoreVertical, FiPaperclip, FiSmile } from "react-icons/fi";
import { IoSend } from "react-icons/io5";


export default function ChatPage() {
  const [message, setMessage] = useState("");

  const messages = [
    {
      id: 1,
      user: {
        name: "Sarah Jenkins",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      },
      time: "10:45 AM",
      text: "Has anyone figured out the answer to question 5 yet? The historical timeline is a bit confusing.",
      isSelf: false,
    },
    {
      id: 2,
      user: {
        name: "David Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
      },
      time: "10:46 AM",
      text: "I'm stuck there too. I think it's somewhere in the middle ages, but the dates don't match up with the quiz options.",
      isSelf: false,
    },
    {
      id: 3,
      user: "System",
      text: "NEW PARTICIPANT JOINED",
      type: "system",
    },
    {
      id: 4,
      user: {
        name: "You",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150",
      },
      time: "10:47 AM",
      text: "I think it might be related to the industrial revolution timeline we saw in the intro video. Check the 1780s section!",
      isSelf: true,
    },
    {
      id: 5,
      user: {
        name: "Emily Watson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
      },
      time: "10:52 AM",
      text: "Thanks Alex! That totally helped. Question 6 is a breeze now.",
      isSelf: false,
    },
  ];

  const onlineUsers = [
    { name: "Marcus Lee", status: "online", level: 12, rank: "Pro", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150" },
    { name: "Sarah Jenkins", status: "online", level: 8, rank: "Newbie", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" },
    { name: "David Chen", status: "away", level: null, rank: null, avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" },
    { name: "Emily Watson", status: "online", level: 15, rank: "Expert", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150" },
  ];

  return (
    <div className="flex bg-white h-[calc(100vh-140px)] border border-gray-100 rounded-[24px] overflow-hidden font-sans">
      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col min-w-0 bg-white">
        {/* Header */}
        <header className="px-8 py-5 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-[#1B1818] tracking-tight">General Lobby</h1>
            <p className="text-xs font-bold text-gray-400 mt-0.5">Public room for all event participants</p>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <button className="hover:text-[#EB5017] transition-colors"><FiSearch size={20} /></button>
            <button className="hover:text-[#EB5017] transition-colors"><FiMoreVertical size={20} /></button>
          </div>
        </header>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 custom-scrollbar">
          {messages.map((msg) => {
            if (msg.type === "system") {
              return (
                <div key={msg.id} className="flex justify-center my-6">
                  <div className="bg-white border border-gray-100 px-6 py-2 rounded-full text-[10px] font-black text-gray-400 tracking-[0.15em] uppercase shadow-sm">
                    {msg.text}
                  </div>
                </div>
              );
            }

            const user = msg.user as { name: string; avatar: string };
            return (
              <div key={msg.id} className={`flex items-start gap-4 ${msg.isSelf ? "flex-row-reverse" : ""}`}>
                <div className="flex-shrink-0 mt-6">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-100">
                      <Image src={user.avatar} alt={user.name} width={40} height={40} className="object-cover" />
                   </div>
                </div>
                <div className={`flex flex-col max-w-[70%] ${msg.isSelf ? "items-end" : "items-start"}`}>
                  <div className={`flex items-center gap-2 mb-2 text-[11px] font-black uppercase tracking-wider ${msg.isSelf ? "flex-row-reverse text-[#EB5017]" : "text-[#B28A6A]"}`}>
                    <span>{user.name}</span>
                    <span className="text-gray-300 font-bold">{msg.time}</span>
                  </div>
                  <div className={`px-6 py-4 rounded-[20px] shadow-sm text-sm font-medium leading-relaxed ${
                    msg.isSelf 
                      ? "bg-[#EB5017] text-white rounded-tr-none" 
                      : "bg-[#F3EBE3]/50 text-[#1B1818] rounded-tl-none"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Area */}
        <div className="px-8 pb-8 pt-4">
          <div className="bg-white border border-gray-100 rounded-[20px] p-2 flex items-center gap-2 shadow-lg shadow-gray-100/50">
            <button className="p-3 text-gray-400 hover:text-[#EB5017] transition-colors">
              <FiSmile size={24} />
            </button>
            <button className="p-3 text-gray-400 hover:text-[#EB5017] transition-colors">
              <FiPaperclip size={24} />
            </button>
            <input 
              type="text" 
              placeholder="Type a message to the lobby..."
              className="flex-grow bg-transparent outline-none text-sm font-semibold text-[#1B1818] placeholder:text-gray-300 px-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="bg-[#EB5017] text-white pl-8 pr-6 py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-[#d64815] transition-all transform active:scale-95 shadow-md shadow-[#EB5017]/20">
              Send <IoSend className="-rotate-12 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-[280px] bg-white border-l border-gray-50 flex flex-col shrink-0">
        {/* Who's Online Section */}
        <div className="p-6 border-b border-gray-50 flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[11px] font-black text-[#1B1818] uppercase tracking-[0.1em]">Who&apos;s Online</h2>
            <span className="bg-[#E7F6EC] text-[#0FAF94] px-2 py-0.5 rounded text-[10px] font-black">124</span>
          </div>
          
          <div className="space-y-6">
            {onlineUsers.map((user, idx) => (
              <div key={idx} className="flex items-center gap-3 group cursor-pointer">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 group-hover:ring-2 ring-[#EB5017] transition-all">
                    <Image src={user.avatarUrl} alt={user.name} width={40} height={40} className="object-cover" />
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${user.status === 'online' ? 'bg-[#0FAF94]' : 'bg-[#FAAD14]'}`} />
                </div>
                <div className="flex-grow overflow-hidden">
                  <p className="text-[13px] font-black text-[#1B1818] truncate group-hover:text-[#EB5017] transition-colors">{user.name}</p>
                  {user.level ? (
                    <p className="text-[10px] font-bold text-gray-400">Level {user.level} • {user.rank}</p>
                  ) : (
                    <p className="text-[10px] font-bold text-gray-400 capitalize">{user.status}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Quizzes Section */}
        <div className="p-6">
          <h2 className="text-[11px] font-black text-[#1B1818] uppercase tracking-[0.1em] mb-4">Upcoming Quizzes</h2>
          <div className="bg-[#FFF8F2] border border-[#FFD9B3] rounded-[16px] p-4 group cursor-pointer hover:border-[#EB5017] transition-all">
            <p className="text-[11px] font-black text-[#EB5017] mb-1">Mega History Quiz</p>
            <div className="flex items-center gap-1.5 text-[9px] font-black text-[#B28A6A] uppercase">
               <div className="w-3 h-3 rounded-full border border-[#B28A6A]/30 flex items-center justify-center">
                  <div className="w-1 h-1 bg-[#B28A6A] rounded-full" />
               </div>
               Starts in 15 mins
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #F1F4F8;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #E4E7EC;
        }
      `}</style>
    </div>
  );
}