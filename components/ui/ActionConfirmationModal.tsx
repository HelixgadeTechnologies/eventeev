"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ActionConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  variant?: "primary" | "danger";
}

const ActionConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isLoading = false,
  variant = "primary",
}: ActionConfirmationModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] bg-white rounded-3xl border-none shadow-2xl p-8 h-fit overflow-hidden">
        <DialogHeader className="space-y-3 text-center sm:text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mb-2">
            <div className="w-2 h-2 rounded-full bg-[#eb5017] animate-pulse" />
          </div>
          <DialogTitle className="text-xl font-black text-[#1B1818] tracking-tight">
            {title}
          </DialogTitle>
          <DialogDescription className="text-xs font-medium text-gray-500 leading-relaxed max-w-[280px] mx-auto">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-8 sm:justify-center">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-8 py-3 rounded-xl border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "flex-1 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all active:scale-95 shadow-xl disabled:opacity-50 flex items-center justify-center gap-2",
              variant === "danger" 
                ? "bg-red-500 hover:bg-red-600 shadow-red-200" 
                : "bg-[#eb5017] hover:bg-[#d64815] shadow-orange-200"
            )}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              confirmLabel
            )}
          </button>
        </DialogFooter>

        <div className="mt-6 pt-4 border-t border-gray-50 text-center">
           <p className="text-[8px] text-gray-400 font-medium uppercase tracking-widest opacity-60">
             This action will modify your event database
           </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActionConfirmationModal;
