import React, { useState } from 'react'
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import DatePicker from "../ui/DatePicker";

import { TicketTier } from "@/app/(app)/events/[_id]/tickets/parent-switcher";

const DonatedTicketsForm = ({ initialData }: { initialData?: TicketTier }) => {
  const [startDate, setStartDate] = useState(initialData?.startDate || "");
  const [stopDate, setStopDate] = useState(initialData?.stopDate || "");

  return (
    <form className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 flex flex-col">
            <Label
              htmlFor="ticketName"
              className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
            >
              Donation Tier
            </Label>
            <Input
              type="text"
              placeholder="e.g. Bronze Supporter"
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
              Max Benefactors
            </Label>
            <Input
              type="number"
              placeholder="0 (Unlimited)"
              defaultValue={initialData?.quantity}
              className="h-12 border-gray-100 bg-white/50 rounded-2xl focus-visible:ring-1 focus-visible:ring-[#EB5017] transition-all px-4"
              id="ticketQuantity"
            />
          </div>
        </div>

        <div className="space-y-1.5 flex flex-col">
          <Label
            htmlFor="price"
            className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
          >
            Suggested Amount (USD)
          </Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
            <Input
              type="number"
              placeholder="25.00"
              defaultValue={initialData?.price}
              className="h-12 border-gray-100 bg-white/50 rounded-2xl focus-visible:ring-1 focus-visible:ring-[#EB5017] transition-all pl-8"
              id="price"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5 flex flex-col">
            <Label
              htmlFor="startDate"
              className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
            >
              Launch Date
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
              Launch Time
            </Label>
            <Input
              type="time"
              defaultValue={initialData?.startTime}
              className="h-12 border-gray-100 bg-white/50 rounded-2xl focus-visible:ring-1 focus-visible:ring-[#EB5017] transition-all px-4"
              id="startTime"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5 flex flex-col">
            <Label
              htmlFor="stopDate"
              className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
            >
              Expiration Date
            </Label>
            <DatePicker 
              value={stopDate}
              onChange={setStopDate}
              placeholder="Select date"
              className="h-12"
            />
          </div>
          <div className="space-y-1.5 flex flex-col">
            <Label
              htmlFor="stopTime"
              className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
            >
              Expiration Time
            </Label>
            <Input
              type="time"
              defaultValue={initialData?.stopTime}
              className="h-12 border-gray-100 bg-white/50 rounded-2xl focus-visible:ring-1 focus-visible:ring-[#EB5017] transition-all px-4"
              id="stopTime"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-gray-50/50">
        <button
          type="button"
          className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-all active:scale-95"
        >
          Discard
        </button>
        <button
          type="submit"
          className="flex-[2] bg-[#EB5017] text-white py-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#EB5017]/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          {initialData ? "Update Donation Tier" : "Create Donation Tier"}
        </button>
      </div>
    </form>
  )
}

export default DonatedTicketsForm