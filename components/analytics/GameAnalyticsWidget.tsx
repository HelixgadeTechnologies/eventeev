"use client";

import React, { useState, useEffect } from "react";
import { HiOutlineChevronDown, HiOutlineTrophy, HiOutlineUserGroup, HiOutlineClock } from "react-icons/hi2";
import { quizzesService } from "@/lib/services/quizzes.service";
import { useParams } from "next/navigation";
import Avatar from "@/components/ui/Avatar";

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
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const quizzes = propQuizzes !== undefined ? propQuizzes : internalQuizzes;

  useEffect(() => {
    if (propQuizzes !== undefined) {
      if (propQuizzes.length > 0) {
        const firstId = propQuizzes[0]._id || propQuizzes[0].id;
        setSelectedQuizId(firstId);
      } else {
        setSelectedQuizId("");
      }
      return;
    }

    if (!eventId) return;

    const fetchQuizzes = async () => {
      try {
        const data = await quizzesService.getQuizzesByEvent(eventId);
        setInternalQuizzes(data || []);
        if (data && data.length > 0) {
          const firstId = data[0]._id || data[0].id;
          setSelectedQuizId(firstId);
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };
    fetchQuizzes();
  }, [eventId, propQuizzes]);

  useEffect(() => {
    if (!selectedQuizId) {
      setLeaderboard([]);
      return;
    }

    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const quiz = quizzes.find(q => (q._id || q.id) === selectedQuizId);
        if (quiz?.pin) {
          const data = await quizzesService.getLeaderboard(quiz.pin);
          setLeaderboard(data || []);
        } else {
          setLeaderboard([]);
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [selectedQuizId, quizzes]);

  return (
    <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-[#1B1818] tracking-tight">Game Performance</h3>
        <div className="relative">
          <select 
            value={selectedQuizId}
            onChange={(e) => setSelectedQuizId(e.target.value)}
            className="appearance-none bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 pr-10 text-sm font-bold text-[#1B1818] outline-none focus:border-[#EB5017] transition-all cursor-pointer min-w-[150px]"
          >
            {quizzes.map((quiz) => {
              const qId = quiz._id || quiz.id;
              return <option key={qId} value={qId}>{quiz.title}</option>;
            })}
            {quizzes.length === 0 && <option value="">No quizzes found</option>}
          </select>
          <HiOutlineChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EB5017]"></div>
        </div>
      ) : (
        <>
          {/* Top 3 Players */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#EB5017]">
              <HiOutlineTrophy className="text-xl" />
              <span className="text-[10px] font-black uppercase tracking-widest">Top 3 Players</span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {leaderboard.length > 0 ? (
                leaderboard.slice(0, 3).map((player, index) => (
                  <div 
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      index === 0 ? "bg-[#FFF2F0] border-[#EB5017]/20" : "bg-white border-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-base font-black ${index === 0 ? "text-[#EB5017]" : "text-gray-400"}`}>
                        #{index + 1}
                      </span>
                      <Avatar 
                        name={player.nickname || player.name} 
                        fallback="Player" 
                        disableLink 
                        className="w-10 h-10 shrink-0" 
                      />
                      <div className="min-w-0">
                        <p className="font-black text-[#1B1818] text-sm truncate max-w-[120px]">
                          {player.nickname || player.name}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          {player.correctAnswers || 0} Correct
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-[#1B1818] text-base">{player.score || 0}</p>
                      <p className="text-[10px] font-bold text-[#EB5017] uppercase tracking-wider">Points</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-sm font-bold text-gray-400">No session data yet</p>
                  <p className="text-[11px] text-gray-400 mt-1">Host this quiz to see live participant performance</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <div className="flex items-center gap-2 text-gray-400">
                <HiOutlineUserGroup className="text-lg" />
                <span className="text-[10px] font-black uppercase tracking-widest">Total Players</span>
              </div>
              <p className="text-xl font-black text-[#1B1818]">{leaderboard.length}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <div className="flex items-center gap-2 text-gray-400">
                <HiOutlineClock className="text-lg" />
                <span className="text-[10px] font-black uppercase tracking-widest">Avg. Score</span>
              </div>
              <p className="text-xl font-black text-[#1B1818]">
                {leaderboard.length > 0 
                  ? Math.round(leaderboard.reduce((acc, p) => acc + (p.score || 0), 0) / leaderboard.length)
                  : 0}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
