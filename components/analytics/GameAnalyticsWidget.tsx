"use client";

import React, { useState, useEffect } from "react";
import { HiOutlineChevronDown, HiOutlineTrophy, HiOutlineUserGroup, HiOutlineClock } from "react-icons/hi2";
import { quizzesService } from "@/lib/services/quizzes.service";
import { useParams } from "next/navigation";

export default function GameAnalyticsWidget() {
  const params = useParams();
  const eventId = params._id as string;
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string>("");
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await quizzesService.getQuizzesByEvent(eventId);
        setQuizzes(data || []);
        if (data && data.length > 0) {
          setSelectedQuizId(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };
    fetchQuizzes();
  }, [eventId]);

  useEffect(() => {
    if (!selectedQuizId) return;

    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const quiz = quizzes.find(q => q.id === selectedQuizId);
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
            {quizzes.map((quiz) => (
              <option key={quiz.id} value={quiz.id}>{quiz.title}</option>
            ))}
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
                    <div className="flex items-center gap-4">
                      <span className={`text-lg font-black ${index === 0 ? "text-[#EB5017]" : "text-gray-400"}`}>
                        #{index + 1}
                      </span>
                      <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                        <div className="w-full h-full flex items-center justify-center bg-[#EB5017]/10 text-[#EB5017] font-black text-xs uppercase">
                          {(player.nickname || player.name || "?")[0]}
                        </div>
                      </div>
                      <div>
                        <p className="font-black text-[#1B1818] text-sm">{player.nickname || player.name}</p>
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
