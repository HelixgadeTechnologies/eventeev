"use client";

import Image from "next/image";
import Button from "../ui/Button";
import Heading from "../ui/HeadingComponent";
import { IoAdd } from "react-icons/io5";

type Props = {
    addTicket: () => void;
}

export default function PaidTickets({
    addTicket,
}: Props) {
  const tickets = [];
  return (
    <section>
      {tickets.length === 0 ? (
        <div className="flex flex-col min-h-[60vh] items-center justify-center gap-6">
          <div className="h-[100px] w-[100px] relative overflow-hidden">
            <Image
              src={"/no-ticket.svg"}
              alt="No ticket"
              fill
              className="object-cover"
            />
          </div>
          <div className="w-[300px]">
            <Heading
                heading="No Paid Ticket Found"
                subtitle="Create a ticket that people have to pay for.
    Click “add Ticket” button to get started in adding your first ticket to your event."
                className="text-center"
            />
          </div>
          <div className="w-[300px] flex items-center gap-2">
            <Button isSecondary content="Learn More" />
            <Button onClick={addTicket} content="Add Ticket" icon={<IoAdd className="text-xl" />} />
          </div>
        </div>
      ) : (
        <section></section>
      )}
    </section>
  );
}
