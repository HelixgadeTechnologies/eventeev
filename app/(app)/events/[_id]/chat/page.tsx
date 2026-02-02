"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { FiSearch, FiMoreVertical, FiPaperclip, FiSmile } from "react-icons/fi";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "@/components/chat/EmojiPicker";


export default function ChatPage() {
  const [activeRoom, setActiveRoom] = useState({ id: "general", name: "General Lobby", description: "Public room for all event participants" });
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("File attached:", file.name);
      alert(`File "${file.name}" attached. Logic for uploading can be added here.`);
    }
  };

  const messages = {
    general: [
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
    ],
    private: [
      {
        id: 1,
        user: {
          name: "Alexandra Moore",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
        },
        time: "11:05 AM",
        text: "Hi everyone! I'll be answering your questions about predictive analytics here for the next 30 minutes.",
        isSelf: false,
        label: "Speaker"
      },
      {
        id: 2,
        user: {
          name: "Mark Wilson",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
        },
        time: "11:10 AM",
        text: "How do you handle missing data in large datasets without introducing bias?",
        isSelf: false,
        label: "Question"
      },
      {
        id: 3,
        user: {
          name: "Alexandra Moore",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
        },
        time: "11:12 AM",
        text: "Great question, Mark. We typically use multiple imputation methods rather than simple mean replacement to preserve the variance.",
        isSelf: false,
        label: "Answer"
      }
    ]
  };

  const onlineUsers = [
    { name: "Marcus Lee", status: "online", level: 12, rank: "Pro", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150" },
    { name: "Sarah Jenkins", status: "online", level: 8, rank: "Newbie", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" },
    { name: "David Chen", status: "away", level: null, rank: null, avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" },
    { name: "Emily Watson", status: "online", level: 15, rank: "Expert", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150" },
  ];

  const privateRooms = [
    { id: "private-1", name: "Data Ethics Q&A", speaker: "Alexandra Moore", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150", participants: 12 },
    { id: "private-2", name: "Marketing Strategy", speaker: "Benjamin Cole", avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150", participants: 8 },
    { id: "private-3", name: "Blockchain Tech", speaker: "Frank Gibson", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150", participants: 5 },
    { id: "private-4", name: "Design Workshop", speaker: "Emma Rivera", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150", participants: 15 },
  ];

  const currentMessages = activeRoom.id === "general" ? messages.general : messages.private;


  return (
    <div className="flex bg-white h-[calc(100vh-140px)] border border-gray-100 rounded-[24px] overflow-hidden font-sans">
      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col min-w-0 bg-white">
        {/* Header */}
        <header className="px-8 py-5 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-[#1B1818] tracking-tight">{activeRoom.name}</h1>
            <p className="text-xs font-bold text-gray-400 mt-0.5">{activeRoom.description}</p>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <button className="hover:text-[#EB5017] transition-colors"><FiSearch size={20} /></button>
            <button className="hover:text-[#EB5017] transition-colors"><FiMoreVertical size={20} /></button>
          </div>
        </header>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 custom-scrollbar">
          {currentMessages.map((msg) => {
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
                    {msg.label && (
                      <span className={`px-1.5 py-0.5 rounded text-[9px] lowercase font-bold ${
                        msg.label === "Speaker" ? "bg-[#1B1818] text-white" :
                        msg.label === "Answer" ? "bg-[#EB5017] text-white" :
                        msg.label === "Question" ? "bg-gray-200 text-gray-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {msg.label}
                      </span>
                    )}
                    <span className="text-gray-300 font-bold">{msg.time}</span>
                  </div>
                  <div className={`px-6 py-4 rounded-[20px] shadow-sm text-sm font-medium leading-relaxed border-2 ${
                    msg.isSelf 
                      ? "bg-[#EB5017] text-white rounded-tr-none border-[#EB5017]" 
                      : msg.label === "Answer"
                      ? "bg-[#FFF8F2] text-[#1B1818] rounded-tl-none border-[#EB5017]"
                      : msg.label === "Speaker"
                      ? "bg-white text-[#1B1818] rounded-tl-none border-[#1B1818]"
                      : msg.label === "Question"
                      ? "bg-[#F3EBE3]/30 text-[#1B1818] rounded-tl-none border-gray-200 italic"
                      : "bg-[#F3EBE3]/50 text-[#1B1818] rounded-tl-none border-transparent"
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
          <div className="bg-white border border-gray-100 rounded-[20px] p-2 flex items-center gap-2 shadow-lg shadow-gray-100/50 relative">
            <button 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-3 transition-colors ${showEmojiPicker ? "text-[#EB5017]" : "text-gray-400 hover:text-[#EB5017]"}`}
            >
              <FiSmile size={24} />
            </button>
            {showEmojiPicker && (
              <EmojiPicker 
                onSelect={handleEmojiSelect} 
                onClose={() => setShowEmojiPicker(false)} 
              />
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
            <button 
              onClick={handleAttachClick}
              className="p-3 text-gray-400 hover:text-[#EB5017] transition-colors"
            >
              <FiPaperclip size={24} />
            </button>
            <input 
              type="text" 
              placeholder={activeRoom.id === "general" ? "Type a message to the lobby..." : `Ask ${activeRoom.name.split(' ')[0]} a question...`}
              className="flex-grow bg-transparent outline-none text-sm font-semibold text-[#1B1818] placeholder:text-gray-300 px-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={() => setShowEmojiPicker(false)}
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
        <div className="p-6 border-b border-gray-50 flex-none overflow-y-auto custom-scrollbar max-h-[40%]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[11px] font-black text-[#1B1818] uppercase tracking-[0.1em]">Who&apos;s Online</h2>
            <span className="bg-[#E7F6EC] text-[#0FAF94] px-2 py-0.5 rounded text-[10px] font-black">124</span>
          </div>
          
          <div className="space-y-6">
            {onlineUsers.slice(0, 4).map((user, idx) => (
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

        {/* Private Room Section */}
        <div className="p-6 border-b border-gray-50 flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[11px] font-black text-[#1B1818] uppercase tracking-[0.1em]">Private Room</h2>
            <button 
              onClick={() => setActiveRoom({ id: "general", name: "General Lobby", description: "Public room for all event participants" })}
              className="text-[10px] font-black text-[#EB5017] hover:underline"
            >
              Lobby
            </button>
          </div>
          
          <div className="space-y-6">
            {privateRooms.map((room) => (
              <div 
                key={room.id} 
                onClick={() => setActiveRoom({ id: room.id, name: room.name, description: `Dedicated Q&A with ${room.speaker}` })}
                className={`flex items-center gap-3 group cursor-pointer p-2 rounded-xl transition-all ${activeRoom.id === room.id ? 'bg-[#FFF8F2] border border-[#FFD9B3]' : 'hover:bg-gray-50'}`}
              >
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${activeRoom.id === room.id ? 'border-[#EB5017]' : 'border-white shadow-sm'}`}>
                    <Image src={room.avatarUrl} alt={room.speaker} width={40} height={40} className="object-cover" />
                  </div>
                </div>
                <div className="flex-grow overflow-hidden">
                  <p className={`text-[13px] font-black truncate transition-colors ${activeRoom.id === room.id ? 'text-[#EB5017]' : 'text-[#1B1818] group-hover:text-[#EB5017]'}`}>{room.name}</p>
                  <p className="text-[10px] font-bold text-gray-400 truncate">{room.speaker} • {room.participants} online</p>
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