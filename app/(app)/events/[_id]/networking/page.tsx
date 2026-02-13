"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaAngleLeft } from "react-icons/fa6";
import {
  HiOutlineUserGroup,
  HiOutlineLightningBolt,
  HiOutlineSparkles,
  HiOutlineCheck,
  HiOutlineChat,
  HiOutlineMail,
} from "react-icons/hi";
import Avatar from "@/components/ui/Avatar";

// ─── Matching questions ────────────────────────────────────────────────
const MATCHING_QUESTIONS = [
  {
    id: "role",
    question: "What best describes your role?",
    options: ["Founder / CEO", "Developer / Engineer", "Designer", "Marketing / Growth", "Product Manager", "Student / Learner", "Investor / VC", "Other"],
  },
  {
    id: "goal",
    question: "What's your main goal at this event?",
    options: ["Find a co-founder", "Hire talent", "Get feedback on my project", "Meet investors", "Learn new skills", "Just explore & connect"],
  },
  {
    id: "industry",
    question: "Which industry are you most interested in?",
    options: ["SaaS / Software", "Fintech", "Health Tech", "AI / Machine Learning", "E-commerce", "EdTech", "Gaming", "Sustainability / CleanTech"],
  },
  {
    id: "stage",
    question: "What stage is your project or company?",
    options: ["Just an idea", "Building MVP", "Early traction", "Scaling / Growing", "Established company", "Not applicable"],
  },
  {
    id: "collab",
    question: "What kind of collaboration are you open to?",
    options: ["Mentorship", "Partnership", "Investment", "Freelance / Contract work", "Full-time roles", "Knowledge sharing"],
  },
];

// ─── Mock matched attendees ────────────────────────────────────────────
const MOCK_MATCHES = [
  { id: 1, name: "Sarah Chen", role: "Founder / CEO", industry: "AI / Machine Learning", goal: "Find a co-founder", matchScore: 94, avatar: null },
  { id: 2, name: "Marcus Johnson", role: "Developer / Engineer", industry: "SaaS / Software", goal: "Get feedback on my project", matchScore: 88, avatar: null },
  { id: 3, name: "Aisha Patel", role: "Investor / VC", industry: "Fintech", goal: "Meet investors", matchScore: 85, avatar: null },
  { id: 4, name: "David Kim", role: "Product Manager", industry: "EdTech", goal: "Learn new skills", matchScore: 82, avatar: null },
  { id: 5, name: "Elena Rodriguez", role: "Designer", industry: "E-commerce", goal: "Partnership", matchScore: 79, avatar: null },
  { id: 6, name: "James Okonkwo", role: "Marketing / Growth", industry: "Health Tech", goal: "Hire talent", matchScore: 76, avatar: null },
];

