"use client";

import { useState, useEffect } from "react";
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
  HiOutlinePlus as HiPlus,
  HiOutlineTrash as HiTrash,
} from "react-icons/hi";
import Avatar from "@/components/ui/Avatar";
import { attendeesService } from "@/lib/services/attendees.service";
import CreateCategoryModal, {
  NetworkingCategory,
  QuestionDraft,
  renderCategoryIcon,
} from "@/components/networking/CreateCategoryModal";
import { toast } from "sonner";

// ─── Default Networking Categories ────────────────────────────────────
const DEFAULT_CATEGORIES: NetworkingCategory[] = [
  {
    id: "tech",
    title: "Tech & Innovation",
    iconName: "code",
    description: "Connect with developers, AI researchers, and engineering leads.",
    color: "#EB5017",
  },
  {
    id: "business",
    title: "Business & Growth",
    iconName: "chart",
    description: "Founders, investors, and growth specialists looking to scale.",
    color: "#7C3AED",
  },
  {
    id: "creative",
    title: "Design & Product",
    iconName: "design",
    description: "Product managers, designers, and creative directors.",
    color: "#10B981",
  },
  {
    id: "general",
    title: "General Networking",
    iconName: "puzzle",
    description: "Meet everyone and explore diverse opportunities across all fields.",
    color: "#3B82F6",
  },
];

interface QuestionItem {
  id: string;
  categories: string[];
  question: string;
  options: string[];
  isCustom?: boolean;
}

