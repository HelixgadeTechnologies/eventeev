"use client";

import { useState, useEffect, use } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa6";
import { eventsService } from "@/lib/services/events.service";
import { attendeesService, ApiAttendee } from "@/lib/services/attendees.service";
import { Loader2, Printer, User, Mail, Calendar, CheckCircle, Clock, ScanLine } from "lucide-react";
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
        <div className="w-full max-w-sm mx-auto bg-transparent print:shadow-none print:border-2 print:border-black print:rounded-xl shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
          {/* Badge Header - Image and Title */}
          <div className="bg-white rounded-t-3xl p-2 pb-6 print:bg-white print:border-b-0">
            <div className="h-48 rounded-2xl w-full overflow-hidden relative print:hidden">
              {event.imageUrl ? (
                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-blue-500 to-yellow-400 opacity-90" />
                  <div className="absolute inset-0 flex justify-center items-end pb-4 space-x-2">
                     <div className="w-12 h-32 bg-gradient-to-t from-red-500 to-pink-500 rounded-full shadow-lg"></div>
                     <div className="w-16 h-24 bg-gradient-to-t from-blue-400 to-blue-200 rounded-full shadow-lg"></div>
                     <div className="w-12 h-40 bg-gradient-to-t from-yellow-400 to-orange-400 rounded-full shadow-lg"></div>
                  </div>
                </>
              )}
            </div>
            <h2 className="text-2xl font-black text-center mt-6 text-[#1B1818] tracking-tight print:text-3xl">
              {event.title}
            </h2>
            <h3 className="text-lg font-bold text-center text-gray-600 mt-1 print:text-xl">{attendee.name}</h3>
          </div>
          
          {/* Separator 1 */}
          <div className="h-8 bg-white flex items-center print:hidden">
            <div className="w-full border-t-2 border-dashed border-gray-200 mx-6" />
          </div>
          
          {/* Middle Body */}
          <div className="p-8 py-2 bg-white print:bg-white print:border-y print:border-dashed print:border-black">
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-gray-400 text-sm font-medium">Date</p>
                <p className="font-bold text-[#1B1818]">
                  {event.startDate ? new Date(event.startDate).toLocaleDateString() : 'TBA'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm font-medium">Time</p>
                <p className="font-bold text-[#1B1818]">
                  {event.startDate ? new Date(event.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'TBA'}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400 text-sm font-medium">Location</p>
                <p className="font-bold text-[#1B1818]">
                  {event.location || "Online"}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm font-medium">Type</p>
                <p className="font-bold text-[#1B1818]">
                  {attendee.status === "VIP" ? "VIP GUEST" : "GENERAL"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm font-medium">Status</p>
                <p className={`font-bold ${attendee.isCheckedIn ? 'text-green-600' : 'text-orange-500'}`}>
                  {attendee.isCheckedIn ? "Checked In" : "Pending"}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400 text-sm font-medium">Email</p>
                <p className="font-bold text-[#1B1818] truncate">
                  {attendee.email}
                </p>
              </div>
              <div className="col-span-2 text-center mt-2">
                <p className="text-gray-400 text-sm font-medium">Registered</p>
                <p className="font-bold text-[#1B1818]">
                  {(attendee.registrationDate || attendee.createdAt) ? new Date(attendee.registrationDate || attendee.createdAt!).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Separator 2 */}
          <div className="h-8 bg-white flex items-center print:hidden">
            <div className="w-full border-t-2 border-dashed border-gray-200 mx-6" />
          </div>

          {/* Bottom Barcode Area */}
          <div className="bg-white rounded-b-3xl p-6 pt-2 text-center print:bg-white print:border-t-0">
            <p className="text-gray-400 text-xs mb-4 font-mono tracking-widest">
              {attendee.id}
            </p>
            <div className="w-full flex flex-col items-center justify-center">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${attendee.id}`}
                alt={`QR Code for ${attendee.name}`}
                className="w-32 h-32 mx-auto"
              />
            </div>
          </div>
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
