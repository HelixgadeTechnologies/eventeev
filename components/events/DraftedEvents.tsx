"use client";

import { useEffect, useState } from "react";
import EventPreviewCard from "./EventPreviewCard";
import EmptyState from "@/components/display/EmptyStateComponent";
import img from "@/public/ticket-icon.svg";
import { eventsService } from "@/lib/services/events.service";
import { useAuth } from "@/context/AuthContext";

export default function DraftedEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await eventsService.getDraftedEvents();
    if (error) {
      setError(error.message || "Failed to load events");
    } else {
      const filtered = (data || []).filter((event: any) => {
        if (!event) return false;
        const eventOwnerId = typeof event.userId === 'object' ? (event.userId?.id || event.userId?._id) : event.userId;
        return eventOwnerId === user?.id || eventOwnerId === user?._id;
      });
      setEvents(filtered);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authLoading) return;
    fetchEvents();
  }, [user, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F56630]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 text-red-500">
        <p>{error}</p>
        <button 
          onClick={() => fetchEvents()}
          className="mt-4 text-[#F56630] font-semibold underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return events.length === 0 ? (
    <EmptyState
      titleText="No draft events found"
      subtitleText="Any events you've saved as draft but haven't published yet will appear here."
      icon={img}
    />
  ) : (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 overflow-x-hidden overflow-y-auto">
      {events.map((event) => (
        <EventPreviewCard
          key={event._id}
          name={event.name}
          time={event.startTime}
          date={event.startDate}
          id={event._id}
        />
      ))}
    </section>
  );
}
