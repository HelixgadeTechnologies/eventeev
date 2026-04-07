export interface SoldTicketType {
  name: string;
  email: string;
  ticketName: string;
  dateRegistered: string;
  amountPaid: number;
  ticketId: string;
}

const soldTicketData: SoldTicketType[] = [
  { name: "John Smith", email: "john.smith@example.com", ticketName: "Early birds", dateRegistered: "2025-08-01", amountPaid: 2, ticketId: "TCK-001" },
  { name: "Emma Johnson", email: "emma.johnson@example.com", ticketName: "Regular", dateRegistered: "2025-08-03", amountPaid: 5, ticketId: "TCK-002" },
  { name: "Michael Brown", email: "michael.brown@example.com", ticketName: "Vip", dateRegistered: "2025-08-05", amountPaid: 10, ticketId: "TCK-003" },
  { name: "Sarah Davis", email: "sarah.davis@example.com", ticketName: "Early birds", dateRegistered: "2025-08-07", amountPaid: 2, ticketId: "TCK-004" },
  { name: "David Wilson", email: "david.wilson@example.com", ticketName: "Regular", dateRegistered: "2025-08-10", amountPaid: 5, ticketId: "TCK-005" },
  { name: "Laura Martinez", email: "laura.martinez@example.com", ticketName: "Vip", dateRegistered: "2025-08-12", amountPaid: 10, ticketId: "TCK-006" },
  { name: "James Taylor", email: "james.taylor@example.com", ticketName: "Early birds", dateRegistered: "2025-08-15", amountPaid: 2, ticketId: "TCK-007" },
  { name: "Emily Anderson", email: "emily.anderson@example.com", ticketName: "Regular", dateRegistered: "2025-08-17", amountPaid: 5, ticketId: "TCK-008" },
  { name: "Robert Thomas", email: "robert.thomas@example.com", ticketName: "Vip", dateRegistered: "2025-08-20", amountPaid: 10, ticketId: "TCK-009" },
  { name: "Sophia Garcia", email: "sophia.garcia@example.com", ticketName: "Early birds", dateRegistered: "2025-08-22", amountPaid: 2, ticketId: "TCK-010" },
  { name: "William Lee", email: "william.lee@example.com", ticketName: "Regular", dateRegistered: "2025-08-25", amountPaid: 5, ticketId: "TCK-011" },
  { name: "Olivia White", email: "olivia.white@example.com", ticketName: "Vip", dateRegistered: "2025-08-27", amountPaid: 10, ticketId: "TCK-012" },
  { name: "Daniel Harris", email: "daniel.harris@example.com", ticketName: "Early birds", dateRegistered: "2025-08-29", amountPaid: 2, ticketId: "TCK-013" },
  { name: "Ava Clark", email: "ava.clark@example.com", ticketName: "Regular", dateRegistered: "2025-09-01", amountPaid: 5, ticketId: "TCK-014" },
  { name: "Matthew Lewis", email: "matthew.lewis@example.com", ticketName: "Vip", dateRegistered: "2025-09-02", amountPaid: 10, ticketId: "TCK-015" },
  { name: "Isabella Walker", email: "isabella.walker@example.com", ticketName: "Early birds", dateRegistered: "2025-09-03", amountPaid: 2, ticketId: "TCK-016" },
  { name: "Ethan Hall", email: "ethan.hall@example.com", ticketName: "Regular", dateRegistered: "2025-09-04", amountPaid: 5, ticketId: "TCK-017" },
  { name: "Mia Allen", email: "mia.allen@example.com", ticketName: "Vip", dateRegistered: "2025-09-05", amountPaid: 10, ticketId: "TCK-018" },
  { name: "Alexander Young", email: "alexander.young@example.com", ticketName: "Early birds", dateRegistered: "2025-09-06", amountPaid: 2, ticketId: "TCK-019" },
  { name: "Charlotte King", email: "charlotte.king@example.com", ticketName: "Regular", dateRegistered: "2025-09-06", amountPaid: 5, ticketId: "TCK-020" }
];

export default soldTicketData;