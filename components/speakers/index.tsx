"use client"

import React from 'react'
import { speakerData, SpeakerDataType } from '@/lib/demo-data/speakers'
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/check-box";
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

const columns: ColumnDef<SpeakerDataType>[] = [
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
      return <button onClick={toggleSort} className="flex items-center gap-x-1.5 cursor-pointer">
        Name <ArrowUpDown size={12} color="#98A2B3" />
      </button>
    },
  },
  {
    accessorKey: "title",
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
      return <button onClick={toggleSort} className="flex items-center gap-x-1.5 cursor-pointer">
        Title of Speaker <ArrowUpDown size={12} color="#98A2B3" />
      </button>
    },
  },
  {
    accessorKey: "twitterHandle",
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
      return <button onClick={toggleSort} className="flex items-center gap-x-1.5 cursor-pointer">
        Twitter Handle <ArrowUpDown size={12} color="#98A2B3" />
      </button>
    },
    cell: ({ row }) => {
      return (
        <span className="bg-[#ffece5] py-0.5 px-3 rounded-full text-[#AD3307]">
          {row.getValue("twitterHandle")}
        </span>
      );
    },
  },
  {
    accessorKey: "company",
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
      return <button onClick={toggleSort} className="flex items-center gap-x-1.5 cursor-pointer">
        Company <ArrowUpDown size={12} color="#98A2B3" />
      </button>
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

const Speakers = () => {
  return (
    <DataTable columns={columns} data={speakerData} isPagination />
  )
}

export default Speakers