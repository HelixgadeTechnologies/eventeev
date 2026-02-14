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

interface PollQuestion {
  id: string;
  text: string;
  options: PollOption[];
  totalVotes: number;
}

interface Poll {
  id: number;
  title: string;
  questions: PollQuestion[];
  status: "active" | "ended";
  createdAt: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────────
const INITIAL_POLLS: Poll[] = [
  {
    id: 1,
    title: "Event Feedback & Preferences",
    questions: [
      {
        id: "q1",
        text: "Which session topic are you most excited about?",
        options: [
          { text: "AI & Machine Learning", votes: 42 },
          { text: "Web3 & Blockchain", votes: 28 },
          { text: "Product Design", votes: 35 },
          { text: "Growth Marketing", votes: 19 },
        ],
        totalVotes: 124,
      },
      {
        id: "q2",
        text: "How would you rate the event venue?",
        options: [
          { text: "⭐ Excellent", votes: 65 },
          { text: "👍 Good", votes: 45 },
          { text: "😐 Average", votes: 12 },
          { text: "👎 Poor", votes: 2 },
        ],
        totalVotes: 124,
      }
    ],
    status: "active",
    createdAt: "Feb 13, 2026",
  },
  {
    id: 2,
    title: "General Satisfaction",
    questions: [
      {
        id: "q1",
        text: "How would you rate the event so far?",
        options: [
          { text: "⭐ Excellent", votes: 56 },
          { text: "👍 Good", votes: 34 },
          { text: "😐 Average", votes: 8 },
          { text: "👎 Needs Improvement", votes: 3 },
        ],
        totalVotes: 101,
      }
    ],
    status: "active",
    createdAt: "Feb 13, 2026",
  },
  {
    id: 3,
    title: "Lunch Logistics",
    questions: [
      {
        id: "q1",
        text: "Preferred lunch option for Day 2?",
        options: [
          { text: "Mediterranean Platter", votes: 44 },
          { text: "Asian Fusion Bowl", votes: 38 },
          { text: "Classic Burger & Sides", votes: 29 },
          { text: "Vegan / Plant-based", votes: 17 },
        ],
        totalVotes: 128,
      }
    ],
    status: "ended",
    createdAt: "Feb 12, 2026",
  },
  {
    id: 4,
    title: "Networking Schedule",
    questions: [
      {
        id: "q1",
        text: "What time should networking sessions start?",
        options: [
          { text: "4:00 PM", votes: 22 },
          { text: "5:00 PM", votes: 41 },
          { text: "6:00 PM", votes: 35 },
          { text: "7:00 PM", votes: 15 },
        ],
        totalVotes: 113,
      }
    ],
    status: "ended",
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
  const [pollTitle, setPollTitle] = useState("");
  const [creationQuestions, setCreationQuestions] = useState([{ text: "", options: ["", ""] }]);

  const filteredPolls = polls.filter((p) => {
    if (filter === "all") return true;
    return p.status === filter;
  });

  // Creation Helpers
  const handleAddQuestion = () => {
    setCreationQuestions([...creationQuestions, { text: "", options: ["", ""] }]);
  };

  const handleRemoveQuestion = (qIdx: number) => {
    if (creationQuestions.length > 1) {
      setCreationQuestions(creationQuestions.filter((_, i) => i !== qIdx));
    }
  };

  const handleQuestionTextChange = (qIdx: number, text: string) => {
    const updated = [...creationQuestions];
    updated[qIdx].text = text;
    setCreationQuestions(updated);
  };

  const handleAddOption = (qIdx: number) => {
    const updated = [...creationQuestions];
    if (updated[qIdx].options.length < 6) {
      updated[qIdx].options.push("");
      setCreationQuestions(updated);
    }
  };

  const handleRemoveOption = (qIdx: number, oIdx: number) => {
    const updated = [...creationQuestions];
    if (updated[qIdx].options.length > 2) {
      updated[qIdx].options = updated[qIdx].options.filter((_, i) => i !== oIdx);
      setCreationQuestions(updated);
    }
  };

  const handleOptionChange = (qIdx: number, oIdx: number, value: string) => {
    const updated = [...creationQuestions];
    updated[qIdx].options[oIdx] = value;
    setCreationQuestions(updated);
  };

  const handleCreatePoll = () => {
    const validQuestions = creationQuestions.filter(q => 
      q.text.trim() && q.options.filter(o => o.trim()).length >= 2
    );

    if (!pollTitle.trim() || validQuestions.length === 0) return;

    const newPoll: Poll = {
      id: Date.now(),
      title: pollTitle.trim(),
      questions: validQuestions.map((q, idx) => ({
        id: `q${idx + 1}`,
        text: q.text.trim(),
        options: q.options.filter(o => o.trim()).map(text => ({ text: text.trim(), votes: 0 })),
        totalVotes: 0
      })),
      status: "active",
      createdAt: "Just now",
    };

    setPolls([newPoll, ...polls]);
    setPollTitle("");
    setCreationQuestions([{ text: "", options: ["", ""] }]);
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
  const totalResponses = polls.reduce((sum, p) => sum + p.questions.reduce((qSum, q) => qSum + q.totalVotes, 0), 0);

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
                      <h3 className="font-black text-lg text-[#1B1818] tracking-tight">{poll.title}</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{poll.questions.length} Question{poll.questions.length !== 1 ? 's' : ''}</p>
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

                {/* Questions and Results */}
                <div className="px-6 pb-6 space-y-8">
                  {poll.questions.map((question, qIdx) => {
                    const maxVotes = Math.max(...question.options.map((o) => o.votes), 1);
                    return (
                      <div key={question.id || qIdx} className="space-y-4">
                        <div className="flex items-center gap-2">
                           <span className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center text-[9px] font-black text-gray-400">{qIdx + 1}</span>
                           <h4 className="text-sm font-black text-[#1B1818] tracking-tight">{question.text}</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                          {question.options.map((option, idx) => {
                            const percentage = question.totalVotes > 0 ? Math.round((option.votes / question.totalVotes) * 100) : 0;
                            const barWidth = question.totalVotes > 0 ? (option.votes / maxVotes) * 100 : 0;
                            const isTop = option.votes === maxVotes && question.totalVotes > 0;
                            return (
                              <div key={idx} className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className={`text-[11px] font-bold ${isTop ? "text-[#1B1818]" : "text-gray-500"}`}>
                                    {option.text}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-bold text-gray-400">{option.votes}v</span>
                                    <span className={`text-[11px] font-black ${isTop ? "text-[#EB5017]" : "text-gray-400"}`}>
                                      {percentage}%
                                    </span>
                                  </div>
                                </div>
                                <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
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
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400">
                    {poll.questions.reduce((sum, q) => sum + q.totalVotes, 0)} total response{poll.questions.reduce((sum, q) => sum + q.totalVotes, 0) !== 1 ? "s" : ""}
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
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-[#1B1818] tracking-tight">Create New Poll</h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Define your questions and gathering options</p>
              </div>
              <button
                onClick={() => { setShowCreateModal(false); setPollTitle(""); setCreationQuestions([{ text: "", options: ["", ""] }]); }}
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all border border-gray-100"
              >
                <HiOutlineX className="text-xl" />
              </button>
            </div>

            <div className="space-y-8">
              {/* Poll Title */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Poll Title</label>
                <input
                  type="text"
                  value={pollTitle}
                  onChange={(e) => setPollTitle(e.target.value)}
                  placeholder="e.g. Day 1 Session Preferences"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 text-sm font-bold text-[#1B1818] placeholder:text-gray-300 focus:border-[#EB5017] focus:outline-none transition-all shadow-sm"
                />
              </div>

              {/* Questions List */}
              <div className="space-y-6">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Questions ({creationQuestions.length})</label>
                </div>

                <div className="space-y-6">
                  {creationQuestions.map((q, qIdx) => (
                    <div key={qIdx} className="p-6 rounded-3xl bg-gray-50/50 border border-gray-100 space-y-5 relative group">
                      {creationQuestions.length > 1 && (
                        <button
                          onClick={() => handleRemoveQuestion(qIdx)}
                          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-300 hover:text-red-500 hover:border-red-200 shadow-sm transition-all"
                        >
                          <HiOutlineX size={14} />
                        </button>
                      )}

                      {/* Question Text */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-[#EB5017]/10 flex items-center justify-center text-[10px] font-black text-[#EB5017]">
                            {qIdx + 1}
                          </span>
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Question Text</span>
                        </div>
                        <input
                          type="text"
                          value={q.text}
                          onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                          placeholder="e.g. Which speaker was most impactful?"
                          className="w-full px-4 py-3 rounded-xl border-2 border-white text-sm font-bold text-[#1B1818] placeholder:text-gray-300 focus:border-[#EB5017] focus:outline-none transition-all bg-white"
                        />
                      </div>

                      {/* Options for this question */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                           <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Answer Options ({q.options.length}/6)</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {q.options.map((option, oIdx) => (
                            <div key={oIdx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                                placeholder={`Option ${oIdx + 1}`}
                                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-white text-sm font-bold text-[#1B1818] placeholder:text-gray-300 focus:border-[#EB5017] focus:outline-none transition-all bg-white"
                              />
                              {q.options.length > 2 && (
                                <button
                                  onClick={() => handleRemoveOption(qIdx, oIdx)}
                                  className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-300 hover:text-red-500 hover:border-red-200 transition-all shrink-0"
                                >
                                  <HiOutlineTrash size={14} />
                                </button>
                              )}
                            </div>
                          ))}
                          {q.options.length < 6 && (
                            <button
                              onClick={() => handleAddOption(qIdx)}
                              className="py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-[10px] font-black text-gray-400 hover:border-[#EB5017] hover:text-[#EB5017] transition-all flex items-center justify-center gap-1.5 uppercase tracking-widest"
                            >
                              <HiOutlinePlus size={14} />
                              Add Option
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleAddQuestion}
                  className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-100 text-xs font-black text-gray-400 hover:border-[#EB5017] hover:text-[#EB5017] hover:bg-[#EB5017]/5 transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-sm"
                >
                  <HiOutlinePlus className="text-sm" />
                  Add Another Question
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-10">
              <button
                onClick={() => { setShowCreateModal(false); setPollTitle(""); setCreationQuestions([{ text: "", options: ["", ""] }]); }}
                className="flex-1 px-6 py-4 rounded-2xl border-2 border-gray-100 text-gray-500 font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-all font-black"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePoll}
                disabled={!pollTitle.trim() || creationQuestions.every(q => !q.text.trim())}
                className={`flex-1 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                  pollTitle.trim() && creationQuestions.some(q => q.text.trim() && q.options.filter(o => o.trim()).length >= 2)
                    ? "bg-[#EB5017] text-white hover:bg-[#d64815] shadow-xl shadow-[#EB5017]/20 active:scale-[0.98]"
                    : "bg-gray-100 text-gray-300 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <HiOutlineCheck className="text-lg" />
                  Launch Multi-Poll
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Detail View Modal ───────────────────────────────────────────── */}
      {viewingPoll && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
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
                <h3 className="text-xl font-black text-[#1B1818] tracking-tight">{viewingPoll.title}</h3>
              </div>
              <button
                onClick={() => setViewingPoll(null)}
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all border border-gray-100"
              >
                <HiOutlineX className="text-lg" />
              </button>
            </div>

            {/* Detailed Results per Question */}
            <div className="space-y-10 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {viewingPoll.questions.map((question, qIdx) => (
                <div key={question.id || qIdx} className="space-y-5">
                   <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-[#EB5017] text-white flex items-center justify-center text-[10px] font-black">{qIdx + 1}</span>
                      <h4 className="text-base font-black text-[#1B1818] tracking-tight">{question.text}</h4>
                   </div>
                   
                   <div className="space-y-3">
                    {question.options.map((option, idx) => {
                      const percentage = question.totalVotes > 0 ? Math.round((option.votes / question.totalVotes) * 100) : 0;
                      const maxVotes = Math.max(...question.options.map((o) => o.votes), 1);
                      const isTop = option.votes === maxVotes && question.totalVotes > 0;
                      return (
                        <div key={idx} className={`p-4 rounded-2xl border-2 transition-all ${isTop ? "border-[#EB5017]/10 bg-[#EB5017]/5" : "border-gray-50 bg-white"}`}>
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
                          <div className="flex items-center justify-between mt-2">
                             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{option.votes} votes received</span>
                             {isTop && <span className="text-[9px] font-black text-[#EB5017] uppercase tracking-widest">Most Popular</span>}
                          </div>
                        </div>
                      );
                    })}
                   </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-8 bg-[#1B1818] rounded-2xl p-5 flex items-center justify-between shadow-xl shadow-black/10">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Aggregate Data</span>
                <span className="text-xs font-bold text-white">Total Response Count</span>
              </div>
              <span className="text-3xl font-black text-[#EB5017]">
                {viewingPoll.questions.reduce((sum, q) => sum + q.totalVotes, 0)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
