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
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-y-8 min-w-[500px]">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-[#EB5017] uppercase tracking-[0.2em]">Inventory</p>
          <h5 className="text-2xl font-black text-[#1B1818] tracking-tight">Add New Ticket</h5>
        </div>

        <Tabs defaultValue="paid" className="w-full">
          <TabsList className="grid w-full grid-cols-3 gap-2 bg-gray-50/50 p-1.5 rounded-full border border-gray-100 mb-8">
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
          
          <div className="bg-gray-50/30 rounded-[32px] p-8 border border-gray-50/50">
            <TabsContent value="paid" className="mt-0 focus-visible:outline-none">
              <PaidTicketsForm />
            </TabsContent>
            <TabsContent value="free" className="mt-0 focus-visible:outline-none">
              <FreeTicketsForm />
            </TabsContent>
            <TabsContent value="donation" className="mt-0 focus-visible:outline-none">
              <DonatedTicketsForm />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Modal>
  );
}

