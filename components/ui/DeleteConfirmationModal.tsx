"use client";

import React from "react";
import Modal from "./Modal";
import { HiOutlineTrash, HiOutlineExclamation } from "react-icons/hi";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  isDeleting?: boolean;
}

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title,
  isDeleting = false 
}: DeleteConfirmationModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-0 overflow-hidden bg-white/95 backdrop-blur-xl">
      <div className="p-8 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-red-50 rounded-[32px] flex items-center justify-center text-red-500 mb-6 ring-8 ring-red-50/30">
          <HiOutlineExclamation size={40} className="animate-bounce" />
        </div>
        
        <h3 className="text-2xl font-black text-[#1B1818] tracking-tight mb-2 uppercase">Confirm Deletion</h3>
        <p className="text-sm text-gray-400 font-medium leading-relaxed mb-8 max-w-[280px]">
          Are you sure you want to delete <span className="text-[#1B1818] font-bold">"{title}"</span>? This action cannot be undone.
        </p>

        <div className="flex items-center gap-3 w-full">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 border border-gray-100 hover:bg-gray-50 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-[#EB5017] text-white hover:bg-[#d64815] shadow-xl shadow-[#EB5017]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <HiOutlineTrash size={16} />
                Delete Now
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
