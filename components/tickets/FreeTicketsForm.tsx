import { Label } from '../ui/label'
import React, { useState } from 'react'
import { Input } from '../ui/input'
import DatePicker from '../ui/DatePicker'
import TimePicker from '../ui/TimePicker'
import { useParams, useRouter } from "next/navigation";
import { ticketsService } from "@/lib/services/tickets.service";
import { Loader2 } from "lucide-react";
import ActionConfirmationModal from "../ui/ActionConfirmationModal";

import { TicketTier } from "@/types/ticket";

const FreeTicketsForm = ({ initialData, onSuccess }: { initialData?: TicketTier, onSuccess?: () => void }) => {
  const params = useParams();
  const eventId = params?._id as string;
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(initialData?.startDate || "");
  const [endDate, setEndDate] = useState(initialData?.stopDate || "");
  const [startTime, setStartTime] = useState(initialData?.startTime || "");
  const [endTime, setEndTime] = useState(initialData?.stopTime || "");

  // Status modal state
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("ticketName") as string;
    const quantity = parseInt(formData.get("ticketQuantity") as string);

    try {
      if (initialData?.id) {
        const { error } = await ticketsService.updateTicket(initialData.id, {
          name,
          type: "Free",
          price: 0,
          quantity: isNaN(quantity) ? 0 : quantity,
          startDate,
          endDate,
          startTime,
          endTime
        } as any);

        if (error) throw error;
        
        setStatusModal({
          isOpen: true,
          title: "Ticket Updated!",
          description: "Free ticket tier updated successfully.",
          variant: "success"
        });
      } else {
        const { error } = await ticketsService.createTicket({
          eventId,
          name,
          type: "Free",
          price: 0,
          quantity: isNaN(quantity) ? 0 : quantity,
          status: "Active",
          startDate,
          endDate,
          startTime,
          endTime
        });

        if (error) throw error;
        
        setStatusModal({
          isOpen: true,
          title: "Ticket Created!",
          description: "New free ticket tier added to your event.",
          variant: "success"
        });
      }
    } catch (err: any) {
      console.error("Failed to save free ticket:", err);
      setStatusModal({
        isOpen: true,
        title: "Action Failed",
        description: err.message || "Something went wrong while saving.",
        variant: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 flex flex-col">
            <Label
              htmlFor="ticketName"
              className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
            >
              Ticket Name
            </Label>
            <Input
              name="ticketName"
              type="text"
              required
              placeholder="e.g. Community Pass"
              defaultValue={initialData?.name}
              className="h-12 border-gray-100 bg-white/50 rounded-2xl focus-visible:ring-1 focus-visible:ring-[#EB5017] transition-all px-4"
              id="ticketName"
            />
          </div>
          <div className="space-y-1.5 flex flex-col">
            <Label
              htmlFor="ticketQuantity"
              className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
            >
              Total Inventory
            </Label>
            <Input
              name="ticketQuantity"
              type="number"
              required
              placeholder="0"
              defaultValue={initialData?.quantity}
              className="h-12 border-gray-100 bg-white/50 rounded-2xl focus-visible:ring-1 focus-visible:ring-[#EB5017] transition-all px-4"
              id="ticketQuantity"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5 flex flex-col">
            <Label
              htmlFor="startDate"
              className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
            >
              Sales Start Date
            </Label>
            <DatePicker 
              value={startDate}
              onChange={setStartDate}
              placeholder="Select date"
              className="h-12"
            />
          </div>
          <div className="space-y-1.5 flex flex-col">
            <Label
              htmlFor="startTime"
              className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
            >
              Sales Start Time
            </Label>
            <TimePicker
              value={startTime}
              onChange={setStartTime}
              className="h-12 border-gray-100 bg-white/50 rounded-2xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5 flex flex-col">
            <Label
              htmlFor="stopDate"
              className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
            >
              Sales End Date
            </Label>
            <DatePicker 
              value={endDate}
              onChange={setEndDate}
              placeholder="Select date"
              className="h-12"
            />
          </div>
          <div className="space-y-1.5 flex flex-col">
            <Label
              htmlFor="stopTime"
              className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
            >
              Sales End Time
            </Label>
            <TimePicker
              value={endTime}
              onChange={setEndTime}
              className="h-12 border-gray-100 bg-white/50 rounded-2xl"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-gray-50/50">
        <button
          type="button"
          disabled={loading}
          className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-all active:scale-95 disabled:opacity-50"
        >
          Discard Changes
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-[2] bg-[#EB5017] text-white py-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#EB5017]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-3 h-3 animate-spin" />}
          {initialData ? "Update Free Tier" : "Initialize Free Tier"}
        </button>
      </div>

      <ActionConfirmationModal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={() => {
          setStatusModal(prev => ({ ...prev, isOpen: false }));
          if (statusModal.variant === "success") {
            if (onSuccess) onSuccess();
            else window.location.reload();
          }
        }}
        title={statusModal.title}
        description={statusModal.description}
        confirmLabel="Understood"
        hideCancelButton={true}
        variant={statusModal.variant === "success" ? "success" : "error"}
      />
    </form>
  )
}

export default FreeTicketsForm