// ─── Main Component ────────────────────────────────────────────────────
export default function NetworkingPage() {
  const { _id } = useParams();
  const [currentStep, setCurrentStep] = useState<"intro" | "form" | "matching" | "results">("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);

  const handleSelectOption = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleNext = () => {
    if (currentQuestion < MATCHING_QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setCurrentStep("matching");
      // Simulate matching delay
      setTimeout(() => setCurrentStep("results"), 2500);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const currentQ = MATCHING_QUESTIONS[currentQuestion];
  const isAnswered = currentQ ? !!answers[currentQ.id] : false;
  const progress = ((currentQuestion + 1) / MATCHING_QUESTIONS.length) * 100;

  // ─── INTRO SCREEN ────────────────────────────────────────────────────
  if (currentStep === "intro") {
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

        {/* Hero */}
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#1B1818] to-[#2d2525] p-10 md:p-14 text-white">
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#EB5017]/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-purple-500/10 rounded-full blur-[80px]" />
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10">
              <HiOutlineSparkles className="text-[#EB5017]" />
              <span className="text-[10px] font-black uppercase tracking-widest">Smart Matching</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1]">
              Find Your <span className="text-[#EB5017]">Perfect</span> Connections
            </h1>
            <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed max-w-lg">
              Answer a few quick questions and our AI-powered matching engine will connect you with the most relevant attendees based on your interests, goals, and expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setCurrentStep("form")}
                className="inline-flex items-center justify-center gap-2 bg-[#EB5017] text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#d64815] transition-all active:scale-95 shadow-xl shadow-[#EB5017]/30"
              >
                <HiOutlineLightningBolt className="text-lg" />
                Start Matching
              </button>
              <button
                onClick={() => { setCurrentStep("results"); }}
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10"
              >
                <HiOutlineUserGroup className="text-lg" />
                Browse All Attendees
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="relative z-10 grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10">
            <div>
              <p className="text-3xl font-black text-white">128</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Attendees</p>
            </div>
            <div>
              <p className="text-3xl font-black text-[#EB5017]">86%</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Match Rate</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">42</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Connections Made</p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="space-y-6">
          <div className="px-2">
            <p className="text-[10px] font-black text-[#eb5017] uppercase tracking-[0.2em] mb-1">Process</p>
            <h3 className="text-2xl font-black text-[#1B1818] tracking-tight">How It Works</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step: "01", title: "Answer Questions", desc: "Tell us about your role, goals, and interests", icon: "📝" },
              { step: "02", title: "AI Matching", desc: "Our engine finds the best matches for you", icon: "🤖" },
              { step: "03", title: "Connect & Chat", desc: "Start conversations with your top matches", icon: "💬" },
            ].map((item) => (
              <div key={item.step} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-[10px] font-black text-[#EB5017] uppercase tracking-widest">Step {item.step}</span>
                </div>
                <h4 className="font-black text-sm text-[#1B1818] mb-1">{item.title}</h4>
                <p className="text-xs text-gray-400 font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── QUESTIONNAIRE FORM ──────────────────────────────────────────────
  if (currentStep === "form") {
    return (
      <div className="min-h-[80vh] flex flex-col font-sans pb-20">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Question {currentQuestion + 1} of {MATCHING_QUESTIONS.length}
            </span>
            <span className="text-[10px] font-black text-[#EB5017] uppercase tracking-widest">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#EB5017] to-[#FF7043] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
          <div className="w-full space-y-8">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 bg-[#EB5017]/10 px-3 py-1 rounded-full mb-2">
                <span className="text-[9px] font-black text-[#EB5017] uppercase tracking-widest">
                  {currentQ.id === "role" ? "About You" : currentQ.id === "goal" ? "Your Goals" : currentQ.id === "industry" ? "Interests" : currentQ.id === "stage" ? "Your Journey" : "Collaboration"}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-[#1B1818] tracking-tight">
                {currentQ.question}
              </h2>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((option) => {
                const isSelected = answers[currentQ.id] === option;
                return (
                  <button
                    key={option}
                    onClick={() => handleSelectOption(currentQ.id, option)}
                    className={`relative text-left px-5 py-4 rounded-2xl border-2 transition-all duration-200 font-bold text-sm ${
                      isSelected
                        ? "border-[#EB5017] bg-[#EB5017]/5 text-[#1B1818] shadow-lg shadow-[#EB5017]/10"
                        : "border-gray-100 bg-white text-gray-600 hover:border-gray-200 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {isSelected && (
                        <div className="w-6 h-6 bg-[#EB5017] rounded-full flex items-center justify-center shrink-0">
                          <HiOutlineCheck className="text-white text-sm" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={currentQuestion === 0 ? () => setCurrentStep("intro") : handleBack}
            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-500 font-bold text-sm hover:bg-gray-50 transition-colors"
          >
            {currentQuestion === 0 ? "Cancel" : "Back"}
          </button>
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className={`px-8 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all ${
              isAnswered
                ? "bg-[#EB5017] text-white hover:bg-[#d64815] shadow-lg shadow-[#EB5017]/20 active:scale-95"
                : "bg-gray-100 text-gray-300 cursor-not-allowed"
            }`}
          >
            {currentQuestion < MATCHING_QUESTIONS.length - 1 ? "Next" : "Find My Matches"}
          </button>
        </div>
      </div>
    );
  }

  // ─── MATCHING ANIMATION ──────────────────────────────────────────────
  if (currentStep === "matching") {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center font-sans">
        <div className="text-center space-y-8">
          {/* Animated circles */}
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 border-4 border-[#EB5017]/20 rounded-full animate-ping" />
            <div className="absolute inset-2 border-4 border-[#EB5017]/30 rounded-full animate-ping [animation-delay:0.3s]" />
            <div className="absolute inset-4 border-4 border-[#EB5017]/40 rounded-full animate-ping [animation-delay:0.6s]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-[#EB5017] rounded-full flex items-center justify-center shadow-2xl shadow-[#EB5017]/30">
                <HiOutlineSparkles className="text-white text-2xl" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-[#1B1818] tracking-tight">Finding Your Matches...</h2>
            <p className="text-sm text-gray-400 font-medium">Analyzing compatibility across {Object.keys(answers).length} dimensions</p>
          </div>

          {/* Animated dots */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#EB5017] animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 rounded-full bg-[#EB5017] animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 rounded-full bg-[#EB5017] animate-bounce" />
          </div>
        </div>
      </div>
    );
  }

  // ─── RESULTS ─────────────────────────────────────────────────────────
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
          <p className="text-[10px] font-black text-[#eb5017] uppercase tracking-[0.2em]">Smart Matching</p>
          <h2 className="text-3xl font-black text-[#1B1818] tracking-tight">Your Top Matches</h2>
          <p className="text-sm text-gray-400 font-medium">Based on your interests, goals, and experience</p>
        </div>
        <button
          onClick={() => { setCurrentStep("form"); setCurrentQuestion(0); setAnswers({}); }}
          className="inline-flex items-center gap-2 bg-white border border-gray-200 text-[#1B1818] px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95 shrink-0"
        >
          <HiOutlineLightningBolt className="text-[#EB5017]" />
          Retake Quiz
        </button>
      </div>

      {/* Your Answers Summary */}
      {Object.keys(answers).length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Your Profile</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(answers).map(([key, value]) => (
              <span key={key} className="bg-[#EB5017]/5 text-[#EB5017] border border-[#EB5017]/10 px-3 py-1.5 rounded-full text-xs font-bold">
                {value}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Matches List */}
      <div className="space-y-4">
        {MOCK_MATCHES.map((match) => (
          <div
            key={match.id}
            onClick={() => setSelectedMatch(selectedMatch === match.id ? null : match.id)}
            className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-lg group ${
              selectedMatch === match.id ? "border-[#EB5017] shadow-lg shadow-[#EB5017]/5" : "border-gray-100"
            }`}
          >
            <div className="p-6 flex items-center gap-5">
              {/* Avatar */}
              <div className="relative shrink-0">
                <Avatar name={match.name} isBigger={true} />
                {/* Match score badge */}
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#EB5017] rounded-full flex items-center justify-center shadow-lg shadow-[#EB5017]/30">
                  <span className="text-[9px] font-black text-white">{match.matchScore}%</span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-base text-[#1B1818] tracking-tight">{match.name}</h4>
                <p className="text-xs text-gray-400 font-bold mt-0.5">{match.role}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-[9px] font-black text-[#EB5017] bg-[#EB5017]/5 px-2 py-0.5 rounded-full border border-[#EB5017]/10">
                    {match.industry}
                  </span>
                  <span className="text-[9px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                    {match.goal}
                  </span>
                </div>
              </div>

              {/* Match bar */}
              <div className="hidden md:flex flex-col items-end gap-1 shrink-0 w-28">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Match</span>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#EB5017] to-[#FF7043] rounded-full transition-all duration-700"
                    style={{ width: `${match.matchScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Expanded actions */}
            {selectedMatch === match.id && (
              <div className="px-6 pb-5 pt-0 flex items-center gap-3 border-t border-gray-50 mt-0 pt-4">
                <button className="inline-flex items-center gap-2 bg-[#EB5017] text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#d64815] transition-all active:scale-95 shadow-lg shadow-[#EB5017]/20">
                  <HiOutlineChat className="text-sm" />
                  Send Message
                </button>
                <button className="inline-flex items-center gap-2 bg-white border border-gray-200 text-[#1B1818] px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all">
                  <HiOutlineMail className="text-sm" />
                  Send Email
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
