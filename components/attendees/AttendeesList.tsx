import React, { useState } from "react";
import { checkInData, AttendeesDataType } from "@/lib/demo-data/attendees";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/check-box";
import Avatar from "../ui/Avatar";
import DataTable from "../ui/data-table";
import { EllipsisVertical, ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const columns: ColumnDef<AttendeesDataType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="size-5 data-[state=checked]:bg-[#EB5017] data-[state=checked]:border-[#EB5017]"
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
        className="size-5 data-[state=checked]:bg-[#EB5017] data-[state=checked]:border-[#EB5017]"
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
    header: ({column}) => {
      const isAsc = () => column.toggleSorting(column.getIsSorted() === "asc");
      const isDesc = () => column.toggleSorting(column.getIsSorted() === "desc");
      const toggleSort = () => {
        if (isAsc) {
          isAsc()
        } else {
          isDesc()
        }
      };
      return <button onClick={toggleSort} className="flex items-center gap-x-1.5 cursor-pointer w-full justify-center">
        Name <ArrowUpDown size={12} color="#98A2B3" />
      </button>
    },
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        <div className="relative flex items-center justify-center w-full min-w-[200px]">
          <div className="absolute left-0">
            <Avatar name={name} href="#" />
          </div>
          <span className="font-medium text-[#101828] text-center">{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({column}) => {
      const isAsc = () => column.toggleSorting(column.getIsSorted() === "asc");
      const isDesc = () => column.toggleSorting(column.getIsSorted() === "desc");
      const toggleSort = () => {
        if (isAsc) {
          isAsc()
        } else {
          isDesc()
        }
      };
      return <button onClick={toggleSort} className="flex items-center gap-x-1.5 cursor-pointer w-full justify-center">
        Email <ArrowUpDown size={12} color="#98A2B3" />
      </button>
    },
    cell: ({ row }) => (
      <div className="flex justify-center w-full">
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "dateRegistered",
    header: ({column}) => {
      const isAsc = () => column.toggleSorting(column.getIsSorted() === "asc");
      const isDesc = () => column.toggleSorting(column.getIsSorted() === "desc");
      const toggleSort = () => {
        if (isAsc) {
          isAsc()
        } else {
          isDesc()
        }
      };
      return <button onClick={toggleSort} className="flex items-center gap-x-1.5 cursor-pointer w-full justify-center">
        Date Registered <ArrowUpDown size={12} color="#98A2B3" />
      </button>
    },
    cell: ({ row }) => {
      return (
        <div className="flex justify-center w-full">
          <span className="bg-[#ffece5] py-0.5 px-3 rounded-full text-[#AD3307]">
            {row.getValue("dateRegistered")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "checkedIn",
    header: ({column}) => {
      const isAsc = () => column.toggleSorting(column.getIsSorted() === "asc");
      const isDesc = () => column.toggleSorting(column.getIsSorted() === "desc");
      const toggleSort = () => {
        if (isAsc) {
          isAsc()
        } else {
          isDesc()
        }
      };
      return <button onClick={toggleSort} className="flex items-center gap-x-1.5 cursor-pointer w-full justify-center">
        Checked In <ArrowUpDown size={12} color="#98A2B3" />
      </button>
    },
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [checked, setChecked] = useState(!!row.getValue("checkedIn"));
      return (
        <div className="flex justify-center w-full">
          <Checkbox
            className="size-5 data-[state=checked]:bg-[#EB5017] data-[state=checked]:border-[#EB5017]"
            checked={checked}
            onCheckedChange={(val: boolean) => setChecked(val)}
            aria-label="Checked In"
          />
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const item = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-8 h-8 flex items-center justify-center rounded-[8px] border border-[#E4E7EC] cursor-pointer">
            <EllipsisVertical size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const AttendeesList = () => {
  return (
    <div>
      <DataTable columns={columns} data={checkInData.slice(0, 5)} isPagination />
    </div>
  );
};

export default AttendeesList;
