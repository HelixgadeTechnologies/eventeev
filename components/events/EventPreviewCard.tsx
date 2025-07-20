"use client";

import { CiCircleMore } from "react-icons/ci";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import { formatDate } from "@/lib/utils/configure-date";

type EventCardProps = {
    name: string;
    time: string;
    date: string;
    imageURL?: string;
    id: string;
}

export default function EventPreviewCard({
    name,
    time,
    date,
    imageURL,
    id,
}: EventCardProps) {
    return (
        <Link href={`/user/events/${id}/dashboard`}>
            <div className="rounded-[16px] min-h-[180px] md:min-h-[200px] bg-white border border-[#B8C4CE] p-5 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-center">
                        {imageURL ? (<Avatar src={imageURL} />) : (<Avatar name={name} />)}
                        <CiCircleMore className="text-2xl md:text-3xl text-gray-400 hover:text-gray-600 hover:cursor-pointer"/>
                    </div>
                    <div className="space-y-1 mt-4">
                        <p className="text-sm md:text-lg font-bold">{name}</p>
                        <p className="text-[10px] md:text-xs">{time}, {formatDate(date)}</p>
                    </div>
                </div>
                <footer className="text-[10px] md:text-xs flex justify-between items-center">
                    <p>You created this event</p>
                    <p>RSVP</p>
                </footer>
            </div>
        </Link>
    )
}