"use client"

import React from 'react'
import { SpeakerDataType } from '@/lib/demo-data/speakers'
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
        className="size-5 border-gray-300 data-[state=checked]:bg-[#EB5017] data-[state=checked]:border-[#EB5017]"
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
        className="size-5 border-gray-300 data-[state=checked]:bg-[#EB5017] data-[state=checked]:border-[#EB5017]"
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
    header: ({column}) => (
      <button 
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} 
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 group hover:text-[#EB5017] transition-colors"
      >
        Speaker <ArrowUpDown size={12} className="group-hover:scale-110 transition-transform" />
      </button>
    ),
    cell: ({ row }) => <span className="font-black text-[#1B1818] uppercase tracking-tight text-xs">{row.getValue("name")}</span>,
  },
  {
    accessorKey: "title",
    header: ({column}) => (
      <button 
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} 
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 group hover:text-[#EB5017] transition-colors"
      >
        Professional Title <ArrowUpDown size={12} className="group-hover:scale-110 transition-transform" />
      </button>
    ),
    cell: ({ row }) => <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{row.getValue("title")}</span>,
  },
  {
    accessorKey: "twitterHandle",
    header: ({column}) => (
      <button 
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} 
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 group hover:text-[#EB5017] transition-colors"
      >
        X (Twitter) <ArrowUpDown size={12} className="group-hover:scale-110 transition-transform" />
      </button>
    ),
    cell: ({ row }) => {
      return (
        <span className="text-[10px] font-black uppercase tracking-tighter text-[#AD3307] bg-[#FFECE5] px-2.5 py-1 rounded-full border border-[#FFECE5]/50">
          {row.getValue("twitterHandle")}
        </span>
      );
    },
  },
  {
    accessorKey: "company",
    header: ({column}) => (
      <button 
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} 
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 group hover:text-[#EB5017] transition-colors"
      >
        Organization <ArrowUpDown size={12} className="group-hover:scale-110 transition-transform" />
      </button>
    ),
    cell: ({ row }) => <span className="text-xs text-[#1B1818] font-black">{row.getValue("company")}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const item = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50/50 border border-gray-100 text-gray-400 hover:text-[#EB5017] hover:bg-white hover:shadow-sm transition-all cursor-pointer group">
              <EllipsisVertical size={16} className="group-hover:scale-110 transition-transform" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-2xl border-gray-100 shadow-xl p-2 bg-white/95 backdrop-blur-xl">
            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-3 py-2">Speaker Actions</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-50" />
            <DropdownMenuItem className="rounded-xl focus:bg-[#EB5017]/5 focus:text-[#EB5017] cursor-pointer text-xs font-bold uppercase tracking-tight py-2.5 px-3">
              View Analytics
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl focus:bg-[#EB5017]/5 focus:text-[#EB5017] cursor-pointer text-xs font-bold uppercase tracking-tight py-2.5 px-3">
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl focus:bg-[#EB5017]/5 focus:text-[#EB5017] cursor-pointer text-xs font-bold uppercase tracking-tight py-2.5 px-3">
              Manage Session
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-50" />
            <DropdownMenuItem className="rounded-xl focus:bg-red-50 focus:text-red-500 cursor-pointer text-xs font-bold uppercase tracking-tight py-2.5 px-3">
              De-list Speaker
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];


const TableList = ({ data }: { data: SpeakerDataType[] }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <DataTable columns={columns} data={data} isPagination hideSearch={true} />
    </div>
  )
}


export default TableList