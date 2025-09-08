import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const PaidTicketsForm = () => {
  return (
    <form className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-1">
        <Label
          htmlFor="ticketName"
          className="text-[#101928] text-sm font-medium"
        >
          Ticket Name
        </Label>
        <Input
          type="text"
          className="w-full !p-4 border-[#D0D5DD] rounded-[6px] focus-visible:ring-0 focus-visible:border-[#F56630]"
          id="ticketName"
        />
      </div>
      <div className="flex flex-col gap-y-1">
        <Label
          htmlFor="ticketName"
          className="text-[#101928] text-sm font-medium"
        >
          Ticket Quantity
        </Label>
        <Input
          type="text"
          className="w-full !p-4 border-[#D0D5DD] rounded-[6px] focus-visible:ring-0 focus-visible:border-[#F56630]"
          id="ticketName"
        />
      </div>
      <div className="flex flex-col gap-y-1">
        <Label
          htmlFor="ticketName"
          className="text-[#101928] text-sm font-medium"
        >
          Price
        </Label>
        <Input
          type="text"
          className="w-full !p-4 border-[#D0D5DD] rounded-[6px] focus-visible:ring-0 focus-visible:border-[#F56630]"
          id="ticketName"
        />
      </div>
      <div className="flex gap-x-3.5 items-center">
        <div className="flex flex-col gap-y-1 w-1/2">
          <Label
            htmlFor="startDate"
            className="text-[#101928] text-sm font-medium"
          >
            Start Date
          </Label>
          <Input
            type="date"
            className="w-full !p-4 border-[#D0D5DD] rounded-[6px] focus-visible:ring-0 focus-visible:border-[#F56630]"
            id="startDate"
          />
        </div>
        <div className="flex flex-col gap-y-1 w-1/2">
          <Label
            htmlFor="startTime"
            className="text-[#101928] text-sm font-medium"
          >
            Start Time
          </Label>
          <Input
            type="time"
            className="w-full !p-4 border-[#D0D5DD] rounded-[6px] focus-visible:ring-0 focus-visible:border-[#F56630]"
            id="startTime"
          />
        </div>
      </div>
      <div className="flex gap-x-3.5 items-center">
        <div className="flex flex-col gap-y-1 w-1/2">
          <Label
            htmlFor="stopDate"
            className="text-[#101928] text-sm font-medium"
          >
            Stop Date
          </Label>
          <Input
            type="date"
            className="w-full !p-4 border-[#D0D5DD] rounded-[6px] focus-visible:ring-0 focus-visible:border-[#F56630]"
            id="stopDate"
          />
        </div>
        <div className="flex flex-col gap-y-1 w-1/2">
          <Label
            htmlFor="stopTime"
            className="text-[#101928] text-sm font-medium"
          >
            Stop Time
          </Label>
          <Input
            type="time"
            className="w-full !p-4 border-[#D0D5DD] rounded-[6px] focus-visible:ring-0 focus-visible:border-[#F56630]"
            id="stopTime"
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-x-8">
        <button
          type="button"
          className="text-[#F56630] border border-[#F56630] w-6/12 flex justify-center items-center text-base font-semibold py-3 rounded-[8px] cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="text-white border border-[#F56630] bg-[#F56630] w-6/12 flex justify-center items-center text-base font-semibold py-3 rounded-[8px] cursor-pointer"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default PaidTicketsForm;
