"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SpeakerForm from "./SpeakerForm";
import { SpeakerDataType } from "@/lib/demo-data/speakers";

interface EditSpeakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  speaker: SpeakerDataType | null;
  onUpdate: (data: any) => void;
}

const EditSpeakerModal = ({
  isOpen,
  onClose,
  speaker,
  onUpdate,
}: EditSpeakerModalProps) => {
  if (!speaker) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[820px] w-full bg-white/95 backdrop-blur-xl border border-white/60 shadow-2xl rounded-[28px] p-0 overflow-hidden font-sans gap-0 h-fit">
        <DialogHeader className="px-7 pt-5 pb-3 border-b border-gray-100 shrink-0">
          <DialogTitle className="text-xl font-bold text-[#1D2739] tracking-tight">Edit Speaker</DialogTitle>
          <DialogDescription className="text-xs text-[#667185] font-normal">
            Update the professional profile for {speaker.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 overflow-hidden">
          <SpeakerForm
            initialData={speaker}
            onSubmit={onUpdate}
            onCancel={onClose}
            submitLabel="Update Speaker"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditSpeakerModal;
