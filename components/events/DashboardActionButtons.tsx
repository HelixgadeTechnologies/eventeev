"use client";

import React, { useState } from "react";
import Link from "next/link";
import ShareEventModal from "./ShareEventModal";

interface DashboardActionButtonsProps {
  eventId: string;
  eventName: string;
  publicUrl?: string;
}

const DashboardActionButtons = ({ eventId, eventName, publicUrl }: DashboardActionButtonsProps) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Use the actual public URL from the backend, or fallback to the previous format if missing
  const eventUrl = publicUrl || `https://eventeev.com/events/${eventId}`;

  return (
    <>
      <div className="flex flex-col gap-3">
        <Link href={`/events/${eventId}/settings/details`} className="w-full">
          <button className="w-full bg-[#eb5017] text-white py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#d64815] transition-all transform active:scale-95 shadow-xl shadow-[#eb5017]/20">
            Edit Event Details
          </button>
        </Link>
        <button 
          onClick={() => setIsShareModalOpen(true)}
          className="w-full bg-white border border-gray-100 text-[#1B1818] py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all transform active:scale-95 shadow-sm"
        >
          Event Url
        </button>
      </div>

      <ShareEventModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        eventUrl={eventUrl}
        eventName={eventName}
      />
    </>
  );
};

export default DashboardActionButtons;
