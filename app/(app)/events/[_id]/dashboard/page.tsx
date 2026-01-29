import AnalyticsCard from "@/components/display/AnalyticsCard";
import { publishedEvents } from "@/lib/demo-data/events";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import { FaAngleRight } from "react-icons/fa6";
import Heading from "@/components/ui/HeadingComponent";
import { services } from "@/lib/demo-data/dashboard-services";
import Image from "next/image";
import CardComponent from "@/components/ui/CardComponent";
import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/utils/configure-date";
import { LuClock3 } from "react-icons/lu";
import { IoCalendarClearOutline } from "react-icons/io5";
import Calendar from "@/components/ui/Calendar";

interface EventDetailsProps {
  params: Promise<{
    _id: string;
  }>;
}

export async function generateStaticParams() {
  return publishedEvents.map((events) => ({
    _id: events._id,
  }));
}

export async function generateMetadata({ params }: EventDetailsProps) {
  const { _id } = await params; // Await the params Promise
  const event = publishedEvents.find((events) => events._id === _id);

  return {
    title: event ? `${event.name} | Dashboard - Eventeev` : "Dashboard - Eventeev",
    description: event?.description || "Explore and manage your events on Eventeev.",
  };
}

export default async function EventsDashboard({ params }: EventDetailsProps) {
  const { _id } = await params; // Await the params Promise
  const currentEvent = publishedEvents.find((eve) => eve._id === _id);

  if (!currentEvent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
          <Image src="/logo-black.svg" alt="Eventeev" width={40} height={40} className="opacity-20" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 leading-tight">Event Not Found</h2>
          <p className="text-gray-500 font-medium">We couldn&apos;t find an event with the ID &quot;{_id}&quot;.</p>
        </div>
        <Link 
          href="/events"
          className="bg-[#eb5017] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#d64815] transition-all"
        >
          Back to My Events
        </Link>
      </div>
    );
  }

  const analytics = [
    {
      title: "RSVP",
      value: 0,
      percentage: 0,
      icon: "/icons/thermometer.svg",
      text: "Increase",
      isCurrency: false,
    },
    {
      title: "Check-ins",
      value: 0,
      percentage: 0,
      icon: "/icons/3d.svg",
      text: "Healthy",
      isCurrency: false,
    },
    {
      title: "Amount generated",
      value: 0,
      percentage: 0,
      icon: "/icons/sun.svg",
      text: "₦0",
      isCurrency: true,
    },
  ];

  return (
    <section className="flex gap-5">
      <div className="w-[65%] space-y-5">
        {/* analytics */}
        <div className="grid grid-cols-3 w-full gap-3">
          {analytics.map((a, index) => (
            <AnalyticsCard
              key={index}
              icon={a.icon}
              title={a.title}
              value={a.value}
              percentage={a.percentage}
              text={a.text}
              isCurrency={a.isCurrency}
            />
          ))}
        </div>

        {/* attendees */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Heading heading="Newest peeps" />
            <Link
              className="text-xs font-semibold primary flex items-center group"
              href={`/events/${currentEvent._id}/attendees`}
            >
              <span className="group-hover:underline">See all attendees</span>
              <FaAngleRight className="text-xl" />
            </Link>
          </div>
          <div className="h-36 w-full rounded-[10px] bg-white border border-gray-200 flex justify-center items-center">
            {currentEvent.attendees.length === 0 ? (
              <p className="font-medium text-gray-600 text-sm">
                New attendees would appear here! 😊
              </p>
            ) : (
              <div className="flex gap-4 items-center hidden-scrollbar overflow-x-auto w-full mx-4">
                {currentEvent.attendees.slice(0, 7).map((attendee) => (
                  <div
                    key={attendee.id}
                    className="space-y-1 flex flex-col justify-center items-center w-[90px]"
                  >
                    <Avatar name={attendee.username} isBigger={true} />
                    <p className="mt-1 font-semibold text-xs text-gray-900 truncate">
                      {attendee.username}
                    </p>
                    <p className="text-[10px] text-gray-400 w-[90px] truncate">
                      {attendee.useremail}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* services */}
        <div className="space-y-3">
          <Heading heading="Services" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {services.map((service, idx) => (
              <Link
                href={`/events/${currentEvent._id}/${service.href}`}
                key={idx}
                className={`h-[150px] w-full rounded-[10px]`}
                style={{ backgroundColor: service.bg }}
              >
                <div className="h-full w-full flex justify-between flex-col px-5 py-7">
                  <div className="h-8 w-8 relative overflow-hidden">
                    <Image src={service.icon} alt="Icon" fill />
                  </div>
                  <p className="leading-5 text-gray-800 font-semibold">
                    {service.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="w-[35%] space-y-7">
        <CardComponent>
          <header className="p-4">
            <Heading heading="Event day" />
          </header>
          <div className="border-t border-b border-gray-300 w-full">
            <div className="p-4 space-y-4">
              <Heading heading={formatDate(currentEvent.startDate)} />
              <div className="gap-2.5 items-center flex">
                <LuClock3 className="text-base text-[#475367]" />
                <p className="font-normal text-[11px] text-[#475367]">
                  {currentEvent.startTime} - {currentEvent.endTime}
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <IoCalendarClearOutline className="text-base text-[#475367]" />
                <p className="text-[#475367] capitalize text-[11px]">
                  {currentEvent.location}
                </p>
              </div>
              <div className="flex gap-2.5 items-center">
                <Avatar name={"Richard Edem"} />
                <div className="my-3">
                  <p className="font-medium text-sm text-[#101928]">
                    {/* {userData.username} */} Dr. Richard Edem
                  </p>
                  <p className="text-[#475367] capitalize text-[11px]">
                    Event Organiser
                  </p>
                </div>
              </div>
            </div>
          </div>
          <footer className="px-4 pt-4 flex items-center gap-2.5">
            <Button content="Edit Event details" isSecondary />
            <Button content="Copy Event Link" />
          </footer>
        </CardComponent>
        <Calendar eventDate={currentEvent.startDate} />
      </div>
    </section>
  );
}
