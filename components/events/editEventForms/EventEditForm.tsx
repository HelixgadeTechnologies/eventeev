"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DatePicker from "@/components/ui/DatePicker";
import FileInput from "@/components/ui/FileInput";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { LuClock3, LuGlobe, LuFacebook, LuInstagram, LuTwitter } from "react-icons/lu";
import ActionConfirmationModal from "@/components/ui/ActionConfirmationModal";
import TimePicker from "@/components/ui/TimePicker";

interface EventEditFormProps {
  initialData: any;
}

const EventEditForm = ({ initialData }: EventEditFormProps) => {
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
    defaultValues: initialData,
  });

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    console.log("Saving event details:", data);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    setShowConfirmModal(false);
    alert("Changes saved (simulated)");
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setShowConfirmModal(true);
    }} className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Basic Details Section */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
          <div className="w-8 h-8 rounded-lg bg-[#eb5017]/10 flex items-center justify-center text-[#eb5017]">
             <HiOutlineInformationCircle className="text-xl" />
          </div>
          <h3 className="text-lg font-black text-[#1B1818] uppercase tracking-tight">Basic Details</h3>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black text-[#1B1818] uppercase tracking-[0.1em]">Event Name</Label>
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-[#1B1818] focus:ring-1 focus:ring-[#eb5017]/20 focus:border-[#eb5017] transition-all outline-none"
                  placeholder="Event Name"
                />
              )}
            />
            {errors.name && <p className="text-[9px] font-bold text-red-500">Required</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-black text-[#1B1818] uppercase tracking-[0.1em]">Event Description</Label>
            <Controller
              name="description"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Textarea
                  {...field}
                  className="min-h-[100px] text-xs font-medium text-[#1B1818] border-gray-200 focus-visible:ring-1 focus-visible:ring-[#eb5017]/20 focus-visible:border-[#eb5017] rounded-xl resize-none"
                  placeholder="Describe your event..."
                />
              )}
            />
            {errors.description && <p className="text-[9px] font-bold text-red-500">Required</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black text-[#1B1818] uppercase tracking-[0.1em]">Start Date</Label>
              <Controller
                name="startDate"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <DatePicker value={field.value} onChange={field.onChange} />
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black text-[#1B1818] uppercase tracking-[0.1em]">Start Time</Label>
              <Controller
                name="startTime"
                control={control}
                render={({ field }) => (
                  <TimePicker value={field.value} onChange={field.onChange} />
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black text-[#1B1818] uppercase tracking-[0.1em]">End Date</Label>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <DatePicker value={field.value} onChange={field.onChange} />
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black text-[#1B1818] uppercase tracking-[0.1em]">End Time</Label>
              <Controller
                name="endTime"
                control={control}
                render={({ field }) => (
                  <TimePicker value={field.value} onChange={field.onChange} />
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category & Media Section */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
          <div className="w-8 h-8 rounded-lg bg-[#eb5017]/10 flex items-center justify-center text-[#eb5017]">
             <LuGlobe className="text-xl" />
          </div>
          <h3 className="text-lg font-black text-[#1B1818] uppercase tracking-tight">Category & Media</h3>
        </div>

        <div className="flex flex-col md:flex-row gap-6 pb-4">
          <div className="flex-[3] space-y-4">
            <div className="flex justify-between items-end">
              <Label className="text-[10px] font-black text-[#1B1818] uppercase tracking-[0.1em]">Thumbnail</Label>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">1:1 (Ideal: 800x800px)</span>
            </div>
            <Controller
              name="thumbnail"
              control={control}
              render={({ field }) => (
                <div className="border-2 border-dashed border-gray-100 rounded-2xl hover:border-[#eb5017]/30 transition-all bg-gray-50/30 overflow-hidden h-[180px]">
                  <FileInput 
                    className="h-full border-none p-0" 
                    defaultValue={field.value} 
                    onChange={(file) => field.onChange(file)} 
                  />
                </div>
              )}
            />
          </div>

          <div className="flex-[7] space-y-4">
            <div className="flex justify-between items-end">
              <Label className="text-[10px] font-black text-[#1B1818] uppercase tracking-[0.1em]">Banner</Label>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">16:9 (Ideal: 1920x1080px)</span>
            </div>
            <Controller
              name="banner"
              control={control}
              render={({ field }) => (
                <div className="border-2 border-dashed border-gray-100 rounded-2xl hover:border-[#eb5017]/30 transition-all bg-gray-50/30 overflow-hidden h-[180px]">
                  <FileInput 
                    className="h-full border-none p-0" 
                    defaultValue={field.value} 
                    onChange={(file) => field.onChange(file)} 
                  />
                </div>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black text-[#1B1818] uppercase tracking-[0.1em]">Event Type</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full bg-white border border-gray-200 h-10 rounded-xl px-3 text-xs font-bold text-[#1B1818] focus:ring-1 focus:ring-[#eb5017]/20 focus:border-[#eb5017]">
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
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-black text-[#1B1818] uppercase tracking-[0.1em]">Event Category</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full bg-white border border-gray-200 h-10 rounded-xl px-3 text-xs font-bold text-[#1B1818] focus:ring-1 focus:ring-[#eb5017]/20 focus:border-[#eb5017]">
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
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[10px] font-black text-[#1B1818] uppercase tracking-[0.1em]">Event Location / Venue</Label>
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-[#1B1818] focus:ring-1 focus:ring-[#eb5017]/20 focus:border-[#eb5017] transition-all outline-none"
                placeholder="Venue location"
              />
            )}
          />
        </div>
      </div>

      {/* Social Links Section */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
          <div className="w-8 h-8 rounded-lg bg-[#eb5017]/10 flex items-center justify-center text-[#eb5017]">
             <LuTwitter className="text-xl" />
          </div>
          <h3 className="text-lg font-black text-[#1B1818] uppercase tracking-tight">Social Links</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black text-[#1B1818] uppercase tracking-[0.1em]">Website URL</Label>
            <Controller
              name="website"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <LuGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...field}
                    type="text"
                    className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs font-bold text-[#1B1818] focus:ring-1 focus:ring-[#eb5017]/20 focus:border-[#eb5017] outline-none"
                    placeholder="https://..."
                  />
                </div>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-black text-[#1B1818] uppercase tracking-[0.1em]">Facebook URL</Label>
            <Controller
              name="facebook"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <LuFacebook className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...field}
                    type="text"
                    className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs font-bold text-[#1B1818] focus:ring-1 focus:ring-[#eb5017]/20 focus:border-[#eb5017] outline-none"
                    placeholder="https://facebook.com/..."
                  />
                </div>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-black text-[#1B1818] uppercase tracking-[0.1em]">Instagram URL</Label>
            <Controller
              name="instagram"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <LuInstagram className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...field}
                    type="text"
                    className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs font-bold text-[#1B1818] focus:ring-1 focus:ring-[#eb5017]/20 focus:border-[#eb5017] outline-none"
                    placeholder="https://instagram.com/..."
                  />
                </div>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-black text-[#1B1818] uppercase tracking-[0.1em]">X (Twitter) URL</Label>
            <Controller
              name="twitter"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <LuTwitter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...field}
                    type="text"
                    className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs font-bold text-[#1B1818] focus:ring-1 focus:ring-[#eb5017]/20 focus:border-[#eb5017] outline-none"
                    placeholder="https://x.com/..."
                  />
                </div>
              )}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          className="px-8 py-3 rounded-full border border-gray-200 text-xs font-black uppercase tracking-widest text-[#475367] hover:bg-gray-50 transition-all active:scale-95"
        >
          Discard Changes
        </button>
        <button
          type="submit"
          className="px-10 py-3 rounded-full bg-[#eb5017] text-white text-xs font-black uppercase tracking-widest hover:bg-[#d64815] transition-all shadow-xl shadow-[#eb5017]/20 active:scale-95"
        >
          Save Changes
        </button>
      </div>
      <ActionConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => !isSaving && setShowConfirmModal(false)}
        onConfirm={handleSubmit(onSubmit)}
        title="Save Changes?"
        description="This will update the event details. Previous versions will be overwritten."
        confirmLabel="Save Now"
        isLoading={isSaving}
      />
    </form>
  );
};

export default EventEditForm;
