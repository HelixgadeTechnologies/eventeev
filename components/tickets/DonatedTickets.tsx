"use client";

import Image from "next/image";
import { IoAdd } from "react-icons/io5";
import DataTable, { FilterConfig } from "../ui/data-table";
import soldTicketData, { SoldTicketType } from "@/lib/demo-data/sold-tickets";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/check-box";

const filters: FilterConfig[] = [
  {
    columnId: "ticketName",
    label: "Donation Type",
    type: "select",
    options: [
      { label: "Community Support", value: "Community Support" },
    ],
  },
  {
    columnId: "dateRegistered",
    label: "Registration Date",
    type: "date",
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
    header: () => <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Type</span>,
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
];

import { TicketTier } from "@/app/(app)/events/[_id]/tickets/parent-switcher";

export default function DonatedTickets({
  addTicket,
  onEdit,
}: {
  addTicket: (type: TicketTier["type"]) => void;
  onEdit: (tier: TicketTier) => void;
}) {
  const tickets: SoldTicketType[] = [];
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
            <h3 className="text-2xl font-black text-[#1B1818] tracking-tight">No Donations Found</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
              Enable your community to support your work with digital donations. Click the &quot;Add Donated Ticket&quot; button to set up a contribution goal.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all active:scale-95">
              Learn More
            </button>
            <button
              onClick={() => addTicket("donation")}
              className="bg-[#EB5017] text-white px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-[#EB5017]/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <IoAdd className="text-lg" /> Add Donated Ticket
            </button>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <DataTable columns={columns} data={tickets} isPagination filters={filters} />
        </div>
      )}
    </section>
  );
}

