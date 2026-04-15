"use client";

import React from "react";
import Modal from "../ui/Modal";
import { X, QrCode } from "lucide-react";
import { Scanner } from "@yudiel/react-qr-scanner";

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (text: string) => void;
}

const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose, onScan }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-md p-0 overflow-hidden bg-black/95 border border-gray-800"
    >
      <div className="flex justify-between items-center p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#EB5017]/20 flex items-center justify-center">
            <QrCode className="text-[#EB5017]" size={20} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight uppercase">Scan Ticket</h3>
            <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase mt-0.5">
              Align QR Code within frame
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="relative aspect-square w-full bg-black flex items-center justify-center p-8">
        {isOpen && (
          <div className="w-full h-full rounded-3xl overflow-hidden border-2 border-[#EB5017]/30 relative shadow-[0_0_50px_-12px_#EB5017]">
            <Scanner
              onScan={(detectedCodes) => {
                const value = detectedCodes[0]?.rawValue;
                if (value) {
                  onScan(value);
                }
              }}
              styles={{
                container: { width: "100%", height: "100%" },
                video: { objectFit: "cover" },
              }}
              components={{
                onOff: true,
                torch: true,
                finder: true,
              }}
            />
            
            {/* Scanning Target Overlay */}
            <div className="absolute inset-0 pointer-events-none border-[3px] border-[#EB5017] m-12 md:m-16 rounded-2xl opacity-80" />
            
            {/* Scanning Line Animation */}
            <div className="absolute inset-0 pointer-events-none left-12 right-12 md:left-16 md:right-16 bg-gradient-to-b from-transparent via-[#EB5017]/50 to-transparent h-1 animate-scan" style={{
              animation: "scan 2s linear infinite",
            }} />
          </div>
        )}
      </div>

      <div className="p-6 text-center bg-black/95">
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-relaxed max-w-xs mx-auto">
          Hold your device steady and ensure the QR code is well-lit. The scan is automatic.
        </p>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 15%; }
          50% { top: 85%; }
          100% { top: 15%; }
        }
      `}} />
    </Modal>
  );
};

export default QRScannerModal;
