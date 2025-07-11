"use client";

import { usePathname, useParams } from "next/navigation";
import { publishedEvents } from "@/lib/demo-data/events";
import { matchBreadcrumb } from "@/lib/utils/match-breadcrumb";

type Props = {
  fallbackTitle?: string;
  fallbackSubtitle?: string;
};

export default function Breadcrumb({
  fallbackTitle = "Welcome",
  fallbackSubtitle = "Control your profile setup and integrations",
}: Props) {
  const pathname = usePathname();
  const { _id } = useParams();

  const currentEvent = publishedEvents.find((event) => event._id === _id);
  const eventName = currentEvent?.name;

  const matched = matchBreadcrumb(pathname, eventName);

  return (
    <section>
      <div>
        <h2 className="font-semibold text-base md:text-[22px]">
          {matched?.title || fallbackTitle}
        </h2>
        <p className="text-xs text-gray-500">
          {matched?.subtitle || fallbackSubtitle}
        </p>
      </div>
    </section>
  );
}
