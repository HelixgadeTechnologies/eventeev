"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { FiSearch, FiMoreVertical, FiPaperclip, FiSmile } from "react-icons/fi";
import { IoSend } from "react-icons/io5";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import EmojiPicker from "@/components/chat/EmojiPicker";
import { chatService, Message, Room } from "@/lib/services/chat.service";
import { authService } from "@/lib/services/auth.service";
import { toast } from "sonner";

export default function ChatPage() {
  const { _id } = useParams();
  const eventId = (Array.isArray(_id) ? _id[0] : _id) || "";
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize socket and fetch data
  useEffect(() => {
    const initChat = async () => {
      try {
        const { user } = await authService.getCurrentUser();
        if (!user) {
          toast.error("Please login to chat");
          return;
        }
        setCurrentUser(user);

        const token = localStorage.getItem('x-auth-token');
        if (token) {
          chatService.initSocket(token);
        }
        
        if (!eventId) return;

        const fetchedRooms = await chatService.getRooms(eventId as string);
        setRooms(fetchedRooms);
        if (fetchedRooms.length > 0) {
          setActiveRoom(fetchedRooms[0]);
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Failed to connect to chat");
      } finally {
        setIsLoading(false);
      }
    };

    initChat();

    return () => {
      chatService.disconnect();
    };
  }, [eventId]);

  // Handle room change
  useEffect(() => {
    if (activeRoom) {
      chatService.joinRoom(activeRoom.id || (activeRoom as any)._id);
      
      const fetchHistory = async () => {
        try {
          const history = await chatService.getMessages(activeRoom.id || (activeRoom as any)._id);
          setMessages(history);
          scrollToBottom();
        } catch (error) {
          toast.error("Failed to load message history");
        }
      };

      fetchHistory();

      const handleNewMessage = (msg: any) => {
        if (msg.room === (activeRoom.id || (activeRoom as any)._id)) {
          setMessages(prev => [...prev, msg]);
          scrollToBottom();
        }
      };

      chatService.onReceiveMessage(handleNewMessage);
    }
  }, [activeRoom]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeRoom || !currentUser) return;

    const messageData = {
      room: activeRoom.id || (activeRoom as any)._id,
      sender: currentUser.id || currentUser._id,
      content: inputText,
      type: 'user_message'
    };

    chatService.sendMessage(messageData);
    setInputText("");
    setShowEmojiPicker(false);
  };

  const handleEmojiSelect = (emoji: string) => {
    setInputText((prev) => prev + emoji);
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.info("File upload functionality coming soon!");
    }
  };



  if (isLoading) {
    return (
      <div className="flex bg-white h-[calc(100vh-140px)] border border-gray-100 rounded-[24px] items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#EB5017] mx-auto" />
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Connecting to lobby...</p>
        </div>
      </div>
    );
  }

  if (!activeRoom) {
     return (
      <div className="flex bg-white h-[calc(100vh-140px)] border border-gray-100 rounded-[24px] items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg font-black text-gray-400">No chat rooms available for this event.</p>
        </div>
      </div>
    );
  }


  return (
    <div className="flex bg-white h-[calc(100vh-140px)] border border-gray-100 rounded-[24px] overflow-hidden font-sans">
      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col min-w-0 bg-white">
        {/* Header */}
        <header className="px-8 py-5 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-[#1B1818] tracking-tight">{activeRoom.name}</h1>
            <p className="text-xs font-bold text-gray-400 mt-0.5">{activeRoom.type === 'public' ? 'Public Lobby' : 'Private Session'}</p>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <button className="hover:text-[#EB5017] transition-colors"><FiSearch size={20} /></button>
            <button className="hover:text-[#EB5017] transition-colors"><FiMoreVertical size={20} /></button>
          </div>
        </header>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 custom-scrollbar">
          {messages.map((msg: any) => {
            const isSystem = msg.type === "system_message";
            if (isSystem) {
              return (
                <div key={msg._id || msg.id} className="flex justify-center my-6">
                  <div className="bg-white border border-gray-100 px-6 py-2 rounded-full text-[10px] font-black text-gray-400 tracking-[0.15em] uppercase shadow-sm">
                    {msg.content}
                  </div>
                </div>
              );
            }

            const sender = msg.sender;
            const isSelf = sender?._id === currentUser?.id || sender?.id === currentUser?.id;
            const time = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";

            return (
              <div key={msg._id || msg.id} className={`flex items-start gap-4 ${isSelf ? "flex-row-reverse" : ""}`}>
                <div className="flex-shrink-0 mt-6">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-100">
                      <Image 
                        src={sender?.avatar || `https://ui-avatars.com/api/?name=${sender?.name || 'User'}&background=random`} 
                        alt={sender?.name || "User"} 
                        width={40} 
                        height={40} 
                        className="object-cover" 
                      />
                   </div>
                </div>
                <div className={`flex flex-col max-w-[70%] ${isSelf ? "items-end" : "items-start"}`}>
                  <div className={`flex items-center gap-2 mb-2 text-[11px] font-black uppercase tracking-wider ${isSelf ? "flex-row-reverse text-[#EB5017]" : "text-[#B28A6A]"}`}>
                    <span>{isSelf ? "You" : sender?.name}</span>
                    <span className="text-gray-300 font-bold">{time}</span>
                  </div>
                  <div className={`px-6 py-4 rounded-[20px] shadow-sm text-sm font-medium leading-relaxed border-2 ${
                    isSelf 
                      ? "bg-[#EB5017] text-white rounded-tr-none border-[#EB5017]" 
                      : "bg-[#F3EBE3]/50 text-[#1B1818] rounded-tl-none border-transparent"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
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
            <form onSubmit={handleSendMessage} className="flex-grow flex items-center gap-2">
              <input 
                type="text" 
                placeholder={activeRoom.name === "General Lobby" ? "Type a message to the lobby..." : `Message ${activeRoom.name}...`}
                className="flex-grow bg-transparent outline-none text-sm font-semibold text-[#1B1818] placeholder:text-gray-300 px-2"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onFocus={() => setShowEmojiPicker(false)}
              />
              <button 
                type="submit"
                className="bg-[#EB5017] text-white pl-8 pr-6 py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-[#d64815] transition-all transform active:scale-95 shadow-md shadow-[#EB5017]/20"
              >
                Send <IoSend className="-rotate-12 ml-1" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-[280px] bg-white border-l border-gray-50 flex flex-col shrink-0">
        {/* Who's Online Section - Placeholder for real-time presence */}
        <div className="p-6 border-b border-gray-50 flex-none overflow-y-auto custom-scrollbar max-h-[40%]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[11px] font-black text-[#1B1818] uppercase tracking-[0.1em]">Who&apos;s Online</h2>
            <span className="bg-[#E7F6EC] text-[#0FAF94] px-2 py-0.5 rounded text-[10px] font-black">1</span>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#EB5017] shadow-sm">
                  <Image 
                    src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${currentUser?.name || 'User'}&background=random`} 
                    alt={currentUser?.name || "You"} 
                    width={40} 
                    height={40} 
                    className="object-cover" 
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-[#0FAF94]" />
              </div>
              <div className="flex-grow overflow-hidden">
                <p className="text-[13px] font-black text-[#1B1818] truncate">{currentUser?.name} (You)</p>
                <p className="text-[10px] font-bold text-gray-400">Online</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rooms Section */}
        <div className="p-6 border-b border-gray-50 flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[11px] font-black text-[#1B1818] uppercase tracking-[0.1em]">Chat Rooms</h2>
          </div>
          
          <div className="space-y-6">
            {rooms.map((room) => (
              <div 
                key={room.id || (room as any)._id} 
                onClick={() => setActiveRoom(room)}
                className={`flex items-center gap-3 group cursor-pointer p-2 rounded-xl transition-all ${activeRoom.id === room.id ? 'bg-[#FFF8F2] border border-[#FFD9B3]' : 'hover:bg-gray-50'}`}
              >
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center border-2 transition-all ${activeRoom.id === room.id ? 'border-[#EB5017] bg-[#EB5017]/10' : 'border-white bg-gray-50 shadow-sm'}`}>
                    <span className={`font-black text-xs ${activeRoom.id === room.id ? 'text-[#EB5017]' : 'text-gray-400'}`}>
                      {room.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="flex-grow overflow-hidden">
                  <p className={`text-[13px] font-black truncate transition-colors ${activeRoom.id === room.id ? 'text-[#EB5017]' : 'text-[#1B1818] group-hover:text-[#EB5017]'}`}>{room.name}</p>
                  <p className="text-[10px] font-bold text-gray-400 truncate">{room.type === 'public' ? 'Lobby' : 'Workshop'}</p>
                </div>
              </div>
            ))}
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