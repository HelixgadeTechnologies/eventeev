import React from "react";
import FileInput from "@/components/ui/FileInput";
// import InputComponent from "@/components/ui/InputComponent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { RootState } from "@/store/store";
import {
  setNextStep,
  setPrevStep,
  updateForm,
} from "@/store/features/create-event/createEventSlice";
import { createEventData } from "@/types/create-event";
import { Label } from "@/components/ui/label";

const EventThumbnailForm = () => {
  const dispatch = useAppDispatch();
  const { formData } = useAppSelector((state: RootState) => state.createEvent);
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: "all",
    defaultValues: formData,
  });

  const handlePrevStep = () => dispatch(setPrevStep());

  const onSubmit = (data: createEventData) => {
    dispatch(updateForm(data));
    dispatch(setNextStep());
    console.log(data);
  };
  
  return (
    <div className="font-sans flex flex-col h-full animate-in fade-in slide-in-from-right-2 duration-500">
      {/* Header */}
      <div className="flex flex-col mb-6">
        <h4 className="text-xl font-black text-[#1B1818] tracking-tight">
          Category & Media
        </h4>
        <p className="text-[10px] font-medium text-[#C27E33] mt-0.5 opacity-90">
          Visuals matter! Choose a striking banner and set your event&apos;s physical or digital location.
        </p>
      </div>

      <form className="flex flex-col gap-y-5 flex-1" onSubmit={handleSubmit(onSubmit)}>
        {/* Banner Upload */}
        <div className="space-y-1.5">
          <Label className="text-[10px] font-black text-[#1B1818] uppercase tracking-[0.1em]">Event Banner / Thumbnail</Label>
          <Controller
            name="thumbnail"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <div className="border-2 border-dashed border-gray-100 rounded-2xl hover:border-[#F56630]/30 transition-all bg-gray-50/30 overflow-hidden">
                <FileInput onChange={(file) => field.onChange(file)} />
              </div>
            )}
          />
          {errors.thumbnail && (
            <p className="text-[9px] font-bold text-red-500 uppercase tracking-wider">Thumbnail is required</p>
          )}
        </div>

        {/* Event Type & Category Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black text-[#1B1818] uppercase tracking-[0.1em]">Event Type</Label>
            <Controller
              name="eventType"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full bg-white border border-gray-200 h-10 rounded-xl px-3 text-xs font-bold text-[#1B1818] focus:ring-1 focus:ring-[#F56630]/20 focus:border-[#F56630]">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                    <SelectItem value="in person" className="text-xs font-bold py-2">Physical</SelectItem>
                    <SelectItem value="hybrid" className="text-xs font-bold py-2">Hybrid</SelectItem>
                    <SelectItem value="virtual" className="text-xs font-bold py-2">Virtual</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.eventType && <p className="text-[9px] font-bold text-red-500 uppercase tracking-wider">Required</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-black text-[#1B1818] uppercase tracking-[0.1em]">Event Category</Label>
            <Controller
              name="category"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full bg-white border border-gray-200 h-10 rounded-xl px-3 text-xs font-bold text-[#1B1818] focus:ring-1 focus:ring-[#F56630]/20 focus:border-[#F56630]">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                    <SelectItem value="hackathon" className="text-xs font-bold py-2">Hackathon</SelectItem>
                    <SelectItem value="tech talk" className="text-xs font-bold py-2">Tech Talk</SelectItem>
                    <SelectItem value="workshop" className="text-xs font-bold py-2">Workshop</SelectItem>
                    <SelectItem value="watch party" className="text-xs font-bold py-2">Watch Party</SelectItem>
                    <SelectItem value="conference" className="text-xs font-bold py-2">Conference</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && <p className="text-[9px] font-bold text-red-500 uppercase tracking-wider">Required</p>}
          </div>
        </div>

        {/* Location */}
        <div className="space-y-1.5">
          <Label className="text-[10px] font-black text-[#1B1818] uppercase tracking-[0.1em]">Event Location / Venue</Label>
          <Controller
            name="location"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <div className="relative">
                <input 
                  type="text" 
                  value={field.value}
                  onChange={field.onChange}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-[#1B1818] focus:ring-1 focus:ring-[#F56630]/20 focus:border-[#F56630] transition-all outline-none placeholder:text-gray-300"
                  placeholder="e.g. Helix-Ace Event Centre, Lagos"
                />
              </div>
            )}
          />
          {errors.location && <p className="text-[9px] font-bold text-red-500 uppercase tracking-wider">Location is required</p>}
        </div>

        {/* Tip Box */}
        <div className="bg-[#FFF4ED] border border-orange-50 rounded-xl p-3 mt-4">
          <p className="text-[9px] font-medium text-[#C27E33] leading-relaxed">
            <span className="font-bold text-[#F56630] uppercase tracking-wider mr-1">Pro Tip:</span>
            High-resolution banners (1920x1080) tend to have 40% higher engagement rates.
          </p>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex items-center gap-4 pt-4 mt-auto">
          <button
            type="button"
            onClick={handlePrevStep}
            className="flex-1 text-[#475367] border border-gray-200 hover:bg-gray-50 text-xs font-black uppercase tracking-widest py-3.5 rounded-xl cursor-pointer transition-all active:scale-95"
          >
            Previous
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

export default EventThumbnailForm;
