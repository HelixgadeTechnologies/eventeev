"use client";

import React from "react";
import { Printer, Calendar, MapPin, QrCode } from "lucide-react";
import { ApiAttendee } from "@/lib/services/attendees.service";

interface AttendeeBadgeProps {
  event: {
    title: string;
    startDate?: string;
    location?: string;
  };
  attendee: ApiAttendee;
  showPrintButton?: boolean;
  className?: string;
}

export const AttendeeBadge: React.FC<AttendeeBadgeProps> = ({
  event,
  attendee,
  showPrintButton = true,
  className = "",
}) => {
  const handlePrint = () => {
    window.print();
  };

  const isVip = attendee.status === "VIP";
  const formattedDate = event.startDate
    ? new Date(event.startDate).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "TBA";

  const formattedTime = event.startDate
    ? new Date(event.startDate).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "TBA";

  return (
    <div className={`w-full max-w-sm mx-auto ${className}`}>
      {/* Badge Card */}
      <div className="font-mono bg-white rounded-3xl overflow-hidden border border-gray-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)]">
        {/* Badge Header */}
        <div className="bg-gradient-to-b from-gray-50/80 to-white p-6 pb-3 pt-8 text-center border-b border-gray-100">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 bg-[#EB5017]/10 text-[#EB5017]">
            {isVip ? "★ VIP Pass" : "Official Pass"}
          </div>
          <h2 className="text-xl font-bold text-[#1B1818] tracking-tight leading-snug line-clamp-2 px-2">
            {event.title}
          </h2>
          <p className="text-xs font-semibold text-gray-500 mt-2">
            {formattedDate} • {formattedTime}
          </p>
          <div className="mt-4 pt-3 border-t border-gray-100">
            <h3 className="text-lg font-bold text-[#1B1818] tracking-tight">{attendee.name}</h3>
            <p className="text-xs text-gray-400 font-sans truncate px-4">{attendee.email}</p>
          </div>
        </div>

        {/* Notched Separator 1 */}
        <div className="relative h-7 bg-white flex items-center">
          <div className="absolute -left-3.5 w-7 h-7 bg-[#F9FAFB] rounded-full border-r border-gray-200 shadow-[inset_-3px_0_6px_rgba(0,0,0,0.06)]" />
          <div className="absolute -right-3.5 w-7 h-7 bg-[#F9FAFB] rounded-full border-l border-gray-200 shadow-[inset_3px_0_6px_rgba(0,0,0,0.06)]" />
          <div className="w-full border-t-2 border-dashed border-gray-200 mx-6" />
        </div>

        {/* Middle Details */}
        <div className="p-6 py-2 bg-white text-xs">
          <div className="grid grid-cols-2 gap-y-3.5 gap-x-3">
            <div>
              <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">Tier</p>
              <p className="font-bold text-[#1B1818] mt-0.5">{isVip ? "VIP GUEST" : "GENERAL"}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">Status</p>
              <span
                className={`inline-block font-bold mt-0.5 ${
                  attendee.isCheckedIn ? "text-emerald-600" : "text-amber-600"
                }`}
              >
                {attendee.isCheckedIn ? "Checked In" : "Pending"}
              </span>
            </div>
            <div className="col-span-2">
              <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">Venue</p>
              <p className="font-bold text-[#1B1818] truncate mt-0.5">{event.location || "Online"}</p>
            </div>
          </div>
        </div>

        {/* Notched Separator 2 */}
        <div className="relative h-7 bg-white flex items-center">
          <div className="absolute -left-3.5 w-7 h-7 bg-[#F9FAFB] rounded-full border-r border-gray-200 shadow-[inset_-3px_0_6px_rgba(0,0,0,0.06)]" />
          <div className="absolute -right-3.5 w-7 h-7 bg-[#F9FAFB] rounded-full border-l border-gray-200 shadow-[inset_3px_0_6px_rgba(0,0,0,0.06)]" />
          <div className="w-full border-t-2 border-dashed border-gray-200 mx-6" />
        </div>

        {/* QR Code & Barcode Section */}
        <div className="bg-white p-6 pt-1 pb-6 text-center">
          <div className="bg-gray-50/70 p-3 rounded-2xl border border-gray-100 inline-block mb-3">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
                attendee.id
              )}`}
              alt={`QR Code for ${attendee.name}`}
              className="w-28 h-28 mx-auto"
            />
          </div>
          <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">
            ID: {attendee.id.slice(0, 12)}...
          </p>
        </div>
      </div>

      {/* Action buttons */}
      {showPrintButton && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={handlePrint}
            className="w-full bg-[#EB5017] hover:bg-[#d64815] text-white py-3 px-5 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md shadow-[#EB5017]/20 hover:shadow-lg hover:shadow-[#EB5017]/30 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Printer size={15} />
            Print Badge
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendeeBadge;
