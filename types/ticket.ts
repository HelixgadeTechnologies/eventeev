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
