"use client"
import React from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller } from "react-hook-form";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { RootState } from "@/store/store";
import {
  setNextStep,
  updateForm,
} from "@/store/features/create-event/createEventSlice";
import { createEventData } from "@/types/create-event";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import DatePicker from "@/components/ui/DatePicker";

const EventDetailsForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { formData } = useAppSelector(
    (state: RootState) => state.createEvent
  );
  const { control, formState: { errors }, handleSubmit } = useForm({
    mode: "all",
    defaultValues: formData,
  });

  const handleFormClose = () => router.push("/events");

  const onSubmit = (data: createEventData) => {
    dispatch(updateForm(data));
    dispatch(setNextStep());
    console.log(data);
  }

  return (
    <div className="font-sans flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col mb-6">
        <h4 className="text-xl font-black text-[#1B1818] tracking-tight">
          Basic Event Details
        </h4>
        <p className="text-[10px] font-medium text-[#C27E33] mt-0.5 opacity-90">
          Set up the foundation of your event. These details will be visible to all attendees.
        </p>
      </div>

      <form className="flex flex-col gap-y-5 flex-1" onSubmit={handleSubmit(onSubmit)}>
        {/* Event Name */}
        <div className="space-y-1.5">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-[#1B1818] uppercase tracking-[0.1em]">Event Name</Label>
                <input 
                  type="text" 
                  value={field.value}
                  onChange={field.onChange}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-[#1B1818] focus:ring-1 focus:ring-[#F56630]/20 focus:border-[#F56630] transition-all outline-none placeholder:text-gray-300"
                  placeholder="e.g. Annual Tech Summit 2024"
                />
              </div>
            )}
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-[#1B1818] uppercase tracking-[0.1em]">Event Description</Label>
                <Textarea
                  placeholder="What is this event about?"
                  className="min-h-[80px] text-xs font-medium text-[#1B1818] border-gray-200 focus-visible:ring-1 focus-visible:ring-[#F56630]/20 focus-visible:border-[#F56630] rounded-xl resize-none"
                  {...field}
                />
                <p className="text-[9px] font-medium text-gray-400">
                  Provide a brief summary for your attendees
                </p>
              </div>
            )}
          />
        </div>

        {/* Dates & Times Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black text-[#1B1818] uppercase tracking-[0.1em]">Start Date</Label>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <DatePicker 
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Set start date"
                  />
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-black text-[#1B1818] uppercase tracking-[0.1em]">Start Time</Label>
              <Controller
                name="startTime"
                control={control}
                render={({ field }) => (
                  <input 
                    type="time" 
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-[#1B1818] focus:ring-1 focus:ring-[#F56630]/20 focus:border-[#F56630] outline-none"
                  />
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black text-[#1B1818] uppercase tracking-[0.1em]">End Date</Label>
              <Controller
                name="stopDate"
                control={control}
                render={({ field }) => (
                  <DatePicker 
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Set end date"
                  />
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-black text-[#1B1818] uppercase tracking-[0.1em]">End Time</Label>
              <Controller
                name="stopTime"
                control={control}
                render={({ field }) => (
                  <input 
                    type="time" 
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-[#1B1818] focus:ring-1 focus:ring-[#F56630]/20 focus:border-[#F56630] outline-none"
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Recurrent Toggle */}
        <div className="bg-[#F9FAFB] border border-gray-100 rounded-xl px-4 py-3 flex justify-between items-center mt-2">
          <div className="space-y-0.5">
            <Label className="text-xs font-bold text-[#1B1818]">Recurrent Event?</Label>
            <p className="text-[9px] font-medium text-gray-400 uppercase tracking-wider">Repeat this event periodically</p>
          </div>
          <Switch className="data-[state=checked]:bg-[#F56630] scale-90" />
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-4 pt-4 mt-auto">
          <button
            type="button"
            onClick={handleFormClose}
            className="flex-1 text-[#475367] border border-gray-200 hover:bg-gray-50 text-xs font-black uppercase tracking-widest py-3.5 rounded-xl cursor-pointer transition-all active:scale-95"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-[2] text-white bg-[#F56630] hover:bg-[#d64815] text-xs font-black uppercase tracking-widest py-3.5 rounded-xl cursor-pointer transition-all shadow-md shadow-[#F56630]/20 active:scale-95"
          >
            Next Step
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventDetailsForm;
