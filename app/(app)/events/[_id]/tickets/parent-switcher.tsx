"use client";

import TabComponent from "@/components/ui/TabComponent";
import { FaMoneyBillWave, FaGift } from "react-icons/fa6";
import { BiDonateHeart } from "react-icons/bi";


export default function TicketParentSwitcher() {
    const tabs = [
        { tabName: "Paid Ticket", id: 1, icon: <FaMoneyBillWave /> },
        { tabName: "Free Ticket", id: 2, icon: <BiDonateHeart/> },
        { tabName: "Donation", id: 3, icon: <FaGift /> },
    ];
    return (
        <TabComponent
        data={tabs}
        />
    )
}