// ─── Default Questions ─────────────────────────────────────────────────
const DEFAULT_QUESTIONS: QuestionItem[] = [
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

export interface MatchedAttendee {
  id: string | number;
  name: string;
  role: string;
  industry: string;
  goal: string;
  matchScore: number;
  avatar?: string | null;
}

// ─── Main Component ────────────────────────────────────────────────────
export default function NetworkingPage() {
  const params = useParams();
  const _id = params?._id as string;
  const eventId = (Array.isArray(_id) ? _id[0] : _id) || "";

  const [currentStep, setCurrentStep] = useState<"intro" | "category" | "form" | "matching" | "results">("intro");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [matches, setMatches] = useState<MatchedAttendee[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<string | number | null>(null);

  // Dynamic Categories & Questions
  const [categories, setCategories] = useState<NetworkingCategory[]>(DEFAULT_CATEGORIES);
  const [questions, setQuestions] = useState<QuestionItem[]>(DEFAULT_QUESTIONS);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFreshMode, setIsFreshMode] = useState(false);

  // Load persisted custom categories and questions per event
  useEffect(() => {
    if (!eventId) return;
    try {
      const savedCats = localStorage.getItem(`eventeev_networking_cats_${eventId}`);
      if (savedCats) {
        const parsed = JSON.parse(savedCats);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCategories([...DEFAULT_CATEGORIES, ...parsed]);
        }
      }
      const savedQs = localStorage.getItem(`eventeev_networking_questions_${eventId}`);
      if (savedQs) {
        const parsed = JSON.parse(savedQs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const customQs: QuestionItem[] = parsed.map((q: any) => ({ ...q, isCustom: true }));
          setQuestions([...DEFAULT_QUESTIONS, ...customQs]);
        }
      }
    } catch (e) {
      console.warn("Failed to load custom networking categories:", e);
    }
  }, [eventId]);

  const handleSaveCategory = (
    newCat: NetworkingCategory,
    newQs: QuestionDraft[],
    startNow: boolean
  ) => {
    const formattedQuestions: QuestionItem[] = newQs.map((q) => ({
      id: q.id,
      categories: [newCat.id],
      question: q.question,
      options: q.options,
      isCustom: true,
    }));

    setCategories((prev) => {
      const updated = [...prev, newCat];
      if (eventId) {
        try {
          const customOnly = updated.filter((c) => c.isCustom);
          localStorage.setItem(`eventeev_networking_cats_${eventId}`, JSON.stringify(customOnly));
        } catch {}
      }
      return updated;
    });

    setQuestions((prev) => {
      const updated = [...prev, ...formattedQuestions];
      if (eventId) {
        try {
          const customOnly = updated.filter((q) => q.isCustom);
          localStorage.setItem(`eventeev_networking_questions_${eventId}`, JSON.stringify(customOnly));
        } catch {}
      }
      return updated;
    });

    toast.success(`Category "${newCat.title}" created with ${newQs.length} questions!`);

    if (startNow) {
      setSelectedCategory(newCat.id);
      setCurrentStep("form");
      setCurrentQuestion(0);
      setAnswers({});
    }
  };

  const handleDeleteCategory = (catId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCategories((prev) => {
      const updated = prev.filter((c) => c.id !== catId);
      if (eventId) {
        try {
          const customOnly = updated.filter((c) => c.isCustom);
          localStorage.setItem(`eventeev_networking_cats_${eventId}`, JSON.stringify(customOnly));
        } catch {}
      }
      return updated;
    });
    setQuestions((prev) => {
      const updated = prev.filter((q) => !q.categories.includes(catId));
      if (eventId) {
        try {
          const customOnly = updated.filter((q) => q.isCustom);
          localStorage.setItem(`eventeev_networking_questions_${eventId}`, JSON.stringify(customOnly));
        } catch {}
      }
      return updated;
    });
    toast.success("Category deleted.");
  };

  const removeCustomQuestion = (id: string) => {
    setQuestions((prev) => {
      const updated = prev.filter((q) => q.id !== id);
      if (eventId) {
        try {
          const customOnly = updated.filter((q) => q.isCustom);
          localStorage.setItem(`eventeev_networking_questions_${eventId}`, JSON.stringify(customOnly));
        } catch {}
      }
      return updated;
    });
    toast.success("Question removed.");
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentStep("form");
    setCurrentQuestion(0);
    setAnswers({});
  };

  const handleSelectOption = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const filteredQuestions = questions.filter((q) => {
    if (!selectedCategory) return false;
    if (selectedCategory === "general") {
      return q.categories.includes("general");
    }
    return q.categories.includes(selectedCategory);
  });

  const handleNext = async () => {
    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setCurrentStep("matching");
      try {
        if (eventId) {
          const res = await attendeesService.getAttendees(eventId, 1, 50);
          if (res.data && res.data.length > 0) {
            const answerValues = Object.values(answers);
            const computedMatches: MatchedAttendee[] = res.data.map((att, idx) => ({
              id: att.id,
              name: att.name || "Attendee",
              role: "Registered Attendee",
              industry: answers["industry"] || answerValues[0] || activeCategoryObj?.title || "General",
              goal: answers["business_goal"] || answerValues[1] || "Networking & Collaboration",
              matchScore: Math.max(65, 95 - (idx * 4)),
              avatar: null,
            }));
            setMatches(computedMatches);
          } else {
            setMatches([]);
          }
        } else {
          setMatches([]);
        }
      } catch {
        setMatches([]);
      }
      setTimeout(() => setCurrentStep("results"), 1500);
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
  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);

  // ─── INTRO SCREEN ────────────────────────────────────────────────────
  const renderIntro = () => (
    <div className="space-y-6 pb-6 font-sans">
      {/* Back */}
      <div className="px-2">
        <Link
          href={`/events/${eventId}/dashboard`}
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
            Choose your focus area, or create a category and ask a couple of custom questions to connect attendees with mutual goals.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => setCurrentStep("category")}
              className="inline-flex items-center justify-center gap-2 bg-[#EB5017] text-white px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-[#d64815] transition-all active:scale-95 shadow-lg shadow-[#EB5017]/20"
            >
              <HiLightning className="text-sm" />
              Start Networking
            </button>
            <button
              onClick={() => {
                setIsFreshMode(true);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest border border-white/20 transition-all active:scale-95"
            >
              <HiPlus className="text-sm text-[#EB5017]" />
              Create Fresh Category
            </button>
            <button
              onClick={() => { setCurrentStep("results"); }}
              className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest border border-white/10 transition-all"
            >
              <HiUserGroup className="text-sm" />
              Browse All
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/10">
          <div>
            <p className="text-xl font-black text-white">{categories.length}</p>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Focus Tracks</p>
          </div>
          <div>
            <p className="text-xl font-black text-[#EB5017]">86%</p>
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Match Rate</p>
          </div>
          <div>
            <p className="text-xl font-black text-white">{questions.length}</p>
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Questions Pool</p>
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
            { step: "01", title: "Select Or Create Focus", desc: "Pick a category or build a fresh one with custom questions", icon: "🎯" },
            { step: "02", title: "Quick Questionnaire", desc: "Share your expertise and event goals", icon: "📝" },
            { step: "03", title: "Smart Matching", desc: "Get paired with top relevant attendees", icon: "⚡" },
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

  // ─── CATEGORY SELECTION ──────────────────────────────────────────────
  const renderCategory = () => (
      <div className="min-h-[70vh] flex flex-col font-sans pb-20 justify-center">
        <div className="max-w-5xl mx-auto w-full space-y-8">
          <div className="text-center space-y-2">
            <p className="text-[10px] font-black text-[#eb5017] uppercase tracking-widest">Step 01 of 03</p>
            <h2 className="text-3xl md:text-4xl font-black text-[#1B1818] tracking-tight">Choose Your Focus Area</h2>
            <p className="text-gray-400 text-sm font-medium max-w-lg mx-auto leading-relaxed">
              Select an existing category, or create a fresh custom category and ask a couple of targeted questions for matching.
            </p>
          </div>

          {/* Banner: Create Fresh Now / Add Category */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-gray-50/90 to-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EB5017]/10 text-[#EB5017] flex items-center justify-center shrink-0">
                <HiSparkles className="text-xl" />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#1B1818] uppercase tracking-wider">Want A Tailored Networking Track?</h4>
                <p className="text-[11px] text-gray-400 font-medium">Create a category and ask a couple of custom questions for your event attendees.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setIsFreshMode(true);
                  setIsModalOpen(true);
                }}
                className="flex-1 sm:flex-none text-[10px] font-black uppercase tracking-wider text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 whitespace-nowrap"
              >
                Create Fresh Now
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsFreshMode(false);
                  setIsModalOpen(true);
                }}
                className="flex-1 sm:flex-none text-[10px] font-black uppercase tracking-wider text-white bg-[#EB5017] hover:bg-[#d64815] px-4 py-2.5 rounded-xl transition-all shadow-md shadow-[#EB5017]/20 flex items-center justify-center gap-1.5 active:scale-95 whitespace-nowrap"
              >
                <HiPlus />
                + New Category
              </button>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className="group relative flex flex-col items-start p-6 rounded-3xl bg-white border border-gray-100 hover:border-[#EB5017] hover:shadow-2xl transition-all duration-500 overflow-hidden text-left cursor-pointer"
              >
                {/* Custom badge & delete button */}
                {cat.isCustom && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 z-20">
                    <span className="text-[8px] font-black uppercase tracking-wider bg-[#EB5017]/10 text-[#EB5017] px-2 py-0.5 rounded-full border border-[#EB5017]/20">
                      Custom
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteCategory(cat.id, e)}
                      className="text-gray-300 hover:text-red-500 p-1 rounded-lg transition-colors"
                      title="Delete Category"
                    >
                      <HiTrash className="text-sm" />
                    </button>
                  </div>
                )}

                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110 duration-500 shadow-sm"
                  style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                >
                  {renderCategoryIcon(cat.iconName)}
                </div>
                <h3 className="font-black text-base text-[#1B1818] mb-1.5 uppercase tracking-tight">{cat.title}</h3>
                <p className="text-xs text-gray-400 font-medium leading-relaxed line-clamp-2">{cat.description}</p>
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-[#EB5017]/5 rounded-tl-full translate-x-12 translate-y-12 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700" />
              </div>
            ))}

            {/* + Create Category Card */}
            <button
              type="button"
              onClick={() => {
                setIsFreshMode(false);
                setIsModalOpen(true);
              }}
              className="group relative flex flex-col items-center justify-center p-6 rounded-3xl bg-gray-50/70 border-2 border-dashed border-gray-200 hover:border-[#EB5017] hover:bg-[#EB5017]/5 hover:shadow-xl transition-all duration-300 text-center min-h-[180px]"
            >
              <div className="w-12 h-12 rounded-2xl bg-white group-hover:bg-[#EB5017] text-gray-400 group-hover:text-white flex items-center justify-center mb-3 transition-all shadow-sm">
                <HiPlus className="text-2xl" />
              </div>
              <h3 className="font-black text-sm text-[#1B1818] group-hover:text-[#EB5017] uppercase tracking-tight mb-1">
                + Create Category
              </h3>
              <p className="text-[11px] text-gray-400 font-medium leading-relaxed max-w-[200px]">
                Define a custom focus & ask a couple of questions
              </p>
            </button>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={() => setCurrentStep("intro")}
              className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#1B1818] transition-colors"
            >
              Cancel & Go Back
            </button>
          </div>

          {/* Custom Event Questions Pool Section */}
          <div className="pt-10 border-t border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-0.5">
                <h3 className="text-xl font-black text-[#1B1818] tracking-tight">Event Questions Pool</h3>
                <p className="text-xs text-gray-400 font-medium">Add questions available across categories or manage custom prompts.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsFreshMode(false);
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 bg-[#EB5017] text-white px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#d64815] transition-all active:scale-95 shadow-md shadow-[#EB5017]/20"
              >
                <HiPlus />
                Add Questions via Category
              </button>
            </div>

            {questions.filter((q) => q.isCustom).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions
                  .filter((q) => q.isCustom)
                  .map((q) => (
                    <div key={q.id} className="bg-white border border-gray-100 rounded-2xl p-5 group relative hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="inline-flex items-center gap-1 bg-[#EB5017]/10 px-2 py-0.5 rounded-full">
                            <span className="text-[8px] font-black text-[#EB5017] uppercase tracking-widest">Custom Question</span>
                          </div>
                          <h4 className="font-black text-sm text-[#1B1818] leading-tight">{q.question}</h4>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {q.options.map((opt, i) => (
                              <span key={i} className="text-[9px] font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                                {opt}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => removeCustomQuestion(q.id)}
                          className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Delete Question"
                        >
                          <HiTrash className="text-base" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="bg-gray-50/70 border border-dashed border-gray-200 rounded-2xl p-6 text-center">
                <p className="text-xs text-gray-400 font-medium">No custom event questions added yet. Create a category to add custom matching questions.</p>
              </div>
            )}
          </div>
        </div>
      </div>
  );

  // ─── QUESTIONNAIRE FORM ──────────────────────────────────────────────
  const renderForm = () => {
    if (filteredQuestions.length === 0) {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center font-sans max-w-lg mx-auto text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-[#EB5017]/10 text-[#EB5017] flex items-center justify-center text-3xl mx-auto shadow-sm">
            {activeCategoryObj ? renderCategoryIcon(activeCategoryObj.iconName) : <HiSparkles />}
          </div>
          <h2 className="text-2xl font-black text-[#1B1818]">
            No Questions Yet for {activeCategoryObj?.title || "this Category"}
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed font-medium">
            This category doesn't have custom questions configured yet. Click below to add a couple of questions now!
          </p>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => {
                setIsFreshMode(false);
                setIsModalOpen(true);
              }}
              className="bg-[#EB5017] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#d64815] transition-all shadow-lg shadow-[#EB5017]/20"
            >
              + Add Questions Now
            </button>
            <button
              onClick={() => setCurrentStep("category")}
              className="bg-gray-100 text-gray-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
            >
              Back to Categories
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-[80vh] flex flex-col font-sans pb-20">
        {/* Progress bar */}
        <div className="mb-8 max-w-3xl mx-auto w-full">
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
              <div 
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-2"
                style={{
                  backgroundColor: `${activeCategoryObj?.color || "#EB5017"}15`,
                  color: activeCategoryObj?.color || "#EB5017",
                }}
              >
                <span className="text-[9px] font-black uppercase tracking-widest">
                  {activeCategoryObj?.title}
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
                        ? "border-[#EB5017] bg-[#EB5017]/5 text-[#1B1818] shadow-lg shadow-[#EB5017]/10 scale-[1.01]"
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
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100 max-w-2xl mx-auto w-full">
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
  };

  // ─── MATCHING ANIMATION ──────────────────────────────────────────────
  const renderMatching = () => (
    <div className="min-h-[80vh] flex flex-col items-center justify-center font-sans">
      <div className="text-center space-y-8">
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
          <p className="text-sm text-gray-400 font-medium">
            Analyzing compatibility in the <span className="text-[#EB5017] font-bold">{activeCategoryObj?.title}</span> sector
          </p>
        </div>

        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#EB5017] animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 rounded-full bg-[#EB5017] animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 rounded-full bg-[#EB5017] animate-bounce" />
        </div>
      </div>
    </div>
  );

  // ─── RESULTS ─────────────────────────────────────────────────────────
  const renderResults = () => (
    <div className="space-y-8 pb-20 font-sans">
      {/* Back */}
      <div className="px-2">
        <Link
          href={`/events/${eventId}/dashboard`}
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
          <p className="text-sm text-gray-400 font-medium">
            Top compatible attendees in <span className="text-[#EB5017] font-bold">{activeCategoryObj?.title || "Networking"}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsFreshMode(false);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 bg-[#EB5017] text-white px-5 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#d64815] transition-all active:scale-95 shadow-md shadow-[#EB5017]/20"
          >
            <HiPlus />
            New Category
          </button>
          <button
            onClick={() => {
              setCurrentStep("category");
              setSelectedCategory(null);
              setCurrentQuestion(0);
              setAnswers({});
            }}
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-[#1B1818] px-5 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95"
          >
            <HiLightning className="text-[#EB5017]" />
            Retake Quiz
          </button>
        </div>
      </div>

      {/* Your Answers Summary */}
      {Object.keys(answers).length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Your Profile Focus</h4>
          <div className="flex flex-wrap gap-2">
            <span className="bg-[#EB5017] text-white px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-tight">
              {activeCategoryObj?.title}
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
      {matches.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
            <HiUserGroup className="text-3xl" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-gray-700 text-lg">No attendee matches yet</h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Once more attendees register and complete check-in for this event, your smart matches will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
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
                  <Link
                    href={`/events/${eventId}/chat`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 bg-[#EB5017] text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#d64815] transition-all active:scale-95 shadow-lg shadow-[#EB5017]/20"
                  >
                    <HiChat className="text-sm" />
                    Send Message
                  </Link>
                  <button className="inline-flex items-center gap-2 bg-white border border-gray-200 text-[#1B1818] px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all">
                    <HiMail className="text-sm" />
                    Send Email
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="font-sans">
      {currentStep === "intro" && renderIntro()}
      {currentStep === "category" && renderCategory()}
      {currentStep === "form" && renderForm()}
      {currentStep === "matching" && renderMatching()}
      {currentStep === "results" && renderResults()}

      {/* Modal for Creating Category & Asking Questions */}
      <CreateCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        isFresh={isFreshMode}
      />
    </div>
  );
}
