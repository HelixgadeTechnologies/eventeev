"use client";

import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useAuth } from "@/context/AuthContext";

const ProfileDisabled = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-y-10">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-y-2">
            <Label
              htmlFor="fName"
              className="text-[#344054] font-sans text-sm font-medium ml-1"
            >
              First Name
            </Label>
            <Input
              type="text"
              placeholder="First Name"
              value={user?.firstName || ""}
              id="fName"
              disabled
              className="h-12 border-[#D0D5DD] bg-[#F9FAFB]/50 rounded-xl px-4 focus-visible:ring-2 focus-visible:ring-[#eb5017]/20 focus-visible:border-[#eb5017] transition-all duration-200"
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label
              htmlFor="lName"
              className="text-[#344054] font-sans text-sm font-medium ml-1"
            >
              Last Name
            </Label>
            <Input
              type="text"
              placeholder="Last Name"
              value={user?.lastName || ""}
              id="lName"
              disabled
              className="h-12 border-[#D0D5DD] bg-[#F9FAFB]/50 rounded-xl px-4 focus-visible:ring-2 focus-visible:ring-[#eb5017]/20 focus-visible:border-[#eb5017] transition-all duration-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-y-2">
            <Label
              htmlFor="email"
              className="text-[#344054] font-sans text-sm font-medium ml-1"
            >
              Email Address
            </Label>
            <Input
              type="email"
              placeholder="Email"
              value={user?.email || ""}
              id="email"
              disabled
              className="h-12 border-[#D0D5DD] bg-[#F9FAFB]/50 rounded-xl px-4 focus-visible:ring-2 focus-visible:ring-[#eb5017]/20 focus-visible:border-[#eb5017] transition-all duration-200"
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label
              htmlFor="gender"
              className="text-[#344054] font-sans text-sm font-medium ml-1"
            >
              Gender
            </Label>
            <Input
              type="text"
              placeholder="Female"
              id="gender"
              disabled
              className="h-12 border-[#D0D5DD] bg-[#F9FAFB]/50 rounded-xl px-4 focus-visible:ring-2 focus-visible:ring-[#eb5017]/20 focus-visible:border-[#eb5017] transition-all duration-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-y-2">
            <Label
              htmlFor="tZone"
              className="text-[#344054] font-sans text-sm font-medium ml-1"
            >
              Time Zone
            </Label>
            <Input
              type="text"
              placeholder="GMT +1"
              id="tZone"
              disabled
              className="h-12 border-[#D0D5DD] bg-[#F9FAFB]/50 rounded-xl px-4 focus-visible:ring-2 focus-visible:ring-[#eb5017]/20 focus-visible:border-[#eb5017] transition-all duration-200"
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label
              htmlFor="country"
              className="text-[#344054] font-sans text-sm font-medium ml-1"
            >
              Country
            </Label>
            <Input
              type="text"
              placeholder="Nigeria"
              id="country"
              disabled
              className="h-12 border-[#D0D5DD] bg-[#F9FAFB]/50 rounded-xl px-4 focus-visible:ring-2 focus-visible:ring-[#eb5017]/20 focus-visible:border-[#eb5017] transition-all duration-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-y-2">
            <Label
              htmlFor="orgName"
              className="text-[#344054] font-sans text-sm font-medium ml-1"
            >
              Organisation Name
            </Label>
            <Input
              type="text"
              placeholder="Organisation Name"
              value={user?.orgName || ""}
              id="orgName"
              disabled
              className="h-12 border-[#D0D5DD] bg-[#F9FAFB]/50 rounded-xl px-4 focus-visible:ring-2 focus-visible:ring-[#eb5017]/20 focus-visible:border-[#eb5017] transition-all duration-200"
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label
              htmlFor="orgWebsite"
              className="text-[#344054] font-sans text-sm font-medium ml-1"
            >
              Organisation Website
            </Label>
            <Input
              type="text"
              placeholder="https://example.com"
              value={user?.orgWebsite || ""}
              id="orgWebsite"
              disabled
              className="h-12 border-[#D0D5DD] bg-[#F9FAFB]/50 rounded-xl px-4 focus-visible:ring-2 focus-visible:ring-[#eb5017]/20 focus-visible:border-[#eb5017] transition-all duration-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-y-2">
            <Label
              htmlFor="orgIndustry"
              className="text-[#344054] font-sans text-sm font-medium ml-1"
            >
              Organisation Industry
            </Label>
            <Input
              type="text"
              placeholder="Organisation Industry"
              value={user?.orgIndustry || ""}
              id="orgIndustry"
              disabled
              className="h-12 border-[#D0D5DD] bg-[#F9FAFB]/50 rounded-xl px-4 focus-visible:ring-2 focus-visible:ring-[#eb5017]/20 focus-visible:border-[#eb5017] transition-all duration-200"
            />
          </div>
        </div>
      </div>


      <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
        <button
          type="button"
          className="w-full sm:w-1/3 h-12 flex justify-center items-center text-[#344054] font-semibold text-base border border-[#D0D5DD] bg-white rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-full sm:w-2/3 h-12 flex justify-center items-center text-white font-semibold text-base bg-gradient-to-r from-[#eb5017] to-[#F56630] rounded-xl hover:opacity-90 transition-all duration-200 shadow-md shadow-[#eb5017]/20"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileDisabled;
