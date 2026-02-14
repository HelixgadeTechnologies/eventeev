"use client";

import TabComponent from "@/components/ui/TabComponent";
import { FaMoneyBillWave, FaGift } from "react-icons/fa6";
import { BiDonateHeart } from "react-icons/bi";
import PaidTickets from "@/components/tickets/PaidTickets";
import FreeTickets from "@/components/tickets/FreeTickets";
import DonatedTickets from "@/components/tickets/DonatedTickets";
import { useState } from "react";
import AddTickets from "@/components/tickets/AddTicketModal";

export interface TicketTier {
  id?: string;
  name: string;
  type: "paid" | "free" | "donation";
  price?: number;
  quantity: number;
  startDate?: string;
  startTime?: string;
  stopDate?: string;
  stopTime?: string;
  description?: string;
}

export default function TicketParentSwitcher() {
  const tabs = [
    { tabName: "Paid Ticket", id: 1, icon: <FaMoneyBillWave /> },
    { tabName: "Free Ticket", id: 2, icon: <BiDonateHeart /> },
    { tabName: "Donation", id: 3, icon: <FaGift /> },
  ];

  const [openAddTicketModal, setOpenAddTicketModal] = useState(false);
  const [editingTier, setEditingTier] = useState<TicketTier | null>(null);
  const [defaultType, setDefaultType] = useState<TicketTier["type"]>("paid");

  const handleOpen = (tierOrType?: TicketTier | TicketTier["type"]) => {
    if (typeof tierOrType === "object" && tierOrType !== null) {
      setEditingTier(tierOrType);
      setDefaultType(tierOrType.type);
    } else {
      setEditingTier(null);
      setDefaultType((tierOrType as TicketTier["type"]) || "paid");
    }
    setOpenAddTicketModal(true);
  };

  const handleClose = () => {
    setOpenAddTicketModal(false);
    setEditingTier(null);
    setDefaultType("paid");
  };

  return (
    <>
        <TabComponent
        data={tabs}
        renderContent={(tabId) => {
            if (tabId === 1) {
            return (
            <PaidTickets 
            addTicket={handleOpen} 
            onEdit={handleOpen}
            />
            );
            } else if (tabId === 2) {
            return <FreeTickets addTicket={handleOpen} onEdit={handleOpen} />;
            } else {
            return <DonatedTickets addTicket={handleOpen} onEdit={handleOpen} />;
            }
        }}
        />

        {openAddTicketModal && (
            <AddTickets
            isOpen={openAddTicketModal}
            onClose={handleClose}
            initialData={editingTier || undefined}
            defaultType={defaultType}
            />
        )}
    </>
  );
}
