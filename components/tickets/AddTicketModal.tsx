"use client";

import Modal from "../ui/Modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DonatedTicketsForm from "./DonatedTicketsForm";
import FreeTicketsForm from "./FreeTicketsForm";
import PaidTicketsForm from "./PaidTicketsForm";

type AddProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddTickets({ isOpen, onClose }: AddProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl p-0">
      <div className="flex flex-col min-h-[500px]">
        {/* Top - Info/Header */}
        <div className="w-full bg-white p-6 md:p-8 space-y-3 border-b border-gray-100">
          <div className="space-y-0.5">
            <p className="text-[10px] font-black text-[#EB5017] uppercase tracking-[0.2em]">Inventory</p>
            <h1 className="text-2xl font-black text-[#1B1818] tracking-tighter leading-tight">
              Add New Ticket
            </h1>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed max-w-xl">
            Create a new ticket tier for your event. Choose between paid, free, or donation-based access.
          </p>
        </div>

        {/* Bottom - Form Section (Glassy) */}
        <div className="flex-1 bg-gray-50/30 p-6 md:p-8 overflow-y-auto max-h-[60vh]">
          <Tabs defaultValue="paid" className="w-full">
            <TabsList className="grid w-full grid-cols-3 gap-2 bg-white/50 p-1.5 rounded-full border border-gray-100 mb-8 backdrop-blur-sm">
              <TabsTrigger
                className="rounded-full py-2.5 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-[#EB5017] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#EB5017]/20 transition-all duration-300"
                value="paid"
              >
                Paid
              </TabsTrigger>
              <TabsTrigger
                className="rounded-full py-2.5 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-[#EB5017] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#EB5017]/20 transition-all duration-300"
                value="free"
              >
                Free
              </TabsTrigger>
              <TabsTrigger
                className="rounded-full py-2.5 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-[#EB5017] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#EB5017]/20 transition-all duration-300"
                value="donation"
              >
                Donated
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-0 focus-visible:outline-none">
              <TabsContent value="paid" className="mt-0 focus-visible:outline-none ring-0 outline-none">
                <PaidTicketsForm />
              </TabsContent>
              <TabsContent value="free" className="mt-0 focus-visible:outline-none ring-0 outline-none">
                <FreeTicketsForm />
              </TabsContent>
              <TabsContent value="donation" className="mt-0 focus-visible:outline-none ring-0 outline-none">
                <DonatedTicketsForm />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </Modal>
  );
}

