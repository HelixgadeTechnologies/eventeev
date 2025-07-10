import { publishedEvents } from "@/lib/events";

interface EventsDetailsProps {
    params: Promise<{
        _id: string;
    }>
};

export async function generateStaticParams() {
    return publishedEvents.map((events) => ({
        _id: events._id,
    }))
};

export async function generateMetadata({ params }: EventsDetailsProps) {
    const { _id } = await params; // Await the params Promise
    const events = publishedEvents.find((ev) => ev._id === _id);

    return {
        title: `${events?.name} - Eventeev`,
        description: events?.description,
    };
}

export default async function EventsDashboard({ params }: EventsDetailsProps) {
    const { _id } = await params; // Await the params Promise
    const events = publishedEvents.find((ev) => ev._id === _id);

    if (!events) {
        return (
            <div>no event found.</div>
        )
    }

    return (
        <section>dashboard for {events.name}</section>
    )
}