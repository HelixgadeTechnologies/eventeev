"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaAngleLeft } from "react-icons/fa6";
import { 
  HiOutlineUserGroup as HiUserGroup,
  HiOutlineLightningBolt as HiLightning,
  HiOutlineSparkles as HiSparkles,
  HiOutlineCheck as HiCheck,
  HiOutlineChat as HiChat,
  HiOutlineMail as HiMail,
  HiOutlineCode as HiCode,
  HiOutlineChartBar as HiChart,
  HiOutlineColorSwatch as HiDesign,
  HiOutlinePuzzle as HiPuzzle,
} from "react-icons/hi";
import Avatar from "@/components/ui/Avatar";

// ─── Networking Categories ───────────────────────────────────────────
const NETWORKING_CATEGORIES = [
  {
    id: "tech",
    title: "Tech & Innovation",
    icon: <HiCode className="text-2xl" />,
    description: "Connect with developers, AI researchers, and engineering leads.",
    color: "#EB5017",
  },
  {
    id: "business",
    title: "Business & Growth",
    icon: <HiChart className="text-2xl" />,
    description: "Founders, investors, and growth specialists looking to scale.",
    color: "#7C3AED",
  },
  {
    id: "creative",
    title: "Design & Product",
    icon: <HiDesign className="text-2xl" />,
    description: "Product managers, designers, and creative directors.",
    color: "#10B981",
  },
  {
    id: "general",
    title: "General Networking",
    icon: <HiPuzzle className="text-2xl" />,
    description: "Meet everyone and explore diverse opportunities across all fields.",
    color: "#3B82F6",
  },
];

