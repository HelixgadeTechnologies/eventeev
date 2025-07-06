'use client';

import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  header: string;
  message: string;
  buttonContent: string
};

export default function Modal({ 
    isOpen, 
    onClose, 
    header,
    message,
    buttonContent = "Okay",
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/80 z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 z-50 relative text-black"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()} // prevent modal close when clicking inside
            >
              <h2 className="text-xl font-semibold mb-2 text-center">
                {header}
              </h2>
              <p className="text-sm text-center text-black/70">{message}</p>
              <div className="mt-6 flex justify-end gap-2">
                <Button onClick={onClose} content={buttonContent} />
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}