"use client";

import React from "react";
import TicketTierList from "./TicketTierList";
import { TicketTier } from "@/types/ticket";

type Props = {
  addTicket: (tierOrType?: TicketTier | TicketTier["type"]) => void;
  onEdit: (tierOrType?: TicketTier | TicketTier["type"]) => void;
  refreshKey?: number;
};

export default function DonatedTickets(props: Props) {
  return <TicketTierList {...props} tierType="donation" />;
}
