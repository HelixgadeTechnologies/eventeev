"use client";

import React from "react";
import { HiOutlineChatAlt2 } from "react-icons/hi";

interface Topic {
  name: string;
  color?: string;
  text?: string;
}

interface ChatInteractionWidgetProps {
  topics?: Topic[];
}

const ChatInteractionWidget: React.FC<ChatInteractionWidgetProps> = ({ topics = [] }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm h-full flex flex-col justify-between">
       <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-bold text-[#1B1818]">Chat & Interaction</h2>
        <span className="text-xs text-gray-400 font-bold">Channels</span>
      </div>

      <div>
        <p className="text-[10px] font-black text-[#888888] uppercase tracking-widest mb-3">Discussed Topics</p>

        {topics.length === 0 ? (
          <div className="py-6 text-center space-y-2">
            <div className="w-8 h-8 mx-auto rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
              <HiOutlineChatAlt2 className="text-lg" />
            </div>
            <p className="text-xs font-bold text-gray-600">No active discussions yet</p>
            <p className="text-[11px] text-gray-400 max-w-xs mx-auto">
              Topics will appear here as attendees message in event chat channels.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
              {topics.map((topic, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1.5 rounded-full text-[11px] font-bold"
                    style={{ backgroundColor: topic.color || "#F2F4F7", color: topic.text || "#344054" }}
                  >
                    {topic.name}
                  </span>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInteractionWidget;
