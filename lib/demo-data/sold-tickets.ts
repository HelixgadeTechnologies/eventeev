export interface SoldTicketType {
  name: string;
  email: string;
  ticketName: string;
  dateRegistered: string;
  amountPaid: number;
  ticketId: string;
}

const soldTicketData: SoldTicketType[] = [];

export default soldTicketData;