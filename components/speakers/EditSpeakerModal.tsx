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
      <DialogContent className="max-w-[86rem] bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl rounded-[32px] p-0 overflow-hidden font-sans border gap-0">
        <DialogHeader className="p-8 pb-0 shrink-0">
          <DialogTitle className="text-2xl font-black text-[#1B1818] tracking-tight">Edit Speaker</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 font-medium">
            Update the professional profile for {speaker.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="p-8 pt-6 overflow-y-auto max-h-[80vh] custom-scrollbar">
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
