"use client";

import { usePathname } from "next/navigation";
// import { publishedEvents } from "@/lib/demo-data/events";\
import { matchBreadcrumb } from "@/lib/utils/match-breadcrumb";
import { todaysDate } from "@/lib/utils/configure-date";
import Image from "next/image";

type Props = {
  fallbackTitle?: string;
  fallbackSubtitle?: string;
};

export default function Breadcrumb({
  fallbackTitle = "Welcome",
  fallbackSubtitle = "Control your profile setup and integrations",
}: Props) {
  const pathname = usePathname();
  // const { _id } = useParams();

  // const currentEvent = publishedEvents.find((event) => event._id === _id);
  // const eventName = currentEvent?.name;

  const matched = matchBreadcrumb(pathname);

  return (
    <section className="flex justify-between items-center">
      <div>
        <h2 className="font-semibold text-base md:text-[22px]">
          {matched?.title || fallbackTitle}
        </h2>
        <p className="text-[10px] md:text-xs text-gray-500">
          {matched?.subtitle || fallbackSubtitle}
        </p>
      </div>

      {/* tab for dashboard */}
      {matched?.href.includes("dashboard") && (
        <div className="w-[217px] h-[74px] bg-white rounded-xl gap-3 flex justify-center items-center px-5 py-4 border border-[#B8C4CE] mr-10">
          <div className="rounded-full bg-[#F0F2F5] h-10 w-10 flex justify-center items-center">
            <Image src={"/icons/speakers-inactive.svg"} alt="Calendar" height={18} width={18} />
          </div>
          <div  className="space-y-1">
            <p className="text-xs font-normal text-gray-600">Today&apos;s Date</p>
            <p className="font-semibold text-sm text-gray-700">{todaysDate()}</p>
          </div>
        </div>
      )}
    </section>
  );
}
