"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { IoAdd } from "react-icons/io5";
import DataTable, { FilterConfig } from "../ui/data-table";
import soldTicketData, { SoldTicketType } from "@/lib/demo-data/sold-tickets";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/check-box";
import { useParams } from "next/navigation";
import { ticketsService, ApiTicket } from "@/lib/services/tickets.service";
import { Loader2, AlertCircle } from "lucide-react";
import { TicketTier } from "@/app/(app)/events/[_id]/tickets/parent-switcher";

type Props = {
  addTicket: (type: TicketTier["type"]) => void;
  onEdit: (tier: TicketTier) => void;
};

const filters: FilterConfig[] = [
  {
    columnId: "ticketName",
    label: "Ticket Type",
    type: "select",
    options: [
      { label: "Early Birds", value: "Early birds" },
      { label: "Regular", value: "Regular" },
      { label: "VIP", value: "Vip" },
    ],
  },
  {
    columnId: "dateRegistered",
    label: "Registration Date",
    type: "date",
  },
  {
    columnId: "amountPaid",
    label: "Amount",
    type: "number",
  },
];

const columns: ColumnDef<SoldTicketType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: boolean) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="select all"
        className="border-gray-300 data-[state=checked]:bg-[#EB5017] data-[state=checked]:border-[#EB5017]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
        arai-label="Select row"
        className="border-gray-300 data-[state=checked]:bg-[#EB5017] data-[state=checked]:border-[#EB5017]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: () => <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Name</span>,
    cell: ({ row }) => <span className="font-bold text-[#1B1818] uppercase tracking-tight text-xs">{row.getValue("name")}</span>
  },
  {
    accessorKey: "email",
    header: () => <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email</span>,
    cell: ({ row }) => <span className="text-xs text-gray-500 font-medium">{row.getValue("email")}</span>
  },
  {
    accessorKey: "ticketName",
    header: () => <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ticket Type</span>,
    cell: ({ row }) => (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-gray-50 text-gray-600 border border-gray-100">
        {row.getValue("ticketName")}
      </span>
    )
  },
  {
    id: "ticketId",
    accessorKey: "ticketId",
    header: () => <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">ID</span>,
    cell: ({ row }) => <code className="text-[10px] font-bold text-[#EB5017] bg-[#EB5017]/5 px-1.5 py-0.5 rounded">#{String(row.getValue("ticketId")).slice(-6)}</code>
  },
  {
    accessorKey: "dateRegistered",
    header: () => <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Registered</span>,
    cell: ({ row }) => {
      return (
        <span className="text-[10px] font-black uppercase tracking-tighter text-[#AD3307] bg-[#FFECE5] px-2.5 py-1 rounded-full border border-[#FFECE5]">
          {row.getValue("dateRegistered")}
        </span>
      );
    },
  },
  {
    accessorKey: "amountPaid",
    header: () => <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Amount</span>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amountPaid"));
      const formatAmount = new Intl.NumberFormat("en-us", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <span className="font-black text-xs text-[#1B1818]">{formatAmount}</span>;
    },
  },
];

export default function PaidTickets({ addTicket, onEdit }: Props) {
  const params = useParams();
  const eventId = params?._id as string;
  
  const [ticketTiers, setTicketTiers] = useState<ApiTicket[]>([]);
  const [soldTickets, setSoldTickets] = useState<SoldTicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (eventId) {
      fetchTicketData();
    }
  }, [eventId]);

  const fetchTicketData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: tiers, error: tiersError } = await ticketsService.getTickets(eventId);
      
      if (tiersError) throw tiersError;
      
      const paidTiers = tiers.filter(t => t.type === 'paid');
      setTicketTiers(paidTiers);

      // Fetch attendees for each paid tier to build the sold tickets list
      const soldRecords: SoldTicketType[] = [];
      await Promise.all(paidTiers.map(async (tier) => {
        const { data: attendees } = await ticketsService.getTicketAttendees(tier.id);
        if (attendees && Array.isArray(attendees)) {
          attendees.forEach((a: any) => {
            soldRecords.push({
              name: a.name,
              email: a.email,
              ticketName: tier.name,
              ticketId: a.id, // Using attendee registration ID as ticket ID for now
              dateRegistered: a.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'N/A',
              amountPaid: tier.price
            });
          });
        }
      }));
      setSoldTickets(soldRecords);
    } catch (err: any) {
      console.error("Failed to fetch tickets:", err);
      setError(err.message || "Failed to load ticket data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-12 h-12 text-[#EB5017] animate-spin" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Loading tickets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-gray-900 font-black uppercase tracking-tight text-lg">Oops! Something went wrong</p>
        <p className="text-gray-500 text-xs font-medium max-w-xs">{error}</p>
        <button onClick={fetchTicketData} className="px-6 py-2 bg-[#EB5017] text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Retry</button>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {ticketTiers.length === 0 ? (
        <div className="flex flex-col min-h-[60vh] items-center justify-center text-center px-4">
          <div className="w-32 h-32 bg-gray-50/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-gray-100 shadow-sm mb-8">
            <div className="relative w-16 h-16 opacity-20">
              <Image
                src={"/no-ticket.svg"}
                alt="No ticket"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <div className="max-w-md space-y-3 mb-8">
            <h3 className="text-2xl font-black text-[#1B1818] tracking-tight">No Paid Tickets Found</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
              Create a ticket that people have to pay for. Click the &quot;Add Ticket&quot; button to get started with your first offering.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all active:scale-95">
              Learn More
            </button>
            <button
              onClick={() => addTicket("paid")}
              className="bg-[#EB5017] text-white px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-[#EB5017]/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <IoAdd className="text-lg" /> Add Ticket
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ticketTiers.map((tier) => {
              const tierArrivals = soldTickets.filter(s => s.ticketName === tier.name);
              const revenue = tierArrivals.length * tier.price;
              const percentage = (tierArrivals.length / (tier.quantity || 1)) * 100;
              
              return (
                <div key={tier.id} className="relative group overflow-hidden rounded-[32px] bg-white/95 backdrop-blur-xl border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all duration-500">
                  <div className="absolute top-0 right-0 p-4">
                    <button 
                      onClick={() => onEdit({
                        name: tier.name,
                        type: "paid",
                        price: tier.price,
                        quantity: tier.quantity,
                        startDate: "" 
                      })}
                      className="bg-[#EB5017] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#EB5017]/10 hover:scale-110 active:scale-95 transition-all"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">{tier.name}</p>
                      <p className="text-3xl font-black text-[#1B1818] tracking-tighter leading-none">
                        ${tier.price.toFixed(2)}<span className="text-xs text-gray-400 ml-1">/ticket</span>
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-[#EB5017] uppercase tracking-widest border border-[#EB5017]/10 bg-[#EB5017]/5 px-2 py-1 rounded-lg">
                          {tier.quantity - tierArrivals.length} Available
                        </span>
                        <span className="text-[10px] font-black text-[#1B1818] bg-gray-100 px-2 py-1 rounded-lg">Cap: {tier.quantity}</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                        <div className="h-full bg-[#EB5017] transition-all duration-1000" style={{ width: `${Math.min(percentage, 100)}%` }} />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-[#1B1818] uppercase tracking-tight">{tierArrivals.length} Sold</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Revenue: ${revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <DataTable columns={columns} data={soldTickets} isPagination filters={filters} />
          </div>
        </div>
      )}
    </section>
  );
}

