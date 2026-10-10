"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { eventsService } from "@/lib/services/events.service";

interface EventContextType {
  event: any | null;
  loading: boolean;
  activePowerups: Set<string>;
  refetchEvent: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [activePowerups, setActivePowerups] = useState<Set<string>>(new Set());

  // Extract eventId robustly (supporting optional locale prefix like /en/events/...)
  const match = pathname.match(/(?:\/[a-zA-Z]{2})?\/events\/([^/]+)/);
  const eventId = match ? match[1] : "";

  const fetchEventData = async () => {
    if (!eventId) {
      setEvent(null);
      setActivePowerups(new Set());
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // 1. Fetch Event Details
      const eventRes = await eventsService.getEventById(eventId);
      if (eventRes.error || !eventRes.data) {
        setEvent(null);
        setActivePowerups(new Set());
        setLoading(false);
        return;
      }

      const eventData = eventRes.data;

      // Verify ownership (only allow event creator)
      const eventOwnerId = typeof eventData.userId === 'object' ? (eventData.userId?.id || eventData.userId?._id) : eventData.userId;
      const isOwner = eventOwnerId === user?.id || eventOwnerId === user?._id;
      
      if (!isOwner) {
        setEvent(null);
        setActivePowerups(new Set());
        setLoading(false);
        router.push("/events");
        return;
      }

      setEvent(eventData);

      // Default active power-ups for event organizers
      const active = new Set<string>([
        "Dashboard",
        "Tickets",
        "Check-in",
        "Analytics",
        "Networking",
        "Speakers",
        "Chat Room",
        "Games",
        "Polls",
        "Schedule",
        "Checklist",
        "Calendar",
        "Links",
      ]);

      // Respect explicit event settings disablements if present
      const chatEnabled = eventData.settings?.enableChat ?? eventData.settings?.chat?.enabled ?? true;
      if (!chatEnabled) {
        active.delete("Chat Room");
      }

      const gamesEnabled = eventData.settings?.showLeaderboard ?? eventData.settings?.game?.showLeaderboard ?? true;
      if (!gamesEnabled) {
        active.delete("Games");
      }

      setActivePowerups(active);
    } catch (err) {
      console.error("Error loading event powerup context details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [eventId]);

  return (
    <EventContext.Provider value={{ event, loading, activePowerups, refetchEvent: fetchEventData }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
};
