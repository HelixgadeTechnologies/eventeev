import Speakers from "@/components/speakers";
import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa6";

export default function SpeakersPage({ params }: { params: { _id: string } }) {
  const { _id } = params;
  return (
    <div className="space-y-10 pb-20">
      <div className="w-full flex justify-start px-2">
        <Link 
            href={`/events/${_id}/dashboard`} 
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

