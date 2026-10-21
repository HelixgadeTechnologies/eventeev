"use client";

import React from "react";
import { HiOutlineChatAlt2 } from "react-icons/hi";

interface Topic {
  name: string;
  color?: string;
  text?: string;
  count?: number;
}

interface ChatInteractionWidgetProps {
  topics?: Topic[];
  rooms?: any[];
  totalMessages?: number;
  activeChatters?: number;
}

const ChatInteractionWidget: React.FC<ChatInteractionWidgetProps> = ({ 
  topics = [], 
  rooms = [], 
  totalMessages = 0, 
  activeChatters = 0 
}) => {
  // Use passed topics or derive from rooms
  const displayTopics: Topic[] = React.useMemo(() => {
    if (topics && topics.length > 0) return topics;
    if (rooms && rooms.length > 0) {
      const palette = [
        { color: "#EEF4FF", text: "#3538CD" },
        { color: "#FDF2FA", text: "#C11574" },
        { color: "#ECFDF3", text: "#027A48" },
        { color: "#F8F9FC", text: "#344054" },
        { color: "#FFF4ED", text: "#B93815" },
      ];
      return rooms.map((r, i) => ({
        name: `#${r.name || 'channel'}`,
        color: palette[i % palette.length].color,
        text: palette[i % palette.length].text,
        count: Array.isArray(r.participants) ? r.participants.length : undefined
      }));
    }
    return [];
  }, [topics, rooms]);

  return (
    <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm h-full flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-base font-bold text-[#1B1818]">Chat & Interaction</h2>
          <p className="text-[11px] text-gray-400 font-medium">Real-time attendee engagement</p>
        </div>
        <span className="text-xs bg-gray-50 border border-gray-100 text-gray-600 font-bold px-2.5 py-1 rounded-full">
          {rooms.length} {rooms.length === 1 ? 'Room' : 'Rooms'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Messages</p>
          <p className="text-lg font-black text-[#1B1818] mt-0.5">{totalMessages.toLocaleString()}</p>
        </div>
        <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Chatters</p>
          <p className="text-lg font-black text-[#EB5017] mt-0.5">{activeChatters.toLocaleString()}</p>
        </div>
      </div>

      <div>
        <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest mb-3">Channels & Topics</p>

        {displayTopics.length === 0 ? (
          <div className="py-5 text-center space-y-2 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
            <div className="w-8 h-8 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <HiOutlineChatAlt2 className="text-lg" />
            </div>
            <p className="text-xs font-bold text-gray-600">No active chat channels yet</p>
            <p className="text-[11px] text-gray-400 max-w-xs mx-auto">
              Channels will appear here as attendees message in event chat rooms.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 max-h-[110px] overflow-y-auto">
            {displayTopics.map((topic, idx) => (
              <span 
                key={idx}
                className="px-3 py-1.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5"
                style={{ backgroundColor: topic.color || "#F2F4F7", color: topic.text || "#344054" }}
              >
                <span>{topic.name}</span>
                {typeof topic.count === 'number' && topic.count > 0 && (
                  <span className="opacity-70 text-[10px]">({topic.count})</span>
                )}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInteractionWidget;
