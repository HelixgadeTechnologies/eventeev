"use client"
import React from 'react';
import Link from "next/link";
import EventDetailsForm from './eventDetailsForm';
import EventThumbnailForm from './eventThumbnailForm';
import EventSocialsForm from './eventSocialsForm';
import EventFormPreview from './eventFormPreview';
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";

const formSteps = [
  { id: 1, title: "Basic Details", subtitle: "Event Name, Description, Dates..." },
  { id: 2, title: "Category & Media", subtitle: "Banner, Location, Category" },
  { id: 3, title: "Social Links", subtitle: "Website, Instagram, X..." },
  { id: 4, title: "Review & Publish", subtitle: "Final check and launch" },
]

const CreateEventForm = () => {
  const { step } = useAppSelector((state: RootState) => state.createEvent);

  return (
    <div className='flex flex-col lg:flex-row gap-6 h-full max-w-[1200px] mx-auto min-w-0'>
      {/* Main Form Area */}
      <div className='bg-white border border-gray-100 rounded-2xl p-6 md:p-8 flex-1 min-w-0 shadow-sm'>
        {step === 1 ? <EventDetailsForm /> : step === 2 ? <EventThumbnailForm /> : step === 3 ? <EventSocialsForm /> : <EventFormPreview />}
      </div>

      {/* Progress Sidebar */}
      <div className='w-full lg:w-[320px] flex-none flex flex-col gap-4'>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex-1 flex flex-col">
          <h3 className="text-[10px] font-black text-[#888888] uppercase tracking-[0.15em] mb-8">Creation Progress</h3>
          
          <ul className='flex flex-col gap-y-0 w-full relative'>
            {/* Vertical Progress Line */}
            <div className="absolute left-[23px] top-6 bottom-6 w-[2px] bg-gray-100" />
            
            {formSteps.map((item, index) => {
              const isActive = step === item.id;
              const isCompleted = step > item.id;
              
              return (
                <li key={item.id} className="relative pb-8 last:pb-0 group">
                  <div className="flex items-center gap-x-4">
                    {/* Step Icon/Circle */}
                    <div className={`relative z-10 w-12 h-12 rounded-full flex justify-center items-center text-sm transition-all duration-300 border-2 ${
                      isActive 
                        ? "bg-[#F56630] border-[#F56630] text-white font-black shadow-lg shadow-[#F56630]/20" 
                        : isCompleted
                        ? "bg-white border-[#F56630] text-[#F56630] font-black"
                        : "bg-white border-gray-100 text-[#98A2B3] font-bold"
                    }`}>
                      {isCompleted ? "✓" : item.id}
                    </div>
                    
                    {/* Step Text */}
                    <div className='flex flex-col gap-y-0.5 min-w-0'>
                      <p className={`text-xs transition-colors duration-300 ${isActive ? "text-[#101928] font-black" : isCompleted ? "text-[#101928] font-bold" : "text-[#98A2B3] font-bold"}`}>
                        {item.title}
                      </p>
                      <p className={`text-[10px] truncate transition-colors duration-300 ${isActive ? "text-[#475367] font-medium" : "text-gray-400 font-medium"}`}>
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  
                  {/* Inner Progress Segment (Active to Next) */}
                  {index < formSteps.length - 1 && isCompleted && (
                    <div className="absolute left-[23px] top-12 h-8 w-[2px] bg-[#F56630] z-0" />
                  )}
                </li>
              );
            })}
          </ul>

          <div className='mt-auto pt-8 border-t border-gray-50'>
            <div className="bg-[#FFFBF7] border border-orange-50 rounded-xl p-4">
              <p className='text-[#344054] text-xs font-black uppercase tracking-tight mb-1'>Need Help?</p>
              <p className='text-[#98A2B3] text-[10px] font-medium mb-3 leading-relaxed'>Get to know how your campaign can reach a wider audience.</p>
              <Link href="#" className='inline-flex items-center justify-center text-[#F56630] text-[10px] font-black uppercase tracking-wider py-2 px-4 rounded-lg bg-white border border-gray-100 hover:border-[#F56630] transition-all shadow-sm'>
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateEventForm