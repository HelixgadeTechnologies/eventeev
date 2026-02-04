import TicketParentSwitcher from "./parent-switcher"
import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa6";

export const metadata = {
    title: "Tickets - Eventeev",
    description: "Add tickets based on ticket type for your event."
}

export default function Tickets() {
    return (
        <div className="space-y-10">
            {/* Premium Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
                <div className="space-y-2">
                    <Link 
                        href="../dashboard" 
                        className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#EB5017] transition-colors group"
                    >
                        <FaAngleLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-[#EB5017] uppercase tracking-[0.2em]">Ticketing Engine</p>
                        <h1 className="text-4xl font-black text-[#1B1818] tracking-tighter">Access Passports</h1>
                    </div>
                </div>
            </div>

            <TicketParentSwitcher />
        </div>
    );
}