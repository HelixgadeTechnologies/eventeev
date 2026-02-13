"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaAngleLeft } from "react-icons/fa6";
import {
  HiOutlinePlus,
  HiOutlineChartBar,
  HiOutlineClock,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineTrash,
  HiOutlineEye,
} from "react-icons/hi";

// ─── Types ─────────────────────────────────────────────────────────────
interface PollOption {
  text: string;
  votes: number;
}

interface Poll {
  id: number;
  question: string;
  options: PollOption[];
  status: "active" | "ended";
  totalVotes: number;
  createdAt: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────────
const INITIAL_POLLS: Poll[] = [
  {
    id: 1,
    question: "Which session topic are you most excited about?",
    options: [
      { text: "AI & Machine Learning", votes: 42 },
      { text: "Web3 & Blockchain", votes: 28 },
      { text: "Product Design", votes: 35 },
      { text: "Growth Marketing", votes: 19 },
    ],
    status: "active",
    totalVotes: 124,
    createdAt: "Feb 13, 2026",
  },
  {
    id: 2,
    question: "How would you rate the event so far?",
    options: [
      { text: "⭐ Excellent", votes: 56 },
      { text: "👍 Good", votes: 34 },
      { text: "😐 Average", votes: 8 },
      { text: "👎 Needs Improvement", votes: 3 },
    ],
    status: "active",
    totalVotes: 101,
    createdAt: "Feb 13, 2026",
  },
  {
    id: 3,
    question: "Preferred lunch option for Day 2?",
    options: [
      { text: "Mediterranean Platter", votes: 44 },
      { text: "Asian Fusion Bowl", votes: 38 },
      { text: "Classic Burger & Sides", votes: 29 },
      { text: "Vegan / Plant-based", votes: 17 },
    ],
    status: "ended",
    totalVotes: 128,
    createdAt: "Feb 12, 2026",
  },
  {
    id: 4,
    question: "What time should networking sessions start?",
    options: [
      { text: "4:00 PM", votes: 22 },
      { text: "5:00 PM", votes: 41 },
      { text: "6:00 PM", votes: 35 },
      { text: "7:00 PM", votes: 15 },
    ],
    status: "ended",
    totalVotes: 113,
    createdAt: "Feb 11, 2026",
  },
];

// ─── Main Component ────────────────────────────────────────────────────
export default function PollsPage() {
  const { _id } = useParams();
  const [polls, setPolls] = useState<Poll[]>(INITIAL_POLLS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewingPoll, setViewingPoll] = useState<Poll | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "ended">("all");

  // Create poll form state
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState(["", ""]);

  const filteredPolls = polls.filter((p) => {
    if (filter === "all") return true;
    return p.status === filter;
  });

  const handleAddOption = () => {
    if (newOptions.length < 6) setNewOptions([...newOptions, ""]);
  };

  const handleRemoveOption = (index: number) => {
    if (newOptions.length > 2) {
      setNewOptions(newOptions.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...newOptions];
    updated[index] = value;
    setNewOptions(updated);
  };

  const handleCreatePoll = () => {
    if (!newQuestion.trim() || newOptions.filter((o) => o.trim()).length < 2) return;

    const newPoll: Poll = {
      id: Date.now(),
      question: newQuestion.trim(),
      options: newOptions.filter((o) => o.trim()).map((text) => ({ text: text.trim(), votes: 0 })),
      status: "active",
      totalVotes: 0,
      createdAt: "Just now",
    };
    setPolls([newPoll, ...polls]);
    setNewQuestion("");
    setNewOptions(["", ""]);
    setShowCreateModal(false);
  };

  const handleEndPoll = (pollId: number) => {
    setPolls(polls.map((p) => (p.id === pollId ? { ...p, status: "ended" as const } : p)));
  };

  const handleDeletePoll = (pollId: number) => {
    setPolls(polls.filter((p) => p.id !== pollId));
    if (viewingPoll?.id === pollId) setViewingPoll(null);
  };

  const activeCount = polls.filter((p) => p.status === "active").length;
  const endedCount = polls.filter((p) => p.status === "ended").length;
  const totalResponses = polls.reduce((sum, p) => sum + p.totalVotes, 0);

  return (
    <div className="space-y-8 pb-20 font-sans">
      {/* Back */}
      <div className="px-2">
        <Link
          href={`/events/${_id}/dashboard`}
          className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#EB5017] transition-all group"
        >
          <FaAngleLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-[#eb5017] uppercase tracking-[0.2em]">Power-up</p>
          <h2 className="text-3xl font-black text-[#1B1818] tracking-tight">Live Polls</h2>
          <p className="text-sm text-gray-400 font-medium">Create polls, gather feedback, and see real-time results.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 bg-[#EB5017] text-white px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#d64815] transition-all active:scale-95 shadow-xl shadow-[#EB5017]/20 shrink-0"
        >
          <HiOutlinePlus className="text-lg" />
          Create Poll
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-1">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Polls</span>
          <span className="text-2xl font-black text-[#EB5017]">{activeCount}</span>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-1">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Responses</span>
          <span className="text-2xl font-black text-[#1B1818]">{totalResponses}</span>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-1">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Ended Polls</span>
          <span className="text-2xl font-black text-gray-400">{endedCount}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(["all", "active", "ended"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              filter === f
                ? "bg-[#1B1818] text-white shadow-lg"
                : "bg-white border border-gray-100 text-gray-400 hover:border-gray-200"
            }`}
          >
            {f} {f === "all" ? `(${polls.length})` : f === "active" ? `(${activeCount})` : `(${endedCount})`}
          </button>
        ))}
      </div>

      {/* Polls List */}
      <div className="space-y-4">
        {filteredPolls.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center space-y-3">
            <HiOutlineChartBar className="text-4xl text-gray-200 mx-auto" />
            <p className="font-black text-sm text-gray-300 uppercase tracking-wider">No polls found</p>
            <p className="text-xs text-gray-300">Create your first poll to start gathering feedback!</p>
          </div>
        ) : (
          filteredPolls.map((poll) => {
            const maxVotes = Math.max(...poll.options.map((o) => o.votes), 1);
            return (
              <div
                key={poll.id}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Poll Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                            poll.status === "active"
                              ? "bg-green-50 text-green-600"
                              : "bg-gray-50 text-gray-400"
                          }`}
                        >
                          {poll.status === "active" ? (
                            <><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live</>
                          ) : (
                            <><HiOutlineClock className="text-xs" /> Ended</>
                          )}
                        </span>
                        <span className="text-[9px] font-bold text-gray-300">{poll.createdAt}</span>
                      </div>
                      <h3 className="font-black text-base text-[#1B1818] tracking-tight">{poll.question}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setViewingPoll(viewingPoll?.id === poll.id ? null : poll)}
                        className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#EB5017] hover:border-[#EB5017]/20 transition-all"
                      >
                        <HiOutlineEye className="text-sm" />
                      </button>
                      {poll.status === "active" && (
                        <button
                          onClick={() => handleEndPoll(poll.id)}
                          className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-amber-500 hover:border-amber-200 transition-all"
                          title="End Poll"
                        >
                          <HiOutlineClock className="text-sm" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePoll(poll.id)}
                        className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-all"
                        title="Delete Poll"
                      >
                        <HiOutlineTrash className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Results Bars */}
                <div className="px-6 pb-6 space-y-3">
                  {poll.options.map((option, idx) => {
                    const percentage = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0;
                    const barWidth = poll.totalVotes > 0 ? (option.votes / maxVotes) * 100 : 0;
                    const isTop = option.votes === maxVotes && poll.totalVotes > 0;
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${isTop ? "text-[#1B1818]" : "text-gray-500"}`}>
                            {option.text}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-400">{option.votes} votes</span>
                            <span className={`text-xs font-black ${isTop ? "text-[#EB5017]" : "text-gray-400"}`}>
                              {percentage}%
                            </span>
                          </div>
                        </div>
                        <div className="w-full h-3 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ease-out ${
                              isTop
                                ? "bg-gradient-to-r from-[#EB5017] to-[#FF7043]"
                                : "bg-gray-200"
                            }`}
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400">
                    {poll.totalVotes} total response{poll.totalVotes !== 1 ? "s" : ""}
                  </span>
                  {poll.status === "active" && (
                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Accepting responses
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ─── Create Poll Modal ───────────────────────────────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black text-[#1B1818] tracking-tight">Create New Poll</h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Ask your attendees anything</p>
              </div>
              <button
                onClick={() => { setShowCreateModal(false); setNewQuestion(""); setNewOptions(["", ""]); }}
                className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
              >
                <HiOutlineX className="text-lg" />
              </button>
            </div>

            {/* Question Input */}
            <div className="space-y-2 mb-6">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Your Question</label>
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="e.g. What topic should the next panel cover?"
                className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 text-sm font-bold text-[#1B1818] placeholder:text-gray-300 focus:border-[#EB5017] focus:outline-none transition-colors"
              />
            </div>

            {/* Options */}
            <div className="space-y-2 mb-6">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Answer Options ({newOptions.length}/6)
              </label>
              <div className="space-y-2.5">
                {newOptions.map((option, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[9px] font-black text-gray-400 shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      placeholder={`Option ${idx + 1}`}
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-100 text-sm font-bold text-[#1B1818] placeholder:text-gray-300 focus:border-[#EB5017] focus:outline-none transition-colors"
                    />
                    {newOptions.length > 2 && (
                      <button
                        onClick={() => handleRemoveOption(idx)}
                        className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all shrink-0"
                      >
                        <HiOutlineX className="text-sm" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {newOptions.length < 6 && (
                <button
                  onClick={handleAddOption}
                  className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-xs font-bold text-gray-400 hover:border-[#EB5017] hover:text-[#EB5017] transition-all flex items-center justify-center gap-1.5"
                >
                  <HiOutlinePlus className="text-sm" />
                  Add Option
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setShowCreateModal(false); setNewQuestion(""); setNewOptions(["", ""]); }}
                className="flex-1 px-4 py-3.5 rounded-xl border border-gray-200 text-gray-500 font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePoll}
                disabled={!newQuestion.trim() || newOptions.filter((o) => o.trim()).length < 2}
                className={`flex-1 px-4 py-3.5 rounded-xl font-black text-sm transition-all ${
                  newQuestion.trim() && newOptions.filter((o) => o.trim()).length >= 2
                    ? "bg-[#EB5017] text-white hover:bg-[#d64815] shadow-lg shadow-[#EB5017]/20 active:scale-95"
                    : "bg-gray-100 text-gray-300 cursor-not-allowed"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <HiOutlineCheck className="text-lg" />
                  Launch Poll
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Detail View Modal ───────────────────────────────────────────── */}
      {viewingPoll && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                      viewingPoll.status === "active"
                        ? "bg-green-50 text-green-600"
                        : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    {viewingPoll.status === "active" ? "Live" : "Ended"}
                  </span>
                  <span className="text-[9px] font-bold text-gray-300">{viewingPoll.createdAt}</span>
                </div>
                <h3 className="text-lg font-black text-[#1B1818] tracking-tight">{viewingPoll.question}</h3>
              </div>
              <button
                onClick={() => setViewingPoll(null)}
                className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
              >
                <HiOutlineX className="text-lg" />
              </button>
            </div>

            {/* Detailed Results */}
            <div className="space-y-4 mb-6">
              {viewingPoll.options.map((option, idx) => {
                const percentage = viewingPoll.totalVotes > 0 ? Math.round((option.votes / viewingPoll.totalVotes) * 100) : 0;
                const maxVotes = Math.max(...viewingPoll.options.map((o) => o.votes), 1);
                const isTop = option.votes === maxVotes && viewingPoll.totalVotes > 0;
                return (
                  <div key={idx} className={`p-4 rounded-xl border-2 transition-all ${isTop ? "border-[#EB5017]/20 bg-[#EB5017]/5" : "border-gray-100 bg-white"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {isTop && <span className="text-sm">🏆</span>}
                        <span className={`text-sm font-black ${isTop ? "text-[#1B1818]" : "text-gray-600"}`}>{option.text}</span>
                      </div>
                      <span className={`text-lg font-black ${isTop ? "text-[#EB5017]" : "text-gray-400"}`}>{percentage}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${isTop ? "bg-gradient-to-r from-[#EB5017] to-[#FF7043]" : "bg-gray-300"}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 mt-1 block">{option.votes} votes</span>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400">Total Responses</span>
              <span className="text-xl font-black text-[#1B1818]">{viewingPoll.totalVotes}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
