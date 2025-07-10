import { publishedEvents } from "@/lib/demo-data/events";

export function generateEventStaticParams() {
  return publishedEvents.map((event) => ({
    _id: event._id,
  }));
}

export function generateEventMetadata({ params }: { params: { _id: string } }) {
  const event = publishedEvents.find((ev) => ev._id === params._id);

  return {
    title: `${event?.name || "Event"} - Eventeev`,
    description: event?.description || "Eventeev event details.",
  };
}
