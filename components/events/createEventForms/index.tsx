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
  { id: 1, title: "Create New Campaign", subitile: "Event Name, Description, Start date, End Date ...." },
  { id: 2, title: "Add category", subitile: "Banner,Event Type,Location, Category" },
  { id: 3, title: "Add Socials", subitile: "Website, Facebook, Instagram, X (Twitter)" },
  { id: 4, title: "Review and Publish", subitile: "Setup your customer journey flow" },
]

const CreateEventForm = () => {
  const { step } = useAppSelector((state: RootState) => state.createEvent);

  return (
    <div className='flex flex-col md:flex-row gap-x-7'>
      <div className='bg-white border border-[#E4E7Ec] rounded-[10px] p-6 pt-8 w-full md:w-7/12 lg:w-8/12'>
        {step === 1 ? <EventDetailsForm /> : step === 2 ? <EventThumbnailForm /> : step === 3 ? <EventSocialsForm /> : <EventFormPreview />}
      </div>
      <div className='bg-white border border-[#E4E7Ec] rounded-[10px] p-6 w-full md:w-5/12 lg:w-4/12 flex flex-col justify-between'>
        <ul className='flex flex-col gap-y-6 w-full'>{formSteps.map(item => (
          <li key={item.id} className={`flex items-center gap-x-4 ${step === item.id ? "" : ""}`}>
            <div className={`w-12 h-12 rounded-full flex justify-center items-center text-xl ${step === item.id ? "bg-[#F56630] text-white font-bold" : "border border-[#98A2B3] bg-white text-[#98A2B3] font-medium"}`}>{ item.id }</div>
            <div className='flex flex-col gap-y-1 flex-1'>
              <p className={`text-base ${step === item.id ? "text-[#101928] font-semibold" : "font-medium" }`}>{item.title}</p>
              <p className={`text-xs line-clamp-1 font-normal ${step === item.id ? "text-[#475367]" : "text-[#667185]" }`}>{item.subitile}</p>
            </div>
          </li>
        ))}</ul>

        <div className='flex flex-col'>
          <p className='text-[#344054] text-base font-semibold mb-1'>Need Help?</p>
          <p className='text-[#98A2B3] text-sm font-normal mb-3'>Get to know how your campaign can reach a wider audience.</p>
              <Link href="#" className='flex justify-center items-center text-[#667185] text-sm font-semibold py-2 px-4 rounded-[8px] w-fit bg-white border border-[#667185]'>Contact Us</Link>
        </div>
      </div>
    </div>
  )
}

export default CreateEventForm