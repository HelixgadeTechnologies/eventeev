"use client";

import React, { useState, useEffect } from "react";
import { 
  HiOutlineShieldCheck
} from "react-icons/hi2";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useParams } from "next/navigation";
import { eventsService } from "@/lib/services/events.service";
import { Loader2 } from "lucide-react";

export default function ChatSettings() {
  const params = useParams();
  const _id = params?._id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [eventData, setEventData] = useState<any>(null);

  const [enableLiveChat, setEnableLiveChat] = useState(true);
  const [profanityFilter, setProfanityFilter] = useState("Medium");
  const [autoBlockLinks, setAutoBlockLinks] = useState(false);
  const [allowPrivateMessaging, setAllowPrivateMessaging] = useState(true);
  const [allowEmojiReactions, setAllowEmojiReactions] = useState(true);
  const [allowFileSharing, setAllowFileSharing] = useState(false);
  const [theme, setTheme] = useState("standard");
  const [fontSize, setFontSize] = useState("medium");

  useEffect(() => {
    const fetchEvent = async () => {
      if (!_id) return;
      setLoading(true);
      const { data, error } = await eventsService.getEventById(_id);
      if (!error && data) {
        setEventData(data);
        const chat = data.settings?.chat || {};
        setEnableLiveChat(chat.enabled ?? true);
        setProfanityFilter(chat.filterStrength || "Medium");
        setAutoBlockLinks(chat.blockLinks ?? false);
        setAllowPrivateMessaging(chat.allowPM ?? true);
        setAllowEmojiReactions(chat.allowReactions ?? true);
        setAllowFileSharing(chat.allowFiles ?? false);
        setTheme(chat.theme || "standard");
        setFontSize(chat.fontSize || "medium");
      }
      setLoading(false);
    };

    fetchEvent();
  }, [_id]);

  const handleSave = async () => {
    setSaving(true);
    const updatePayload = {
      settings: {
        ...eventData?.settings,
        chat: {
          enabled: enableLiveChat,
          filterStrength: profanityFilter,
          blockLinks: autoBlockLinks,
          allowPM: allowPrivateMessaging,
          allowReactions: allowEmojiReactions,
          allowFiles: allowFileSharing,
          theme,
          fontSize,
        }
      }
    };

    const { error } = await eventsService.updateEvent(_id, updatePayload);
    setSaving(false);
    if (error) {
      alert("Failed to save chat settings: " + (error.message || "Unknown error"));
    } else {
      alert("Chat settings updated successfully!");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 bg-white">
        <Loader2 className="w-10 h-10 text-[#eb5017] animate-spin" />
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Chat Settings...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden p-4 md:p-6 bg-white select-none">
      {/* Header */}
      <header className="mb-4 flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold text-[#1B1818] leading-tight tracking-tight">Chat Settings</h1>
          <p className="text-[10px] font-medium text-[#C27E33] mt-0.5 opacity-90 leading-relaxed max-w-2xl">
            Configure moderation rules, permissions, and appearance for the live event chat experience.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#eb5017] text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-[#d64815] transition-all disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Rules"}
        </button>
      </header>

      {/* Main Content Areas */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column: Management & Moderation */}
          <div className="flex-1 space-y-6 min-w-0">
            
            {/* Chat Management */}
            <section className="space-y-3">
              <h3 className="text-xs font-bold text-[#1B1818] uppercase tracking-wider">Chat Management</h3>
              <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-[#1B1818]">Enable Live Chat</Label>
                  <p className="text-[9px] font-medium text-gray-400">Allow attendees to communicate in real-time during the event</p>
                </div>
                <Switch checked={enableLiveChat} onCheckedChange={setEnableLiveChat} />
              </div>
            </section>

            {/* Moderation Tools */}
            <section className="space-y-3">
              <h3 className="text-xs font-bold text-[#1B1818] uppercase tracking-wider">Moderation Tools</h3>
              <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-4 shadow-sm">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#1B1818]">Profanity Filter Strength</Label>
                  <select 
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-[#1B1818] focus:ring-1 focus:ring-[#EB5017]/10 focus:border-[#EB5017] transition-all outline-none appearance-none"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Extreme</option>
                  </select>
                  <p className="text-[9px] font-medium text-gray-400 mt-1">Determines how strictly the automatic filter blocks sensitive content</p>
                </div>
                
                <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-[#1B1818]">Auto-block Links</Label>
                    <p className="text-[9px] font-medium text-gray-400">Prevent users from sharing URLs in public chat</p>
                  </div>
                  <Switch checked={autoBlockLinks} onCheckedChange={setAutoBlockLinks} />
                </div>
              </div>
            </section>

            {/* Participant Permissions */}
            <section className="space-y-3">
              <h3 className="text-xs font-bold text-[#1B1818] uppercase tracking-wider">Participant Permissions</h3>
              <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-[#1B1818]">Allow Private Messaging</Label>
                    <p className="text-[9px] font-medium text-gray-400">Users can send direct messages to each other</p>
                  </div>
                  <Switch checked={allowPrivateMessaging} onCheckedChange={setAllowPrivateMessaging} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-[#1B1818]">Allow Emoji Reactions</Label>
                    <p className="text-[9px] font-medium text-gray-400">Let users react to messages with emojis</p>
                  </div>
                  <Switch checked={allowEmojiReactions} onCheckedChange={setAllowEmojiReactions} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-[#1B1818]">Allow File Sharing</Label>
                    <p className="text-[9px] font-medium text-gray-400">Allow users to upload images and documents</p>
                  </div>
                  <Switch checked={allowFileSharing} onCheckedChange={setAllowFileSharing} />
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Display & Policy */}
          <div className="w-full lg:w-[280px] flex-none space-y-4">
            {/* Chat Display */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-4 shadow-sm">
               <h3 className="text-xs font-bold text-[#1B1818] uppercase tracking-wider">Chat Display</h3>
               
               <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-[#1B1818] uppercase tracking-wider">Message Font Size</Label>
                  <select 
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-[#1B1818] focus:ring-1 focus:ring-[#EB5017]/10 focus:border-[#EB5017] transition-all outline-none appearance-none"
                  >
                    <option value="small">Small (12px)</option>
                    <option value="medium">Medium (14px)</option>
                    <option value="large">Large (16px)</option>
                  </select>
               </div>
               
               <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-[#1B1818] uppercase tracking-wider">Chat Theme</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setTheme("standard")}
                      className={`p-2 rounded-lg border-2 transition-all text-center ${theme === "standard" ? "border-[#EB5017] bg-white" : "border-gray-50 bg-gray-50 opacity-60"}`}
                    >
                      <div className="h-10 bg-white border border-gray-100 rounded mb-1 flex flex-col justify-end p-1.5 gap-1">
                        <div className="h-1 w-2/3 bg-orange-200 rounded-full" />
                        <div className="h-1 w-1/3 bg-gray-200 rounded-full" />
                      </div>
                      <span className="text-[10px] font-bold text-[#1B1818]">Standard</span>
                    </button>
                    <button 
                      onClick={() => setTheme("dark")}
                      className={`p-2 rounded-lg border-2 transition-all text-center ${theme === "dark" ? "border-[#EB5017] bg-white" : "border-gray-50 bg-gray-50 opacity-60"}`}
                    >
                      <div className="h-10 bg-[#111] border border-gray-800 rounded mb-1 flex flex-col justify-end p-1.5 gap-1">
                        <div className="h-1 w-2/3 bg-orange-500 rounded-full" />
                        <div className="h-1 w-1/3 bg-gray-700 rounded-full" />
                      </div>
                      <span className="text-[10px] font-bold text-[#1B1818]">Dark Mode</span>
                    </button>
                  </div>
               </div>
            </div>

            {/* Safe Space Policy */}
            <div className="bg-[#FFFBF7] border border-orange-100 rounded-2xl p-4 space-y-3 shadow-sm">
               <div className="flex items-center gap-2">
                 <HiOutlineShieldCheck className="text-lg text-[#EB5017]" />
                 <h4 className="text-xs font-bold text-[#EB5017]">Safe Space Policy</h4>
               </div>
               <p className="text-[10px] font-medium text-[#B28A6A] leading-relaxed">
                  Strong profanity filtering and link blocking are recommended for public events to ensure a professional and safe environment for all participants.
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
