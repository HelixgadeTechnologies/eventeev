"use client";

import Image from "next/image";
import { IoAdd } from "react-icons/io5";

export default function DonatedTickets({
  addTicket,
}: {
  addTicket: () => void;
}) {
  const tickets: { id: string | number; name: string }[] = [];
  return (
    <section className="space-y-6">
      {tickets.length === 0 ? (
        <div className="flex flex-col min-h-[60vh] items-center justify-center text-center px-4">
          <div className="w-32 h-32 bg-gray-50/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-gray-100 shadow-sm mb-8">
            <div className="relative w-16 h-16 opacity-20">
              <Image
                src={"/no-ticket.svg"}
                alt="No ticket"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <div className="max-w-md space-y-3 mb-8">
            <h3 className="text-2xl font-black text-[#1B1818] tracking-tight">No Donations Found</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
              Enable your community to support your work with digital donations. Click the &quot;Add Donated Ticket&quot; button to set up a contribution goal.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all active:scale-95">
              Learn More
            </button>
            <button
              onClick={addTicket}
              className="bg-[#EB5017] text-white px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-[#EB5017]/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <IoAdd className="text-lg" /> Add Donated Ticket
            </button>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
           {/* Placeholder for future donated tickets list */}
        </div>
      )}
    </section>
  );
}

