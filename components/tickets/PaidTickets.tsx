"use client";

import React from "react";
import TicketTierList from "./TicketTierList";
import { TicketTier } from "@/types/ticket";

type Props = {
  addTicket: (tierOrType?: TicketTier | TicketTier["type"]) => void;
  onEdit: (tierOrType?: TicketTier | TicketTier["type"]) => void;
  refreshKey?: number;
};

export default function PaidTickets(props: Props) {
  return <TicketTierList {...props} tierType="paid" />;
}
