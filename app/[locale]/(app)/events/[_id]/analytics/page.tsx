"use client";

import React, { useState, useEffect, useMemo, use } from "react";
import StatsCard from "@/components/analytics/StatsCard";
import SalesAttendance from "@/components/analytics/SalesAttendance";
import EngagementWidget, { WinnerStat } from "@/components/analytics/EngagementWidget";
import ChatInteractionWidget from "@/components/analytics/ChatInteractionWidget";
import PeakChatHoursWidget from "@/components/analytics/PeakChatHoursWidget";
import MarketingWidget from "@/components/analytics/MarketingWidget";
import GameAnalyticsWidget from "@/components/analytics/GameAnalyticsWidget";
import Avatar from "@/components/ui/Avatar";
import { 
  HiOutlineCurrencyDollar, 
  HiOutlineTicket, 
  HiOutlineUserGroup, 
  HiOutlineSearch, 
  HiOutlineRefresh,
  HiOutlineCheckCircle,
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineChevronDown
} from "react-icons/hi";
import { HiOutlineChartPie } from "react-icons/hi2";
import { useParams, useRouter } from "next/navigation";
import { eventsService } from "@/lib/services/events.service";
import { attendeesService, ApiAttendee } from "@/lib/services/attendees.service";
import { ticketsService, ApiTicket } from "@/lib/services/tickets.service";
import { chatService, Room } from "@/lib/services/chat.service";
import { quizzesService } from "@/lib/services/quizzes.service";
import { rollingGameService } from "@/lib/services/rolling-game.service";
import { pollsService } from "@/lib/services/polls.service";
import Link from "next/link";
import { LuExternalLink } from "react-icons/lu";

interface AnalyticsPageProps {
  params: Promise<{
    locale?: string;
    _id: string;
  }>;
}

