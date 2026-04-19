"use client"
import React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { RootState } from "@/store/store";
import {
  setPrevStep,
} from "@/store/features/create-event/createEventSlice";
import { createEventData } from "@/types/create-event";
import document from "@/public/document.svg";
import { Label } from "@/components/ui/label";
import ActionConfirmationModal from "@/components/ui/ActionConfirmationModal";
import { eventsService } from "@/lib/services/events.service";
import { useRouter } from "next/navigation";
import { convertTo24HourFormat } from "@/lib/utils/configure-date";

const EventFormPreview = () => {
  const dispatch = useAppDispatch();
  const { formData } = useAppSelector((state: RootState) => state.createEvent);
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [feedbackModal, setFeedbackModal] = React.useState<{
    isOpen: boolean;
    title: string;
    description: string;
    variant: "success" | "error";
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    variant: "success",
  });
  const [isPublishing, setIsPublishing] = React.useState(false);

  const { handleSubmit } = useForm({
    mode: "all",
    defaultValues: formData,
  });

  const handlePrevStep = () => dispatch(setPrevStep());

  const router = useRouter();

  const extractErrorMessage = (error: any): string => {
    if (typeof error === 'string') return error;
    if (error.message && typeof error.message === 'string') {
      // If there are specific validation errors, try to append them
      if (error.errors && typeof error.errors === 'object') {
        const fieldErrors = Object.values(error.errors).join(", ");
        return fieldErrors || error.message;
      }
      return error.message;
    }
    if (error.error && typeof error.error === 'string') return error.error;
    return "An unexpected error occurred.";
  };

  const onSubmit = async (status: 'Published' | 'Draft' = 'Published') => {
    setIsPublishing(true);
    
    try {
      // Map frontend formData to backend expected format
      // Note: Backend expects YYYY-MM-DD for dates and HH:mm (24h) for times
      const payload = {
        title: formData.name,
        description: formData.description,
        category: formData.category,
        type: formData.eventType,
        startDate: formData.startDate,
        endDate: formData.stopDate || formData.startDate, // Required field
        startTime: convertTo24HourFormat(formData.startTime),
        endTime: convertTo24HourFormat(formData.stopTime),
        location: formData.location || 'Online',
        website: formData.website || undefined,
        facebookUrl: formData.facebookUrl || undefined,
        instagramUrl: formData.instagramUrl || undefined,
        xUrl: formData.xUrl || undefined,
        recurrentEvent: formData.recurrentEvent || false,
        status: status,
        bannerImage: formData.banner || undefined,
        thumbnailImage: formData.thumbnail || undefined,
      };

      const { data: result, error } = await eventsService.createEvent(payload);
      
      if (error) {
        const errorMsg = extractErrorMessage(error);
        setFeedbackModal({
          isOpen: true,
          title: status === 'Draft' ? "Failed to Save Draft" : "Failed to Publish",
          description: errorMsg,
          variant: "error",
        });
        return;
      }

      setFeedbackModal({
        isOpen: true,
        title: status === 'Draft' ? "Draft Saved!" : "Event Published!",
        description: status === 'Draft' 
          ? "Your event has been saved as a draft. You can come back and finish it later." 
          : "Congratulations! Your event is now live and ready to accept registrations.",
        variant: "success",
        onConfirm: () => router.push("/events"),
      });
      
      setShowConfirmModal(false);
    } catch (err: any) {
      console.error(`${status === 'Draft' ? 'Draft' : 'Publishing'} error:`, err);
      setFeedbackModal({
        isOpen: true,
        title: "Something went wrong",
        description: err.message || `An error occurred while ${status === 'Draft' ? 'saving the draft' : 'publishing the event'}.`,
        variant: "error",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="font-sans flex flex-col h-full animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="flex flex-col mb-8 text-center md:text-left">
        <h4 className="text-xl font-black text-[#1B1818] tracking-tight">
          Review & Publish
        </h4>
        <p className="text-[10px] font-medium text-[#C27E33] mt-0.5 opacity-90 uppercase tracking-widest">
          Double check everything before we go live.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {/* Visual Summary Card */}
        <div className="bg-[#FAF9F6] border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="relative aspect-video rounded-2xl bg-gray-200 overflow-hidden group">
            <div className="absolute inset-0 bg-[#F56630]/10 flex items-center justify-center">
               <Image src={document} alt="banner" width={48} height={48} className="opacity-20 translate-y-2 group-hover:translate-y-0 transition-transform" />
            </div>
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Event Name</Label>
              <h3 className="text-lg font-black text-[#1B1818] leading-tight">{formData.name || "Untitled Event"}</h3>
            </div>
            
            <div className="space-y-1">
              <Label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Description</Label>
              <p className="text-xs font-medium text-[#475367] leading-relaxed line-clamp-3 italic">
                &quot;{formData.description || "No description provided."}&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Specs */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-1">
              <Label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Timeline</Label>
              <div className="flex flex-col">
                <p className="text-xs font-bold text-[#1B1818]">{formData.startDate}</p>
                <p className="text-[10px] font-medium text-[#F56630]">{formData.startTime}</p>
              </div>
            </div>

            <div className="space-y-1 text-right">
              <Label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Category</Label>
              <p className="text-xs font-black text-[#1B1818] uppercase">{formData.category || "General"}</p>
            </div>

            <div className="space-y-1">
              <Label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Location</Label>
              <p className="text-xs font-bold text-[#1B1818] truncate max-w-[150px]">{formData.location || "Online"}</p>
            </div>

            <div className="space-y-1 text-right">
              <Label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Visibility</Label>
              <div className="flex justify-end">
                <span className="bg-orange-50 text-[#F56630] text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-orange-100">
                  {formData.eventType || "Public"}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-50">
            <div className="bg-green-50/30 border border-green-100/50 rounded-2xl p-4 flex items-center justify-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[10px] font-bold text-green-700 uppercase tracking-wider">Ready for instant deployment</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row items-center gap-3 pt-8 mt-auto">
        <button
          type="button"
          onClick={handlePrevStep}
          className="w-full md:flex-1 text-[#475367] border border-gray-200 hover:bg-gray-50 text-xs font-black uppercase tracking-widest py-3.5 rounded-xl cursor-pointer transition-all active:scale-95"
        >
          Back to Edit
        </button>
        
        <button
          type="button"
          disabled={isPublishing}
          onClick={() => onSubmit('Draft')}
          className="w-full md:flex-1 text-[#1B1818] border-2 border-gray-100 hover:border-[#F56630]/30 text-xs font-black uppercase tracking-widest py-3.5 rounded-xl cursor-pointer transition-all active:scale-95 disabled:opacity-50"
        >
          {isPublishing ? 'Saving...' : 'Save as Draft'}
        </button>

        <button
          type="button"
          onClick={() => setShowConfirmModal(true)}
          className="w-full md:flex-[2] text-white bg-[#F56630] hover:bg-[#d64815] text-xs font-black uppercase tracking-widest py-3.5 rounded-xl cursor-pointer transition-all shadow-xl shadow-[#F56630]/30 active:scale-95 border border-[#F56630]"
        >
          Publish & Go Live
        </button>
      </div>

      <ActionConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => !isPublishing && setShowConfirmModal(false)}
        onConfirm={() => onSubmit('Published')}
        title="Publish Event?"
        description="Once published, your event will be live and accessible to attendees. You can still edit details later."
        confirmLabel="Publish Now"
        isLoading={isPublishing}
      />

      <ActionConfirmationModal
        isOpen={feedbackModal.isOpen}
        onClose={() => setFeedbackModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={() => {
          setFeedbackModal(prev => ({ ...prev, isOpen: false }));
          feedbackModal.onConfirm?.();
        }}
        title={feedbackModal.title}
        description={feedbackModal.description}
        variant={feedbackModal.variant}
        confirmLabel="Understood"
        hideCancelButton={true}
      />

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2DBD4;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};


export default EventFormPreview;
