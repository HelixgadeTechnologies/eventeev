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
    label: "Ticket Type",
    type: "select",
    options: [
      { label: "Standard Admission", value: "Standard Admission" },
      { label: "Speaker Invite", value: "Speaker Invite" },
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
];

export default function FreeTickets({ addTicket }: { addTicket: () => void }) {
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
            <h3 className="text-2xl font-black text-[#1B1818] tracking-tight">No Free Tickets Found</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
              Create a complimentary ticket for your guests. Click the &quot;Add Free Ticket&quot; button to get started.
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
              <IoAdd className="text-lg" /> Add Free Ticket
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Standard Free Card */}
            <div className="relative group overflow-hidden rounded-[32px] bg-white/95 backdrop-blur-xl border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="absolute top-0 right-0 p-4">
                 <button className="bg-[#EB5017] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#EB5017]/10 hover:scale-110 active:scale-95 transition-all">
                  Edit
                </button>
              </div>
              <div className="space-y-6">
                <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Standard Admission</p>
                   <p className="text-3xl font-black text-[#1B1818] tracking-tighter leading-none">
                     FREE
                   </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-[#EB5017] uppercase tracking-widest border border-[#EB5017]/10 bg-[#EB5017]/5 px-2 py-1 rounded-lg">Unlimited spots</span>
                    <span className="text-[10px] font-black text-[#1B1818] bg-gray-100 px-2 py-1 rounded-lg">Cap: 500</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                    <div className="h-full bg-[#EB5017] w-1/4" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-[#1B1818] uppercase tracking-tight">125 Claimed</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No Revenue</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Speaker Guest Card */}
            <div className="relative group overflow-hidden rounded-[32px] bg-white/95 backdrop-blur-xl border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="absolute top-0 right-0 p-4">
                 <button className="bg-[#1B1818] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-110 active:scale-95 transition-all">
                  Edit
                </button>
              </div>
              <div className="space-y-6">
                <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Speaker Invite</p>
                   <p className="text-3xl font-black text-[#1B1818] tracking-tighter leading-none">
                     FREE
                   </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-[#0F973D] uppercase tracking-widest border border-[#0F973D]/10 bg-[#0F973D]/5 px-2 py-1 rounded-lg">Exlusive</span>
                    <span className="text-[10px] font-black text-[#1B1818] bg-gray-100 px-2 py-1 rounded-lg">Cap: 20</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0F973D] w-1/2" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-[#1B1818] uppercase tracking-tight">10 Claimed</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">VIP Perks Incl.</span>
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