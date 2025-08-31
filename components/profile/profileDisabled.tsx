import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";

const ProfileDisabled = () => {
  return (
    <div className="flex flex-col gap-y-8">
      <div className="grid grid-cols-2 gap-x-[18px]">
        <div className="flex flex-col gap-y-1">
          <Label
            htmlFor="fName"
            className="text-[#475367] font-sans text-sm font-medium"
          >
            First Name
          </Label>
          <Input
            type="text"
            placeholder="Esther"
            id="fName"
            disabled
            className="border-[#D0D5DD] rounded-[6px] p-4 focus-visible:ring-0 focus-visible:border-[#EB5017] w-full"
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label
            htmlFor="lName"
            className="text-[#475367] font-sans text-sm font-medium"
          >
            Last Name
          </Label>
          <Input
            type="text"
            placeholder="Tracy"
            id="lName"
            disabled
            className="border-[#D0D5DD] rounded-[6px] p-4 focus-visible:ring-0 focus-visible:border-[#EB5017] w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-[18px]">
        <div className="flex flex-col gap-y-1">
          <Label
            htmlFor="email"
            className="text-[#475367] font-sans text-sm font-medium"
          >
            Email
          </Label>
          <Input
            type="email"
            placeholder="esthertracy@gmail.com"
            id="email"
            disabled
            className="border-[#D0D5DD] rounded-[6px] p-4 focus-visible:ring-0 focus-visible:border-[#EB5017] w-full"
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label
            htmlFor="gender"
            className="text-[#475367] font-sans text-sm font-medium"
          >
            Gender
          </Label>
          <Input
            type="text"
            placeholder="female"
            id="gender"
            disabled
            className="border-[#D0D5DD] rounded-[6px] p-4 focus-visible:ring-0 focus-visible:border-[#EB5017] w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-[18px]">
        <div className="flex flex-col gap-y-1">
          <Label
            htmlFor="tZone"
            className="text-[#475367] font-sans text-sm font-medium"
          >
            Time Zone
          </Label>
          <Input
            type="text"
            placeholder="GMT +1"
            id="tZone"
            disabled
            className="border-[#D0D5DD] rounded-[6px] p-4 focus-visible:ring-0 focus-visible:border-[#EB5017] w-full"
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label
            htmlFor="country"
            className="text-[#475367] font-sans text-sm font-medium"
          >
            Country
          </Label>
          <Input
            type="text"
            placeholder="Nigeria"
            id="country"
            disabled
            className="border-[#D0D5DD] rounded-[6px] p-4 focus-visible:ring-0 focus-visible:border-[#EB5017] w-full"
          />
        </div>
      </div>

      <div className="border-t border-t-[#E9E9E9] border-b border-b-[#E9E9E9] py-4 flex flex-col justify-between">
        <div className="py-4 flex justify-between items-center w-full">
          <label className="text-[#1D2739] font-sans text-sm fornt-medium">
            Recurrent event?
          </label>
          <Switch className="data-[state=checked]:bg-[#F56630]" checked />
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
            className="text-[#F56630] border border-[#F56630] w-4/12 flex justify-center items-center text-base font-semibold py-4 rounded-[8px] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="text-white border border-[#F56630] bg-[#F56630] w-8/12 flex justify-center items-center text-base font-semibold py-4 rounded-[8px] cursor-pointer"
          >
            Edit
          </button>
        </div>
    </div>
  );
};

export default ProfileDisabled;
