"use client";

import { useState, useEffect, use } from "react";
import { useParams } from "next/navigation";
import AttendeesList from "@/components/attendees/AttendeesList";
import AttendeesSummary from "@/components/attendees/AttendeesSummary";
import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa6";
import { eventsService } from "@/lib/services/events.service";
import { Loader2 } from "lucide-react";

interface AttendeesPageProps {
  params: Promise<{
    _id: string;
  }>;
}

export default function AttendeesPage({ params }: AttendeesPageProps) {
  const { _id } = use(params);
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await eventsService.getEventById(_id);
        if (fetchError) {
          setError(fetchError.message || "Event Not Found");
        } else {
          setEvent(data);
        }
      } catch (err) {
        setError("Connection Issue");
      } finally {
        setLoading(false);
      }
    };

    if (_id) {
      fetchEvent();
    }
  }, [_id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-[#EB5017] animate-spin" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Verifying event access...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <h2 className="text-3xl font-black text-[#1B1818] tracking-tight">
          {error === "Event Not Found" ? "Event Not Found" : "Connection Issue"}
        </h2>
        <p className="text-gray-400 font-medium max-w-sm mx-auto uppercase text-[10px] tracking-widest leading-relaxed">
          {error || "We encountered an issue retrieving the attendee information."}
        </p>
        <Link 
          href="/events"
          className="bg-[#eb5017] text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-[#eb5017]/20 transition-all hover:scale-105 active:scale-95"
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
            href={`/events/${_id}/dashboard`}
            className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#EB5017] transition-all group"
          >
            <FaAngleLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <div className="pt-2">
            <h1 className="text-4xl font-black text-[#1B1818] tracking-tight lowercase first-letter:uppercase">Attendees</h1>
            <p className="text-sm text-gray-400 font-medium mt-1">Managing participants for <span className="text-[#1B1818] font-bold">{event.title}</span></p>
          </div>
        </div>
      </div>

      <AttendeesSummary />
      <AttendeesList />
    </div>
  );
}

