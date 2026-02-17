"use client";

import React, { use } from "react";
import EventEditForm from "@/components/events/editEventForms/EventEditForm";
import { publishedEvents } from "@/lib/demo-data/events";
import Image from "next/image";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    _id: string;
  }>;
}

export default function EventDetailsSettings({ params }: PageProps) {
  const { _id } = use(params);
  const currentEvent = publishedEvents.find((e) => e._id === _id);

  if (!currentEvent) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-6 bg-white p-10">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 shadow-sm">
          <Image src="/logo-black.svg" alt="Eventeev" width={32} height={32} className="opacity-10" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#1B1818] tracking-tight mb-2">Event Not Found</h2>
          <p className="text-gray-400 font-medium max-w-sm mx-auto uppercase text-[10px] tracking-widest">
            We couldn&apos;t find the data for this event.
          </p>
        </div>
        <Link 
          href="/events"
          className="bg-[#eb5017] text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#d64815] transition-all"
        >
          Back to My Events
        </Link>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden p-6 bg-white select-none">
      <header className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-black text-[#eb5017] uppercase tracking-[0.2em]">Management</span>
        </div>
        <h1 className="text-2xl font-black text-[#1B1818] leading-tight tracking-tight">Event Details</h1>
        <p className="text-[10px] font-medium text-[#C27E33] mt-0.5 opacity-90 leading-relaxed max-w-2xl">
          Complete and modify the core information for {currentEvent.name}. These details define the attendee experience.
        </p>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <EventEditForm initialData={currentEvent} />
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
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
