import React from "react";
// import InputComponent from "@/components/ui/InputComponent";
import { useForm, Controller } from "react-hook-form";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { RootState } from "@/store/store";
import {
  setNextStep,
  setPrevStep,
  updateForm,
} from "@/store/features/create-event/createEventSlice";
import { createEventData } from "@/types/create-event";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const EventSocialsForm = () => {
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
          Social Links & Integrations
        </h4>
        <p className="text-[10px] font-medium text-[#C27E33] mt-0.5 opacity-90">
          Connect your event to the world. Add your website and social handles for better visibility.
        </p>
      </div>

      {/* Tip Box */}
      <div className="bg-[#F9FAFB] border border-gray-100 rounded-xl p-3 mb-6">
        <p className="text-[9px] font-medium text-gray-400 leading-relaxed italic">
          &quot;Adding social links can boost your event&apos;s trust score by up to 65%.&quot; — Eventeev Insights
        </p>
      </div>

      <form className="flex flex-col gap-y-4 flex-1" onSubmit={handleSubmit(onSubmit)}>
        {/* Website */}
        <div className="space-y-1.5">
          <Label className="text-[10px] font-black text-[#1B1818] uppercase tracking-[0.1em]">Event Website</Label>
          <Controller
            name="website"
            control={control}
            render={({ field }) => (
              <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-[#F56630]/20 focus-within:border-[#F56630] transition-all">
                <span className="bg-gray-50 px-3 py-2 text-gray-400 font-bold text-[10px] border-r border-gray-100 flex items-center shrink-0 uppercase tracking-wider">https://</span>
                <input 
                  type="text" 
                  value={field.value}
                  onChange={field.onChange}
                  className="flex-1 px-3 py-2 text-xs font-bold text-[#1B1818] outline-none bg-transparent placeholder:text-gray-300"
                  placeholder="www.yourevent.com"
                />
              </div>
            )}
          />
        </div>

        {/* Social Handles Group */}
        <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 md:p-5 space-y-4">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-2">Social Profiles</h4>
          
          {/* Facebook */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-[#1B1818]">Facebook Handle</Label>
            <Controller
              name="facebookUrl"
              control={control}
              render={({ field }) => (
                <input 
                  type="text" 
                  value={field.value}
                  onChange={field.onChange}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-[#1B1818] focus:ring-1 focus:ring-[#F56630]/20 focus:border-[#F56630] transition-all outline-none"
                  placeholder="facebook.com/handle"
                />
              )}
            />
          </div>

          {/* Instagram & X Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-[#1B1818]">Instagram</Label>
              <Controller
                name="instagramUrl"
                control={control}
                render={({ field }) => (
                  <input 
                    type="text" 
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-[#1B1818] focus:ring-1 focus:ring-[#F56630]/20 focus:border-[#F56630] transition-all outline-none"
                    placeholder="@handle"
                  />
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-[#1B1818]">X (Twitter)</Label>
              <Controller
                name="xUrl"
                control={control}
                render={({ field }) => (
                  <input 
                    type="text" 
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-[#1B1818] focus:ring-1 focus:ring-[#F56630]/20 focus:border-[#F56630] transition-all outline-none"
                    placeholder="@handle"
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Integration Toggle */}
        <div className="bg-[#FFF4ED] border border-orange-50 rounded-xl px-4 py-3 flex justify-between items-center">
          <div className="space-y-0.5">
            <Label className="text-xs font-bold text-[#F56630]">Smart Rate Limiting</Label>
            <p className="text-[9px] font-medium text-[#C27E33] leading-tight">Restrict registration to once per customer</p>
          </div>
          <Switch className="data-[state=checked]:bg-[#F56630] scale-90" />
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

export default EventSocialsForm;
