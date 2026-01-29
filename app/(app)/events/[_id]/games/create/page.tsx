
"use client";

import { useState } from "react";
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
  HiX
} from "react-icons/hi";
import { 
  IoSquareOutline, 
  IoTriangleOutline, 
  IoEllipseOutline, 
  IoDiamond 
} from "react-icons/io5";
import { useRouter } from "next/navigation";

export default function CreateQuizPage() {
  const router = useRouter();
  const [quizTitle, setQuizTitle] = useState("General Knowledge Quiz");
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [questions, setQuestions] = useState([
    { id: 1, type: "Quiz", title: "1. Quiz", active: true, timeLimit: "20 seconds" },
  ]);

  const activeQuestion = questions.find(q => q.active) || questions[0];

  const handleAddQuestion = () => {
    const newId = Math.max(...questions.map(q => q.id), 0) + 1;
    setQuestions(prev => [
      ...prev.map(q => ({ ...q, active: false })),
      { id: newId, type: "Quiz", title: `${newId}. Quiz`, active: true, timeLimit: "20 seconds" }
    ]);
  };

  const handleTypeChange = (type: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === activeQuestion.id ? { ...q, type, title: `${q.id}. ${type}` } : q
    ));
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
            <h1 className="text-sm font-bold text-[#1B1818]">{quizTitle}</h1>
            <span className="text-[10px] text-gray-400 font-medium italic">Auto-saved at 2:45 PM</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-6 py-2.5 rounded-xl bg-[#F2F4F7] text-[#344054] font-bold text-sm hover:bg-gray-200 transition-all">
            Preview
          </button>
          <button className="px-6 py-2.5 rounded-xl bg-[#EB5017] text-white font-bold text-sm hover:bg-[#d64815] transition-all shadow-lg shadow-[#EB5017]/20">
            Save Quiz
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
                <div className="h-14 bg-white/50 rounded-lg border border-dashed border-gray-200 flex items-center justify-center">
                  <span className="text-[10px] text-gray-400 font-medium">Start typing...</span>
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
            <input 
              type="text" 
              placeholder="Start typing your question"
              className="w-full bg-transparent text-center text-3xl font-black text-[#1B1818] placeholder:text-gray-300 outline-none border-none py-2"
            />

            {/* Media Upload Area */}
            <div className="w-full aspect-[3/1] max-h-[240px] bg-white rounded-[24px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 relative group hover:border-[#EB5017]/30 transition-all cursor-pointer">
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
            </div>

            {/* Answer Grid */}
            <div className="grid grid-cols-2 gap-4 w-full">
              {activeQuestion.type === "Quiz" ? (
                <>
                  {/* Top Left: Red Triangle (Hollow) */}
                  <div className="h-[80px] bg-[#E21B3C] rounded-[16px] relative flex items-center justify-center p-6 shadow-md cursor-pointer group hover:brightness-110 transition-all border-b-4 border-black/20">
                    <IoTriangleOutline className="absolute left-6 text-white text-3xl stroke-[2.5]" />
                    <span className="text-white text-[15px] font-bold opacity-90 group-hover:opacity-100">Add answer 1</span>
                    <div className="absolute right-6 w-6 h-6 rounded-full border-2 border-white/50" />
                  </div>
                  {/* Top Right: Yellow Circle (Hollow) */}
                  <div className="h-[80px] bg-[#D89E00] rounded-[16px] relative flex items-center justify-center p-6 shadow-md cursor-pointer group hover:brightness-110 transition-all border-b-4 border-black/20">
                    <IoEllipseOutline className="absolute left-6 text-white text-3xl stroke-[2.5]" />
                    <span className="text-white text-[15px] font-bold opacity-90 group-hover:opacity-100">Add answer 2</span>
                    <div className="absolute right-6 w-6 h-6 rounded-full border-2 border-white/50" />
                  </div>
                  {/* Bottom Left: Blue X (Solid) */}
                  <div className="h-[80px] bg-[#1368CE] rounded-[16px] relative flex items-center justify-center p-6 shadow-md cursor-pointer group hover:brightness-110 transition-all border-b-4 border-black/20">
                    <HiX className="absolute left-6 text-white text-3xl" />
                    <span className="text-white text-[15px] font-bold opacity-90 group-hover:opacity-100">Add answer 3</span>
                    <div className="absolute right-6 w-6 h-6 rounded-full border-2 border-white/50" />
                  </div>
                  {/* Bottom Right: Green Square (Hollow) */}
                  <div className="h-[80px] bg-[#26890C] rounded-[16px] relative flex items-center justify-center p-6 shadow-md cursor-pointer group hover:brightness-110 transition-all border-b-4 border-black/20">
                    <IoSquareOutline className="absolute left-6 text-white text-3xl stroke-[2.5]" />
                    <span className="text-white text-[15px] font-bold opacity-90 group-hover:opacity-100">Add answer 4</span>
                    <div className="absolute right-6 w-6 h-6 rounded-full border-2 border-white/50" />
                  </div>
                </>
              ) : (
                <>
                  {/* True Option */}
                  <div className="h-[80px] bg-[#1368CE] rounded-[16px] relative flex items-center justify-center p-6 shadow-md cursor-pointer group hover:brightness-110 transition-all border-b-4 border-black/20">
                    <IoDiamond className="absolute left-6 text-white text-3xl" />
                    <span className="text-white text-[15px] font-bold opacity-90 group-hover:opacity-100 text-center">True</span>
                    <div className="absolute right-6 w-6 h-6 rounded-full border-2 border-white/50" />
                  </div>
                  {/* False Option */}
                  <div className="h-[80px] bg-[#E21B3C] rounded-[16px] relative flex items-center justify-center p-6 shadow-md cursor-pointer group hover:brightness-110 transition-all border-b-4 border-black/20">
                    <HiX className="absolute left-6 text-white text-3xl" />
                    <span className="text-white text-[15px] font-bold opacity-90 group-hover:opacity-100 text-center">False</span>
                    <div className="absolute right-6 w-6 h-6 rounded-full border-2 border-white/50" />
                  </div>
                </>
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar - Settings */}
        <aside className="w-[320px] bg-white border-l border-gray-100 flex flex-col shrink-0 overflow-hidden text-sm uppercase font-bold text-gray-400">
          <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar uppercase">
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

            {/* Points */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-[#1B1818] uppercase tracking-widest">Points</label>
                <span className="text-sm font-black text-[#EB5017]">1,000</span>
              </div>
              <div className="relative h-6 flex items-center">
                <div className="absolute w-full h-1.5 bg-[#F2F4F7] rounded-full" />
                <div className="absolute w-1/2 h-1.5 bg-[#EB5017] rounded-full" />
                <div className="absolute left-1/2 -ml-2.5 w-5 h-5 bg-white border-[5px] border-[#EB5017] rounded-full shadow-md cursor-pointer" />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                <span>0</span>
                <span>1,000</span>
                <span>2,000</span>
              </div>
            </div>

            {/* Answer Options */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#1B1818] uppercase tracking-widest">Answer Options</label>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-[#FFF2F0] border-2 border-[#EB5017] rounded-2xl cursor-pointer">
                   <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border-4 border-[#EB5017] bg-white" />
                    <span className="text-sm font-bold text-[#1B1818]">Single select</span>
                   </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl cursor-pointer hover:border-[#EB5017] transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-200 bg-white" />
                    <span className="text-sm font-bold text-[#1B1818]">Multi-select</span>
                  </div>
                </div>
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
function HiOutlineQuestionMarkCircle(props: any) {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" {...props}>
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  );
}
