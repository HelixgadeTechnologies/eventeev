"use client";

import TabComponent from "@/components/ui/TabComponent";
import { FaMoneyBillWave, FaGift } from "react-icons/fa6";
import { BiDonateHeart } from "react-icons/bi";
import PaidTickets from "@/components/tickets/PaidTickets";
import FreeTickets from "@/components/tickets/FreeTickets";
import DonatedTickets from "@/components/tickets/DonatedTickets";
import { useState } from "react";
import AddTickets from "@/components/tickets/AddTicketModal";
import { TicketTier } from "@/types/ticket";

export default function TicketParentSwitcher() {
  const tabs = [
    { tabName: "Paid Ticket", id: 1, icon: <FaMoneyBillWave /> },
    { tabName: "Free Ticket", id: 2, icon: <BiDonateHeart /> },
    { tabName: "Donation", id: 3, icon: <FaGift /> },
  ];

  const [openAddTicketModal, setOpenAddTicketModal] = useState(false);
  const [editingTier, setEditingTier] = useState<TicketTier | null>(null);
  const [defaultType, setDefaultType] = useState<TicketTier["type"]>("paid");
  const [refreshKey, setRefreshKey] = useState(0);

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

  const handleSuccess = () => {
    handleClose();
    setRefreshKey(prev => prev + 1);
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
            refreshKey={refreshKey}
            />
            );
            } else if (tabId === 2) {
            return <FreeTickets addTicket={handleOpen} onEdit={handleOpen} refreshKey={refreshKey} />;
            } else {
            return <DonatedTickets addTicket={handleOpen} onEdit={handleOpen} refreshKey={refreshKey} />;
            }
        }}
        />

        {openAddTicketModal && (
            <AddTickets
            isOpen={openAddTicketModal}
            onClose={handleClose}
            onSuccess={handleSuccess}
            initialData={editingTier || undefined}
            defaultType={defaultType}
            />
        )}
    </>
  );
}
