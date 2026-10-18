"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HiOutlineCode, 
  HiOutlineChartBar, 
  HiOutlineColorSwatch, 
  HiOutlinePuzzle, 
  HiOutlineSparkles, 
  HiOutlineLightningBolt, 
  HiOutlineGlobeAlt, 
  HiOutlineHeart,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineLightBulb,
  HiX
} from "react-icons/hi";
import { cn } from "@/lib/utils";

export interface QuestionDraft {
  id: string;
  question: string;
  options: string[];
}

export interface NetworkingCategory {
  id: string;
  title: string;
  description: string;
  iconName: "code" | "chart" | "design" | "puzzle" | "sparkles" | "lightning" | "globe" | "heart";
  color: string;
  isCustom?: boolean;
}

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: NetworkingCategory, questions: QuestionDraft[], startNow: boolean) => void;
  isFresh?: boolean;
}

const COLOR_PALETTE = [
  { label: "Orange", hex: "#EB5017" },
  { label: "Purple", hex: "#7C3AED" },
  { label: "Emerald", hex: "#10B981" },
  { label: "Blue", hex: "#3B82F6" },
  { label: "Rose", hex: "#F43F5E" },
  { label: "Amber", hex: "#F59E0B" },
  { label: "Cyan", hex: "#06B6D4" },
  { label: "Indigo", hex: "#6366F1" },
];

const ICON_OPTIONS = [
  { id: "sparkles", label: "Innovation / AI", icon: HiOutlineSparkles },
  { id: "code", label: "Tech / Code", icon: HiOutlineCode },
  { id: "chart", label: "Business / Growth", icon: HiOutlineChartBar },
  { id: "design", label: "Design / Creative", icon: HiOutlineColorSwatch },
  { id: "puzzle", label: "Networking", icon: HiOutlinePuzzle },
  { id: "lightning", label: "Startups / Speed", icon: HiOutlineLightningBolt },
  { id: "globe", label: "Global / Remote", icon: HiOutlineGlobeAlt },
  { id: "heart", label: "Social / Impact", icon: HiOutlineHeart },
] as const;

const CATEGORY_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  code: HiOutlineCode,
  chart: HiOutlineChartBar,
  design: HiOutlineColorSwatch,
  puzzle: HiOutlinePuzzle,
  sparkles: HiOutlineSparkles,
  lightning: HiOutlineLightningBolt,
  globe: HiOutlineGlobeAlt,
  heart: HiOutlineHeart,
};

export function renderCategoryIcon(iconName: string, className = "text-2xl") {
  const IconComponent = CATEGORY_ICON_MAP[iconName] || HiOutlineSparkles;
  return <IconComponent className={className} />;
}

