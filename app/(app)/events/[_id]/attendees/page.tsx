"use client";

import { publishedEvents } from "@/lib/demo-data/events";
import { useParams } from "next/navigation";
import AttendeesList from "@/components/attendees/AttendeesList";
import AttendeesSummary from "@/components/attendees/AttendeesSummary";
import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa6";

export default function AttendeesPage() {
  const { _id } = useParams();

  const currentEvent = publishedEvents.find((event) => event._id === _id);

  if (!currentEvent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <h2 className="text-3xl font-black text-[#1B1818] tracking-tight">Event Not Found</h2>
        <Link 
          href="/events"
          className="bg-[#eb5017] text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-[#eb5017]/20"
        >
          Back to My Events
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
          <div className="space-y-2">
              <Link 
                  href="./dashboard" 
                  className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#EB5017] transition-all group"
              >
                  <FaAngleLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
                  Back to Dashboard
              </Link>

          </div>
      </div>

      <AttendeesSummary />
      <AttendeesList />
    </div>
  );
}

