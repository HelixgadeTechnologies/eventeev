import React from "react";
import InputComponent from "@/components/ui/InputComponent";
import { useForm, Controller } from "react-hook-form";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { RootState } from "@/store/store";
import {
  setNextStep,
  setPrevStep,
  updateForm,
} from "@/store/features/create-event/createEventSlice";
import { createEventData } from "@/types/create-event";
import { Switch } from "@/components/ui/switch";

const EventSocialsForm = () => {
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
          Event Social Details
        </h4>
        <p className="text-base text-[#8c94A6] font-normal">
          Fill out these details to create your event
        </p>
      </div>
      <form className="flex flex-col gap-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="website"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field }) => (
            <InputComponent
              name={field.name}
              label="Event Website"
              value={field.value}
              onChange={field.onChange}
              placeholder="www."
            />
          )}
        />
        {errors.website && (
          <p role="alert" className="text-xs text-red-700 -mt-6">
            Event website is required
          </p>
        )}

        <Controller
          name="facebookUrl"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field }) => (
            <InputComponent
              name={field.name}
              label="Event Facebook Link"
              value={field.value}
              onChange={field.onChange}
              placeholder="https://facebook.com/"
            />
          )}
        />
        {errors.facebookUrl && (
          <p role="alert" className="text-xs text-red-700 -mt-6">
            Event Facebook Link is required
          </p>
        )}

        <Controller
          name="instagramUrl"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field }) => (
            <InputComponent
              name={field.name}
              label="Event Instagram Link"
              value={field.value}
              onChange={field.onChange}
              placeholder="https://instagram.com/"
            />
          )}
        />
        {errors.instagramUrl && (
          <p role="alert" className="text-xs text-red-700 -mt-6">
            Event Instagram Link is required
          </p>
        )}

        <Controller
          name="xUrl"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field }) => (
            <InputComponent
              name={field.name}
              label="Event X (Twitter) Link"
              value={field.value}
              onChange={field.onChange}
              placeholder="https://x.com/"
            />
          )}
        />
        {errors.xUrl && (
          <p role="alert" className="text-xs text-red-700 -mt-6">
            Event X (Twitter) Link is required
          </p>
        )}

        <div className="border-b border-b-[#E9E9E9] py-4 flex flex-col justify-between items-center">
          <div className="py-4 flex justify-between items-center w-full">
            <label className="text-[#1D2739] font-sans text-sm fornt-medium">
              Run only once per customer
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
          <p className="text-[#667185] font-sans text-sm fornt-medium">
            You can set up a{" "}
            <span className="text-[#F56630]">
              custom domain or connect your email service provider
            </span>{" "}
            to change this.
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

export default EventSocialsForm;