export default function CreateCategoryModal({
  isOpen,
  onClose,
  onSave,
  isFresh = false,
}: CreateCategoryModalProps) {
  const [title, setTitle] = useState(isFresh ? "Custom Networking Track" : "");
  const [description, setDescription] = useState(
    isFresh ? "Connect with professionals sharing these specific interests and goals." : ""
  );
  const [selectedColor, setSelectedColor] = useState("#EB5017");
  const [selectedIcon, setSelectedIcon] = useState<NetworkingCategory["iconName"]>("sparkles");

  // Questions to ask for this category
  const [questions, setQuestions] = useState<QuestionDraft[]>([
    {
      id: `q-${Date.now()}-1`,
      question: "What is your main area of focus in this space?",
      options: ["Early-stage builder", "Industry expert", "Consultant / Advisor", "Explorer / Enthusiast"],
    },
    {
      id: `q-${Date.now()}-2`,
      question: "What are you primarily looking for from connections?",
      options: ["Co-founders & Partners", "Clients & Projects", "Mentorship & Advice", "Casual Collaboration"],
    },
  ]);

  const [formError, setFormError] = useState("");

  // Clean reset whenever modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTitle(isFresh ? "Custom Networking Track" : "");
      setDescription(
        isFresh ? "Connect with professionals sharing these specific interests and goals." : ""
      );
      setSelectedColor("#EB5017");
      setSelectedIcon("sparkles");
      setQuestions([
        {
          id: `q-${Date.now()}-1`,
          question: "What is your main area of focus in this space?",
          options: ["Early-stage builder", "Industry expert", "Consultant / Advisor", "Explorer / Enthusiast"],
        },
        {
          id: `q-${Date.now()}-2`,
          question: "What are you primarily looking for from connections?",
          options: ["Co-founders & Partners", "Clients & Projects", "Mentorship & Advice", "Casual Collaboration"],
        },
      ]);
      setFormError("");
    }
  }, [isOpen, isFresh]);

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: `q-${Date.now()}-${prev.length + 1}`,
        question: "",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
      },
    ]);
  };

  const handleRemoveQuestion = (qIndex: number) => {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((_, i) => i !== qIndex));
  };

  const handleQuestionTextChange = (qIndex: number, text: string) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex] = { ...updated[qIndex], question: text };
      return updated;
    });
  };

  const handleOptionChange = (qIndex: number, optIndex: number, value: string) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const newOpts = [...updated[qIndex].options];
      newOpts[optIndex] = value;
      updated[qIndex] = { ...updated[qIndex], options: newOpts };
      return updated;
    });
  };

  const handleAddOption = (qIndex: number) => {
    setQuestions((prev) => {
      const updated = [...prev];
      if (updated[qIndex].options.length >= 8) return prev;
      updated[qIndex] = {
        ...updated[qIndex],
        options: [...updated[qIndex].options, `Option ${updated[qIndex].options.length + 1}`],
      };
      return updated;
    });
  };

  const handleRemoveOption = (qIndex: number, optIndex: number) => {
    setQuestions((prev) => {
      const updated = [...prev];
      if (updated[qIndex].options.length <= 2) return prev;
      updated[qIndex] = {
        ...updated[qIndex],
        options: updated[qIndex].options.filter((_, idx) => idx !== optIndex),
      };
      return updated;
    });
  };

  const handleLoadTemplate = () => {
    setTitle("Special Interest Group");
    setDescription("Meet attendees with shared specialization, goals, and opportunities.");
    setSelectedColor("#7C3AED");
    setSelectedIcon("lightning");
    setQuestions([
      {
        id: `q-${Date.now()}-1`,
        question: "What best describes your current project or role?",
        options: ["Lead / Manager", "Specialist / Contributor", "Founder / Creator", "Strategist"],
      },
      {
        id: `q-${Date.now()}-2`,
        question: "Which topic do you most want to discuss?",
        options: ["Scaling & Execution", "Tools & Frameworks", "Emerging Opportunities", "Collaborative Projects"],
      },
      {
        id: `q-${Date.now()}-3`,
        question: "What is your preferred format to connect?",
        options: ["1-on-1 Deep Dive", "Group Coffee Chat", "Async Project Sharing", "Open to All"],
      },
    ]);
  };

  const handleSave = (startNow: boolean) => {
    if (!title.trim()) {
      setFormError("Please enter a category title.");
      return;
    }

    const invalidQ = questions.find((q) => !q.question.trim());
    if (invalidQ) {
      setFormError("Please provide text for all questions.");
      return;
    }

    const invalidOpts = questions.find((q) => q.options.some((opt) => !opt.trim()));
    if (invalidOpts) {
      setFormError("Please ensure all answer options have text.");
      return;
    }

    setFormError("");

    const categoryId = `cat-${Date.now()}-${title.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 16)}`;

    const newCategory: NetworkingCategory = {
      id: categoryId,
      title: title.trim(),
      description: description.trim() || `Networking questions and smart matching for ${title.trim()}`,
      iconName: selectedIcon,
      color: selectedColor,
      isCustom: true,
    };

    onSave(newCategory, questions, startNow);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-[32px] shadow-2xl border border-gray-100 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-[#1B1818]"
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gradient-to-r from-gray-50/60 to-white">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-[#EB5017]/10 px-2.5 py-0.5 rounded-full mb-1.5">
                  <HiOutlineLightBulb className="text-[#EB5017] text-xs" />
                  <span className="text-[9px] font-black text-[#EB5017] uppercase tracking-widest">
                    {isFresh ? "Fresh Questionnaire" : "New Category"}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-[#1B1818] tracking-tight">
                  {isFresh ? "Create a Fresh Category & Questions" : "Create Networking Category"}
                </h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Ask a couple of questions so attendees can connect over shared goals.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleLoadTemplate}
                  className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#EB5017] bg-[#EB5017]/5 hover:bg-[#EB5017]/10 px-3 py-2 rounded-xl transition-all"
                  title="Auto-fill with sample questions"
                >
                  <HiOutlineSparkles />
                  Sample Template
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-black flex items-center justify-center transition-all"
                >
                  <HiX className="text-lg" />
                </button>
              </div>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-bold animate-shake">
                  {formError}
                </div>
              )}

              {/* 1. Category Meta */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-[#EB5017] uppercase tracking-widest">
                  1. Category Details
                </h4>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                    Category Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., AI & Robotics, Healthcare Innovation, Real Estate..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-gray-50/70 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-[#1B1818] focus:border-[#EB5017] focus:bg-white focus:ring-2 focus:ring-[#EB5017]/10 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                    Short Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Connect with engineers, researchers, and early builders."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-gray-50/70 border border-gray-100 rounded-2xl px-4 py-3 text-xs font-bold text-[#1B1818] focus:border-[#EB5017] focus:bg-white focus:ring-2 focus:ring-[#EB5017]/10 outline-none transition-all"
                  />
                </div>

                {/* Color & Icon Pickers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Theme Color */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                      Theme Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {COLOR_PALETTE.map((c) => (
                        <button
                          type="button"
                          key={c.hex}
                          onClick={() => setSelectedColor(c.hex)}
                          className={cn(
                            "w-7 h-7 rounded-full transition-transform active:scale-90 relative flex items-center justify-center",
                            selectedColor === c.hex
                              ? "scale-110 ring-2 ring-offset-2 ring-[#1B1818]"
                              : "hover:scale-105"
                          )}
                          style={{ backgroundColor: c.hex }}
                          title={c.label}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                      Icon
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {ICON_OPTIONS.map((item) => {
                        const Icon = item.icon;
                        const isSelected = selectedIcon === item.id;
                        return (
                          <button
                            type="button"
                            key={item.id}
                            onClick={() => setSelectedIcon(item.id)}
                            className={cn(
                              "w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all",
                              isSelected
                                ? "bg-[#1B1818] text-white shadow-md scale-105"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            )}
                            title={item.label}
                          >
                            <Icon />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Questions Section */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-[10px] font-black text-[#EB5017] uppercase tracking-widest">
                      2. Ask A Couple Of Questions
                    </h4>
                    <p className="text-xs text-gray-400 font-medium">
                      Attendees in this category will answer these questions for intelligent pairing.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-white bg-[#EB5017] hover:bg-[#d64815] px-3.5 py-2 rounded-xl transition-all shadow-md shadow-[#EB5017]/20 active:scale-95"
                  >
                    <HiOutlinePlus />
                    Add Question
                  </button>
                </div>

                <div className="space-y-4">
                  {questions.map((q, qIndex) => (
                    <div
                      key={q.id}
                      className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100 space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 bg-white px-2 py-0.5 rounded-md border border-gray-100">
                          Question {qIndex + 1}
                        </span>
                        {questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(qIndex)}
                            className="text-gray-300 hover:text-red-500 transition-colors p-1"
                            title="Remove Question"
                          >
                            <HiOutlineTrash className="text-base" />
                          </button>
                        )}
                      </div>

                      {/* Question Text */}
                      <input
                        type="text"
                        placeholder="e.g., What best describes your primary skill or objective?"
                        value={q.question}
                        onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
                        className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-bold text-[#1B1818] focus:border-[#EB5017] outline-none transition-all shadow-sm"
                      />

                      {/* Options */}
                      <div className="space-y-2 pt-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block px-1">
                          Multiple Choice Options
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, optIdx) => (
                            <div key={optIdx} className="relative flex items-center">
                              <input
                                type="text"
                                placeholder={`Option ${optIdx + 1}`}
                                value={opt}
                                onChange={(e) => handleOptionChange(qIndex, optIdx, e.target.value)}
                                className="w-full bg-white border border-gray-100 rounded-xl pl-3 pr-7 py-2 text-xs font-semibold text-[#1B1818] focus:border-[#EB5017] outline-none transition-all"
                              />
                              {q.options.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveOption(qIndex, optIdx)}
                                  className="absolute right-2 text-gray-300 hover:text-red-500 transition-colors"
                                  title="Remove option"
                                >
                                  <HiX className="text-xs" />
                                </button>
                              )}
                            </div>
                          ))}
                          {q.options.length < 8 && (
                            <button
                              type="button"
                              onClick={() => handleAddOption(qIndex)}
                              className="border border-dashed border-gray-200 rounded-xl py-2 px-3 text-center text-[10px] font-black text-gray-400 hover:border-[#EB5017] hover:text-[#EB5017] transition-all bg-white/50"
                            >
                              + Add Option
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/50 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#1B1818] transition-colors py-2 px-4"
              >
                Cancel
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleSave(false)}
                  className="flex-1 sm:flex-none bg-white border border-gray-200 hover:border-gray-300 text-[#1B1818] px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
                >
                  Save Category
                </button>
                <button
                  type="button"
                  onClick={() => handleSave(true)}
                  className="flex-1 sm:flex-none bg-[#EB5017] hover:bg-[#d64815] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-[#EB5017]/25 flex items-center justify-center gap-1.5"
                >
                  <HiOutlineLightningBolt className="text-sm" />
                  Save & Start Now
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
