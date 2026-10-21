"use client";

import React, { useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";
import { useParams } from "next/navigation";
import { quizzesService } from "@/lib/services/quizzes.service";
import { HiOutlineTrophy } from "react-icons/hi2";

import Avatar from "@/components/ui/Avatar";

export interface WinnerStat {
  rank: number;
  name: string;
  score: string;
  color: string;
}

interface EngagementWidgetProps {
  winners?: WinnerStat[];
  eventId?: string;
}

const EngagementWidget: React.FC<EngagementWidgetProps> = ({ 
  winners: propWinners, 
  eventId: propEventId 
}) => {
  const params = useParams();
  const eventId = propEventId || (params?._id as string);
  const [internalWinners, setInternalWinners] = useState<WinnerStat[]>([]);
  const [loading, setLoading] = useState(false);

  const winners = propWinners !== undefined ? propWinners : internalWinners;

  useEffect(() => {
    if (propWinners !== undefined) {
      return;
    }
    if (!eventId) return;

    const fetchTopWinners = async () => {
      setLoading(true);
      try {
        const quizzes = await quizzesService.getQuizzesByEvent(eventId);
        if (Array.isArray(quizzes) && quizzes.length > 0) {
          const firstQuizWithPin = quizzes.find((q: any) => q.pin);
          if (firstQuizWithPin?.pin) {
            const leaderboard = await quizzesService.getLeaderboard(firstQuizWithPin.pin);
            if (Array.isArray(leaderboard) && leaderboard.length > 0) {
              const bgColors = ["#FFF2F0", "#FFF8F2", "#F9FAFB"];
              const mapped: WinnerStat[] = leaderboard.slice(0, 3).map((item: any, idx: number) => ({
                rank: idx + 1,
                name: item.nickname || item.name || `Player ${idx + 1}`,
                score: `${(item.score ?? 0).toLocaleString()} pts`,
                color: bgColors[idx] || "#F9FAFB",
              }));
              setInternalWinners(mapped);
              return;
            }
          }
        }
        setInternalWinners([]);
      } catch (err) {
        console.error("Failed to load engagement winners:", err);
        setInternalWinners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopWinners();
  }, [eventId, propWinners]);

  return (
    <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-bold text-[#1B1818]">Engagement & Games</h2>
        <button className="text-gray-400 hover:text-[#EB5017]"><MoreVertical size={20} /></button>
      </div>

      <p className="text-[10px] font-black text-[#B28A6A] uppercase tracking-widest mb-3">Top 3 Winners</p>
      
      {loading ? (
        <div className="py-8 text-center">
          <div className="w-6 h-6 mx-auto border-2 border-[#EB5017] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : winners.length === 0 ? (
        <div className="py-8 text-center space-y-2">
          <div className="w-10 h-10 mx-auto rounded-full bg-orange-50 flex items-center justify-center text-[#EB5017]">
            <HiOutlineTrophy className="text-xl" />
          </div>
          <p className="text-xs font-bold text-[#1B1818]">No game winners yet</p>
          <p className="text-[11px] text-gray-400 max-w-xs mx-auto">
            Host a live quiz or game to see participant rankings and scores.
          </p>
        </div>
      ) : (
        <div className="space-y-4 flex-1">
          {winners.map((winner) => (
            <div key={winner.rank} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-[#EB5017] text-xs shrink-0"
                  style={{ backgroundColor: winner.color }}
                >
                  #{winner.rank}
                </div>
                <Avatar 
                  name={winner.name} 
                  fallback={`P${winner.rank}`} 
                  disableLink 
                  className="w-9 h-9 shrink-0" 
                />
                <span className="text-sm font-bold text-[#1B1818] truncate max-w-[130px]">{winner.name}</span>
              </div>
              <span className="text-xs font-bold text-gray-400 shrink-0">{winner.score}</span>
            </div>
          ))}
        </div>
      )}

      {winners.length > 0 && (
        <div className="mt-4 bg-[#FFF8F2] border border-[#FFD9B3] rounded-[16px] p-5">
          <div className="flex justify-between items-center mb-1.5">
             <span className="text-[10px] font-black text-[#EB5017] uppercase tracking-wide">Leaderboard Active</span>
             <span className="text-sm font-black text-[#EB5017]">Live</span>
          </div>
          <div className="h-2 w-full bg-[#FFE5D5] rounded-full overflow-hidden">
            <div className="h-full bg-[#EB5017] w-full rounded-full" />
          </div>
        </div>
      )}
    </div>
  );
};

export default EngagementWidget;
