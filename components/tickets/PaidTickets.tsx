"use client";

import Image from "next/image";
import { IoAdd } from "react-icons/io5";
import DataTable, { FilterConfig } from "../ui/data-table";
import soldTicketData, { SoldTicketType } from "@/lib/demo-data/sold-tickets";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/check-box";


type Props = {
  addTicket: () => void;
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

export default function PaidTickets({ addTicket }: Props) {
  const tickets = soldTicketData;
  return (
    <section className="space-y-6">
      {tickets.length === 0 ? (
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
              onClick={addTicket}
              className="bg-[#EB5017] text-white px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-[#EB5017]/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <IoAdd className="text-lg" /> Add Ticket
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Early Bird Card */}
            <div className="relative group overflow-hidden rounded-[32px] bg-white/95 backdrop-blur-xl border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="absolute top-0 right-0 p-4">
                 <button className="bg-[#EB5017] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#EB5017]/10 hover:scale-110 active:scale-95 transition-all">
                  Edit
                </button>
              </div>
              <div className="space-y-6">
                <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Early Bird Tier</p>
                   <p className="text-3xl font-black text-[#1B1818] tracking-tighter leading-none">
                     $12.50<span className="text-xs text-gray-400 ml-1">/ticket</span>
                   </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-[#EB5017] uppercase tracking-widest border border-[#EB5017]/10 bg-[#EB5017]/5 px-2 py-1 rounded-lg">100 Available</span>
                    <span className="text-[10px] font-black text-[#1B1818] bg-gray-100 px-2 py-1 rounded-lg">Cap: 150</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                    <div className="h-full bg-[#EB5017] w-1/3" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-[#1B1818] uppercase tracking-tight">50 Sold</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Revenue: $625.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* General Card */}
            <div className="relative group overflow-hidden rounded-[32px] bg-white/95 backdrop-blur-xl border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="absolute top-0 right-0 p-4">
                 <button className="bg-[#1B1818] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-110 active:scale-95 transition-all">
                  Edit
                </button>
              </div>
              <div className="space-y-6">
                <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">General Admission</p>
                   <p className="text-3xl font-black text-[#1B1818] tracking-tighter leading-none">
                     $25.00<span className="text-xs text-gray-400 ml-1">/ticket</span>
                   </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-[#0F973D] uppercase tracking-widest border border-[#0F973D]/10 bg-[#0F973D]/5 px-2 py-1 rounded-lg">Low Stock</span>
                    <span className="text-[10px] font-black text-[#1B1818] bg-gray-100 px-2 py-1 rounded-lg">Cap: 200</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0F973D] w-[85%]" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-[#1B1818] uppercase tracking-tight">170 Sold</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Revenue: $4,250</span>
                  </div>
                </div>
              </div>
            </div>

            {/* VIP Card */}
            <div className="relative group overflow-hidden rounded-[32px] bg-white/95 backdrop-blur-xl border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="absolute top-0 right-0 p-4">
                 <button className="bg-[#EB5017] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#EB5017]/10 hover:scale-110 active:scale-95 transition-all">
                  Edit
                </button>
              </div>
              <div className="space-y-6">
                <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">V.I.P Experience</p>
                   <p className="text-3xl font-black text-[#1B1818] tracking-tighter leading-none">
                     $150.00<span className="text-xs text-gray-400 ml-1">/ticket</span>
                   </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-[#F5B546] uppercase tracking-widest border border-[#F5B546]/10 bg-[#F5B546]/5 px-2 py-1 rounded-lg">Selling Fast</span>
                    <span className="text-[10px] font-black text-[#1B1818] bg-gray-100 px-2 py-1 rounded-lg">Cap: 50</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                    <div className="h-full bg-[#F5B546] w-1/2" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-[#1B1818] uppercase tracking-tight">25 Sold</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Revenue: $3,750</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <DataTable columns={columns} data={soldTicketData} isPagination filters={filters} />
          </div>
        </div>
      )}
    </section>
  );
}

