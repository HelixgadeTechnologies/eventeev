"use client";

import Image from "next/image";
import Button from "../ui/Button";
import Heading from "../ui/HeadingComponent";
import { IoAdd } from "react-icons/io5";
import DataTable from "../ui/data-table";
import soldTicketData, { SoldTicketType } from "@/lib/demo-data/sold-tickets";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/check-box";

type Props = {
  addTicket: () => void;
};

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
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
        arai-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "ticketName",
    header: "Ticket Name",
  },
  {
    accessorKey: "ticketId",
    header: "Ticket ID",
  },
  {
    accessorKey: "dateRegistered",
    header: "Date Registered",
    cell: ({ row }) => {
      return (
        <span className="bg-[#ffece5] py-0.5 px-3 rounded-full text-[#AD3307]">
          {row.getValue("dateRegistered")}
        </span>
      );
    },
  },
  {
    accessorKey: "amountPaid",
    header: "Amount Paid",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amountPaid"));
      const formatAmount = new Intl.NumberFormat("en-us", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <>{formatAmount}</>;
    },
  },
];

export default function PaidTickets({ addTicket }: Props) {
  const tickets = soldTicketData;
  return (
    <section>
      {tickets.length === 0 ? (
        <div className="flex flex-col min-h-[60vh] items-center justify-center gap-6">
          <div className="h-[100px] w-[100px] relative overflow-hidden">
            <Image
              src={"/no-ticket.svg"}
              alt="No ticket"
              fill
              className="object-cover"
            />
          </div>
          <div className="w-[300px]">
            <Heading
              heading="No Paid Ticket Found"
              subtitle="Create a ticket that people have to pay for.
    Click “add Ticket” button to get started in adding your first ticket to your event."
              className="text-center"
            />
          </div>
          <div className="w-[300px] flex items-center gap-2">
            <Button isSecondary content="Learn More" />
            <Button
              onClick={addTicket}
              content="Add Ticket"
              icon={<IoAdd className="text-xl" />}
            />
          </div>
        </div>
      ) : (
        <section>
          <div className="mt-6 mb-10 flex flex-col md:flex-row gap-y-3 md:gap-x-3">
            <div className="rounded-[6px] p-4 flex flex-col gap-y-4 w-1/3 bg-[#FFECE5]">
              <div className="flex justify-between font-sans">
                <p className="font-normal text-sm text-[#475367]">
                  <strong className="font-extrabold text-xl text-black">
                    $2
                  </strong>
                  /per ticket
                </p>
                <button className="bg-[#F56630] text-white px-2.5 py-[5px] rounded-[6px] text-xs font-bold">
                  Edit
                </button>
              </div>
              <div className="flex justify-between font-sans">
                <p className="text-[#f56630] font-medium text-xs">100 Available</p>
                <p className="text-[#f56630] font-medium text-xs px-2 rounded-full bg-[#FFCAB7]">150</p>
              </div>
              <div className="flex justify-between font-sans">
                <p className="text-[#f56630] font-bold text-xs">50 Sold</p>
                <p className="text-black font-bold text-xs px-2 rounded-full">Revenue: $200</p>
              </div>
            </div>
            
            <div className="rounded-[6px] p-4 flex flex-col gap-y-4 w-1/3 bg-[#E7F6EC]">
              <div className="flex justify-between font-sans">
                <p className="font-normal text-sm text-[#475367]">
                  <strong className="font-extrabold text-xl text-black">
                    $2
                  </strong>
                  /per ticket
                </p>
                <button className="bg-[#F56630] text-white px-2.5 py-[5px] rounded-[6px] text-xs font-bold">
                  Edit
                </button>
              </div>
              <div className="flex justify-between font-sans">
                <p className="text-[#0F973D] font-medium text-xs">100 Available</p>
                <p className="text-[#0F973D] font-medium text-xs px-2 rounded-full bg-[#CDF9DB]">150</p>
              </div>
              <div className="flex justify-between font-sans">
                <p className="text-[#0F973D] font-bold text-xs">50 Sold</p>
                <p className="text-black font-bold text-xs px-2 rounded-full">Revenue: $200</p>
              </div>
            </div>
            
            <div className="rounded-[6px] p-4 flex flex-col gap-y-4 w-1/3 bg-[#FEF6E7]">
              <div className="flex justify-between font-sans">
                <p className="font-normal text-sm text-[#475367]">
                  <strong className="font-extrabold text-xl text-black">
                    $2
                  </strong>
                  /per ticket
                </p>
                <button className="bg-[#F56630] text-white px-2.5 py-[5px] rounded-[6px] text-xs font-bold">
                  Edit
                </button>
              </div>
              <div className="flex justify-between font-sans">
                <p className="text-[#F5B546] font-medium text-xs">100 Available</p>
                <p className="text-[#F5B546] font-medium text-xs px-2 rounded-full bg-[#FFDEA0]">150</p>
              </div>
              <div className="flex justify-between font-sans">
                <p className="text-[#F5B546] font-bold text-xs">50 Sold</p>
                <p className="text-black font-bold text-xs px-2 rounded-full">Revenue: $200</p>
              </div>
            </div>
          </div>
          <DataTable columns={columns} data={soldTicketData} />
        </section>
      )}
    </section>
  );
}
