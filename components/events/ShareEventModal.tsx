"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LuCopy, LuCheck, LuTwitter, LuFacebook, LuLinkedin } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa6";
import { cn } from "@/lib/utils";

interface ShareEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventUrl: string;
  eventName: string;
}

const ShareEventModal = ({ isOpen, onClose, eventUrl, eventName }: ShareEventModalProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  const shareLinks = [
    {
      name: "X (Twitter)",
      icon: LuTwitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `Check out this event: ${eventName}`
      )}&url=${encodeURIComponent(eventUrl)}`,
      color: "bg-black text-white",
    },
    {
      name: "Facebook",
      icon: LuFacebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`,
      color: "bg-[#1877F2] text-white",
    },
    {
      name: "LinkedIn",
      icon: LuLinkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(eventUrl)}`,
      color: "bg-[#0A66C2] text-white",
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `${eventName}: ${eventUrl}`
      )}`,
      color: "bg-[#25D366] text-white",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-3xl border-none shadow-2xl p-6 px-8 h-fit overflow-hidden">
        <DialogHeader className="space-y-1 text-center">
          <p className="text-[10px] font-black text-[#eb5017] uppercase tracking-[0.2em]">Spread the word</p>
          <DialogTitle className="text-xl font-black text-[#1B1818] tracking-tight">Share Event</DialogTitle>
          <DialogDescription className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
            Invite others to join "{eventName}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* URL Copy Section */}
          <div className="space-y-2">
            <p className="text-[10px] font-black text-[#1B1818] uppercase tracking-[0.1em]">Event Link</p>
            <div className="flex gap-2">
              <div className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-[11px] font-bold text-gray-600 truncate flex items-center">
                {eventUrl}
              </div>
              <button
                onClick={handleCopy}
                className={cn(
                  "p-2.5 rounded-xl transition-all active:scale-95 shadow-lg flex items-center justify-center min-w-[45px]",
                  copied 
                    ? "bg-green-500 text-white shadow-green-200" 
                    : "bg-[#eb5017] text-white shadow-orange-100 hover:bg-[#d64815]"
                )}
              >
                {copied ? <LuCheck className="text-base animate-in zoom-in" /> : <LuCopy className="text-base" />}
              </button>
            </div>
          </div>

          {/* Social Icons Section */}
          <div className="space-y-2">
            <p className="text-[10px] font-black text-[#1B1818] uppercase tracking-[0.1em]">Share via</p>
            <div className="grid grid-cols-4 gap-3">
              {shareLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border border-gray-50 bg-white hover:border-gray-200 hover:shadow-lg transition-all duration-300 group",
                    "active:scale-95"
                  )}
                  title={link.name}
                >
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform", link.color)}>
                    <link.icon className="text-base" />
                  </div>
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">{link.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-50">
          <p className="text-[8px] text-center text-gray-400 font-medium uppercase tracking-widest leading-relaxed">
            Sharing this event helps it reach 3x more potential attendees! 🚀
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareEventModal;
