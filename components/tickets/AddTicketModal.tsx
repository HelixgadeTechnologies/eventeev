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
      <div className="flex flex-col gap-y-4">
        <h5>Add Ticket</h5>
        <Tabs defaultValue="paid">
          <TabsList className="w-full gap-x-5 border-0 bg-transparent">
            <TabsTrigger
              className="data-[state=active]:bg-[#E8562E] bg-[#D93F1661] text-white border border-[#FD9670] rounded-full !py-4"
              value="paid"
            >
              Paid
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-[#E8562E] bg-[#D93F1661] text-white border border-[#FD9670] rounded-full !py-4"
              value="free"
            >
              Free
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-[#E8562E] bg-[#D93F1661] text-white border border-[#FD9670] rounded-full !py-4"
              value="donation"
            >
              Donation
            </TabsTrigger>
          </TabsList>
          <TabsContent value="paid">
            <PaidTicketsForm />
          </TabsContent>
          <TabsContent value="free">
            <FreeTicketsForm />
          </TabsContent>
          <TabsContent value="donation">
            <DonatedTicketsForm />
          </TabsContent>
        </Tabs>
      </div>
    </Modal>
  );
}
