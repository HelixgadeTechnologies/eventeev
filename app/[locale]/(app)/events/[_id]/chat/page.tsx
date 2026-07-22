"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FiSearch, FiMoreVertical, FiPaperclip, FiSmile, FiMessageSquare, FiCoffee } from "react-icons/fi";
import { IoSend as SendIcon } from "react-icons/io5";
import { HiOutlineChatBubbleLeftRight, HiOutlineUsers } from "react-icons/hi2";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import EmojiPicker from "@/components/chat/EmojiPicker";
import { chatService, Room } from "@/lib/services/chat.service";
import { authService } from "@/lib/services/auth.service";
import { attendeesService } from "@/lib/services/attendees.service";
import { uploadService } from "@/lib/services/upload.service";
import { toast } from "sonner";

export default function ChatPage() {
  const { _id } = useParams();
  const eventId = (Array.isArray(_id) ? _id[0] : _id) || "";
  
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://eventeevapi.onrender.com');
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [roomCount, setRoomCount] = useState(0);
  const [isActivated, setIsActivated] = useState(false);
  const [hasEnoughAttendees, setHasEnoughAttendees] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [eventMembers, setEventMembers] = useState<any[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize socket and fetch initial data
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

        // Fetch attendees for presence & activation check
        try {
          const res = await attendeesService.getAttendees(eventId as string, 1, 50);
          const attendeesList = res.data || [];
          setEventMembers(attendeesList);
          const totalAttendees = res.pagination?.total || attendeesList.length || 0;
          if (totalAttendees >= 2) {
            setHasEnoughAttendees(true);
          }
        } catch (err) {
          console.error("Error fetching attendees:", err);
        }

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

  // Handle room change & socket message subscription
  useEffect(() => {
    if (!activeRoom) return;

    const currentRoomId = activeRoom.id || (activeRoom as any)._id;
    chatService.joinRoom(currentRoomId);
    
    // Reset unread count for current room
    setUnreadCounts(prev => ({ ...prev, [currentRoomId]: 0 }));

    const fetchHistory = async () => {
      try {
        const history = await chatService.getMessages(currentRoomId);
        const msgs = Array.isArray(history) ? history : (history?.messages || history?.data || []);
        setMessages(Array.isArray(msgs) ? msgs : []);
        scrollToBottom();
      } catch (error) {
        toast.error("Failed to load message history");
      }
    };

    fetchHistory();

    const handleNewMessage = (msg: any) => {
      if (msg.room === currentRoomId) {
        setMessages(prev => [...prev, msg]);
        scrollToBottom();
      } else {
        setUnreadCounts(prev => ({
          ...prev,
          [msg.room]: (prev[msg.room] || 0) + 1
        }));
      }
    };

    const handleRoomStatus = (status: { activated: boolean; count: number; roomId: string }) => {
      if (status.roomId === currentRoomId) {
        setIsActivated(status.activated);
        setRoomCount(status.count);
      }
    };

    chatService.onReceiveMessage(handleNewMessage);
    chatService.onRoomStatus(handleRoomStatus);

    return () => {
      chatService.offReceiveMessage(handleNewMessage);
      chatService.offRoomStatus(handleRoomStatus);
    };
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeRoom || !currentUser) return;

    setIsUploading(true);
    toast.loading("Uploading image...", { id: "chat-upload" });

    try {
      const { data, error } = await uploadService.uploadImage(file);
      if (error || !data) {
        toast.error(error?.message || "Failed to upload image", { id: "chat-upload" });
        return;
      }

      const imageUrl = data.url || data.secure_url || data.image || data;
      const messageData = {
        room: activeRoom.id || (activeRoom as any)._id,
        sender: currentUser.id || currentUser._id,
        content: typeof imageUrl === 'string' ? imageUrl : JSON.stringify(imageUrl),
        type: 'image'
      };

      chatService.sendMessage(messageData);
      toast.success("Image sent!", { id: "chat-upload" });
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload image", { id: "chat-upload" });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
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

  const isImageContent = (msg: any) => {
    if (msg.type === 'image') return true;
    const content = msg.content || '';
    return typeof content === 'string' && (content.startsWith('http://') || content.startsWith('https://')) &&
      (content.match(/\.(jpeg|jpg|gif|png|webp)/i) || content.includes('cloudinary'));
  };

  return (
    <div className="flex bg-white h-[calc(100vh-140px)] border border-gray-100 rounded-[24px] overflow-hidden font-sans">
      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col min-w-0 bg-white">
        {/* Header */}
        <header className="px-8 py-5 border-b border-gray-50 flex items-center justify-between min-h-[84px]">
          {activeRoom ? (
            <>
              <div>
                <h1 className="text-xl font-black text-[#1B1818] tracking-tight">{activeRoom.name}</h1>
                <p className="text-xs font-bold text-gray-400 mt-0.5">{activeRoom.type === 'general' ? 'Public Lobby' : 'Private Session'}</p>
              </div>
              <div className="flex items-center gap-4 text-gray-400">
                <button className="hover:text-[#EB5017] transition-colors"><FiSearch size={20} /></button>
                <button className="hover:text-[#EB5017] transition-colors"><FiMoreVertical size={20} /></button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300">
                 <FiMessageSquare size={20} />
               </div>
               <div>
                 <div className="h-4 w-32 bg-gray-50 rounded animate-pulse mb-2" />
                 <div className="h-3 w-48 bg-gray-50/50 rounded animate-pulse" />
               </div>
            </div>
          )}
        </header>

        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 custom-scrollbar relative">
          {!activeRoom ? (
            <div className="absolute inset-0 flex items-center justify-center p-12">
               <div className="text-center max-w-sm">
                 <div className="w-20 h-20 bg-[#FFF8F2] rounded-[32px] flex items-center justify-center text-[#EB5017] mx-auto mb-6 shadow-xl shadow-[#EB5017]/5">
                   <HiOutlineChatBubbleLeftRight size={40} />
                 </div>
                 <h3 className="text-xl font-black text-[#1B1818] tracking-tight mb-2 uppercase">Select a Room</h3>
                 <p className="text-sm text-gray-400 font-medium leading-relaxed">
                   Join a lobby or session to start interacting with other attendees and organizers in real-time.
                 </p>
               </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-12">
               <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                 <FiMessageSquare size={24} />
               </div>
               <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Begin the conversation</p>
               <p className="text-xs text-gray-300 font-bold uppercase tracking-widest">No messages yet — be the first to speak!</p>
            </div>
          ) : (
            messages.map((msg: any) => {
              const isSystem = msg.type === "system_message";
              if (isSystem) {
                return (
                  <div key={msg._id || msg.id || Math.random()} className="flex justify-center my-6">
                    <div className="bg-white border border-gray-100 px-6 py-2 rounded-full text-[10px] font-black text-gray-400 tracking-[0.15em] uppercase shadow-sm">
                      {msg.content}
                    </div>
                  </div>
                );
              }

              const sender = msg.sender;
              const isSelf = sender?._id === currentUser?.id || sender?.id === currentUser?.id || msg.sender === currentUser?.id;
              const time = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";
              const isImg = isImageContent(msg);

              return (
                <div key={msg._id || msg.id || Math.random()} className={`flex items-start gap-4 ${isSelf ? "flex-row-reverse" : ""}`}>
                  <div className="flex-shrink-0 mt-2">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-100">
                        <Image 
                          src={sender?.avatar ? (sender.avatar.startsWith('http') ? sender.avatar : `${BASE_URL}${sender.avatar}`) : `https://ui-avatars.com/api/?name=${encodeURIComponent(sender?.name || 'User')}&background=random`} 
                          alt={sender?.name || "User"} 
                          width={40} 
                          height={40} 
                          className="object-cover" 
                        />
                     </div>
                  </div>
                  <div className={`flex flex-col max-w-[70%] ${isSelf ? "items-end" : "items-start"}`}>
                    <div className={`flex items-center gap-2 mb-2 text-[11px] font-black uppercase tracking-wider ${isSelf ? "flex-row-reverse text-[#EB5017]" : "text-[#B28A6A]"}`}>
                      <span>{isSelf ? "You" : sender?.name || "Member"}</span>
                      <span className="text-gray-300 font-bold">{time}</span>
                    </div>
                    {isImg ? (
                      <div className="rounded-2xl overflow-hidden border-2 border-gray-100 shadow-md max-w-sm">
                        <a href={msg.content} target="_blank" rel="noopener noreferrer">
                          <img 
                            src={msg.content} 
                            alt="Shared attachment" 
                            className="w-full h-auto max-h-64 object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </a>
                      </div>
                    ) : (
                      <div className={`px-6 py-4 rounded-[20px] shadow-sm text-sm font-medium leading-relaxed border-2 ${
                        isSelf 
                          ? "bg-[#EB5017] text-white rounded-tr-none border-[#EB5017]" 
                          : "bg-[#F3EBE3]/50 text-[#1B1818] rounded-tl-none border-transparent"
                      }`}>
                        {msg.content}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          
          {/* Room Activation Overlay */}
          {activeRoom && !isActivated && !hasEnoughAttendees && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-10 flex items-center justify-center p-8">
              <div className="text-center max-w-sm bg-white p-8 rounded-[32px] shadow-2xl shadow-[#EB5017]/10 border border-gray-50 transform hover:scale-[1.02] transition-transform">
                <div className="w-16 h-16 bg-[#FFF8F2] rounded-2xl flex items-center justify-center text-[#EB5017] mx-auto mb-6">
                  <HiOutlineUsers size={32} />
                </div>
                <h3 className="text-lg font-black text-[#1B1818] tracking-tight mb-2 uppercase">Awaiting Activation</h3>
                <p className="text-sm text-gray-400 font-medium leading-relaxed mb-4">
                  This room requires at least 2 attendees to be present. Share the event link to invite others!
                </p>
                <div className="flex justify-center items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-[#EB5017] animate-ping" />
                   <span className="text-[10px] font-black text-[#EB5017] uppercase tracking-widest">
                     Current Count: {roomCount}/2
                   </span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className={`px-8 pb-8 pt-4 transition-opacity duration-300 ${(!activeRoom || (!isActivated && !hasEnoughAttendees)) ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
          <div className="bg-white border border-gray-100 rounded-[20px] p-2 flex items-center gap-2 shadow-lg shadow-gray-100/50 relative">
            <button 
              disabled={!activeRoom}
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
              disabled={!activeRoom || isUploading}
              onClick={handleAttachClick}
              className="p-3 text-gray-400 hover:text-[#EB5017] transition-colors disabled:opacity-50"
              title="Attach Image"
            >
              {isUploading ? <Loader2 size={22} className="animate-spin text-[#EB5017]" /> : <FiPaperclip size={24} />}
            </button>
            <form onSubmit={handleSendMessage} className="flex-grow flex items-center gap-2">
              <input 
                type="text" 
                disabled={!activeRoom}
                placeholder={!activeRoom ? "Please select a room first..." : activeRoom.name === "General Lobby" ? "Type a message to the lobby..." : `Message ${activeRoom.name}...`}
                className="flex-grow bg-transparent outline-none text-sm font-semibold text-[#1B1818] placeholder:text-gray-300 px-2"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onFocus={() => setShowEmojiPicker(false)}
              />
              <button 
                type="submit"
                disabled={!activeRoom || !inputText.trim()}
                className="bg-[#EB5017] text-white pl-8 pr-6 py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-[#d64815] transition-all transform active:scale-95 shadow-md shadow-[#EB5017]/20 disabled:bg-gray-200 disabled:shadow-none"
              >
                Send <SendIcon className="-rotate-12 ml-1" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-[280px] bg-white border-l border-gray-50 flex flex-col shrink-0">
        {/* Members / Who's Online Section */}
        <div className="p-6 border-b border-gray-50 flex-none overflow-y-auto custom-scrollbar max-h-[40%]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[11px] font-black text-[#1B1818] uppercase tracking-[0.1em]">Event Members</h2>
            <span className="bg-[#E7F6EC] text-[#0FAF94] px-2 py-0.5 rounded text-[10px] font-black">{eventMembers.length + 1}</span>
          </div>
          
          <div className="space-y-4">
            {/* Current user */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#EB5017] shadow-sm">
                  <Image 
                    src={currentUser?.avatar ? (currentUser.avatar.startsWith('http') ? currentUser.avatar : `${BASE_URL}${currentUser.avatar}`) : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'User')}&background=random`} 
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

            {/* Other Attendees */}
            {eventMembers.map((member: any) => (
              <div key={member.id || member._id || Math.random()} className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-100 bg-gray-50">
                    <Image 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || member.email || 'Member')}&background=random`} 
                      alt={member.name || "Member"} 
                      width={36} 
                      height={36} 
                      className="object-cover" 
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white bg-gray-300" />
                </div>
                <div className="flex-grow overflow-hidden">
                  <p className="text-xs font-bold text-[#1B1818] truncate">{member.name || member.email}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{member.checkedIn ? 'Verified' : 'Attendee'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rooms Section */}
        <div className="p-6 border-b border-gray-50 flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[11px] font-black text-[#1B1818] uppercase tracking-[0.1em]">Chat Rooms</h2>
          </div>
          
          <div className="space-y-3">
            {rooms.length === 0 ? (
               <div className="py-12 px-4 text-center group cursor-default">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-200 mx-auto mb-4 group-hover:bg-[#FFF8F2] group-hover:text-[#EB5017] transition-all duration-500">
                    <FiCoffee size={24} />
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">No chat rooms found for this event yet.</p>
               </div>
            ) : (
              rooms.map((room) => {
                const roomId = room.id || (room as any)._id;
                const isSelected = (activeRoom?.id || (activeRoom as any)?._id) === roomId;
                const unread = unreadCounts[roomId] || 0;

                return (
                  <div 
                    key={roomId} 
                    onClick={() => setActiveRoom(room)}
                    className={`flex items-center gap-3 group cursor-pointer p-3 rounded-2xl transition-all ${isSelected ? 'bg-[#FFF8F2] border border-[#FFD9B3]' : 'hover:bg-gray-50 border border-transparent'}`}
                  >
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center border-2 transition-all ${isSelected ? 'border-[#EB5017] bg-[#EB5017]/10' : 'border-white bg-gray-50 shadow-sm'}`}>
                        <span className={`font-black text-xs ${isSelected ? 'text-[#EB5017]' : 'text-gray-400'}`}>
                          {room.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-grow overflow-hidden">
                      <p className={`text-[13px] font-black truncate transition-colors ${isSelected ? 'text-[#EB5017]' : 'text-[#1B1818] group-hover:text-[#EB5017]'}`}>{room.name}</p>
                      <p className="text-[10px] font-bold text-gray-400 truncate">{room.type === 'general' ? 'Lobby' : 'Workshop'}</p>
                    </div>
                    {unread > 0 && !isSelected && (
                      <span className="bg-[#EB5017] text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce">
                        {unread}
                      </span>
                    )}
                  </div>
                );
              })
            )}
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