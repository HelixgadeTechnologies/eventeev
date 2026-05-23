"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { eventsService } from "@/lib/services/events.service";
import { ticketsService } from "@/lib/services/tickets.service";
import { speakersService } from "@/lib/services/speakers.service";
import { quizzesService } from "@/lib/services/quizzes.service";
import { pollsService } from "@/lib/services/polls.service";
import { checklistService } from "@/lib/services/checklist.service";
import { scheduleService } from "@/lib/services/schedule.service";
import { linksService } from "@/lib/services/links.service";

interface EventContextType {
  event: any | null;
  loading: boolean;
  activePowerups: Set<string>;
  refetchEvent: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
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
      setEvent(eventData);

      // Always active power-ups
      const active = new Set<string>(["Dashboard", "Analytics", "Networking"]);

      // 2. Concurrently check data for other powerups/services
      const results = await Promise.allSettled([
        ticketsService.getTickets(eventId),
        speakersService.getSpeakers(eventId),
        quizzesService.getQuizzesByEvent(eventId),
        pollsService.getPolls(eventId),
        checklistService.getChecklist(eventId),
        scheduleService.getSchedule(eventId),
        linksService.getLinks(eventId),
      ]);

      // Helper to extract clean array from Promise.allSettled response
      const getArrayData = (result: any) => {
        if (result.status === "fulfilled" && result.value) {
          const val = result.value;
          if (Array.isArray(val)) return val;
          if (Array.isArray(val.data)) return val.data;
        }
        return [];
      };

      const tickets = getArrayData(results[0]);
      const speakers = getArrayData(results[1]);
      const quizzes = getArrayData(results[2]);
      const polls = getArrayData(results[3]);
      const checklist = getArrayData(results[4]);
      const schedule = getArrayData(results[5]);
      const links = getArrayData(results[6]);

      // Tickets & Check-in
      if (tickets.length > 0) {
        active.add("Tickets");
        active.add("Check-in");
      }

      // Speakers
      if (speakers.length > 0) {
        active.add("Speakers");
      }

      // Games
      const showLeaderboard = eventData.settings?.showLeaderboard ?? eventData.settings?.game?.showLeaderboard ?? true;
      if (quizzes.length > 0 || showLeaderboard) {
        active.add("Games");
      }

      // Chat Room
      const chatEnabled = eventData.settings?.enableChat ?? eventData.settings?.chat?.enabled ?? true;
      if (chatEnabled) {
        active.add("Chat Room");
      }

      // Polls
      if (polls.length > 0) {
        active.add("Polls");
      }

      // Checklist
      if (checklist.length > 0) {
        active.add("Checklist");
      }

      // Schedule
      if (schedule.length > 0) {
        active.add("Schedule");
      }

      // Calendar
      if (checklist.length > 0 || schedule.length > 0) {
        active.add("Calendar");
      }

      // Links
      if (links.length > 0) {
        active.add("Links");
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
