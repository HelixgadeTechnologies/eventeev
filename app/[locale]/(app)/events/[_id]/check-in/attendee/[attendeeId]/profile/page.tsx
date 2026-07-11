"use client";

import { useState, useEffect, use } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa6";
import { eventsService } from "@/lib/services/events.service";
import { attendeesService, ApiAttendee } from "@/lib/services/attendees.service";
import { Loader2, Mail, Calendar, CheckCircle, Clock, User, Tag, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Avatar from "@/components/ui/Avatar";

interface AttendeeProfilePageProps {
  params: Promise<{
    _id: string;
    attendeeId: string;
  }>;
}

export default function AttendeeProfilePage({ params }: AttendeeProfilePageProps) {
  const { _id, attendeeId } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  
  const [event, setEvent] = useState<any>(null);
  const [attendee, setAttendee] = useState<ApiAttendee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        
        // Fetch event details
        const { data: eventData, error: eventError } = await eventsService.getEventById(_id);
        if (eventError) {
          setError(eventError.message || "Event Not Found");
          setLoading(false);
          return;
        }

        // Verify ownership
        const eventOwnerId = typeof eventData?.userId === 'object' ? (eventData.userId?.id || eventData.userId?._id) : eventData?.userId;
        const isOwner = eventOwnerId === user?.id || eventOwnerId === user?._id;

        if (!isOwner) {
          setError("Event Not Found");
          setLoading(false);
          return;
        }
        setEvent(eventData);

        // Fetch all attendees and find the specific one
        const { data: attendeesData, error: attendeesError } = await attendeesService.getAttendees(_id);
        if (attendeesError) {
          setError(attendeesError.message || "Failed to load attendees");
          setLoading(false);
          return;
        }

        const foundAttendee = attendeesData.find((a) => a.id === attendeeId);
        if (!foundAttendee) {
          setError("Attendee not found in this event");
          setLoading(false);
          return;
        }

        setAttendee(foundAttendee);
      } catch (err) {
        setError("Connection Issue");
      } finally {
        setLoading(false);
      }
    };

    if (_id && attendeeId) {
      fetchData();
    }
  }, [_id, attendeeId, user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-[#EB5017] animate-spin" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Loading profile...</p>
      </div>
    );
  }

  if (error || !event || !attendee) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <h2 className="text-3xl font-black text-[#1B1818] tracking-tight">
          {error === "Event Not Found" ? "Event Not Found" : "Error"}
        </h2>
        <p className="text-gray-400 font-medium max-w-sm mx-auto uppercase text-[10px] tracking-widest leading-relaxed">
          {error || "We encountered an issue retrieving the profile information."}
        </p>
        <button 
          onClick={() => router.back()}
          className="bg-[#eb5017] text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-[#eb5017]/20 transition-all hover:scale-105 active:scale-95"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 mt-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
        <div className="space-y-2">
          <Link 
            href={`/events/${_id}/check-in`}
            className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#EB5017] transition-all group"
          >
            <FaAngleLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
            Back to Check-in
          </Link>
          <div className="pt-2">
            <h1 className="text-4xl font-black text-[#1B1818] tracking-tight lowercase first-letter:uppercase">Attendee Profile</h1>
            <p className="text-sm text-gray-400 font-medium mt-1">Viewing details for <span className="text-[#1B1818] font-bold">{attendee.name}</span></p>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        
        {/* Left Column: Avatar & Quick Info */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center text-center">
            <div className="w-32 h-32 mb-6 shadow-xl rounded-full overflow-hidden border-4 border-white ring-4 ring-gray-50">
              <Avatar name={attendee.name} size={128} />
            </div>
            <h2 className="text-2xl font-black text-[#1B1818] tracking-tight">{attendee.name}</h2>
            <p className="text-sm text-gray-500 font-medium mt-2">{attendee.email}</p>
            
            <div className="mt-8 w-full space-y-3">
              <div className={`w-full py-3 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest ${attendee.isCheckedIn ? 'bg-[#0F973D]/10 text-[#0F973D]' : 'bg-orange-50 text-orange-600'}`}>
                {attendee.isCheckedIn ? (
                  <><CheckCircle size={16} /> Checked In</>
                ) : (
                  <><Clock size={16} /> Pending Check-in</>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="text-lg font-black text-[#1B1818] uppercase tracking-tight mb-6 flex items-center gap-2">
              <User className="text-[#EB5017]" size={20} />
              Personal Details
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</p>
                <p className="text-[#1B1818] font-bold">{attendee.name}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                <p className="text-[#1B1818] font-bold">{attendee.email}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Registration Date</p>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-gray-400" />
                  <p className="text-[#1B1818] font-bold">
                    {(attendee.registrationDate || attendee.createdAt) ? new Date(attendee.registrationDate || attendee.createdAt!).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Attendee ID</p>
                <p className="text-[#1B1818] font-mono text-xs bg-gray-50 px-3 py-1.5 rounded-lg inline-block">{attendee.id}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="text-lg font-black text-[#1B1818] uppercase tracking-tight mb-6 flex items-center gap-2">
              <ShieldCheck className="text-[#EB5017]" size={20} />
              Event Access
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ticket Type</p>
                <div className="flex items-center gap-2">
                  <Tag size={14} className="text-gray-400" />
                  <p className="text-[#1B1818] font-bold">{attendee.status === "VIP" ? "VIP Access" : "General Admission"}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Event Name</p>
                <p className="text-[#1B1818] font-bold">{event.title}</p>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
              <Link
                href={`/events/${_id}/check-in/attendee/${attendeeId}`}
                className="bg-[#EB5017] text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#d64815] transition-all shadow-sm hover:shadow-md active:scale-95 inline-flex items-center gap-2"
              >
                View Print Badge
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
