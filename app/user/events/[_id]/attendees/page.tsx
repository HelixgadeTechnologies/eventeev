"use client";

import { publishedEvents } from "@/lib/demo-data/events";
import { useParams } from "next/navigation";


export default function EventsDashboard() {
  const { _id } = useParams();

  const currentEvent = publishedEvents.find(event => event._id === _id);

  if (!currentEvent) {
    return <div>no event found.</div>;
  }

  return <section>Attendees for {currentEvent.name}</section>;
}
