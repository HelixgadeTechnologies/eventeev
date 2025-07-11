"use client";

import AnalyticsCard from "@/components/display/AnalyticsCard";
import { publishedEvents } from "@/lib/demo-data/events";
import { useParams } from "next/navigation";


export default function EventsDashboard() {
  const { _id } = useParams();

  const currentEvent = publishedEvents.find(event => event._id === _id);

  if (!currentEvent) {
    return <div>no event found.</div>;
  }

  return (
    <section className="flex gap-5">
      <div className="w-[70%]">
        <div className="grid grid-cols-3 w-full gap-3">
          {currentEvent.analytics.map((a, index) => (
            <AnalyticsCard 
            key={index}
            icon={a.icon}
            title={a.title}
            value={a.value}
            percentage={a.percentage}
            />
          ))}
        </div>
      </div>
      <div className="w-[30%]"></div>
    </section>
  );
}
