"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/ui/Button";
import PublishedEvents from "@/components/events/PublishedEvents";
import DraftedEvents from "@/components/events/DraftedEvents";
import CompletedEvents from "@/components/events/CompletedEvents";
import { eventsService } from "@/lib/services/events.service";

export default function EventsComponent() {
  const [activeTab, setActiveTab] = useState(1);
  const router = useRouter();

  const handleToggleForm = () => {
    router.push("/create-event");
  };

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  const tabs = [
    { name: "Live", id: 1 },
    { name: "Completed", id: 2 },
    { name: "Drafted", id: 3 },
  ];

  // We'll let the individual tab components handle their own empty states for now
  // to avoid complex cross-tab state management in this component.
  // Alternatively, we could fetch all events here.
  
  return (
    <section>
      <div className="h-[52px] w-full gap-6 flex justify-between items-center text-sm border-b border-[#E4E7EC] my-6 relative">
        <div className="flex items-center gap-6">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className="relative hover:cursor-pointer text-xs md:text-sm"
              onClick={() => handleTabChange(tab.id)}
            >
              <p
                className={
                  activeTab === tab.id ? "text-[#F56630]" : "text-[#344054]"
                }
              >
                {tab.name}
              </p>
              {activeTab === tab.id && (
                <span className="border-t-2 border-[#F56630] h-1.5 w-full absolute -bottom-[22px] md:-bottom-5"></span>
              )}
            </div>
          ))}
        </div>
        <div className="w-[200px]">
          <Button
            content="Create your first event"
            onClick={handleToggleForm}
          />
        </div>
      </div>

      <div className="my-3.5">
        {activeTab === 1 && <PublishedEvents />}
        {activeTab === 2 && <CompletedEvents />}
        {activeTab === 3 && <DraftedEvents />}
      </div>
    </section>
  );
}