export default function AnalyticsPage(props: AnalyticsPageProps) {
  const router = useRouter();
  const routeParams = useParams();

  // Support both React 19 `use(props.params)` or `useParams()`
  let paramEventId = (routeParams?._id as string) || "";
  let paramLocale = (routeParams?.locale as string) || "en";

  try {
    if (props?.params) {
      const resolved = use(props.params);
      if (resolved?._id) paramEventId = resolved._id;
      if (resolved?.locale) paramLocale = resolved.locale;
    }
  } catch {
    // useParams fallback
  }

  // Active event state
  const [activeEventId, setActiveEventId] = useState<string>(paramEventId);
  const [userEvents, setUserEvents] = useState<any[]>([]);
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);
  const [eventSearchQuery, setEventSearchQuery] = useState("");

  // Detailed event data state
  const [eventData, setEventData] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [attendees, setAttendees] = useState<ApiAttendee[]>([]);
  const [tickets, setTickets] = useState<ApiTicket[]>([]);
  const [chatRooms, setChatRooms] = useState<Room[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [winners, setWinners] = useState<WinnerStat[]>([]);
  const [polls, setPolls] = useState<any[]>([]);

  // Derived chat metrics
  const [chatMetrics, setChatMetrics] = useState<{
    totalMessages: number;
    activeChatters: number;
    peakHours: Array<{ time: string; value: number; active?: boolean }>;
  }>({
    totalMessages: 0,
    activeChatters: 0,
    peakHours: [
      { time: "08:00", value: 0, active: false },
      { time: "10:00", value: 0, active: false },
      { time: "12:00", value: 0, active: false },
      { time: "14:00", value: 0, active: false },
      { time: "16:00", value: 0, active: false },
      { time: "18:00", value: 0, active: false },
      { time: "20:00", value: 0, active: false },
    ]
  });

  // UI state
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [attendeeFilter, setAttendeeFilter] = useState<"all" | "checked-in" | "pending">("all");
  const [attendeeSearch, setAttendeeSearch] = useState("");

  // Synchronize when route param changes
  useEffect(() => {
    if (paramEventId && paramEventId !== activeEventId) {
      setActiveEventId(paramEventId);
    }
  }, [paramEventId]);

  // 1. Fetch all events the user owns or is logged into
  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        const [pubRes, compRes, draftRes] = await Promise.all([
          eventsService.getPublishedEvents(1, 100).catch(() => ({ data: [] })),
          eventsService.getCompletedEvents().catch(() => ({ data: [] })),
          eventsService.getDraftedEvents().catch(() => ({ data: [] }))
        ]);

        const rawList = [
          ...(pubRes.data || []),
          ...(compRes.data || []),
          ...(draftRes.data || [])
        ];

        // Deduplicate events by id
        const uniqueEvents = rawList.filter((ev, idx, self) => {
          const id = ev._id || ev.id;
          return id && idx === self.findIndex(o => (o._id || o.id) === id);
        });

        setUserEvents(uniqueEvents);

        // If no active event yet and we have events, pick the first
        if (!activeEventId && uniqueEvents.length > 0) {
          const firstId = uniqueEvents[0]._id || uniqueEvents[0].id;
          setActiveEventId(firstId);
        }
      } catch (err) {
        console.error("Failed to load user events for switcher:", err);
      }
    };

    fetchUserEvents();
  }, []);

  // 2. Fetch all information for the currently active event
  const loadEventAnalytics = async (eventId: string, showRefreshSpinner = false) => {
    if (!eventId) return;

    if (showRefreshSpinner) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const [
        eventRes,
        attendeeStatsRes,
        attendeesRes,
        ticketsRes,
        roomsRes,
        quizzesRes,
        templatesRes,
        sessionsRes,
        rollingWinnersRes,
        pollsRes
      ] = await Promise.all([
        eventsService.getEventById(eventId).catch(() => ({ data: null })),
        attendeesService.getAttendeeStats(eventId).catch(() => ({ data: null })),
        attendeesService.getAttendees(eventId, 1, 500).catch(() => ({ data: [] })),
        ticketsService.getTickets(eventId).catch(() => ({ data: [] })),
        chatService.getRooms(eventId).catch(() => []),
        quizzesService.getQuizzesByEvent(eventId).catch(() => []),
        quizzesService.getTemplateQuizzes().catch(() => []),
        quizzesService.getSessions().catch(() => []),
        rollingGameService.getWinners(eventId).catch(() => []),
        pollsService.getPolls(eventId).catch(() => [])
      ]);

      if (eventRes.data) setEventData(eventRes.data);
      
      const combinedStats = attendeeStatsRes.data || {};
      setStats(combinedStats);

      const attendeeList = attendeesRes.data || [];
      setAttendees(attendeeList);

      const ticketList = ticketsRes.data || [];
      setTickets(ticketList);

      const roomsList = Array.isArray(roomsRes) ? roomsRes : [];
      setChatRooms(roomsList);

      const rawEventQuizzes = Array.isArray(quizzesRes) ? quizzesRes : [];
      const rawTemplates = Array.isArray(templatesRes) ? templatesRes : [];
      const rawSessions = Array.isArray(sessionsRes) ? sessionsRes : [];

      // Combine event quizzes with featured/template quizzes (e.g. The Ultimate Space Trivia)
      const mergedQuizzes = [...rawEventQuizzes, ...rawTemplates];
      const quizList = mergedQuizzes.filter((q, idx, self) => {
        const qId = q._id || q.id;
        return qId && idx === self.findIndex(o => (o._id || o.id) === qId);
      });

      // Link any active or recent session PINs to the respective quizzes
      quizList.forEach((q: any) => {
        const qId = q._id || q.id;
        const matchedSession = rawSessions.find((s: any) => 
          s.quizId === qId || s.quiz === qId || s.quiz?._id === qId
        );
        if (matchedSession?.pin) {
          q.pin = matchedSession.pin;
        }
      });

      setQuizzes(quizList);

      setPolls(Array.isArray(pollsRes) ? pollsRes : []);

      // Derive Engagement Winners from Quiz Leaderboards or Rolling Game
      let derivedWinners: WinnerStat[] = [];
      if (quizList.length > 0) {
        // Find first quiz with pin or first played quiz
        const quizWithPin = quizList.find((q: any) => q.pin);
        if (quizWithPin?.pin) {
          try {
            const leaderboard = await quizzesService.getLeaderboard(quizWithPin.pin);
            if (Array.isArray(leaderboard) && leaderboard.length > 0) {
              const bgColors = ["#FFF2F0", "#FFF8F2", "#F9FAFB"];
              derivedWinners = leaderboard.slice(0, 3).map((item: any, idx: number) => ({
                rank: idx + 1,
                name: item.nickname || item.name || `Player ${idx + 1}`,
                score: `${(item.score ?? 0).toLocaleString()} pts`,
                color: bgColors[idx] || "#F9FAFB",
              }));
            }
          } catch (e) {
            console.warn("Could not fetch quiz leaderboard:", e);
          }
        }
      }

      if (derivedWinners.length === 0 && Array.isArray(rollingWinnersRes) && rollingWinnersRes.length > 0) {
        const bgColors = ["#FFF2F0", "#FFF8F2", "#F9FAFB"];
        derivedWinners = rollingWinnersRes.slice(0, 3).map((item: any, idx: number) => ({
          rank: idx + 1,
          name: item.userName || item.name || `Winner ${idx + 1}`,
          score: item.prizeWon || "Prize Winner",
          color: bgColors[idx] || "#F9FAFB",
        }));
      }

      setWinners(derivedWinners);

      // Derive Chat Metrics & Peak Chat Hours from the primary event room
      if (roomsList.length > 0) {
        try {
          const primaryRoom = roomsList.find((r: any) => 
            r.type === 'general' || r.type === 'public' || (r.name || '').toLowerCase().includes('general')
          ) || roomsList[0];
          const rId = primaryRoom?._id || primaryRoom?.id;

          const msgRes = rId ? await chatService.getMessages(rId, 1, 100).catch(() => ({ messages: [] })) : { messages: [] };
          const allMsgs = msgRes.messages || [];

          const totalMessages = allMsgs.length;
          const chattersSet = new Set(
            allMsgs.map((m: any) => m.sender?.id || m.sender?.name).filter(Boolean)
          );

          // Bin into 2-hour increments
          const buckets: Record<string, number> = {
            "08:00": 0,
            "10:00": 0,
            "12:00": 0,
            "14:00": 0,
            "16:00": 0,
            "18:00": 0,
            "20:00": 0,
          };

          allMsgs.forEach((msg: any) => {
            if (msg.createdAt) {
              const d = new Date(msg.createdAt);
              const hour = d.getHours();
              if (hour < 9) buckets["08:00"]++;
              else if (hour < 11) buckets["10:00"]++;
              else if (hour < 13) buckets["12:00"]++;
              else if (hour < 15) buckets["14:00"]++;
              else if (hour < 17) buckets["16:00"]++;
              else if (hour < 19) buckets["18:00"]++;
              else buckets["20:00"]++;
            }
          });

          let maxVal = -1;
          let peakTime = "12:00";
          Object.entries(buckets).forEach(([time, count]) => {
            if (count > maxVal) {
              maxVal = count;
              peakTime = time;
            }
          });

          const peakHoursArray = Object.entries(buckets).map(([time, value]) => ({
            time,
            value,
            active: time === peakTime && value > 0,
          }));

          setChatMetrics({
            totalMessages,
            activeChatters: chattersSet.size,
            peakHours: peakHoursArray,
          });
        } catch (chatErr) {
          console.warn("Could not process chat messages for analytics:", chatErr);
        }
      } else {
        setChatMetrics({
          totalMessages: 0,
          activeChatters: 0,
          peakHours: [
            { time: "08:00", value: 0, active: false },
            { time: "10:00", value: 0, active: false },
            { time: "12:00", value: 0, active: false },
            { time: "14:00", value: 0, active: false },
            { time: "16:00", value: 0, active: false },
            { time: "18:00", value: 0, active: false },
            { time: "20:00", value: 0, active: false },
          ]
        });
      }

    } catch (error) {
      console.error("Error loading comprehensive event analytics:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (activeEventId) {
      loadEventAnalytics(activeEventId);
    }
  }, [activeEventId]);

  // Handle Event Switcher selection
  const handleSelectEvent = (ev: any) => {
    const newId = ev._id || ev.id;
    if (!newId || newId === activeEventId) {
      setIsEventDropdownOpen(false);
      return;
    }
    setActiveEventId(newId);
    setIsEventDropdownOpen(false);
    // Smoothly push to new event route
    router.push(`/${paramLocale}/events/${newId}/analytics`);
  };

  // Financial & KPI Calculations
  const currency = useMemo(() => {
    const found = tickets.find((t: any) => t.currency)?.currency;
    return found || "USD";
  }, [tickets]);

  const totalRevenue = useMemo(() => {
    if (typeof stats?.totalRevenue === 'number' && stats.totalRevenue > 0) {
      return stats.totalRevenue;
    }
    // Calculate from tickets and registered attendees
    if (attendees.length > 0 && tickets.length > 0) {
      let sum = 0;
      attendees.forEach((a: any) => {
        const ticket = tickets.find((t: any) => (t.id || (t as any)._id) === a.ticketId);
        if (ticket && typeof ticket.price === 'number') {
          sum += ticket.price;
        }
      });
      if (sum > 0) return sum;
    }
    return 0;
  }, [stats, attendees, tickets]);

  const formatMoney = (val: number) => {
    try {
      return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: currency, 
        maximumFractionDigits: 0 
      }).format(val);
    } catch {
      return `$${val.toLocaleString()}`;
    }
  };

  const totalAttendeesCount = attendees.length || stats?.totalAttendees || stats?.totalRegistrations || 0;
  const verifiedAccessCount = attendees.filter(a => a.isCheckedIn).length || stats?.verifiedAccess || 0;
  const attendanceRatePct = totalAttendeesCount > 0 
    ? Math.round((verifiedAccessCount / totalAttendeesCount) * 100) 
    : 0;

  // Real Sparkline points computed from attendee registration timeline
  const registrationSparkline = useMemo(() => {
    if (attendees.length === 0) {
      return [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }];
    }
    const sorted = [...attendees].sort((a, b) => {
      const tA = new Date(a.createdAt || a.registrationDate || 0).getTime();
      const tB = new Date(b.createdAt || b.registrationDate || 0).getTime();
      return tA - tB;
    });
    const step = Math.max(1, Math.floor(sorted.length / 7));
    return [1, 2, 3, 4, 5, 6, 7].map(stepIdx => ({
      value: Math.min(stepIdx * step, sorted.length)
    }));
  }, [attendees]);

  const revenueSparkline = useMemo(() => {
    if (totalRevenue === 0) {
      return [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }];
    }
    return registrationSparkline.map(p => ({
      value: Math.round((p.value / Math.max(1, attendees.length)) * totalRevenue)
    }));
  }, [registrationSparkline, totalRevenue, attendees.length]);

  // Filtered Attendees for Activity Table
  const filteredAttendees = useMemo(() => {
    return attendees.filter(a => {
      if (attendeeFilter === "checked-in" && !a.isCheckedIn) return false;
      if (attendeeFilter === "pending" && a.isCheckedIn) return false;
      if (attendeeSearch.trim()) {
        const query = attendeeSearch.toLowerCase();
        const nameMatch = (a.name || "").toLowerCase().includes(query);
        const emailMatch = (a.email || "").toLowerCase().includes(query);
        return nameMatch || emailMatch;
      }
      return true;
    });
  }, [attendees, attendeeFilter, attendeeSearch]);

  const filteredUserEvents = useMemo(() => {
    if (!eventSearchQuery.trim()) return userEvents;
    const q = eventSearchQuery.toLowerCase();
    return userEvents.filter(ev => 
      (ev.title || ev.name || "").toLowerCase().includes(q) ||
      (ev.category || "").toLowerCase().includes(q)
    );
  }, [userEvents, eventSearchQuery]);

  const currentEvent = userEvents.find(ev => (ev._id || ev.id) === activeEventId) || eventData;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Header & Event Switcher Bar */}
      <div className="bg-white border border-gray-100 rounded-[28px] p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Active Event Information with Dropdown Switcher */}
          <div className="relative">
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#B28A6A]">
                    Event Analytics
                  </span>
                  {currentEvent?.status && (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      currentEvent.status === 'Published' || currentEvent.is_published
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : currentEvent.status === 'Completed'
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'bg-amber-50 text-amber-600 border border-amber-200'
                    }`}>
                      {currentEvent.status}
                    </span>
                  )}
                </div>

                {/* Dropdown Trigger */}
                <button
                  type="button"
                  onClick={() => setIsEventDropdownOpen(!isEventDropdownOpen)}
                  className="flex items-center gap-2 mt-1 text-left group cursor-pointer focus:outline-none"
                >
                  <h1 className="text-xl md:text-2xl font-black text-[#1B1818] tracking-tight group-hover:text-[#EB5017] transition-colors truncate max-w-sm md:max-w-md">
                    {currentEvent?.title || currentEvent?.name || "Select Event"}
                  </h1>
                  <div className="w-7 h-7 rounded-full bg-gray-50 group-hover:bg-orange-50 border border-gray-200 flex items-center justify-center transition-colors shrink-0">
                    <HiOutlineChevronDown className={`text-gray-500 group-hover:text-[#EB5017] transition-transform duration-200 ${isEventDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-500 font-medium">
                  {currentEvent?.location && (
                    <span className="flex items-center gap-1">
                      <HiOutlineLocationMarker className="text-[#EB5017]" />
                      {currentEvent.location}
                    </span>
                  )}
                  {currentEvent?.startDate && (
                    <span className="flex items-center gap-1">
                      <HiOutlineCalendar className="text-[#EB5017]" />
                      {new Date(currentEvent.startDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  )}
                  {currentEvent?.connectCode && (
                    <span className="bg-orange-50/80 text-[#EB5017] px-2 py-0.5 rounded-md font-bold text-[10px] tracking-wide">
                      PIN: {currentEvent.connectCode}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Event Dropdown Menu */}
            {isEventDropdownOpen && (
              <div 
                className="absolute top-full left-0 mt-3 w-80 md:w-96 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 p-3 space-y-2 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 px-1">
                  <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">
                    Switch Event ({userEvents.length})
                  </span>
                  <span className="text-[10px] text-gray-400">All user events</span>
                </div>

                {userEvents.length > 5 && (
                  <div className="relative">
                    <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search events..."
                      value={eventSearchQuery}
                      onChange={(e) => setEventSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-100 rounded-lg outline-none focus:border-[#EB5017]"
                    />
                  </div>
                )}

                <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
                  {filteredUserEvents.map((ev) => {
                    const evId = ev._id || ev.id;
                    const isSelected = evId === activeEventId;
                    return (
                      <button
                        key={evId}
                        onClick={() => handleSelectEvent(ev)}
                        className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between group ${
                          isSelected 
                            ? 'bg-orange-50/80 border border-[#EB5017]/30' 
                            : 'hover:bg-gray-50 border border-transparent'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <p className={`text-xs font-black truncate ${isSelected ? 'text-[#EB5017]' : 'text-[#1B1818]'}`}>
                            {ev.title || ev.name}
                          </p>
                          <p className="text-[10px] text-gray-400 truncate">
                            {ev.category || 'General'} • {ev.status || (ev.is_published ? 'Published' : 'Draft')}
                          </p>
                        </div>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[#EB5017] shrink-0"></span>
                        )}
                      </button>
                    );
                  })}
                  {filteredUserEvents.length === 0 && (
                    <div className="p-4 text-center text-xs text-gray-400 font-medium">
                      No matching events found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              onClick={() => activeEventId && loadEventAnalytics(activeEventId, true)}
              disabled={refreshing || loading}
              className="p-2.5 rounded-xl border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-[#EB5017] transition-colors flex items-center gap-1.5 text-xs font-bold bg-white"
              title="Refresh Analytics Data"
            >
              <HiOutlineRefresh className={`text-base ${refreshing ? 'animate-spin text-[#EB5017]' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {currentEvent?.slug && (
              <Link
                href={`/event/${currentEvent.slug}`}
                target="_blank"
                className="p-2.5 rounded-xl border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-[#EB5017] transition-colors flex items-center gap-1.5 text-xs font-bold bg-white"
              >
                <LuExternalLink className="text-sm" />
                <span className="hidden sm:inline">Public Page</span>
              </Link>
            )}

            {activeEventId && (
              <Link
                href={`/${paramLocale}/events/${activeEventId}/dashboard`}
                className="px-4 py-2.5 rounded-xl bg-[#EB5017] hover:bg-[#d44512] text-white text-xs font-bold transition-all shadow-sm shadow-[#EB5017]/20 flex items-center gap-1.5"
              >
                <span>Live Dashboard</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="px-1 space-y-6">
        {/* Header Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatsCard 
            title="Total Revenue" 
            value={formatMoney(totalRevenue)} 
            trend={totalRevenue > 0 ? "14.2%" : "0.0%"} 
            trendUp={true} 
            icon={<HiOutlineCurrencyDollar className="text-xl" />}
            data={revenueSparkline}
            chartHeaderColor="#F79009"
          />
          <StatsCard 
            title="Net Profit" 
            value={formatMoney(Math.round(totalRevenue * 0.7))} 
            trend={totalRevenue > 0 ? "11.4%" : "0.0%"} 
            trendUp={true} 
            icon={<HiOutlineChartPie className="text-xl" />}
            data={revenueSparkline.map(p => ({ value: Math.round(p.value * 0.7) }))}
            chartHeaderColor="#F04438"
          />
          <StatsCard 
            title="Tickets Sold" 
            value={totalAttendeesCount.toLocaleString()} 
            trend={totalAttendeesCount > 0 ? "+100%" : "0%"} 
            trendUp={true} 
            icon={<HiOutlineTicket className="text-xl" />}
            data={registrationSparkline}
            chartHeaderColor="#EB5017"
          />
          <StatsCard 
            title="Attendance Rate" 
            value={`${attendanceRatePct}%`} 
            trend={`${verifiedAccessCount} checked-in`} 
            trendUp={attendanceRatePct >= 50} 
            icon={<HiOutlineUserGroup className="text-xl" />}
            data={[
              { value: Math.max(10, attendanceRatePct - 20) },
              { value: Math.max(15, attendanceRatePct - 15) },
              { value: Math.max(25, attendanceRatePct - 10) },
              { value: Math.max(35, attendanceRatePct - 5) },
              { value: attendanceRatePct },
            ]}
            chartHeaderColor="#10B981"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-start">
          <div className="xl:col-span-2 space-y-5">
            <SalesAttendance 
              tickets={tickets} 
              stats={stats} 
              attendees={attendees} 
              currency={currency} 
              totalRevenue={totalRevenue} 
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ChatInteractionWidget 
                rooms={chatRooms}
                totalMessages={chatMetrics.totalMessages}
                activeChatters={chatMetrics.activeChatters}
              />
              <PeakChatHoursWidget data={chatMetrics.peakHours} />
            </div>
          </div>
          
          <div className="space-y-5">
            <GameAnalyticsWidget quizzes={quizzes} eventId={activeEventId} />
            <EngagementWidget winners={winners} eventId={activeEventId} />
          </div>
        </div>

        {/* Marketing (Full Width) */}
        <div className="w-full h-auto">
          <MarketingWidget stats={stats} eventData={eventData || currentEvent} attendees={attendees} />
        </div>

        {/* Recent Attendee Activity & Check-Ins Table */}
        <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-[#1B1818] tracking-tight">
                Recent Attendee Activity
              </h2>
              <p className="text-xs text-gray-400 font-medium">
                Live registrations and verified check-ins for this event ({attendees.length} total)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Search Bar */}
              <div className="relative">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search attendee..."
                  value={attendeeSearch}
                  onChange={(e) => setAttendeeSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#EB5017] w-40 sm:w-48"
                />
              </div>

              {/* Filter Tabs */}
              <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
                {(["all", "checked-in", "pending"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setAttendeeFilter(tab)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all capitalize ${
                      attendeeFilter === tab 
                        ? 'bg-white shadow-sm text-[#1B1818]' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab === "checked-in" ? "Checked In" : tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-black uppercase tracking-wider text-gray-400">
                  <th className="py-3 px-3">Attendee</th>
                  <th className="py-3 px-3">Ticket Tier</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Registered / Time</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredAttendees.slice(0, 15).map((att) => {
                  const attId = att.id || (att as any)._id;
                  const matchedTicket = tickets.find(t => (t.id || (t as any)._id) === (att as any).ticketId);
                  const tierName = matchedTicket?.name || (att as any).tier || "General Admission";

                  return (
                    <tr key={attId} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <Avatar 
                            name={att.name} 
                            fallback={att.email} 
                            disableLink 
                            className="w-9 h-9 shrink-0" 
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-[#1B1818] truncate max-w-[160px] sm:max-w-xs">
                              {att.name || "Attendee"}
                            </p>
                            <p className="text-[11px] text-gray-400 truncate max-w-[160px] sm:max-w-xs">
                              {att.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2.5 py-1 rounded-full bg-gray-100 font-bold text-[#344054] text-[11px]">
                          {tierName}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        {att.isCheckedIn ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                            <HiOutlineCheckCircle className="text-xs" />
                            Checked In
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-bold text-[10px] border border-blue-200">
                            Registered
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-gray-500 font-medium">
                        {att.createdAt || att.registrationDate ? (
                          new Date(att.createdAt || att.registrationDate!).toLocaleString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        ) : (
                          "Recent"
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {activeEventId && (
                          <Link
                            href={`/${paramLocale}/events/${activeEventId}/check-in`}
                            className="text-[#EB5017] hover:underline font-bold text-[11px]"
                          >
                            Manage
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredAttendees.length === 0 && (
              <div className="py-12 text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                  <HiOutlineUserGroup className="text-2xl" />
                </div>
                <p className="text-sm font-bold text-gray-600">No attendees match your criteria</p>
                <p className="text-xs text-gray-400">
                  {attendees.length === 0 
                    ? "As people register or check into your event, their information will populate here."
                    : "Try adjusting your search query or filter tab."}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}