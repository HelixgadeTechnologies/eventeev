import Speakers from "@/components/speakers";
import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa6";

interface SpeakersPageProps {
  params: Promise<{
    _id: string;
    locale?: string;
  }>;
}

export default async function SpeakersPage({ params }: SpeakersPageProps) {
  const resolvedParams = await params;
  const _id = resolvedParams?._id;
  const dashboardHref = _id ? `/events/${_id}/dashboard` : "/dashboard";

  return (
    <div className="space-y-10 pb-20">
      <div className="w-full flex justify-start px-2">
        <Link 
            href={dashboardHref} 
            className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#EB5017] transition-all group"
        >
            <FaAngleLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
        </Link>
      </div>

      <Speakers />
    </div>
  );
}

