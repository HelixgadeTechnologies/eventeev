"use client";

import Avatar from "@/components/ui/Avatar";
import { CiCircleMore } from "react-icons/ci";

type EventCardProps = {
    name: string;
    time: string;
    date: string;
    imageURL?: string;
}

export default function EventPreviewCard({
    name,
    time,
    date,
    imageURL,
}: EventCardProps) {
    return (
        <div className="rounded-[16px] min-h-[180px] md:min-h-[235px] bg-white border border-gray-200 p-5 flex flex-col justify-between shadow-sm">
            <div>
                <div className="flex justify-between items-center">
                    {imageURL ? (<Avatar src={imageURL} />) : (<Avatar name={name} />)}
                    <CiCircleMore className="text-2xl md:text-3xl text-gray-400 hover:text-gray-600 hover:cursor-pointer"/>
                </div>
                <div className="space-y-1 mt-4">
                    <p className="text-sm md:text-lg font-bold">{name}</p>
                    <p className="text-[10px] md:text-xs">{time}, {date}</p>
                </div>
            </div>
            <footer className="text-[10px] md:text-xs flex justify-between items-center">
                <p>You created this event</p>
                <p>RSVP</p>
            </footer>
        </div>
    )
}