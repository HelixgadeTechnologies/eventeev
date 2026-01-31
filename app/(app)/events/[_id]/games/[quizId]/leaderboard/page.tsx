"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiOutlineChevronRight, HiOutlineTrophy, HiOutlineFire, HiOutlineArrowTrendingUp, HiOutlineRocketLaunch, HiOutlineCog6Tooth, HiOutlineSpeakerWave } from "react-icons/hi2";

export default function LeaderboardPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?._id;
  const quizId = params?.quizId;
  const [progress, setProgress] = useState(0);

  const handleNextQuestion = () => {
    router.push(`/events/${eventId}/games/${quizId}/intro`);
  };

  useEffect(() => {
    // Start progress animation
    const timer = setTimeout(() => {
      setProgress(100);
    }, 100);

    // Auto navigate after 5 seconds
    const navigationTimer = setTimeout(() => {
      handleNextQuestion();
    }, 5100);

    return () => {
      clearTimeout(timer);
      clearTimeout(navigationTimer);
    };
  }, []);

  const leaderboard = [
    { rank: 2, name: "TriviaKing_99", points: "11,200", gained: "+720", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMQVUVfDcl_BSZSeuVf2BeAHhTZlb2RhoubZm2Jr54OJUCpFIxwgTNlrIPllfl-nPqCR2XEYME1f9DWspgwyy0PqTFojsMTfyAXep_ItSGiGmwHiKlLvxoSSowttHoIle1dyHbVFcYbcJeQ4qNrAgUPBpSte6irDOdEo--xLDKd7pdoI-UWxkFv1UcknQflgEbTmFnuSOcB7VHJi1aHuPErHdhM5FXNnMn4xbHI1FmhXVpAVN5Di3ZPy9F99KDfNzpBbtOMwK8ad8", message: "Keep it up! Close gap." },
    { rank: 3, name: "BrainyJane", points: "10,950", gained: "+610", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCn0CjJqxRnQkxlnBnGPwGkx6csnB7l8uwPIcsiv-i-mm3wKuj1VXYx11wE60PYMobz9zde-WXeqnps1TAqy93CxGzbTia3-HVmIxL86naKvKbyTRjOhfEWzdJJeajA-wbEfMcUzR3J8N9Yu9nqGjCBXiqyWMVVUqxzPeF47Bw-JgNhQS97B59y5P93nf4J9Cvh8-0Wtg_n5z9FUFbGQNSktaYV48kRmLWpN__TfoYXKNvQZv0yGKwtp1tRWJnvu_YzNOSlMsMqZ_g", message: "On fire today!" },
    { rank: 4, name: "CyberSeeker", points: "9,800", gained: "+450", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZVDw93gGRQRd9QuRC6Q3EpHFFPRd-XIWEo4Tiwoeppuojeo5I8gFHtDqllugRd7NboVYCEXLvZMJ7j-HM_sOBz5lTP0ijN87cO2CUVU0rRzjiUK44vI3Ru8-vWyp9lqp77IEPgXayoXgqBl59Cj1imFW1CyyQDTshU7GLpDb-fMgwLEQNbuQtOoeAa80_hsUAIkjzEVqfMUxfou6HJnDfhlHg3KkqpJwGKTG6EfAIFq9I4p-pejR7gWDSz1wHdebujAV_kuMp4P8", message: "Moving up fast." },
    { rank: 5, name: "SmartyPants", points: "9,420", gained: "+320", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtChap5fsALJElgiqUu4jor99JzUzqzXziOCUvFZRUHACN17NNY7EUSiCDiAz8IaCzI6gK803WHLrI2p35UnMjV8sbFNc5-7h7kTXDmzRM5xRpPuLAiJggSl9etcZTHGUWxMyOcVJ-A653Yy3b4MBUZa7q30jfl4kyWx2DnQPET-sSf598EkClTRhcCkyO6nX2yhN3naS7_jl5IuF6lX3lhMpF4cZg4YtqshNnrLZ_0z6W7Pqv72tHuib12NZxoaHuUnF-2pauIR8", message: "Holding steady." },
  ];

  return (
    <div className="fixed inset-0 bg-[#F8F7F5] flex flex-col font-sans text-[#1c140d] overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-8">
        <div className="max-w-[760px] w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1 mb-1 text-center">
            <h2 className="text-[48px] font-black leading-none tracking-tight font-feather uppercase">Leaderboard</h2>
            <p className="text-[#9c7349] text-base font-bold opacity-70">Question 7 of 15 • Standings updated</p>
          </div>

          {/* 1st Place Highlight Card */}
          <div className="relative rounded-[28px] overflow-hidden shadow-2xl shadow-[#f48c25]/20 bg-[#f48c25] text-white flex flex-col md:flex-row ring-6 ring-[#f48c25]/10 animate-in fade-in slide-in-from-bottom-8 duration-700">
             <div className="md:w-[28%] aspect-square relative bg-gray-200">
               <img 
                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBnKgN_ceXyFP8eAnDuclQlZK8YnW16ndR346p5X_2PXT8obw60STjkgm_L0vBHwgNWZwjDVFt160VchUD_Mq5XROE7aLBqU96TDDC0hff5kuFduegbzvmr-l_RY8JShAm4fMO7RxABE7Ng0CRGj-i7dkfQG-ChADxUiqzxuvCk6I9F3-ggxoH76XSbZDiUSHTPavMSCzsEAviYmdwUv9im-6WXjyJJ8d19jjOjUJ3VvDYKB2cV-268uJI4IK0cbc9ddyQ-vap3DM" 
                 alt="Leader Avatar"
                 className="object-cover w-full h-full"
               />
               <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#f48c25]/20" />
             </div>
             
             <div className="flex-1 p-6 md:p-7 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-1">
                  <HiOutlineTrophy className="text-yellow-300 size-5" />
                  <span className="text-[10px] font-black tracking-widest uppercase opacity-80">CURRENT LEADER</span>
                </div>
                <h3 className="text-2xl font-black font-feather mb-3 uppercase">QuizMaster Pro</h3>
                
                <div className="flex items-end justify-between">
                  <div className="flex flex-col">
                    <span className="text-4xl font-black leading-none tracking-tight">12,450 pts</span>
                    <div className="flex items-center gap-2 mt-1.5 text-white font-bold">
                       <HiOutlineArrowTrendingUp className="size-4" />
                       <span className="text-xs">+850 Points Gained!</span>
                    </div>
                  </div>
                  
                  <div className="bg-white/20 px-4 py-1.5 rounded-xl border border-white/30 backdrop-blur-md">
                     <span className="text-[9px] font-black opacity-60 uppercase tracking-widest">STREAK</span>
                     <div className="flex items-center gap-2 mt-0">
                        <HiOutlineFire className="text-orange-200 size-4" />
                        <span className="text-lg font-black">12</span>
                     </div>
                  </div>
                </div>
             </div>
          </div>

          {/* Ranks 2-5 List */}
          <div className="flex flex-col gap-2.5">
            {leaderboard.map((player) => (
              <div 
                key={player.rank}
                className="flex items-center gap-4 bg-white border border-[#f4ede7] rounded-[20px] p-4 shadow-sm hover:shadow-lg hover:scale-[1.005] transition-all duration-300 animate-in fade-in slide-in-from-left-8"
                style={{ animationDelay: `${player.rank * 100}ms` }}
              >
                <div className="flex items-center gap-5 flex-1">
                  <span className="text-xl font-black text-[#9c7349]/40 w-6">{player.rank}</span>
                  <div className="size-11 rounded-full overflow-hidden border-2 border-[#f4ede7] relative shrink-0">
                    <img src={player.avatar} alt={player.name} className="object-cover w-full h-full" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-black font-feather uppercase">{player.name}</span>
                    <span className="text-[#9c7349] text-xs font-bold opacity-60">{player.message}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <span className="text-xl font-black leading-none">{player.points} pts</span>
                  <span className="text-[#26890C] font-black text-[10px] mt-0.5">{player.gained} gained</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Nav / Host Control */}
      <div className="fixed bottom-10 right-10 z-20 flex items-center animate-in slide-in-from-right-12 duration-1000">
        <div className="hidden md:flex flex-col items-end mr-5">
          <span className="text-[10px] font-black text-[#f48c25] tracking-[0.2em] uppercase mb-1">Host Control</span>
          <span className="text-xs font-medium opacity-40">Ready for next question?</span>
        </div>
        <button 
          onClick={handleNextQuestion}
          className="flex items-center justify-center gap-3 bg-[#f48c25] text-white px-8 py-4 rounded-2xl shadow-2xl shadow-[#f48c25]/40 hover:scale-105 hover:bg-[#d67a1d] active:scale-95 transition-all duration-300 group"
        >
          <span className="text-base font-black tracking-wider uppercase">NEXT QUESTION</span>
          <HiOutlineChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Decorative Bottom Bar */}
      <div 
        className="fixed bottom-0 left-0 h-2 bg-[#f48c25] rounded-r-full shadow-lg z-10 transition-all duration-[5000ms] ease-linear" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
