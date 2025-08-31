import { publishedEvents } from "@/lib/demo-data/events";
import EventPreviewCard from "./EventPreviewCard";
import EmptyState from "@/components/display/EmptyStateComponent";
import img from "@/public/ticket-icon.svg"

export default function PublishedEvents() {
  return publishedEvents.length === 0 ? (
    <EmptyState titleText="You currently have no event listed here." subtitleText="You will see list of events that you have Live events" icon={img} />
  ) : (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 overflow-x-hidden overflow-y-auto">
      {publishedEvents.map(
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
