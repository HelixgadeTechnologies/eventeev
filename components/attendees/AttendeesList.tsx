"use client";

import React, { useState, useMemo, useEffect } from "react";
import { AttendeesDataType } from "@/lib/demo-data/attendees";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/check-box";
import Avatar from "../ui/Avatar";
import DataTable from "../ui/data-table";
import { EllipsisVertical, ArrowUpDown, AlertCircle, CheckCircle2, Download, Loader2, Plus, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ActionConfirmationModal from "../ui/ActionConfirmationModal";
import { FilterConfig } from "../ui/data-table";
import Modal from "../ui/Modal";
import { useParams } from "next/navigation";
import { attendeesService, ApiAttendee } from "@/lib/services/attendees.service";

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
  const params = useParams();
  const eventId = params?._id as string;
  
  const [attendees, setAttendees] = useState<AttendeesDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", email: "" });
  const [isAdding, setIsAdding] = useState(false);
  const [pendingAttendee, setPendingAttendee] = useState<AttendeesDataType | null>(null);
  const [pendingStatus, setPendingStatus] = useState<boolean>(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    variant: "success" | "error";
  }>({
    isOpen: false,
    title: "",
    description: "",
    variant: "success",
  });

  useEffect(() => {
    if (eventId) {
      fetchAttendees();
    }
  }, [eventId]);

  const fetchAttendees = async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await attendeesService.getAttendees(eventId);
    
    if (fetchError) {
      setError(fetchError.message || "Failed to load attendees");
      setAttendees([]);
    } else {
      // Map ApiAttendee to AttendeesDataType
      const mappedAttendees: AttendeesDataType[] = data.map((a: ApiAttendee) => ({
        id: a.id,
        name: a.name,
        email: a.email,
        dateRegistered: (a.registrationDate || a.createdAt) 
          ? new Date(a.registrationDate || a.createdAt!).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })
          : 'N/A',
        checkedIn: a.isCheckedIn
      }));
      setAttendees(mappedAttendees);
    }
    setLoading(false);
  };

  const exportToCSV = () => {
    // We export the current attendees state
    const headers = ["Name", "Email", "Date Registered", "Status"];
    const csvRows = attendees.map(a => [
      a.name,
      a.email,
      a.dateRegistered,
      a.checkedIn ? "Verified" : "Pending"
    ]);

    const csvContent = [
      headers.join(","),
      ...csvRows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `attendees-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleToggleCheckIn = (attendee: AttendeesDataType, status: boolean) => {
    if (status) {
      setPendingAttendee(attendee);
      setPendingStatus(status);
      setIsConfirmOpen(true);
    } else {
      // Direct uncheck or keep as is (Backend currently only has check-in endpoint)
      // If we had a revert endpoint, we'd call it here.
      // For now, we'll just show the confirm modal or ignore uncheck if not supported.
      updateAttendeeStatus(attendee.id, status);
    }
  };

  const updateAttendeeStatus = (id: string, status: boolean) => {
    setAttendees((prev) =>
      prev.map((a) => (a.id === id ? { ...a, checkedIn: status } : a))
    );
  };

  const confirmCheckIn = async () => {
    if (!pendingAttendee) return;
    
    setIsActionLoading(true);
    const { error: checkInError } = await attendeesService.checkInAttendee(pendingAttendee.id);
    
    if (checkInError) {
      setStatusModal({
        isOpen: true,
        title: "Check-in Failed",
        description: checkInError.message || "Failed to check in attendee. Please try again.",
        variant: "error"
      });
    } else {
      updateAttendeeStatus(pendingAttendee.id, pendingStatus);
      setStatusModal({
        isOpen: true,
        title: "Check-in Successful!",
        description: `${pendingAttendee.name} has been verified and checked in.`,
        variant: "success"
      });
    }
    
    setIsActionLoading(false);
    setIsConfirmOpen(false);
    setPendingAttendee(null);
  };

  const handleAddAttendee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name || !addForm.email) return;
    
    setIsAdding(true);
    const { data, error } = await attendeesService.createAttendee({ 
      eventId, 
      name: addForm.name, 
      email: addForm.email 
    });
    
    if (error) {
      setStatusModal({
        isOpen: true,
        title: "Failed to Add Attendee",
        description: error.message || "An error occurred while adding the attendee.",
        variant: "error"
      });
    } else {
      setStatusModal({
        isOpen: true,
        title: "Attendee Added!",
        description: `${addForm.name} has been successfully added to the event.`,
        variant: "success"
      });
      setAddForm({ name: "", email: "" });
      setIsAddModalOpen(false);
      fetchAttendees();
    }
    setIsAdding(false);
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-12 h-12 text-[#EB5017] animate-spin" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Loading attendees...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <div className="space-y-1">
          <p className="text-gray-900 font-black uppercase tracking-tight text-lg">Failed to load attendees</p>
          <p className="text-gray-500 text-xs font-medium">{error}</p>
        </div>
        <button 
          onClick={fetchAttendees}
          className="px-6 py-2.5 rounded-xl bg-[#EB5017] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#AD3307] transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 mt-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-black text-[#1B1818] uppercase tracking-tight">Attendees List</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Manage and track your event participants</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#EB5017] text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#d64815] transition-all shadow-sm hover:shadow-md group active:scale-95"
          >
            <Plus size={14} className="group-hover:scale-110 transition-transform" />
            Add Attendee
          </button>
          <button 
            onClick={exportToCSV}
            className="inline-flex items-center gap-2 bg-white border border-gray-100 text-[#1B1818] px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-[#EB5017] hover:text-[#EB5017] transition-all shadow-sm hover:shadow-md group active:scale-95"
          >
            <Download size={14} className="group-hover:-translate-y-0.5 transition-transform" />
            Export CSV
          </button>
        </div>
      </div>
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
              disabled={isActionLoading}
              className="px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#1B1818] hover:bg-gray-50 transition-all border border-gray-100 disabled:opacity-50"
            >
              No, Cancel
            </button>
            <button 
              onClick={confirmCheckIn}
              disabled={isActionLoading}
              className="px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white bg-[#EB5017] hover:bg-[#AD3307] transition-all shadow-lg shadow-[#EB5017]/20 flex items-center justify-center gap-2 disabled:opacity-80"
            >
              {isActionLoading ? <Loader2 size={12} className="animate-spin" /> : null}
              {isActionLoading ? "Processing..." : "Yes, Check In"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => !isAdding && setIsAddModalOpen(false)}
        className="max-w-md p-6"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-black text-[#1B1818] tracking-tight">Add Attendee</h3>
            <p className="text-xs text-gray-400 font-medium mt-1">Manually register someone for the event.</p>
          </div>
          <button
            onClick={() => !isAdding && setIsAddModalOpen(false)}
            className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#1B1818] transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        
        <form onSubmit={handleAddAttendee} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</label>
            <input
              type="text"
              required
              value={addForm.name}
              onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#EB5017] focus:ring-4 focus:ring-[#EB5017]/10 outline-none transition-all text-sm font-bold placeholder:text-gray-300"
              placeholder="e.g. Jane Doe"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
            <input
              type="email"
              required
              value={addForm.email}
              onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#EB5017] focus:ring-4 focus:ring-[#EB5017]/10 outline-none transition-all text-sm font-bold placeholder:text-gray-300"
              placeholder="e.g. jane@example.com"
            />
          </div>
          
          <button
            type="submit"
            disabled={isAdding || !addForm.name || !addForm.email}
            className="w-full mt-2 bg-[#EB5017] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#d64815] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isAdding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            {isAdding ? "Adding..." : "Add to Guestlist"}
          </button>
        </form>
      </Modal>

      <ActionConfirmationModal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
        title={statusModal.title}
        description={statusModal.description}
        confirmLabel="Understood"
        hideCancelButton={true}
        variant={statusModal.variant}
      />
    </div>
  );
};

export default AttendeesList;
