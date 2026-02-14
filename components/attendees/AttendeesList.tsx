"use client";

import React, { useState, useMemo } from "react";
import { checkInData, AttendeesDataType } from "@/lib/demo-data/attendees";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/check-box";
import Avatar from "../ui/Avatar";
import DataTable from "../ui/data-table";
import { EllipsisVertical, ArrowUpDown, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilterConfig } from "../ui/data-table";
import Modal from "../ui/Modal";

const filters: FilterConfig[] = [
  {
    columnId: "checkedIn",
    label: "Status",
    type: "select",
    options: [
      { label: "Verified", value: "true" },
      { label: "Pending", value: "false" },
    ],
  },
];

const AttendeesList = () => {
  const [attendees, setAttendees] = useState<AttendeesDataType[]>(checkInData);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingAttendee, setPendingAttendee] = useState<AttendeesDataType | null>(null);
  const [pendingStatus, setPendingStatus] = useState<boolean>(false);

  const handleToggleCheckIn = (attendee: AttendeesDataType, status: boolean) => {
    // If we are checking IN, show confirmation. If unchecking, maybe just do it? 
    // The prompt says "when a user is checked it display a modal".
    if (status) {
      setPendingAttendee(attendee);
      setPendingStatus(status);
      setIsConfirmOpen(true);
    } else {
      // Direct uncheck
      updateAttendeeStatus(attendee.email, status);
    }
  };

  const updateAttendeeStatus = (email: string, status: boolean) => {
    setAttendees((prev) =>
      prev.map((a) => (a.email === email ? { ...a, checkedIn: status } : a))
    );
  };

  const confirmCheckIn = () => {
    if (pendingAttendee) {
      updateAttendeeStatus(pendingAttendee.email, pendingStatus);
    }
    setIsConfirmOpen(false);
    setPendingAttendee(null);
  };

  const columns = useMemo<ColumnDef<AttendeesDataType>[]>(() => [
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
          aria-label="Select row"
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
          Attendee Name <ArrowUpDown size={12} className="group-hover:scale-110 transition-transform" />
        </button>
      ),
      cell: ({ row }) => {
        const name = row.getValue("name") as string;
        return (
          <div className="flex items-center gap-4">
            <div className="relative group/avatar">
              <div className="absolute inset-0 bg-[#EB5017] rounded-full scale-0 group-hover/avatar:scale-110 transition-transform duration-300 opacity-20" />
              <Avatar name={name} href="#" />
            </div>
            <span className="font-black text-[#1B1818] uppercase tracking-tight text-xs">{name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({column}) => (
        <button 
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} 
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 group hover:text-[#EB5017] transition-colors"
        >
          Email Contact <ArrowUpDown size={12} className="group-hover:scale-110 transition-transform" />
        </button>
      ),
      cell: ({ row }) => <span className="text-xs text-gray-500 font-medium">{row.getValue("email")}</span>,
    },
    {
      accessorKey: "dateRegistered",
      header: ({column}) => (
        <button 
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} 
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 group hover:text-[#EB5017] transition-colors"
        >
          Registration <ArrowUpDown size={12} className="group-hover:scale-110 transition-transform" />
        </button>
      ),
      cell: ({ row }) => {
        return (
          <span className="text-[10px] font-black uppercase tracking-tighter text-[#AD3307] bg-[#FFECE5] px-2.5 py-1 rounded-full border border-[#FFECE5]/50">
            {row.getValue("dateRegistered")}
          </span>
        );
      },
    },
    {
      accessorKey: "checkedIn",
      header: ({column}) => (
        <button 
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} 
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 group hover:text-[#EB5017] transition-colors"
        >
          Status <ArrowUpDown size={12} className="group-hover:scale-110 transition-transform" />
        </button>
      ),
      filterFn: (row, columnId, filterValue) => {
        if (filterValue === "" || filterValue === undefined) return true;
        return String(row.getValue(columnId)) === filterValue;
      },
      cell: ({ row }) => {
        const checked = !!row.getValue("checkedIn");
        return (
          <div className="flex items-center gap-3">
            <Checkbox
              className="size-5 border-gray-300 data-[state=checked]:bg-[#0F973D] data-[state=checked]:border-[#0F973D]"
              checked={checked}
              onCheckedChange={(val: boolean) => handleToggleCheckIn(row.original, val)}
              aria-label="Checked In"
            />
            <span className={`text-[9px] font-black uppercase tracking-widest ${checked ? 'text-[#0F973D]' : 'text-gray-300'}`}>
              {checked ? 'Verified' : 'Pending'}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50/50 border border-gray-100 text-gray-400 hover:text-[#EB5017] hover:bg-white hover:shadow-sm transition-all cursor-pointer group">
                <EllipsisVertical size={16} className="group-hover:scale-110 transition-transform" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-2xl border-gray-100 shadow-xl p-2 bg-white/95 backdrop-blur-xl">
              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-3 py-2">Management</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-50" />
              <DropdownMenuItem className="rounded-xl focus:bg-[#EB5017]/5 focus:text-[#EB5017] cursor-pointer text-xs font-bold uppercase tracking-tight py-2.5 px-3">
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl focus:bg-[#EB5017]/5 focus:text-[#EB5017] cursor-pointer text-xs font-bold uppercase tracking-tight py-2.5 px-3">
                Print Badge
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl focus:bg-[#EB5017]/5 focus:text-[#EB5017] cursor-pointer text-xs font-bold uppercase tracking-tight py-2.5 px-3">
                Resend Invite
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-50" />
              <DropdownMenuItem className="rounded-xl focus:bg-red-50 focus:text-red-500 cursor-pointer text-xs font-bold uppercase tracking-tight py-2.5 px-3">
                Remove Peep
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [handleToggleCheckIn]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 mt-10">
      <DataTable columns={columns} data={attendees} isPagination filters={filters} />
      
      <Modal 
        isOpen={isConfirmOpen} 
        onClose={() => setIsConfirmOpen(false)}
        className="max-w-sm p-0 overflow-hidden"
      >
        <div className="p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-[#EB5017]/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 size={32} className="text-[#EB5017]" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-black text-[#1B1818] uppercase tracking-tight">Confirm Check-in</h3>
            <p className="text-sm text-gray-500 font-medium">
              Are you sure you want to check <span className="text-[#1B1818] font-bold">{pendingAttendee?.name}</span> in for this event?
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button 
              onClick={() => setIsConfirmOpen(false)}
              className="px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#1B1818] hover:bg-gray-50 transition-all border border-gray-100"
            >
              No, Cancel
            </button>
            <button 
              onClick={confirmCheckIn}
              className="px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white bg-[#EB5017] hover:bg-[#AD3307] transition-all shadow-lg shadow-[#EB5017]/20"
            >
              Yes, Check In
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AttendeesList;
