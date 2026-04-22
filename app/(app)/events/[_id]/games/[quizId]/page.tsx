"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  HiOutlineChevronRight, 
  HiOutlineUsers, 
  HiOutlinePlay, 
  HiOutlineEye,
  HiOutlineSparkles,
  HiOutlineQuestionMarkCircle
} from "react-icons/hi";
import { LuClock3, LuChartBar } from "react-icons/lu";
import { FiShare2, FiBookmark, FiAlertTriangle } from "react-icons/fi";
import QuestionPreviewCard from "@/components/games/QuestionPreviewCard";
import RelatedQuizItem from "@/components/games/RelatedQuizItem";
import { quizzesService } from "@/lib/services/quizzes.service";
import { toast } from "sonner";


export default function QuizDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params._id as string;
  const quizId = params.quizId as string;

  const [showAnswers, setShowAnswers] = useState(false);
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isHosting, setIsHosting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await quizzesService.getQuiz(quizId);
        setQuiz(data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        toast.error("Failed to load quiz details.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleHostGame = async () => {
    setIsHosting(true);
    try {
      const response = await quizzesService.hostQuiz(quizId);
      // Assuming response contains { pin: string }
      const pin = response.pin;
      router.push(`/events/${eventId}/games/${quizId}/waiting-room?pin=${pin}`);
    } catch (error) {
      console.error("Error hosting game:", error);
      toast.error("Failed to start session.");
    } finally {
      setIsHosting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#eb5017]"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <h1 className="text-2xl font-bold">Quiz not found</h1>
        <Link href={`/events/${eventId}/games`} className="text-[#eb5017] font-bold">Back to Games</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 font-sans space-y-8 bg-gray-50/50 min-h-screen">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm font-semibold text-[#667185]">
        <Link href={`/events/${eventId}/dashboard`} className="hover:text-[#eb5017]">Home</Link>
        <HiOutlineChevronRight className="text-gray-400" />
        <Link href={`/events/${eventId}/games`} className="hover:text-[#eb5017]">Science</Link>
        <HiOutlineChevronRight className="text-gray-400" />
        <span className="text-[#1B1818] truncate">{quiz.title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-grow space-y-12">
          {/* Hero Section */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="relative w-full md:w-[160px] lg:w-[200px] h-[160px] lg:h-[200px] flex-shrink-0 rounded-[24px] overflow-hidden shadow-xl shadow-gray-200">
              <Image src={quiz.thumbnail} alt={quiz.title} fill className="object-cover" />
            </div>

            <div className="flex-grow space-y-4 py-1">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-[#eb5017] uppercase tracking-[0.1em]">
                  {quiz.category}
                </span>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-[#1B1818] leading-tight tracking-tight">
                  {quiz.title}
                </h1>
              </div>

              <p className="text-base md:text-lg text-[#667185] leading-relaxed font-medium max-w-2xl">
                {quiz.description}
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden">
                   <Image src="/icons/avatar-placeholder.png" alt={quiz.author} width={40} height={40} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#1B1818]">By {quiz.author}</span>
                  {quiz.isVerified && (
                    <span className="text-[10px] font-black text-[#667185] uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Verified Creator
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link 
                  href={`/events/${eventId}/games/${params.quizId}/waiting-room`}
                  className="bg-[#eb5017] text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-[#d64815] transition-all transform active:scale-95 shadow-lg shadow-[#eb5017]/20"
                >
                  <HiOutlinePlay className="text-xl" />
                  Play Now
                </Link>
                <button 
                  onClick={handleHostGame}
                  disabled={isHosting}
                  className="bg-white text-[#1B1818] border-2 border-gray-100 px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:border-[#eb5017] hover:text-[#eb5017] transition-all disabled:opacity-50"
                >
                  <HiOutlineUsers className="text-xl" />
                  {isHosting ? "Starting..." : "Host Game"}
                </button>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-[#eb5017]">
                <HiOutlineQuestionMarkCircle className="text-lg bg-[#FFF2F0] p-1 rounded w-6 h-6" />
                <span className="text-[10px] font-black uppercase tracking-wider">Questions</span>
              </div>
              <p className="text-2xl font-black text-[#1B1818]">{quiz.questions?.length || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-[#eb5017]">
                <LuClock3 className="text-lg bg-[#FFF2F0] p-1 rounded w-6 h-6" />
                <span className="text-[10px] font-black uppercase tracking-wider">Avg. Time</span>
              </div>
              <p className="text-2xl font-black text-[#1B1818]">{quiz.avgTime || "15m"}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-[#eb5017]">
                <HiOutlinePlay className="text-lg bg-[#FFF2F0] p-1 rounded w-6 h-6" />
                <span className="text-[10px] font-black uppercase tracking-wider">Plays</span>
              </div>
              <p className="text-2xl font-black text-[#1B1818]">{quiz.plays || "0"}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-[#eb5017]">
                <LuChartBar className="text-lg bg-[#FFF2F0] p-1 rounded w-6 h-6" />
                <span className="text-[10px] font-black uppercase tracking-wider">Level</span>
              </div>
              <p className="text-2xl font-black text-[#1B1818]">{quiz.level || "Med"}</p>
            </div>
          </div>

          {/* Questions Preview */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-[#1B1818] tracking-tight">Questions Preview</h2>
              <button 
                onClick={() => setShowAnswers(!showAnswers)}
                className="bg-white border border-gray-100 px-4 py-2 rounded-xl text-xs font-bold text-[#667185] flex items-center gap-2 hover:border-[#eb5017] transition-all"
              >
                <HiOutlineEye className="text-lg" />
                {showAnswers ? "Hide Answers" : "Show Answers"}
              </button>
            </div>

            <div className="space-y-4">
              {quiz.questions?.map((q: any, i: number) => (
                <QuestionPreviewCard 
                  key={i} 
                  number={i + 1}
                  question={q.text}
                  options={q.options}
                  correctOptionIndex={q.correctAnswer?.[0]}
                  timeLimit={`${q.timeLimit}s`}
                  thumbnail={q.mediaUrl}
                  showAnswer={showAnswers}
                />
              ))}
            </div>

            <div className="flex justify-center pt-4">
              <button className="bg-white border-2 border-gray-100 px-8 py-3 rounded-xl font-bold text-sm text-[#667185] flex items-center gap-2 hover:border-[#eb5017] hover:text-[#eb5017] transition-all">
                <HiOutlineChevronRight className="rotate-90" />
                Load more questions
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[360px] space-y-6">
          {/* Related Quizzes */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3">
              <HiOutlineSparkles className="text-2xl text-[#eb5017]" />
              <h3 className="text-lg font-black text-[#1B1818] tracking-tight">Related Quizzes</h3>
            </div>
            <div className="space-y-6">
              {quiz.relatedQuizzes?.map((q: any) => (
                <RelatedQuizItem key={q.id} {...q} />
              ))}
            </div>
            <button className="w-full bg-gray-50 text-[#667185] py-3.5 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all border border-gray-100">
              Explore All Science Quizzes
            </button>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button className="w-full bg-white border border-gray-100 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-3 hover:border-[#eb5017] transition-all group">
              <FiShare2 className="text-xl text-[#eb5017]" />
              Share with friends
            </button>
            <button className="w-full bg-white border border-gray-100 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-3 hover:border-[#eb5017] transition-all group">
              <FiBookmark className="text-xl text-[#eb5017]" />
              Save to Library
            </button>
            <div className="flex justify-center">
              <button className="text-xs font-bold text-[#667185] flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                <FiAlertTriangle />
                Report this Content
              </button>
            </div>
          </div>

          {/* Rewards Card */}
          <div className="bg-[#FFF8E6] rounded-[24px] border border-[#FFE58F] p-8 space-y-4">
            <h4 className="text-[10px] font-black text-[#eb5017] uppercase tracking-widest">Eventeev Rewards</h4>
            <p className="text-sm font-medium text-[#1B1818] leading-relaxed">
              Complete this quiz with a score over 80% to earn the exclusive <span className="text-[#eb5017] font-black">Star Gazer</span> badge for your profile!
            </p>
          </div>
        </div>
      </div>

      {/* Footer (Simplified as per design) */}
      <footer className="pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 pb-8">
        <div className="flex items-center rotate-[-1deg]">
            <Image src="/logo.svg" alt="Eventeev" width={100} height={24} />
        </div>
        <div className="flex items-center gap-8 text-xs font-bold text-[#667185]">
          <Link href="/about" className="hover:text-[#eb5017]">About Us</Link>
          <Link href="/community" className="hover:text-[#eb5017]">Community</Link>
          <Link href="/privacy" className="hover:text-[#eb5017]">Privacy Policy</Link>
          <Link href="/help" className="hover:text-[#eb5017]">Help Center</Link>
        </div>
        <div className="text-xs font-bold text-[#667185] opacity-60">
          © 2024 Eventeev Platforms Inc.
        </div>
      </footer>
    </div>
  );
}
