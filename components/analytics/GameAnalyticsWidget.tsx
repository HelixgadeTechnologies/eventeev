"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  HiOutlineChevronDown, 
  HiOutlineTrophy, 
  HiOutlineUserGroup, 
  HiOutlineClock,
  HiOutlinePlay,
  HiOutlineSparkles,
  HiOutlineQuestionMarkCircle,
  HiOutlineCheckCircle,
  HiOutlineFire,
  HiOutlineChartBar,
  HiOutlineChevronUp
} from "react-icons/hi2";
import { FaCrown, FaMedal } from "react-icons/fa6";
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
  const [showQuestions, setShowQuestions] = useState(false);

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

        const combined = [
          ...(Array.isArray(eventQuizzes) ? eventQuizzes : []), 
          ...(Array.isArray(templateQuizzes) ? templateQuizzes : [])
        ];
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

        // Sort descending by score
        players.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

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
  const questionsList: any[] = currentQuiz?.questions || [];
  const questionsCount = questionsList.length;

  const totalPossiblePoints = useMemo(() => {
    if (!questionsList.length) return 0;
    return questionsList.reduce((sum: number, q: any) => sum + (q.points || 1000), 0);
  }, [questionsList]);

  const avgScore = leaderboard.length > 0
    ? Math.round(leaderboard.reduce((acc, p) => acc + (p.score || 0), 0) / leaderboard.length)
    : 0;

  const topScore = leaderboard.length > 0 ? (leaderboard[0]?.score || 0) : 0;

  // Extract Top 3 Winners
  const winner1 = leaderboard[0] || null;
  const winner2 = leaderboard[1] || null;
  const winner3 = leaderboard[2] || null;

  return (
    <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm space-y-6">
      
      {/* 1. Header with Title and Game Selector Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-black text-[#1B1818] tracking-tight">Game Performance</h3>
          <p className="text-[11px] text-gray-400 font-medium">
            Top 3 winners & detailed game analytics
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
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Loading Game Performance...</p>
        </div>
      ) : (
        <>
          {/* Active Game Banner */}
          {currentQuiz && (
            <div className="bg-gradient-to-r from-orange-50/70 to-amber-50/40 border border-orange-100/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                  {currentQuiz.description || "Live trivia quiz session"}
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

          {/* 2. Top 3 Winners Section */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#EB5017]">
                <HiOutlineTrophy className="text-xl" />
                <span className="text-[11px] font-black uppercase tracking-widest">Top 3 Winners</span>
              </div>
              <span className="text-[11px] text-gray-400 font-bold">
                {leaderboard.length} {leaderboard.length === 1 ? "Competitor" : "Competitors"}
              </span>
            </div>

            {/* Top 3 Winners Cards */}
            <div className="grid grid-cols-1 gap-3">
              
              {/* 1st Place - Gold Champion */}
              <div className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                winner1 
                  ? "bg-gradient-to-r from-amber-50/90 via-orange-50/50 to-white border-amber-300/80 shadow-sm ring-1 ring-amber-400/20" 
                  : "bg-gray-50/50 border-dashed border-gray-200 opacity-60"
              }`}>
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-sm shadow-sm shrink-0">
                    <FaCrown className="text-amber-100 text-base" />
                  </div>
                  <Avatar 
                    name={winner1?.nickname || winner1?.name} 
                    fallback="1" 
                    disableLink 
                    className="w-11 h-11 shrink-0 ring-2 ring-amber-400/40" 
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100/70 px-1.5 py-0.5 rounded">
                        1st Place
                      </span>
                    </div>
                    <p className="font-black text-[#1B1818] text-sm truncate max-w-[150px] sm:max-w-xs mt-0.5">
                      {winner1 ? (winner1.nickname || winner1.name) : "Awaiting Winner"}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400">
                      {winner1?.correctAnswers !== undefined ? `${winner1.correctAnswers} of ${questionsCount || 3} Correct` : "Gold Medal"}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-black text-[#1B1818] text-base">
                    {winner1 ? (winner1.score ?? 0).toLocaleString() : "0"}
                  </p>
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Points</p>
                </div>
              </div>

              {/* 2nd Place - Silver Runner-Up */}
              <div className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                winner2 
                  ? "bg-gradient-to-r from-slate-50 to-gray-50/60 border-slate-200" 
                  : "bg-gray-50/40 border-dashed border-gray-200 opacity-50"
              }`}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-400 text-white flex items-center justify-center font-black text-xs shrink-0">
                    <FaMedal className="text-slate-100" />
                  </div>
                  <Avatar 
                    name={winner2?.nickname || winner2?.name} 
                    fallback="2" 
                    disableLink 
                    className="w-10 h-10 shrink-0" 
                  />
                  <div className="min-w-0">
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                      2nd Place
                    </span>
                    <p className="font-black text-[#1B1818] text-sm truncate max-w-[140px] sm:max-w-xs mt-0.5">
                      {winner2 ? (winner2.nickname || winner2.name) : "Awaiting Runner-Up"}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400">
                      {winner2?.correctAnswers !== undefined ? `${winner2.correctAnswers} Correct` : "Silver Medal"}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-black text-[#1B1818] text-sm">
                    {winner2 ? (winner2.score ?? 0).toLocaleString() : "0"}
                  </p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Points</p>
                </div>
              </div>

              {/* 3rd Place - Bronze */}
              <div className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                winner3 
                  ? "bg-gradient-to-r from-orange-50/40 to-stone-50/50 border-orange-200/70" 
                  : "bg-gray-50/30 border-dashed border-gray-200 opacity-40"
              }`}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#CD7F32] text-white flex items-center justify-center font-black text-xs shrink-0">
                    <FaMedal className="text-amber-100" />
                  </div>
                  <Avatar 
                    name={winner3?.nickname || winner3?.name} 
                    fallback="3" 
                    disableLink 
                    className="w-10 h-10 shrink-0" 
                  />
                  <div className="min-w-0">
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#9C5819] bg-[#FFEAD5] px-1.5 py-0.5 rounded">
                      3rd Place
                    </span>
                    <p className="font-black text-[#1B1818] text-sm truncate max-w-[140px] sm:max-w-xs mt-0.5">
                      {winner3 ? (winner3.nickname || winner3.name) : "Awaiting 3rd Place"}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400">
                      {winner3?.correctAnswers !== undefined ? `${winner3.correctAnswers} Correct` : "Bronze Medal"}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-black text-[#1B1818] text-sm">
                    {winner3 ? (winner3.score ?? 0).toLocaleString() : "0"}
                  </p>
                  <p className="text-[9px] font-bold text-[#9C5819] uppercase tracking-wider">Points</p>
                </div>
              </div>

            </div>
          </div>

          {/* 3. Game Analytics Section at the Bottom */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HiOutlineChartBar className="text-lg text-[#EB5017]" />
                <h4 className="text-xs font-black text-[#1B1818] uppercase tracking-wider">
                  Game Analytics Breakdown
                </h4>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {currentQuiz?.category || "Trivia"}
              </span>
            </div>

            {/* 4 Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-gray-50/80 rounded-2xl border border-gray-100 space-y-0.5">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <HiOutlineUserGroup className="text-sm" />
                  <span className="text-[9px] font-black uppercase tracking-wider">Players</span>
                </div>
                <p className="text-lg font-black text-[#1B1818]">{leaderboard.length}</p>
                <p className="text-[9px] text-gray-400 font-medium">Session attendees</p>
              </div>

              <div className="p-3 bg-gray-50/80 rounded-2xl border border-gray-100 space-y-0.5">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <HiOutlineClock className="text-sm" />
                  <span className="text-[9px] font-black uppercase tracking-wider">Avg Score</span>
                </div>
                <p className="text-lg font-black text-[#1B1818]">{avgScore.toLocaleString()}</p>
                <p className="text-[9px] text-gray-400 font-medium">Per participant</p>
              </div>

              <div className="p-3 bg-gray-50/80 rounded-2xl border border-gray-100 space-y-0.5">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <HiOutlineQuestionMarkCircle className="text-sm" />
                  <span className="text-[9px] font-black uppercase tracking-wider">Questions</span>
                </div>
                <p className="text-lg font-black text-[#1B1818]">{questionsCount || 3}</p>
                <p className="text-[9px] text-gray-400 font-medium">Quiz challenge</p>
              </div>

              <div className="p-3 bg-gray-50/80 rounded-2xl border border-gray-100 space-y-0.5">
                <div className="flex items-center gap-1.5 text-amber-500">
                  <HiOutlineTrophy className="text-sm" />
                  <span className="text-[9px] font-black uppercase tracking-wider">Top Score</span>
                </div>
                <p className="text-lg font-black text-[#EB5017]">
                  {topScore > 0 ? topScore.toLocaleString() : (totalPossiblePoints > 0 ? `${totalPossiblePoints.toLocaleString()}` : "0")}
                </p>
                <p className="text-[9px] text-gray-400 font-medium">
                  {totalPossiblePoints > 0 ? `of ${totalPossiblePoints.toLocaleString()} max` : "High score"}
                </p>
              </div>
            </div>

            {/* Questions Breakdown Accordion / List */}
            {questionsList.length > 0 && (
              <div className="bg-gray-50/60 rounded-2xl border border-gray-100 p-4 space-y-3">
                <button
                  type="button"
                  onClick={() => setShowQuestions(!showQuestions)}
                  className="w-full flex items-center justify-between text-left cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-2">
                    <HiOutlineSparkles className="text-sm text-[#EB5017]" />
                    <span className="text-xs font-black text-[#1B1818]">
                      Question Performance & Key ({questionsList.length} Questions)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#EB5017]">
                    <span>{showQuestions ? "Hide" : "Show Questions"}</span>
                    {showQuestions ? <HiOutlineChevronUp className="text-xs" /> : <HiOutlineChevronDown className="text-xs" />}
                  </div>
                </button>

                {showQuestions && (
                  <div className="space-y-2.5 pt-2 border-t border-gray-200/60 animate-in fade-in duration-200">
                    {questionsList.map((q: any, qIdx: number) => {
                      const correctIdxs: number[] = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer || 0];
                      return (
                        <div key={qIdx} className="bg-white rounded-xl p-3 border border-gray-100 space-y-2 text-xs">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-md bg-orange-100/80 text-[#EB5017] font-black text-[10px] flex items-center justify-center shrink-0">
                                {qIdx + 1}
                              </span>
                              <p className="font-bold text-[#1B1818] text-xs">
                                {q.text}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                                {q.type || "Quiz"}
                              </span>
                              <span className="text-[10px] font-black text-[#EB5017] bg-orange-50 px-1.5 py-0.5 rounded">
                                {q.points || 1000} pts
                              </span>
                            </div>
                          </div>

                          {/* Options */}
                          {Array.isArray(q.options) && q.options.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 pl-7">
                              {q.options.map((opt: string, optIdx: number) => {
                                const isCorrect = correctIdxs.includes(optIdx);
                                return (
                                  <div 
                                    key={optIdx}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center justify-between ${
                                      isCorrect 
                                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold" 
                                        : "bg-gray-50 text-gray-500"
                                    }`}
                                  >
                                    <span className="truncate">{opt}</span>
                                    {isCorrect && (
                                      <HiOutlineCheckCircle className="text-emerald-600 text-xs shrink-0 ml-1" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </div>
        </>
      )}
    </div>
  );
}
