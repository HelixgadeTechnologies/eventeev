export interface TicketTier {
  id?: string;
  name: string;
  type: "paid" | "free" | "donation";
  price?: number;
  currency?: string;
  quantity: number;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  stopDate?: string;
  stopTime?: string;
  description?: string;
}
