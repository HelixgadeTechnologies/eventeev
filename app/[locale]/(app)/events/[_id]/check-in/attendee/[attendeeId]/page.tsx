"use client";

import { useState, useEffect, use } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa6";
import { eventsService } from "@/lib/services/events.service";
import { attendeesService, ApiAttendee } from "@/lib/services/attendees.service";
import { Loader2, Printer, User, Mail, Calendar, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface AttendeeBadgePageProps {
  params: Promise<{
    _id: string;
    attendeeId: string;
  }>;
}

export default function AttendeeBadgePage({ params }: AttendeeBadgePageProps) {
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
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Loading attendee information...</p>
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
          {error || "We encountered an issue retrieving the attendee information."}
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Non-printable Header */}
      <div className="print:hidden flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
        <div className="space-y-2">
          <Link 
            href={`/events/${_id}/check-in`}
            className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#EB5017] transition-all group"
          >
            <FaAngleLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
            Back to Check-in
          </Link>
          <div className="pt-2">
            <h1 className="text-4xl font-black text-[#1B1818] tracking-tight lowercase first-letter:uppercase">Attendee Info</h1>
            <p className="text-sm text-gray-400 font-medium mt-1">Reviewing details for <span className="text-[#1B1818] font-bold">{attendee.name}</span></p>
          </div>
        </div>
        
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 bg-[#EB5017] text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#d64815] transition-all shadow-sm hover:shadow-md group active:scale-95"
        >
          <Printer size={16} className="group-hover:scale-110 transition-transform" />
          Print Badge
        </button>
      </div>

      {/* Printable Badge Area */}
      <div className="flex justify-center mt-10 print:mt-0 print:p-0">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xl print:shadow-none print:border-2 print:border-black print:rounded-xl">
          {/* Badge Header - Event Name */}
          <div className="bg-[#1B1818] px-8 py-6 text-center print:bg-gray-100 print:text-black print:border-b-2 print:border-black">
            <h2 className="text-xl font-black text-white uppercase tracking-widest print:text-black">
              {event.title}
            </h2>
            <p className="text-[#EB5017] text-xs font-bold uppercase tracking-widest mt-2 print:text-gray-600">
              {event.startDate ? new Date(event.startDate).toLocaleDateString() : 'Event Date'}
            </p>
          </div>
          
          {/* Badge Body */}
          <div className="p-8 space-y-8 bg-white">
            <div className="text-center space-y-2">
              <h3 className="text-3xl font-black text-[#1B1818] tracking-tight uppercase print:text-4xl">
                {attendee.name}
              </h3>
              <p className="text-gray-500 font-bold text-sm tracking-wide">
                {attendee.status === "VIP" ? "VIP GUEST" : "GENERAL ADMISSION"}
              </p>
            </div>
            
            <div className="flex flex-col items-center justify-center pt-4 pb-2 border-t border-dashed border-gray-200 print:border-gray-400">
              <div className="w-32 h-32 bg-gray-50 border-2 border-gray-100 rounded-xl flex items-center justify-center p-2 mb-4 print:border-gray-300">
                {/* QR Placeholder since we don't have a specific QR generator library */}
                <div className="text-center">
                  <ScanLine size={48} className="mx-auto text-gray-300 print:text-gray-400" />
                  <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest mt-2">Scan to Verify</p>
                </div>
              </div>
              
              <div className="text-xs font-mono text-gray-400 tracking-widest">
                ID: {attendee.id.substring(0, 8).toUpperCase()}
              </div>
            </div>
            
            <div className="space-y-3 bg-gray-50 p-5 rounded-2xl print:bg-white print:border print:border-gray-200">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="text-gray-400" size={16} />
                <span className="font-medium text-[#1B1818]">{attendee.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="text-gray-400" size={16} />
                <span className="font-medium text-[#1B1818]">
                  Registered: {(attendee.registrationDate || attendee.createdAt) ? new Date(attendee.registrationDate || attendee.createdAt!).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                {attendee.isCheckedIn ? (
                  <>
                    <CheckCircle className="text-green-500" size={16} />
                    <span className="font-bold text-green-600 uppercase tracking-tight text-xs">Checked In</span>
                  </>
                ) : (
                  <>
                    <Clock className="text-orange-500" size={16} />
                    <span className="font-bold text-orange-600 uppercase tracking-tight text-xs">Pending Check-in</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-[#EB5017] h-4 w-full print:bg-black"></div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
          .print\\:flex {
            display: flex !important;
          }
          .print\\:bg-gray-100 {
            background-color: #f3f4f6 !important;
          }
          .print\\:text-black {
            color: #000 !important;
          }
          .print\\:border-black {
            border-color: #000 !important;
          }
          .print\\:bg-white {
            background-color: #fff !important;
          }
          .print\\:bg-black {
            background-color: #000 !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          
          /* Find the badge container and make it visible */
          .w-full.max-w-md {
            visibility: visible !important;
            position: absolute;
            left: 50%;
            top: 0;
            transform: translate(-50%, 0);
            margin: 0 !important;
          }
          .w-full.max-w-md * {
            visibility: visible;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}
