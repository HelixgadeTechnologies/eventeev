"use client";

import React from "react";

const EMOJIS = [
  "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
  "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
  "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩",
  "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣",
  "😖", "😫", "😩", "🥺", "😢", "😭", "😮", "😯", "😲", "😳",
  "🤯", "🤬", "😡", "😠", "🤫", "🫠", "🫡", "🥱", "😴", "🤤",
  "😪", "😵", "😵‍💫", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒",
  "🤕", "🤑", "🤠", "😈", "👿", "👹", "👺", "🤡", "💩", "👻",
  "💀", "☠️", "👽", "👾", "🤖", "🎃", "😺", "😸", "😻", "😼",
  "👍", "👎", "👌", "🤌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈"
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect, onClose }) => {
  return (
    <div className="absolute bottom-full mb-4 left-0 bg-white border border-gray-100 rounded-[20px] shadow-2xl p-4 w-[300px] z-50">
      <div className="flex justify-between items-center mb-3 px-1">
        <h3 className="text-[11px] font-black text-[#1B1818] uppercase tracking-[0.1em]">Pick an Emoji</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-[#EB5017] text-xs font-bold">Close</button>
      </div>
      <div className="grid grid-cols-8 gap-2 h-40 overflow-y-auto custom-scrollbar p-1">
        {EMOJIS.map((emoji, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(emoji)}
            className="text-xl hover:bg-gray-50 rounded-lg p-1 transition-all active:scale-95"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
