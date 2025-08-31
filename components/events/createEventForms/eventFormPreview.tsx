"use client"
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { RootState } from "@/store/store";
import {
  setNextStep,
  setPrevStep,
  updateForm,
} from "@/store/features/create-event/createEventSlice";
import { createEventData } from "@/types/create-event";
import { formatFileSize, formatLastModified } from "@/lib/utils/file-utils";
import document from "@/public/document.svg";

const EventFormPreview = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { formData } = useAppSelector((state: RootState) => state.createEvent);
  const { handleSubmit } = useForm({
    mode: "all",
    defaultValues: formData,
  });

  const handlePrevStep = () => dispatch(setPrevStep());

  const onSubmit = (data: createEventData = formData) => {
    console.log(data);
    window.location.reload();
  };

  return (
    <div>
      <div className="flex flex-col items-center gap-y-2 mb-8">
        <h4 className="!font-sans text-[#1A1A21] font-semibold text-2xl">
          Event Review
        </h4>
        <p className="text-base text-[#8c94A6] font-normal">
          Fill out these details to create your event
        </p>
      </div>
      <div className="flex justify-center gap-x-4">
        <div className="w-7/12 border-b border-b-[#F0F2F5] pb-6 flex gap-x-2 mb-4">
          <Image src={document} alt="document icon" />
          <div className="flex flex-col gap-y-0.5">
            <p className="text-base text-black font-semibold">Event Banner</p>
            <div className="flex items-center gap-x-0.5">
              <p className="text-sm text-[#98A2B3] font-semibold">
                {formatLastModified(formData.thumbnail?.lastModified)} .{" "}
                {formatFileSize(formData.thumbnail?.size)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-4">
        <p className="border-t border-t-[#F0F2F5] pt-4 text-[#1D2739] font-medium text-sm">
          <strong>Event Name:</strong> {formData.name}
        </p>
        <p className="border-t border-t-[#F0F2F5] pt-4 text-[#1D2739] font-medium text-sm">
          <strong>Event Description:</strong> {formData.description}
        </p>
        <div className="border-t border-t-[#F0F2F5] pt-4 flex items-center gap-x-2">
          <p className="text-[#1D2739] font-medium text-sm">
            <strong>Start Date:</strong> {formData.startDate}
          </p>
          <p className="text-[#1D2739] font-medium text-sm">
            <strong>Stop Date:</strong> {formData.stopDate}
          </p>
        </div>
        <div className="border-t border-t-[#F0F2F5] pt-4 flex items-center gap-x-2">
          <p className="text-[#1D2739] font-medium text-sm">
            <strong>Start Time:</strong> {formData.startTime}
          </p>
          <p className="text-[#1D2739] font-medium text-sm">
            <strong>Stop Time:</strong> {formData.stopTime}
          </p>
        </div>
        <p className="border-t border-t-[#F0F2F5] pt-4 text-[#1D2739] font-medium text-sm">
          <strong>Event Type:</strong> {formData.eventType}
        </p>
        <p className="border-t border-t-[#F0F2F5] pt-4 text-[#1D2739] font-medium text-sm">
          <strong>Location:</strong> {formData.location}
        </p>
        <p className="border-t border-t-[#F0F2F5] pt-4 text-[#1D2739] font-medium text-sm">
          <strong>Category:</strong> {formData.category}
        </p>
        <div className="border-t border-t-[#F0F2F5] pt-4 flex items-center gap-x-8">
          <button
            type="button"
            onClick={handlePrevStep}
            className="text-[#F56630] border border-[#F56630] w-4/12 flex justify-center items-center text-base font-semibold py-4 rounded-[8px] cursor-pointer"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={handlePrevStep}
            className="text-[#F56630] border border-[#F56630] w-4/12 flex justify-center items-center text-base font-semibold py-4 rounded-[8px] cursor-pointer"
          >
            Save
          </button>
          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            className="text-white border border-[#F56630] bg-[#F56630] w-4/12 flex justify-center items-center text-base font-semibold py-4 rounded-[8px] cursor-pointer"
          >
            Publish Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventFormPreview;
