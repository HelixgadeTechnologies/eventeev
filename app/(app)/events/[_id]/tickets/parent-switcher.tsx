"use client";

import TabComponent from "@/components/ui/TabComponent";
import { FaMoneyBillWave, FaGift } from "react-icons/fa6";
import { BiDonateHeart } from "react-icons/bi";
import PaidTickets from "@/components/tickets/PaidTickets";
import FreeTickets from "@/components/tickets/FreeTickets";
import DonatedTickets from "@/components/tickets/DonatedTickets";
import { useState } from "react";
import AddTickets from "@/components/tickets/AddTicketModal";

export default function TicketParentSwitcher() {
  const tabs = [
    { tabName: "Paid Ticket", id: 1, icon: <FaMoneyBillWave /> },
    { tabName: "Free Ticket", id: 2, icon: <BiDonateHeart /> },
    { tabName: "Donation", id: 3, icon: <FaGift /> },
  ];

  const [openAddTicketModal, setOpenAddTicketModal] = useState(false);

  const handleOpen = () => {
    setOpenAddTicketModal(true);
  };

  const handleClose = () => {
    setOpenAddTicketModal(false);
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
            />
            );
            } else if (tabId === 2) {
            return <FreeTickets />;
            } else {
            return <DonatedTickets />;
            }
        }}
        />

        {openAddTicketModal && (
            <AddTickets
            isOpen={openAddTicketModal}
            onClose={handleClose}
            />
        )}
    </>
  );
}
