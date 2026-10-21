"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  HiOutlineChevronDown, 
  HiOutlineTrophy, 
  HiOutlineUserGroup, 
  HiOutlineClock,
  HiOutlinePlay,
  HiOutlineSparkles,
  HiOutlineQuestionMarkCircle
} from "react-icons/hi2";
import { quizzesService } from "@/lib/services/quizzes.service";
import { useParams } from "next/navigation";
import Avatar from "@/components/ui/Avatar";
import Link from "next/link";

interface GameAnalyticsWidgetProps {
  quizzes?: any[];
  eventId?: string;
}

export default function GameAnalyticsWidget({ 
  quizzes: propQuizzes, 
  eventId: propEventId 
}: GameAnalyticsWidgetProps = {}) {
  const params = useParams();
  const eventId = propEventId || (params?._id as string);
  const [internalQuizzes, setInternalQuizzes] = useState<any[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string>("");
  const [activePin, setActivePin] = useState<string>("");
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [quizDetails, setQuizDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 1. Fetch quizzes (both event-specific and template quizzes like The Ultimate Space Trivia)
  useEffect(() => {
    let isMounted = true;

    const loadAllQuizzes = async () => {
      try {
        const [eventQuizzes, templateQuizzes, sessions] = await Promise.all([
          eventId ? quizzesService.getQuizzesByEvent(eventId).catch(() => []) : Promise.resolve([]),
          quizzesService.getTemplateQuizzes().catch(() => []),
          quizzesService.getSessions().catch(() => [])
        ]);

        const combined = [...(Array.isArray(eventQuizzes) ? eventQuizzes : []), ...(Array.isArray(templateQuizzes) ? templateQuizzes : [])];
        const unique = combined.filter((q, idx, self) => {
          const qId = q._id || q.id;
          return qId && idx === self.findIndex(o => (o._id || o.id) === qId);
        });

        // Link sessions
        unique.forEach((q: any) => {
          const qId = q._id || q.id;
          const match = Array.isArray(sessions) ? sessions.find((s: any) => 
            s.quizId === qId || s.quiz === qId || s.quiz?._id === qId
          ) : null;
          if (match?.pin) {
            q.pin = match.pin;
          }
        });

        if (isMounted) {
          setInternalQuizzes(unique);

          // If no selected quiz yet, pick the best default (e.g. Space Trivia or first with pin/session)
          if (!selectedQuizId && unique.length > 0) {
            const spaceTrivia = unique.find(q => (q.title || "").toLowerCase().includes("space trivia"));
            const firstWithPin = unique.find(q => q.pin);
            const defaultQuiz = spaceTrivia || firstWithPin || unique[0];
            setSelectedQuizId(defaultQuiz._id || defaultQuiz.id);
          }
        }
      } catch (err) {
        console.error("Failed to load quizzes for game analytics:", err);
      }
    };

    if (propQuizzes && propQuizzes.length > 0) {
      // Ensure templates like Space Trivia are present in propQuizzes if missing
      const hasSpaceTrivia = propQuizzes.some(q => (q.title || "").toLowerCase().includes("space trivia"));
      if (!hasSpaceTrivia) {
        quizzesService.getTemplateQuizzes().then(templates => {
          if (Array.isArray(templates) && isMounted) {
            const combined = [...propQuizzes, ...templates];
            const unique = combined.filter((q, idx, self) => {
              const qId = q._id || q.id;
              return qId && idx === self.findIndex(o => (o._id || o.id) === qId);
            });
            setInternalQuizzes(unique);
            if (!selectedQuizId && unique.length > 0) {
              const spaceTrivia = unique.find(q => (q.title || "").toLowerCase().includes("space trivia"));
              const firstWithPin = unique.find(q => q.pin);
              const defaultQuiz = spaceTrivia || firstWithPin || unique[0];
              setSelectedQuizId(defaultQuiz._id || defaultQuiz.id);
            }
          }
        }).catch(() => {});
      } else {
        setInternalQuizzes(propQuizzes);
        if (!selectedQuizId && propQuizzes.length > 0) {
          const spaceTrivia = propQuizzes.find(q => (q.title || "").toLowerCase().includes("space trivia"));
          const firstWithPin = propQuizzes.find(q => q.pin);
          const defaultQuiz = spaceTrivia || firstWithPin || propQuizzes[0];
          setSelectedQuizId(defaultQuiz._id || defaultQuiz.id);
        }
      }
    } else {
      loadAllQuizzes();
    }

    return () => {
      isMounted = false;
    };
  }, [eventId, propQuizzes]);

  const quizzes = useMemo(() => {
    return internalQuizzes.length > 0 ? internalQuizzes : (propQuizzes || []);
  }, [internalQuizzes, propQuizzes]);

  // 2. Fetch Leaderboard and Full Details for the Selected Quiz
  useEffect(() => {
    if (!selectedQuizId) {
      setLeaderboard([]);
      setQuizDetails(null);
      setActivePin("");
      return;
    }

    let isMounted = true;
    setLoading(true);

    const fetchGameData = async () => {
      try {
        const quizObj = quizzes.find(q => (q._id || q.id) === selectedQuizId);
        
        // Resolve PIN from multiple fallback sources:
        // 1. quiz.pin
        // 2. localStorage quiz_session_${selectedQuizId}
        // 3. localStorage eventeev_quiz_pins dictionary
        // 4. localStorage last_active_quiz_pin
        let resolvedPin = quizObj?.pin || "";
        if (!resolvedPin && typeof window !== "undefined") {
          try {
            resolvedPin = localStorage.getItem(`quiz_session_${selectedQuizId}`) || "";
            if (!resolvedPin) {
              const pinDict = JSON.parse(localStorage.getItem("eventeev_quiz_pins") || "{}");
              resolvedPin = pinDict[selectedQuizId] || "";
            }
            if (!resolvedPin) {
              resolvedPin = localStorage.getItem("last_active_quiz_pin") || "";
            }
          } catch (_) {}
        }

        if (isMounted) {
          setActivePin(resolvedPin);
        }

        // Fetch full quiz details (questions count, category, description)
        let fullQuiz = quizObj;
        if (!fullQuiz?.questions || fullQuiz.questions.length === 0) {
          try {
            const fetched = await quizzesService.getQuiz(selectedQuizId);
            if (fetched) fullQuiz = fetched;
          } catch (_) {}
        }
        if (isMounted) {
          setQuizDetails(fullQuiz);
        }

        // Fetch leaderboard if PIN is available
        let players: any[] = [];
        if (resolvedPin) {
          try {
            const lbData = await quizzesService.getLeaderboard(resolvedPin);
            if (Array.isArray(lbData) && lbData.length > 0) {
              players = lbData;
              if (typeof window !== "undefined") {
                try {
                  localStorage.setItem(`eventeev_leaderboard_${selectedQuizId}`, JSON.stringify(lbData));
                  localStorage.setItem(`eventeev_leaderboard_${resolvedPin}`, JSON.stringify(lbData));
                } catch (_) {}
              }
            }
          } catch (e) {
            console.warn(`Could not fetch live leaderboard for PIN ${resolvedPin}:`, e);
          }
        }

        // Check cached leaderboard if live query was empty
        if (players.length === 0 && typeof window !== "undefined") {
          try {
            const cached = JSON.parse(localStorage.getItem(`eventeev_leaderboard_${selectedQuizId}`) || "[]");
            if (Array.isArray(cached) && cached.length > 0) {
              players = cached;
            }
          } catch (_) {}
        }

        if (isMounted) {
          setLeaderboard(players);
        }
      } catch (err) {
        console.error("Error fetching game performance data:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchGameData();

    return () => {
      isMounted = false;
    };
  }, [selectedQuizId, quizzes]);

  const currentQuiz = quizDetails || quizzes.find(q => (q._id || q.id) === selectedQuizId);
  const questionsCount = currentQuiz?.questions?.length || 0;
  const totalPossiblePoints = useMemo(() => {
    if (!currentQuiz?.questions) return 0;
    return currentQuiz.questions.reduce((sum: number, q: any) => sum + (q.points || 1000), 0);
  }, [currentQuiz]);

  const avgScore = leaderboard.length > 0
    ? Math.round(leaderboard.reduce((acc, p) => acc + (p.score || 0), 0) / leaderboard.length)
    : 0;

  const topScore = leaderboard.length > 0 ? (leaderboard[0]?.score || 0) : 0;

  return (
    <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm space-y-6">
      
      {/* Header with Title and Game Selector Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-black text-[#1B1818] tracking-tight">Game Performance</h3>
          <p className="text-[11px] text-gray-400 font-medium">
            Trivia quizzes and live session analytics
          </p>
        </div>

        <div className="relative">
          <select 
            value={selectedQuizId}
            onChange={(e) => setSelectedQuizId(e.target.value)}
            className="appearance-none bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 pr-10 text-xs font-bold text-[#1B1818] outline-none focus:border-[#EB5017] transition-all cursor-pointer min-w-[210px] max-w-[260px] truncate"
          >
            {quizzes.map((quiz) => {
              const qId = quiz._id || quiz.id;
              const isSpace = (quiz.title || "").toLowerCase().includes("space");
              return (
                <option key={qId} value={qId}>
                  {quiz.title} {isSpace ? "🚀" : quiz.category ? `(${quiz.category})` : ""}
                </option>
              );
            })}
            {quizzes.length === 0 && <option value="">No games found</option>}
          </select>
          <HiOutlineChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EB5017]"></div>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Loading Game Data...</p>
        </div>
      ) : (
        <>
          {/* Active Game Info Banner */}
          {currentQuiz && (
            <div className="bg-gradient-to-r from-orange-50/60 to-amber-50/40 border border-orange-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-black text-[#1B1818] text-sm truncate max-w-xs">
                    {currentQuiz.title}
                  </span>
                  {currentQuiz.category && (
                    <span className="px-2 py-0.5 rounded-full bg-white text-[#EB5017] font-black text-[9px] uppercase tracking-wider border border-orange-200 shrink-0">
                      {currentQuiz.category}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 line-clamp-1">
                  {currentQuiz.description || "Interactive event trivia game session"}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {activePin ? (
                  <span className="px-3 py-1 rounded-full bg-white text-emerald-700 font-bold text-xs border border-emerald-200 flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>PIN: {activePin}</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-white/80 text-gray-500 font-bold text-[10px] border border-gray-200">
                    Ready to Play
                  </span>
                )}

                {eventId && (
                  <Link
                    href={`/events/${eventId}/games/${selectedQuizId}`}
                    className="px-3 py-1 rounded-full bg-[#EB5017] hover:bg-[#d44512] text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <HiOutlinePlay className="text-xs" />
                    <span>Host Game</span>
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Top 3 Players / Leaderboard */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#EB5017]">
                <HiOutlineTrophy className="text-xl" />
                <span className="text-[10px] font-black uppercase tracking-widest">Top Players</span>
              </div>
              {leaderboard.length > 0 && (
                <span className="text-xs text-gray-400 font-bold">
                  {leaderboard.length} {leaderboard.length === 1 ? "Participant" : "Participants"}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3">
              {leaderboard.length > 0 ? (
                leaderboard.slice(0, 3).map((player, index) => (
                  <div 
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      index === 0 
                        ? "bg-[#FFF2F0] border-[#EB5017]/30 shadow-sm" 
                        : "bg-white border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`text-base font-black shrink-0 ${index === 0 ? "text-[#EB5017]" : "text-gray-400"}`}>
                        #{index + 1}
                      </span>
                      <Avatar 
                        name={player.nickname || player.name} 
                        fallback={`P${index + 1}`} 
                        disableLink 
                        className="w-10 h-10 shrink-0" 
                      />
                      <div className="min-w-0">
                        <p className="font-black text-[#1B1818] text-sm truncate max-w-[140px] sm:max-w-xs">
                          {player.nickname || player.name || `Player ${index + 1}`}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          {player.correctAnswers !== undefined ? `${player.correctAnswers} Correct` : "Verified Participant"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-black text-[#1B1818] text-base">
                        {(player.score ?? 0).toLocaleString()}
                      </p>
                      <p className="text-[10px] font-bold text-[#EB5017] uppercase tracking-wider">Points</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 px-4 bg-gray-50/70 rounded-2xl border border-dashed border-gray-200 space-y-3">
                  <div className="w-10 h-10 mx-auto rounded-full bg-orange-50 flex items-center justify-center text-[#EB5017]">
                    <HiOutlineSparkles className="text-xl" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1B1818]">
                      {currentQuiz?.title || "Game"} is ready to play
                    </p>
                    <p className="text-[11px] text-gray-400 max-w-xs mx-auto mt-0.5">
                      {activePin 
                        ? `Live session created with PIN ${activePin}. Attendees can join now to compete.`
                        : "Host a live game with attendees to track scores, answers, and live leaderboard rankings."}
                    </p>
                  </div>
                  {eventId && (
                    <Link
                      href={`/events/${eventId}/games/${selectedQuizId}`}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#EB5017] hover:bg-[#d44512] text-white text-xs font-bold transition-all shadow-sm shadow-[#EB5017]/20"
                    >
                      <HiOutlinePlay className="text-xs" />
                      <span>Start Game Session</span>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-0.5">
              <div className="flex items-center gap-1.5 text-gray-400">
                <HiOutlineUserGroup className="text-base" />
                <span className="text-[9px] font-black uppercase tracking-widest">Players</span>
              </div>
              <p className="text-lg font-black text-[#1B1818]">{leaderboard.length}</p>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-0.5">
              <div className="flex items-center gap-1.5 text-gray-400">
                <HiOutlineClock className="text-base" />
                <span className="text-[9px] font-black uppercase tracking-widest">Avg. Score</span>
              </div>
              <p className="text-lg font-black text-[#1B1818]">{avgScore.toLocaleString()}</p>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-0.5">
              <div className="flex items-center gap-1.5 text-gray-400">
                <HiOutlineQuestionMarkCircle className="text-base" />
                <span className="text-[9px] font-black uppercase tracking-widest">Questions</span>
              </div>
              <p className="text-lg font-black text-[#1B1818]">{questionsCount || 3}</p>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-0.5">
              <div className="flex items-center gap-1.5 text-gray-400">
                <HiOutlineTrophy className="text-base text-amber-500" />
                <span className="text-[9px] font-black uppercase tracking-widest">Top Score</span>
              </div>
              <p className="text-lg font-black text-[#EB5017]">
                {topScore > 0 ? topScore.toLocaleString() : (totalPossiblePoints > 0 ? `${totalPossiblePoints.toLocaleString()} max` : "0")}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
