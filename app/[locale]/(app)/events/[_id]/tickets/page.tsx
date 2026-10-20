import TicketParentSwitcher from "./parent-switcher"
import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa6";

export const metadata = {
    title: "Tickets - Eventeev",
    description: "Add tickets based on ticket type for your event."
}

interface TicketsPageProps {
    params: Promise<{
        _id: string;
        locale?: string;
    }>;
}

export default async function Tickets({ params }: TicketsPageProps) {
    const resolvedParams = await params;
    const _id = resolvedParams?._id;
    const dashboardHref = _id ? `/events/${_id}/dashboard` : "/dashboard";

    return (
        <div className="space-y-10">
            {/* Premium Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
                <div className="space-y-2">
                    <Link 
                        href={dashboardHref} 
                        className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#EB5017] transition-colors group"
                    >
                        <FaAngleLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>

                </div>
            </div>

            <TicketParentSwitcher />
        </div>
    );
}