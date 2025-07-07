"use client";

import Image from "next/image"
import Link from "next/link"
import { useState } from "react";

export default function NotificationsComponent() {
    const [isActive, setIsActive] = useState(false);

    return (
        <Link href={"/events/notifications"} className="h-10 w-10 rounded-full bg-gray-100 flex justify-center items-center text-sm font-medium">
            <Image
            src={isActive ? "/icons/notification-active.svg" : "/icons/notification-inactive.svg"}
            alt="Notification Icon"
            width={15}
            height={15}
            />
        </Link>
    )
}