import { Label } from '../ui/label'
import React from 'react'
import { Input } from '../ui/input'

const FreeTicketsForm = () => {
  return (
    <form className="space-y-6">
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
              type="text"
              placeholder="e.g. Community Pass"
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
              type="number"
              placeholder="0"
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
            <Input
              type="date"
              className="h-12 border-gray-100 bg-white/50 rounded-2xl focus-visible:ring-1 focus-visible:ring-[#EB5017] transition-all px-4"
              id="startDate"
            />
          </div>
          <div className="space-y-1.5 flex flex-col">
            <Label
              htmlFor="startTime"
              className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
            >
              Sales Start Time
            </Label>
            <Input
              type="time"
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
              Sales End Date
            </Label>
            <Input
              type="date"
              className="h-12 border-gray-100 bg-white/50 rounded-2xl focus-visible:ring-1 focus-visible:ring-[#EB5017] transition-all px-4"
              id="stopDate"
            />
          </div>
          <div className="space-y-1.5 flex flex-col">
            <Label
              htmlFor="stopTime"
              className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
            >
              Sales End Time
            </Label>
            <Input
              type="time"
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
          Discard Changes
        </button>
        <button
          type="submit"
          className="flex-[2] bg-[#EB5017] text-white py-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#EB5017]/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          Initialize Free Tier
        </button>
      </div>
    </form>
  )
}

export default FreeTicketsForm