import React from "react";
import InputComponent from "@/components/ui/InputComponent";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller } from "react-hook-form";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { RootState } from "@/store/store";
import {
  setNextStep,
  setShowForm,
  updateForm,
} from "@/store/features/create-event/createEventSlice";
import { createEventData } from "@/types/create-event";
import { Switch } from "@/components/ui/switch";

const EventDetailsForm = () => {
  const dispatch = useAppDispatch();
  const { formData } = useAppSelector(
    (state: RootState) => state.createEvent
  );
  const { control, formState: { errors }, handleSubmit } = useForm({
    mode: "all",
    defaultValues: formData,
  });

  const handleFormClose = () => dispatch(setShowForm(false));

  const onSubmit = (data: createEventData) => {
    dispatch(updateForm(data));
    dispatch(setNextStep());
    console.log(data);
  }

  return (
    <div className="font-sans">
      <div className="flex flex-col items-center gap-y-2 mb-8">
        <h4 className="!font-sans text-[#1A1A21] font-semibold text-2xl">
          Create a new Event
        </h4>
        <p className="text-base text-[#8c94A6] font-normal">
          Fill out these details to create your event
        </p>
      </div>
      <form className="flex flex-col gap-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field }) => (
            <InputComponent
              name={field.name}
              label="Event Name"
              value={field.value}
              onChange={field.onChange}
              placeholder="Enter Event Name"
            />
          )}
        />
        {errors.name && <p role="alert" className="text-xs text-red-700 -mt-6">Event name is required</p>}

        <Controller
          name="description"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field }) => (
            <div className="grid w-full gap-3">
              <label htmlFor="desc">Your Message</label>
              <Textarea
                placeholder="Enter text here."
                id="desc"
                className="placeholder-[#98A2B3] focus-visible:ring-0 focus-visible:border-[#FA9874]"
                {...field}
              />
              <p className="text-muted-foreground text-sm">
                Keep this simple, maximum of 50 characters
              </p>
            </div>
          )}
        />
        {errors.description && <p role="alert" className="text-xs text-red-700 -mt-6">Description is required</p>}

        <div className="flex flex-col md:flex-row md:items-center md:gap-x-[18px]">
          <div className="w-full md:w-1/2">
            <Controller
              name="startDate"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <InputComponent
                  name={field.name}
                  label="Event Start Date"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="01 September 2024"
                />
              )}
            />
            {errors.startDate && <p role="alert" className="text-xs text-red-700 mt-1">Start date is required</p>}
          </div>
          <div className="w-full md:w-1/2">
            <Controller
              name="stopDate"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <InputComponent
                  name={field.name}
                  label="Event End Date"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="01 September 2024"
                />
              )}
            />
            {errors.stopDate && <p role="alert" className="text-xs text-red-700 mt-1">Stop date is required</p>}
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:gap-x-[18px]">
          <div className="w-full md:w-1/2">
            <Controller
              name="startTime"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <InputComponent
                  name={field.name}
                  label="Event Start Time"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="01 September 2024"
                />
              )}
            />
            {errors.startTime && <p role="alert" className="text-xs text-red-700 mt-1">Start time is required</p>}
          </div>
          <div className="w-full md:w-1/2">
            <Controller
              name="stopTime"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <InputComponent
                  name={field.name}
                  label="Event End Time"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="01 September 2024"
                />
              )}
            />
            {errors.stopTime && <p role="alert" className="text-xs text-red-700 mt-1">Stop time is required</p>}
          </div>
        </div>
        <div className="border-t border-b border-t-[#E9E9E9] border-b-[#E9E9E9] py-4 flex justify-between items-center">
          <label className="text-[#1D2739] font-sans text-sm fornt-medium">
            Recurrent event?
          </label>
          <Controller
            name="description"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <Switch
                className="data-[state=checked]:bg-[#F56630]"
                {...field}
              />
            )}
          />
        </div>
        <div className="flex flex-col md:flex-row items-center gap-x-8">
          <button
            type="button"
            onClick={handleFormClose}
            className="text-[#F56630] border border-[#F56630] w-4/12 flex justify-center items-center text-base font-semibold py-4 rounded-[8px] cursor-pointer"
          >
            Cancel
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

export default EventDetailsForm;