// ─── Matching questions with category mapping ─────────────────────────
const ALL_QUESTIONS = [
  {
    id: "role",
    categories: ["tech", "business", "creative", "general"],
    question: "What best describes your role?",
    options: ["Founder / CEO", "Developer / Engineer", "Designer", "Marketing / Growth", "Product Manager", "Student / Learner", "Investor / VC", "Other"],
  },
  {
    id: "tech_stack",
    categories: ["tech"],
    question: "What's your preferred tech stack?",
    options: ["Full Stack (JS/TS)", "Backend (Go/Rust/Python)", "Front-end (React/Next)", "Cloud/DevOps", "AI / Web3", "Other"],
  },
  {
    id: "preferred_language",
    categories: ["tech"],
    question: "Which language do you love most?",
    options: ["TypeScript/JS", "Python", "Rust", "Go", "Java/Kotlin", "Swift/C++"],
  },
  {
    id: "oss_interest",
    categories: ["tech"],
    question: "Are you interested in Open Source?",
    options: ["Active Contributor", "Occasional Contributor", "Want to start", "Focus on proprietary", "Just a user"],
  },
  {
    id: "business_goal",
    categories: ["business", "general"],
    question: "What's your main goal at this event?",
    options: ["Find a co-founder", "Hire talent", "Get feedback on my project", "Meet investors", "Learn new skills", "Just explore & connect"],
  },
  {
    id: "industry",
    categories: ["tech", "business", "creative", "general"],
    question: "Which industry are you most interested in?",
    options: ["SaaS / Software", "Fintech", "Health Tech", "AI / Machine Learning", "E-commerce", "EdTech", "Gaming", "Sustainability / CleanTech"],
  },
  {
    id: "company_stage",
    categories: ["business"],
    question: "What stage is your project or company?",
    options: ["Just an idea", "Building MVP", "Early traction", "Scaling / Growing", "Established company", "Not applicable"],
  },
  {
    id: "funding_status",
    categories: ["business"],
    question: "What is your current funding status?",
    options: ["Bootstrapped", "Pre-seed / Angel", "Seed", "Series A+", "Looking for grants", "N/A"],
  },
  {
    id: "design_focus",
    categories: ["creative"],
    question: "Where do you spend most of your creative time?",
    options: ["UI / Visual Design", "UX / Interaction", "Product Strategy", "Branding & Motion", "Research & Testing", "Freelancing"],
  },
  {
    id: "ux_methodology",
    categories: ["creative"],
    question: "What is your primary design methodology?",
    options: ["Design Thinking", "Lean UX", "User-Centered Design", "Agile Design", "Data-Driven Design"],
  },
  {
    id: "design_tools",
    categories: ["creative"],
    question: "Which tool is your daily driver?",
    options: ["Figma", "Adobe Creative Suite", "Framer", "Sketch", "Pen & Paper"],
  },
  {
    id: "fave_topic",
    categories: ["general"],
    question: "What's a topic you could talk about for hours?",
    options: ["Tech Trends", "Entrepreneurship", "Creative Arts", "Global Economy", "Personal Growth", "Gaming/Hobbies"],
  },
  {
    id: "collab",
    categories: ["creative", "general", "tech", "business"],
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

interface CustomQuestion {
  id: string;
  categories: string[];
  question: string;
  options: string[];
}

// ─── Main Component ────────────────────────────────────────────────────
export default function NetworkingPage() {
  const { _id } = useParams();
  const [currentStep, setCurrentStep] = useState<"intro" | "category" | "form" | "matching" | "results">("intro");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([]);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionOptions, setNewQuestionOptions] = useState<string[]>(["", ""]);

  const allAvailableQuestions = [...ALL_QUESTIONS, ...customQuestions];

  const filteredQuestions = allAvailableQuestions.filter(q => 
    selectedCategory === "general" ? q.categories.includes("general") : q.categories.includes(selectedCategory || "")
  );

  const handleAddCustomQuestion = () => {
    if (!newQuestionText.trim() || newQuestionOptions.some(opt => !opt.trim())) return;
    
    const newQ: CustomQuestion = {
      id: `custom-${Date.now()}`,
      categories: ["tech", "business", "creative", "general"],
      question: newQuestionText,
      options: newQuestionOptions.filter(opt => opt.trim() !== ""),
    };

    setCustomQuestions([...customQuestions, newQ]);
    setNewQuestionText("");
    setNewQuestionOptions(["", ""]);
    setShowAddQuestion(false);
  };

  const removeCustomQuestion = (id: string) => {
    setCustomQuestions(customQuestions.filter(q => q.id !== id));
  };

  const updateOption = (index: number, value: string) => {
    const newOpts = [...newQuestionOptions];
    newOpts[index] = value;
    setNewQuestionOptions(newOpts);
  };

  const addOptionField = () => {
    setNewQuestionOptions([...newQuestionOptions, ""]);
  };

  const removeOptionField = (index: number) => {
    if (newQuestionOptions.length <= 2) return;
    setNewQuestionOptions(newQuestionOptions.filter((_, i) => i !== index));
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentStep("form");
    setCurrentQuestion(0);
  };

  const handleSelectOption = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleNext = () => {
    if (currentQuestion < filteredQuestions.length - 1) {
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
    } else {
      setCurrentStep("category");
    }
  };

  const currentQ = filteredQuestions[currentQuestion];
  const isAnswered = currentQ ? !!answers[currentQ.id] : false;
  const progress = filteredQuestions.length > 0 ? ((currentQuestion + 1) / filteredQuestions.length) * 100 : 0;

  // ─── INTRO SCREEN ────────────────────────────────────────────────────
  if (currentStep === "intro") {
    return (
      <div className="space-y-6 pb-6 font-sans">
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
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#1B1818] to-[#2d2525] p-6 md:p-8 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#EB5017]/15 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px]" />
          <div className="relative z-10 max-w-xl space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
              <HiSparkles className="text-[#EB5017] text-xs" />
              <span className="text-[9px] font-black uppercase tracking-widest">Smart Matching</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              Find Your <span className="text-[#EB5017]">Perfect</span> Connections
            </h1>
            <p className="text-gray-400 text-xs md:text-sm font-medium leading-relaxed max-w-md">
              Choose your focus area and answer a few quick questions. Our AI matching engine will connect you with the most relevant attendees.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={() => setCurrentStep("category")}
                className="inline-flex items-center justify-center gap-2 bg-[#EB5017] text-white px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-[#d64815] transition-all active:scale-95 shadow-lg shadow-[#EB5017]/20"
              >
                <HiLightning className="text-sm" />
                Start Networking
              </button>
              <button
                onClick={() => { setCurrentStep("results"); }}
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10"
              >
                <HiUserGroup className="text-sm" />
                Browse All
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="relative z-10 grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/10">
            <div>
              <p className="text-xl font-black text-white">128</p>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Participants</p>
            </div>
            <div>
              <p className="text-xl font-black text-[#EB5017]">86%</p>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Match Rate</p>
            </div>
            <div>
              <p className="text-xl font-black text-white">42</p>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Matches</p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="space-y-4">
          <div className="px-2">
            <p className="text-[9px] font-black text-[#eb5017] uppercase tracking-[0.2em] mb-0.5">Process</p>
            <h3 className="text-xl font-black text-[#1B1818] tracking-tight">How It Works</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { step: "01", title: "Select Focus", desc: "Pick your category", icon: "🎯" },
              { step: "02", title: "Quick Quiz", desc: "Share your expertise", icon: "📝" },
              { step: "03", title: "Connect", desc: "Smart relevant matches", icon: "⚡" },
            ].map((item) => (
              <div key={item.step} className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-[9px] font-black text-[#EB5017] uppercase tracking-widest">Step {item.step}</span>
                </div>
                <h4 className="font-black text-xs text-[#1B1818] mb-0.5">{item.title}</h4>
                <p className="text-[10px] text-gray-400 font-medium leading-tight">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── CATEGORY SELECTION ──────────────────────────────────────────────
  if (currentStep === "category") {
    return (
      <div className="min-h-[70vh] flex flex-col font-sans pb-20 justify-center">
        <div className="max-w-4xl mx-auto w-full space-y-10">
          <div className="text-center space-y-3">
            <p className="text-[10px] font-black text-[#eb5017] uppercase tracking-widest">Step 01 of 03</p>
            <h2 className="text-3xl md:text-4xl font-black text-[#1B1818] tracking-tight">Choose Your Focus Area</h2>
            <p className="text-gray-400 text-sm font-medium max-w-lg mx-auto leading-relaxed">
              Select the category that best aligns with your networking goals today. We'll tailor your experience accordingly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {NETWORKING_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className="group relative flex flex-col items-start p-6 rounded-3xl bg-white border border-gray-100 hover:border-[#EB5017] hover:shadow-2xl transition-all duration-500 overflow-hidden text-left"
              >
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500"
                  style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                >
                  {cat.icon}
                </div>
                <h3 className="font-black text-base text-[#1B1818] mb-2 uppercase tracking-tight">{cat.title}</h3>
                <p className="text-xs text-gray-400 font-medium leading-relaxed">{cat.description}</p>
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-[#EB5017]/5 rounded-tl-full translate-x-12 translate-y-12 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700" />
              </button>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <button
               onClick={() => setCurrentStep("intro")}
               className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#1B1818] transition-colors"
            >
              Cancel & Go Back
            </button>
          </div>

          {/* Custom Questions Section */}
          <div className="pt-12 border-t border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-[#1B1818] tracking-tight">Custom Event Questions</h3>
                <p className="text-xs text-gray-400 font-medium">Add specific questions you want attendees to answer for better matching.</p>
              </div>
              {!showAddQuestion && (
                <button
                  onClick={() => setShowAddQuestion(true)}
                  className="inline-flex items-center gap-2 bg-[#EB5017] text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#d64815] transition-all active:scale-95"
                >
                  <HiLightning className="text-sm" />
                  Add Question
                </button>
              )}
            </div>

            {showAddQuestion ? (
              <div className="bg-gray-50 rounded-[32px] p-8 border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="max-w-2xl space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Question Text</label>
                    <input
                      type="text"
                      placeholder="e.g., What is your primary goal for this event?"
                      value={newQuestionText}
                      onChange={(e) => setNewQuestionText(e.target.value)}
                      className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-[#1B1818] focus:border-[#EB5017] focus:ring-4 focus:ring-[#EB5017]/5 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Options</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {newQuestionOptions.map((opt, idx) => (
                        <div key={idx} className="relative group">
                          <input
                            type="text"
                            placeholder={`Option ${idx + 1}`}
                            value={opt}
                            onChange={(e) => updateOption(idx, e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-3.5 text-xs font-bold text-[#1B1818] focus:border-[#EB5017] outline-none transition-all"
                          />
                          {newQuestionOptions.length > 2 && (
                            <button
                              onClick={() => removeOptionField(idx)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-500 transition-colors"
                            >
                              <HiCheck className="rotate-45" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={addOptionField}
                        className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-2xl p-3.5 text-gray-400 hover:border-[#EB5017] hover:text-[#EB5017] transition-all group"
                      >
                        <HiLightning className="text-xs group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Add Option</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <button
                      onClick={handleAddCustomQuestion}
                      className="bg-[#1B1818] text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#2d2525] transition-all"
                    >
                      Save Question
                    </button>
                    <button
                      onClick={() => setShowAddQuestion(false)}
                      className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#1B1818] transition-colors px-4"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customQuestions.map((q) => (
                  <div key={q.id} className="bg-white border border-gray-100 rounded-2xl p-6 group relative hover:shadow-xl transition-all duration-500">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-1.5 bg-[#EB5017]/5 px-2 py-0.5 rounded-full">
                          <HiLightning className="text-[#EB5017] text-[10px]" />
                          <span className="text-[8px] font-black text-[#EB5017] uppercase tracking-widest">Custom</span>
                        </div>
                        <h4 className="font-black text-sm text-[#1B1818] leading-tight">{q.question}</h4>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {q.options.map((opt, i) => (
                            <span key={i} className="text-[9px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
                              {opt}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => removeCustomQuestion(q.id)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <HiCheck className="text-sm rotate-45" />
                      </button>
                    </div>
                  </div>
                ))}
                {customQuestions.length === 0 && (
                  <div className="md:col-span-2 py-12 text-center bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-100">
                    <p className="text-xs text-gray-400 font-medium italic">No custom questions added yet. Tailor your networking experience!</p>
                  </div>
                )}
              </div>
            )}
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
              Question {currentQuestion + 1} of {filteredQuestions.length}
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
                  {NETWORKING_CATEGORIES.find(c => c.id === selectedCategory)?.title}
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
                          <HiCheck className="text-white text-sm" />
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
            onClick={handleBack}
            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-500 font-bold text-sm hover:bg-gray-50 transition-colors"
          >
            Back
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
            {currentQuestion < filteredQuestions.length - 1 ? "Next" : "Find My Matches"}
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
                <HiSparkles className="text-white text-2xl" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-[#1B1818] tracking-tight">Finding Your Matches...</h2>
            <p className="text-sm text-gray-400 font-medium">Analyzing compatibility in the <span className="text-[#EB5017]">{NETWORKING_CATEGORIES.find(c => c.id === selectedCategory)?.title}</span> sector</p>
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
          <p className="text-sm text-gray-400 font-medium">Top compatible attendees in <span className="text-[#EB5017] font-bold">{NETWORKING_CATEGORIES.find(c => c.id === selectedCategory)?.title || "Networking"}</span></p>
        </div>
        <button
          onClick={() => { setCurrentStep("category"); setSelectedCategory(null); setCurrentQuestion(0); setAnswers({}); }}
          className="inline-flex items-center gap-2 bg-white border border-gray-200 text-[#1B1818] px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95 shrink-0"
        >
          <HiLightning className="text-[#EB5017]" />
          Retake Quiz
        </button>
      </div>

      {/* Your Answers Summary */}
      {Object.keys(answers).length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Your Profile Focus</h4>
          <div className="flex flex-wrap gap-2">
             <span className="bg-[#EB5017] text-white px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-tight">
                {NETWORKING_CATEGORIES.find(c => c.id === selectedCategory)?.title}
              </span>
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
              <div className="px-6 pb-5 pt-4 flex items-center gap-3 border-t border-gray-50">
                <button className="inline-flex items-center gap-2 bg-[#EB5017] text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#d64815] transition-all active:scale-95 shadow-lg shadow-[#EB5017]/20">
                  <HiChat className="text-sm" />
                  Send Message
                </button>
                <button className="inline-flex items-center gap-2 bg-white border border-gray-200 text-[#1B1818] px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all">
                  <HiMail className="text-sm" />
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
