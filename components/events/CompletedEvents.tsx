import { completedEvents } from "@/lib/demo-data/events";
import EventPreviewCard from "./EventPreviewCard";
import EmptyState from "@/components/display/EmptyStateComponent";

export default function CompletedEvents() {
  return completedEvents.length === 0 ? (
    <EmptyState text="No Live events" />
  ) : (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-5 overflow-x-hidden overflow-y-auto">
      {completedEvents.map(
        (events: {
          _id: string;
          name: string;
          startTime: string;
          startDate: string;
        }) => (
          <EventPreviewCard
            key={events._id}
            name={events.name}
            time={events.startTime}
            date={events.startDate}
            id={events._id}
          />
        )
      )}
    </section>
  );
}
