"use client";

import { useEffect, useState } from "react";
import EventPreviewCard from "./EventPreviewCard";
import EmptyState from "@/components/display/EmptyStateComponent";
import img from "@/public/ticket-icon.svg";
import { eventsService } from "@/lib/services/events.service";
import { isEventPassed } from "@/lib/utils/configure-date";

export default function PublishedEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const { data, error } = await eventsService.getPublishedEvents();
      if (error) {
        setError(error.message || "Failed to load events");
      } else {
        // Filter out "Production Test Event" and exclude events that have passed
        const filteredEvents = (data || []).filter(
          (event: any) => 
            event.name !== "Production Test Event" && 
            !isEventPassed(event)
        );
        setEvents(filteredEvents);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  if (loading) {
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
          onClick={() => window.location.reload()}
          className="mt-4 text-[#F56630] font-semibold underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return events.length === 0 ? (
    <EmptyState
      titleText="You currently have no event listed here."
      subtitleText="You will see list of events that you have Live events"
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
