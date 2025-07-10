"use client";

import { useState } from "react";
import { publishedEvents, draftedEvents, completedEvents } from "@/lib/events";
import Image from "next/image";
import Button from "@/components/ui/Button";
import PublishedEvents from "@/components/events/PublishedEvents";
import DraftedEvents from "@/components/events/DraftedEvents";
import CompletedEvents from "@/components/events/CompletedEvents";

export default function EventsComponent() {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  const tabs = [
    { name: "Live", id: 1 },
    { name: "Completed", id: 2 },
    { name: "Drafted", id: 3 },
  ];

  const noEvents =
    publishedEvents.length === 0 &&
    draftedEvents.length === 0 &&
    completedEvents.length === 0;

  if (noEvents) {
    return (
      <section className="h-full flex flex-col justify-center items-center gap-2">
        <Image
          src="/confetti.svg"
          alt="Eventeev 2025"
          height={120}
          width={120}
        />
        <p className="font-semibold text-xl">
          You currently have no event listed here.
        </p>
        <p className="text-xs">
          You will see list of events that you have created or invited to
        </p>
        <div className="w-[236px] mt-2">
          <Button content="Create your first event" />
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="h-[52px] w-full gap-6 flex items-center text-sm border-b border-[#E4E7EC] my-6 relative">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className="relative hover:cursor-pointer text-xs md:text-sm"
            onClick={() => handleTabChange(tab.id)}
          >
            <p className={activeTab === tab.id ? "text-[#F56630]" : "text-[#344054]"}>
              {tab.name}
            </p>
            {activeTab === tab.id && <span className="border-t-2 border-[#F56630] h-1.5 w-full absolute -bottom-[22px] md:-bottom-5"></span>}
          </div>
        ))}
      </div>

      <div className="my-3.5">
        {activeTab === 1 && <PublishedEvents />}
        {activeTab === 2 && <CompletedEvents />}
        {activeTab === 3 && <DraftedEvents />}
      </div>
    </section>
  );
}
