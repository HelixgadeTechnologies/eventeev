"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function NotificationsComponent() {
  const [isActive, setIsActive] = useState(false);

  const handleNotifictaion = () => {
    setIsActive(true);
  };

  return (
    <Link
      onClick={handleNotifictaion}
      href={"/user/events/notifications"}
      className="h-[30px] w-[30px] md:h-10 md:w-10 rounded-full bg-gray-100 flex justify-center items-center text-sm font-medium"
    >
      <Image
        src={
          isActive
            ? "/icons/notification-active.svg"
            : "/icons/notification-inactive.svg"
        }
        alt="Notification Icon"
        width={15}
        height={15}
        className="hidden md:block"
      />
      <Image
        src={
          isActive
            ? "/icons/notification-active.svg"
            : "/icons/notification-inactive.svg"
        }
        alt="Notification Icon"
        width={13}
        height={13}
        className="block md:hidden"
      />
    </Link>
  );
}
