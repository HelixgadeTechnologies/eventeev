"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { matchBreadcrumb } from "@/lib/utils/match-breadcrumb";
import { todaysDate } from "@/lib/utils/configure-date";
import Image from "next/image";
// import { publishedEvents } from "@/lib/demo-data/events";
import Button from "./Button";
import { IoAdd } from "react-icons/io5";
import AddTickets from "../tickets/AddTicketModal";

type Props = {
  fallbackTitle?: string;
  fallbackSubtitle?: string;
};

export default function Breadcrumb({
  fallbackTitle = "Welcome",
  fallbackSubtitle = "Control your profile setup and integrations",
}: Props) {
  const pathname = usePathname();
  // const params = useParams();
  const [openAddTicketModal, setOpenAddTicketModal] = useState(false);

  // const _id = Array.isArray(params._id) ? params._id[0] : params._id;

  // const currentEvent = publishedEvents.find((event) => event._id === _id);
  const matched = matchBreadcrumb(pathname);

  const handleOpen = () => {
    setOpenAddTicketModal(true);
  };

  const handleClose = () => {
    setOpenAddTicketModal(false);
  };

  // Build the dynamic route pattern
  // const dynamicRoute = currentEvent ? `/events/${currentEvent._id}/dashboard` : null;

  const hasButtons: Record<string, React.ReactNode> = {
    dashboard: (
      <div className="w-[217px] h-[74px] bg-white rounded-xl gap-3 flex justify-center items-center px-5 py-4 border border-[#B8C4CE]">
        <div className="rounded-full bg-[#F0F2F5] h-10 w-10 flex justify-center items-center">
          <Image
            src={"/icons/speakers-inactive.svg"}
            alt="Calendar"
            height={18}
            width={18}
          />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-normal text-gray-600">Today&apos;s Date</p>
          <p className="font-semibold text-sm text-gray-700 whitespace-nowrap">
            {todaysDate()}
          </p>
        </div>
      </div>
    ),

    tickets: (
      <Button
        content="Add Ticket"
        icon={<IoAdd className="text-lg" />}
        onClick={handleOpen}
      />
    ),
    games: (
      <Button
        content="Create New Quiz"
        icon={<IoAdd className="text-lg" />}
        onClick={() => console.log("Create New Quiz clicked")}
      />
    ),
  };

  const getPageType = () => {
    const pathSegments = pathname.split("/");
    return pathSegments[pathSegments.length - 1];
  };

  const pageType = getPageType();

  const shouldShowButton = () => {
    if (hasButtons[pageType]) return hasButtons[pageType];

    if (matched?.href && hasButtons[matched.href])
      return hasButtons[matched.href];

    return null;
  };

  const buttonToShow = shouldShowButton();

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

      {buttonToShow && <div className="min-w-[228px]">{buttonToShow}</div>}
      {openAddTicketModal && (
        <AddTickets isOpen={openAddTicketModal} onClose={handleClose} />
      )}
    </section>
  );
}
