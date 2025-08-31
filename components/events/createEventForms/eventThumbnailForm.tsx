import React from "react";
import FileInput from "@/components/ui/FileInput";
import InputComponent from "@/components/ui/InputComponent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { RootState } from "@/store/store";
import {
  setNextStep,
  setPrevStep,
  updateForm,
} from "@/store/features/create-event/createEventSlice";
import { createEventData } from "@/types/create-event";

const EventThumbnailForm = () => {
  const dispatch = useAppDispatch();
  const { formData } = useAppSelector((state: RootState) => state.createEvent);
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: "all",
    defaultValues: formData,
  });

  const handlePrevStep = () => dispatch(setPrevStep());

  const onSubmit = (data: createEventData) => {
    dispatch(updateForm(data));
    dispatch(setNextStep());
    console.log(data);
  };
  
  return (
    <div>
      <div className="flex flex-col items-center gap-y-2 mb-8">
        <h4 className="!font-sans text-[#1A1A21] font-semibold text-2xl">
          Create a new Event
        </h4>
        <p className="text-base text-[#8c94A6] font-normal">
          Upload event thumbnail
        </p>
      </div>
      <form className="flex flex-col gap-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="thumbnail"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field }) => (
            <FileInput onChange={(file) => field.onChange(file)} />
          )}
        />
        {errors.thumbnail && (
          <p role="alert" className="text-xs text-red-700 -mt-6">
            Thumbnail is required
          </p>
        )}

        <Controller
          name="eventType"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field }) => (
            <div className="grid w-full gap-3">
              <label htmlFor="eventType">Event Type</label>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full data-[size=default]:h-14 focus-visible:ring-0 focus-visible:!border-[#FA9874] px-4 border">
                  <SelectValue placeholder="Select Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in person">Physical</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="virtual">Virtual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />
        {errors.eventType && (
          <p role="alert" className="text-xs text-red-700 -mt-6">
            Event type is required
          </p>
        )}

        <Controller
          name="location"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field }) => (
            <InputComponent
              name={field.name}
              label="Event Location"
              value={field.value}
              onChange={field.onChange}
              placeholder="Helix-Ace Event centre 123"
            />
          )}
        />
        {errors.location && <p role="alert" className="text-xs text-red-700 -mt-6">Event location is required</p>}

        <Controller
          name="category"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field }) => (
            <div className="grid w-full gap-3">
              <label htmlFor="eventType">Event Category</label>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full data-[size=default]:h-14 focus-visible:ring-0 focus-visible:!border-[#FA9874] px-4 border">
                  <SelectValue placeholder="Select Event Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hackathon">Hackathon</SelectItem>
                  <SelectItem value="tech talk">Tech Talk</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="watch party">Watch Party</SelectItem>
                  <SelectItem value="info session">Info Session</SelectItem>
                  <SelectItem value="conference">Conference</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />
        {errors.category && (
          <p role="alert" className="text-xs text-red-700 -mt-6">
            Event Category is required
          </p>
        )}
        
        <div className="border-b border-b-[#E9E9E9] py-4 flex justify-between items-center">
          <p className="text-[#667185] font-sans text-sm fornt-medium">
            You can set up a <span className="text-[#F56630]">custom domain or connect your email service provider</span> to change this.
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-x-8">
          <button
            type="button"
            onClick={handlePrevStep}
            className="text-[#F56630] border border-[#F56630] w-4/12 flex justify-center items-center text-base font-semibold py-4 rounded-[8px] cursor-pointer"
          >
            Previous
          </button>
          <button
            type="submit"
            className="text-white border border-[#F56630] bg-[#F56630] w-8/12 flex justify-center items-center text-base font-semibold py-4 rounded-[8px] cursor-pointer"
          >
            Next Step
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventThumbnailForm;
