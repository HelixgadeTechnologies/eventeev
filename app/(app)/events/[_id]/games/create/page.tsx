
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { 
  HiOutlineChevronDown, 
  HiOutlinePlus, 
  HiOutlineTrash, 
  HiOutlineDuplicate,
  HiOutlinePhotograph,
  HiOutlineViewGrid,
  HiOutlineArrowLeft,
  HiOutlineClock,
  HiOutlineCollection,
  HiX
} from "react-icons/hi";
import { 
  IoSquareOutline, 
  IoTriangleOutline, 
  IoEllipseOutline, 
  IoDiamond 
} from "react-icons/io5";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { eventsService } from "@/lib/services/events.service";
import { quizzesService } from "@/lib/services/quizzes.service";

interface Option {
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: number;
  type: string;
  title: string;
  text: string;
  active: boolean;
  timeLimit: string;
  media: string | null;
  options: Option[];
  isMultiSelect: boolean;
}

const DEFAULT_MAX_QUESTIONS = 30;

export default function CreateQuizPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const _id = params?._id as string;
  
  // Get initial data from query params
  const initialId = searchParams.get("id") || "";
  const initialTitle = searchParams.get("title") || "General Knowledge Quiz";
  const initialDescription = searchParams.get("description") || "A fun quiz to test your knowledge.";
  const initialCategory = searchParams.get("category") || "trivia";

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [quizTitle, setQuizTitle] = useState(initialTitle);
  const [quizDescription, setQuizDescription] = useState(initialDescription);
  const [quizCategory, setQuizCategory] = useState(initialCategory);
  const [quizId, setQuizId] = useState(initialId);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [maxQuestions, setMaxQuestions] = useState(DEFAULT_MAX_QUESTIONS);
  const [questions, setQuestions] = useState<Question[]>([
    { 
      id: 1, 
      type: "Quiz", 
      title: "1. Quiz", 
      text: "", 
      active: true, 
      timeLimit: "20 seconds", 
      media: null,
      isMultiSelect: false,
      options: [
        { text: "Add answer 1", isCorrect: false },
        { text: "Add answer 2", isCorrect: false },
        { text: "Add answer 3", isCorrect: false },
        { text: "Add answer 4", isCorrect: false },
      ]
    },
  ]);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!_id) return;
      const { data, error } = await eventsService.getEventById(_id);
      if (!error && data) {
        const gameSettings = data.settings?.game;
        if (gameSettings?.maxQuestions) {
          setMaxQuestions(gameSettings.maxQuestions);
        }
      }
    };
    fetchSettings();
  }, [_id]);

  const activeQuestion = questions.find(q => q.active) || questions[0];

  const handleAddQuestion = () => {
    if (questions.length >= maxQuestions) {
      alert(`Maximum of ${maxQuestions} questions allowed.`);
      return;
    }
    const newId = Math.max(...questions.map(q => q.id), 0) + 1;
    setQuestions(prev => [
      ...prev.map(q => ({ ...q, active: false })),
      { 
        id: newId, 
        type: "Quiz", 
        title: `${newId}. Quiz`, 
        text: "", 
        active: true, 
        timeLimit: "20 seconds", 
        media: null,
        isMultiSelect: false,
        options: [
          { text: "Add answer 1", isCorrect: false },
          { text: "Add answer 2", isCorrect: false },
          { text: "Add answer 3", isCorrect: false },
          { text: "Add answer 4", isCorrect: false },
        ]
      }
    ]);
  };

  const handleTypeChange = (type: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === activeQuestion.id) {
        const options = type === "True/False" 
          ? [
              { text: "True", isCorrect: false },
              { text: "False", isCorrect: false }
            ]
          : [
              { text: "Add answer 1", isCorrect: false },
              { text: "Add answer 2", isCorrect: false },
              { text: "Add answer 3", isCorrect: false },
              { text: "Add answer 4", isCorrect: false },
            ];
        return { ...q, type, title: `${q.id}. ${type}`, options };
      }
      return q;
    }));
    setIsTypeDropdownOpen(false);
  };

  const handleTimeChange = (timeLimit: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === activeQuestion.id ? { ...q, timeLimit } : q
    ));
    setIsTimeDropdownOpen(false);
  };

  const handleDuplicate = () => {
    if (!activeQuestion) return;
    if (questions.length >= maxQuestions) {
      alert(`Maximum of ${maxQuestions} questions allowed.`);
      return;
    }
    const newId = Math.max(...questions.map(q => q.id), 0) + 1;
    const activeIndex = questions.findIndex(q => q.id === activeQuestion.id);
    const newQuestion = { ...activeQuestion, id: newId, title: `${newId}. ${activeQuestion.type}`, active: true };
    
    const newQuestions = [...questions.map(q => ({ ...q, active: false }))];
    newQuestions.splice(activeIndex + 1, 0, newQuestion);
    setQuestions(newQuestions);
  };

  const handleDelete = (id: number) => {
    if (questions.length <= 1) return;
    setQuestions(prev => {
      const remaining = prev.filter(q => q.id !== id);
      if (prev.find(q => q.id === id)?.active) {
        remaining[remaining.length - 1].active = true;
      }
      return remaining;
    });
  };

  const setActive = (id: number) => {
    setQuestions(prev => prev.map(q => ({ ...q, active: q.id === id })));
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setQuestions(prev => prev.map(q => 
        q.id === activeQuestion.id ? { ...q, media: url } : q
      ));
    }
  };

  const handleRemoveMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuestions(prev => prev.map(q => 
      q.id === activeQuestion.id ? { ...q, media: null } : q
    ));
  };

  const handleQuestionTextChange = (text: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === activeQuestion.id ? { ...q, text } : q
    ));
  };

  const handleOptionTextChange = (index: number, text: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === activeQuestion.id) {
        const newOptions = [...q.options];
        newOptions[index] = { ...newOptions[index], text };
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const handleToggleCorrect = (index: number) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === activeQuestion.id) {
        const newOptions = q.options.map((opt, i) => {
          if (i === index) {
            return { ...opt, isCorrect: q.isMultiSelect ? !opt.isCorrect : true };
          }
          return q.isMultiSelect ? opt : { ...opt, isCorrect: false };
        });
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const handleToggleMultiSelect = (multi: boolean) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === activeQuestion.id) {
        // If switching to single select, keep only the first correct answer
        const newOptions = multi ? q.options : q.options.map((opt, i, arr) => {
          const firstCorrectIndex = arr.findIndex(o => o.isCorrect);
          return { ...opt, isCorrect: i === firstCorrectIndex };
        });
        return { ...q, isMultiSelect: multi, options: newOptions };
      }
      return q;
    }));
  };

  const handleSaveQuiz = async () => {
    setIsSaving(true);
    const payload = {
      id: quizId,
      eventId: _id,
      title: quizTitle,
      description: quizDescription,
      category: quizCategory,
      questions: questions.map(q => ({
        text: q.text,
        mediaUrl: q.media,
        type: q.type,
        options: q.options.map(o => o.text),
        correctAnswer: q.options.reduce((acc, o, i) => o.isCorrect ? [...acc, i] : acc, [] as number[]),
        timeLimit: parseInt(q.timeLimit) || 20,
        points: 0,
        isMultiSelect: q.isMultiSelect
      }))
    };

    try {
      await quizzesService.createQuiz(payload);
      alert("Quiz saved successfully!");
      router.push(`/events/${_id}/games/quiz`);
    } catch (error) {
      console.error("Save Quiz Error:", error);
      alert("Failed to save quiz. Please check all fields.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm font-sans mb-10">
      {/* Header */}
      <header className="h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#344054] hover:text-[#EB5017] font-bold text-sm transition-all group"
          >
            <HiOutlineArrowLeft className="text-lg group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <div className="h-8 w-[1px] bg-gray-200" />
          <div className="flex flex-col">
            <input 
              type="text"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              className="text-sm font-bold text-[#1B1818] bg-transparent outline-none border-b border-transparent focus:border-[#EB5017] w-[200px]"
            />
            <span className="text-[10px] text-gray-400 font-medium italic">Auto-saved at 2:45 PM</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-6 py-2.5 rounded-xl bg-[#F2F4F7] text-[#344054] font-bold text-sm hover:bg-gray-200 transition-all">
            Preview
          </button>
          <button 
            onClick={handleSaveQuiz}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-[#EB5017] text-white font-bold text-sm hover:bg-[#d64815] transition-all shadow-lg shadow-[#EB5017]/20 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Quiz"}
          </button>
          <div className="w-10 h-10 rounded-full bg-[#FFE5D5] border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
             <Image src="/icons/avatar-placeholder.png" alt="Profile" width={40} height={40} />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden h-[calc(100vh-180px)]">
        {/* Left Sidebar - Questions */}
        <aside className="w-[240px] bg-white border-r border-gray-100 flex flex-col shrink-0 relative overflow-hidden h-[calc(100vh-180px)]">
          <div className="absolute inset-0 overflow-y-auto space-y-3 p-4 pb-48 custom-scrollbar">
            {questions.map((q) => (
              <div 
                key={q.id} 
                onClick={() => setActive(q.id)}
                className={`relative p-3 rounded-xl border-2 transition-all cursor-pointer group ${
                  q.active 
                    ? "border-[#EB5017] bg-[#FFF2F0]" 
                    : "border-transparent bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-[#eb5017] uppercase tracking-wider">{q.title}</span>
                  <HiOutlineTrash 
                    onClick={(e) => { e.stopPropagation(); handleDelete(q.id); }}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" 
                  />
                </div>
                <div className="h-14 bg-white/50 rounded-lg border border-dashed border-gray-200 flex items-center justify-center px-2 overflow-hidden">
                  <span className="text-[10px] text-gray-400 font-medium truncate">
                    {q.text || "Start typing..."}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Precise Fixed Alignment Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-transparent space-y-2 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-10">
            <div className="h-[58px]" /> {/* Match height of Duplicate button in right sidebar */}
            <button 
              onClick={handleAddQuestion}
              className="w-full py-4 bg-[#EB5017] text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-3 hover:bg-[#d64815] transition-all shadow-lg shadow-[#EB5017]/10 pointer-events-auto"
            >
              <HiOutlinePlus className="text-xl" />
              Add Question
            </button>
          </div>
        </aside>

        {/* Main Editor Area */}
        <main className="flex-1 overflow-y-auto bg-[#F9FAFB] p-6 flex flex-col items-center custom-scrollbar">
          <div className="w-full max-w-4xl flex flex-col items-center space-y-6">
            {/* Question Input */}
            <div className="w-full flex flex-col items-center gap-2">
              <input 
                type="text" 
                value={activeQuestion.text}
                onChange={(e) => handleQuestionTextChange(e.target.value)}
                placeholder="Start typing your question"
                className="w-full bg-transparent text-center text-3xl font-black text-[#1B1818] placeholder:text-gray-300 outline-none border-none py-2"
              />
              <input 
                type="text" 
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
                placeholder="Add a quiz description (optional)"
                className="w-full bg-transparent text-center text-xs font-medium text-gray-400 placeholder:text-gray-300 outline-none border-none"
              />
            </div>

            {/* Media Upload Area */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-[3/1] max-h-[240px] bg-white rounded-[24px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 relative group hover:border-[#EB5017]/30 transition-all cursor-pointer overflow-hidden"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleMediaUpload}
              />
              
              {activeQuestion.media ? (
                <>
                  <Image 
                    src={activeQuestion.media} 
                    alt="Question media" 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={handleRemoveMedia}
                      className="bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full text-white transition-all transform hover:scale-110"
                    >
                      <HiOutlineTrash size={24} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-[#FFF2F0] text-[#EB5017] flex items-center justify-center shadow-sm">
                    <HiOutlinePhotograph className="text-2xl" />
                  </div>
                  <div className="text-center">
                    <p className="text-base font-bold text-[#1B1818]">Upload Media</p>
                    <p className="text-xs text-gray-400 font-medium mt-1">
                      Drag and drop images or videos here, or paste a link from YouTube.
                    </p>
                  </div>
                  <button className="mt-1 px-6 py-2 bg-[#F2F4F7] text-[#344054] font-bold text-xs rounded-xl hover:bg-gray-200 transition-all">
                    Find media
                  </button>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              {activeQuestion.options.map((option, index) => {
                const colors = [
                  { bg: "bg-[#E21B3C]", icon: <IoTriangleOutline className="absolute left-6 text-white text-3xl stroke-[2.5]" /> },
                  { bg: "bg-[#D89E00]", icon: <IoEllipseOutline className="absolute left-6 text-white text-3xl stroke-[2.5]" /> },
                  { bg: "bg-[#1368CE]", icon: <HiX className="absolute left-6 text-white text-3xl" /> },
                  { bg: "bg-[#26890C]", icon: <IoSquareOutline className="absolute left-6 text-white text-3xl stroke-[2.5]" /> },
                ];
                
                // For True/False, we might want different icons, but the user's request
                // says "Options (4 for quiz option 2 for trur/false)", so we'll use 
                // the first two colors/icons or specific ones.
                const tfIcons = [
                  { bg: "bg-[#1368CE]", icon: <IoDiamond className="absolute left-6 text-white text-3xl" /> },
                  { bg: "bg-[#E21B3C]", icon: <HiX className="absolute left-6 text-white text-3xl" /> },
                ];

                const style = activeQuestion.type === "True/False" ? tfIcons[index] : colors[index];

                return (
                  <div 
                    key={index}
                    className={`h-[80px] ${style.bg} rounded-[16px] relative flex items-center justify-center p-6 shadow-md border-b-4 border-black/20 group hover:brightness-110 transition-all`}
                  >
                    {style.icon}
                    <input 
                      type="text"
                      value={option.text}
                      onChange={(e) => handleOptionTextChange(index, e.target.value)}
                      className="bg-transparent text-white text-[15px] font-bold opacity-90 group-hover:opacity-100 text-center outline-none border-none w-full px-12"
                    />
                    <button 
                      onClick={() => handleToggleCorrect(index)}
                      className={`absolute right-6 w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                        option.isCorrect ? "bg-white border-white" : "border-white/50"
                      }`}
                    >
                      {option.isCorrect && <div className="w-3 h-3 rounded-full bg-[#EB5017]" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* Right Sidebar - Settings */}
        <aside className="w-[320px] bg-white border-l border-gray-100 flex flex-col shrink-0 overflow-hidden text-sm uppercase font-bold text-gray-400">
          <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar uppercase">
            {/* Quiz Category */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#1B1818] uppercase tracking-widest">Quiz Category</label>
              <div className="relative">
                <button 
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:border-[#EB5017] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FFF2F0] text-[#EB5017] flex items-center justify-center">
                      <HiOutlineCollection className="text-xl" />
                    </div>
                    <span className="text-sm font-bold text-[#1B1818]">{quizCategory}</span>
                  </div>
                  <HiOutlineChevronDown className={`text-gray-400 group-hover:text-[#EB5017] transition-transform ${isCategoryDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isCategoryDropdownOpen && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-30 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {["trivia", "science", "music", "history", "geography", "pop-culture"].map((cat) => (
                      <button 
                        key={cat}
                        onClick={() => {
                          setQuizCategory(cat);
                          setIsCategoryDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${quizCategory === cat ? "bg-gray-50 text-[#EB5017]" : "text-[#1B1818]"}`}
                      >
                        <span className="text-sm font-bold capitalize">{cat}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Question Type */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#1B1818] uppercase tracking-widest">Question Type</label>
              <div className="relative">
                <button 
                  onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                  className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:border-[#EB5017] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FFF2F0] text-[#EB5017] flex items-center justify-center">
                      <HiOutlineQuestionMarkCircle className="text-xl" />
                    </div>
                    <span className="text-sm font-bold text-[#1B1818]">{activeQuestion.type}</span>
                  </div>
                  <HiOutlineChevronDown className={`text-gray-400 group-hover:text-[#EB5017] transition-transform ${isTypeDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isTypeDropdownOpen && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button 
                      onClick={() => handleTypeChange("Quiz")}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${activeQuestion.type === "Quiz" ? "bg-gray-50" : ""}`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#FFF2F0] text-[#EB5017] flex items-center justify-center">
                        <HiOutlineQuestionMarkCircle className="text-xl" />
                      </div>
                      <span className="text-sm font-bold text-[#1B1818]">Quiz</span>
                    </button>
                    <button 
                      onClick={() => handleTypeChange("True/False")}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${activeQuestion.type === "True/False" ? "bg-gray-50" : ""}`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#FFF2F0] text-[#EB5017] flex items-center justify-center">
                        <HiOutlineViewGrid className="text-xl" />
                      </div>
                      <span className="text-sm font-bold text-[#1B1818]">True/False</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Time Limit */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#1B1818] uppercase tracking-widest">Time Limit</label>
              <div className="relative">
                <button 
                  onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                  className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:border-[#EB5017] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FFF2F0] text-[#EB5017] flex items-center justify-center">
                      <HiOutlineClock className="text-xl" />
                    </div>
                    <span className="text-sm font-bold text-[#1B1818]">{activeQuestion.timeLimit}</span>
                  </div>
                  <HiOutlineChevronDown className={`text-gray-400 group-hover:text-[#EB5017] transition-transform ${isTimeDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isTimeDropdownOpen && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {["5 seconds", "10 seconds", "15 seconds", "20 seconds"].map((time) => (
                      <button 
                        key={time}
                        onClick={() => handleTimeChange(time)}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${activeQuestion.timeLimit === time ? "bg-gray-50 text-[#EB5017]" : "text-[#1B1818]"}`}
                      >
                        <span className="text-sm font-bold">{time}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>


            {/* Answer Options */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#1B1818] uppercase tracking-widest">Answer Options</label>
              <div className="flex bg-gray-50 p-1.5 rounded-[20px] border border-gray-100">
                <button 
                  onClick={() => handleToggleMultiSelect(false)}
                  className={`flex-1 flex items-center justify-center py-3 rounded-[14px] text-xs font-black transition-all duration-300 ${!activeQuestion.isMultiSelect ? "bg-white text-[#EB5017] shadow-md shadow-black/5 scale-[1.02]" : "text-gray-400 hover:text-[#1B1818]"}`}
                >
                  Single Select
                </button>
                <button 
                  onClick={() => handleToggleMultiSelect(true)}
                  className={`flex-1 flex items-center justify-center py-3 rounded-[14px] text-xs font-black transition-all duration-300 ${activeQuestion.isMultiSelect ? "bg-white text-[#EB5017] shadow-md shadow-black/5 scale-[1.02]" : "text-gray-400 hover:text-[#1B1818]"}`}
                >
                  Multi-select
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-100 space-y-2 bg-white mt-auto">
            <button 
              onClick={handleDuplicate}
              className="w-full py-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-[#1B1818] flex items-center justify-center gap-3 hover:border-[#EB5017] transition-all group shadow-sm"
            >
              <HiOutlineDuplicate className="text-xl text-gray-400 group-hover:text-[#EB5017]" />
              Duplicate
            </button>
            <button 
              onClick={() => activeQuestion && handleDelete(activeQuestion.id)}
              className="w-full py-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-red-500 flex items-center justify-center gap-3 hover:border-red-200 hover:bg-red-50 transition-all group shadow-sm"
            >
              <HiOutlineTrash className="text-xl opacity-70 group-hover:opacity-100" />
              Delete
            </button>
          </div>
        </aside>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E4E7EC;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D0D5DD;
        }
      `}</style>
    </div>
  );
}

// Simple Icon for Question Type
function HiOutlineQuestionMarkCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" {...props}>
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  );
}
