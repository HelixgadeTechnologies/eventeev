import { publishedEvents } from "@/lib/demo-data/events";
import { generateEventMetadata, generateEventStaticParams } from "@/lib/utils/get-static";

interface EventsDetailsProps {
  params: Promise<{
    _id: string;
  }>;
}

export async function generateMetadata(props: { params: { _id: string } }) {
  return generateEventMetadata(props);
}

export async function generateStaticParams() {
  return generateEventStaticParams();
}

export default async function EventsDashboard({ params }: EventsDetailsProps) {
  const { _id } = await params; // Await the params Promise
  const events = publishedEvents.find((ev) => ev._id === _id);

  if (!events) {
    return <div>no event found.</div>;
  }

  return <section>dashboard for {events.name}</section>;
}
