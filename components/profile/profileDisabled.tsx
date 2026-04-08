"use client";

import React, { useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useAuth } from "@/context/AuthContext";

const ProfileDisabled = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "Female",
    tZone: "GMT +1",
    country: "Nigeria",
    orgName: "",
    orgWebsite: "",
    orgIndustry: ""
  });

  // Sync with user data when it changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        gender: "Female",
        tZone: "GMT +1",
        country: "Nigeria",
        orgName: user.orgName || "",
        orgWebsite: user.orgWebsite || "",
        orgIndustry: user.orgIndustry || ""
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    // Map IDs to state keys if different
    const fieldMap: { [key: string]: string } = {
      fName: "firstName",
      lName: "lastName",
      email: "email",
      gender: "gender",
      tZone: "tZone",
      country: "country",
      orgName: "orgName",
      orgWebsite: "orgWebsite",
      orgIndustry: "orgIndustry"
    };

    const stateKey = fieldMap[id];
    if (stateKey) {
      setFormData(prev => ({ ...prev, [stateKey]: value }));
    }
  };

  const toggleEdit = (e: React.MouseEvent) => {
    if (!isEditing) {
      e.preventDefault();
      setIsEditing(true);
    } else {
      // Logic for saving would go here
      setIsEditing(false);
    }
  };

  return (
    <form className="flex flex-col gap-y-10" onSubmit={(e) => e.preventDefault()}>
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
              value={formData.firstName}
              onChange={handleChange}
              id="fName"
              disabled={!isEditing}
              className={`h-12 border-[#D0D5DD] rounded-xl px-4 focus-visible:ring-2 focus-visible:ring-[#eb5017]/20 focus-visible:border-[#eb5017] transition-all duration-200 ${!isEditing ? "bg-[#F9FAFB]/50" : "bg-white"}`}
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
              value={formData.lastName}
              onChange={handleChange}
              id="lName"
              disabled={!isEditing}
              className={`h-12 border-[#D0D5DD] rounded-xl px-4 focus-visible:ring-2 focus-visible:ring-[#eb5017]/20 focus-visible:border-[#eb5017] transition-all duration-200 ${!isEditing ? "bg-[#F9FAFB]/50" : "bg-white"}`}
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
              value={formData.email}
              onChange={handleChange}
              id="email"
              disabled={!isEditing}
              className={`h-12 border-[#D0D5DD] rounded-xl px-4 focus-visible:ring-2 focus-visible:ring-[#eb5017]/20 focus-visible:border-[#eb5017] transition-all duration-200 ${!isEditing ? "bg-[#F9FAFB]/50" : "bg-white"}`}
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
              value={formData.gender}
              onChange={handleChange}
              id="gender"
              disabled={!isEditing}
              className={`h-12 border-[#D0D5DD] rounded-xl px-4 focus-visible:ring-2 focus-visible:ring-[#eb5017]/20 focus-visible:border-[#eb5017] transition-all duration-200 ${!isEditing ? "bg-[#F9FAFB]/50" : "bg-white"}`}
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
              value={formData.tZone}
              onChange={handleChange}
              id="tZone"
              disabled={!isEditing}
              className={`h-12 border-[#D0D5DD] rounded-xl px-4 focus-visible:ring-2 focus-visible:ring-[#eb5017]/20 focus-visible:border-[#eb5017] transition-all duration-200 ${!isEditing ? "bg-[#F9FAFB]/50" : "bg-white"}`}
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
              value={formData.country}
              onChange={handleChange}
              id="country"
              disabled={!isEditing}
              className={`h-12 border-[#D0D5DD] rounded-xl px-4 focus-visible:ring-2 focus-visible:ring-[#eb5017]/20 focus-visible:border-[#eb5017] transition-all duration-200 ${!isEditing ? "bg-[#F9FAFB]/50" : "bg-white"}`}
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
              value={formData.orgName}
              onChange={handleChange}
              id="orgName"
              disabled={!isEditing}
              className={`h-12 border-[#D0D5DD] rounded-xl px-4 focus-visible:ring-2 focus-visible:ring-[#eb5017]/20 focus-visible:border-[#eb5017] transition-all duration-200 ${!isEditing ? "bg-[#F9FAFB]/50" : "bg-white"}`}
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
              value={formData.orgWebsite}
              onChange={handleChange}
              id="orgWebsite"
              disabled={!isEditing}
              className={`h-12 border-[#D0D5DD] rounded-xl px-4 focus-visible:ring-2 focus-visible:ring-[#eb5017]/20 focus-visible:border-[#eb5017] transition-all duration-200 ${!isEditing ? "bg-[#F9FAFB]/50" : "bg-white"}`}
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
              value={formData.orgIndustry}
              onChange={handleChange}
              id="orgIndustry"
              disabled={!isEditing}
              className={`h-12 border-[#D0D5DD] rounded-xl px-4 focus-visible:ring-2 focus-visible:ring-[#eb5017]/20 focus-visible:border-[#eb5017] transition-all duration-200 ${!isEditing ? "bg-[#F9FAFB]/50" : "bg-white"}`}
            />
          </div>
        </div>
      </div>


      <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="w-full sm:w-1/3 h-12 flex justify-center items-center text-[#344054] font-semibold text-base border border-[#D0D5DD] bg-white rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm"
        >
          Cancel
        </button>
        <button
          type={isEditing ? "submit" : "button"}
          onClick={toggleEdit}
          className="w-full sm:w-2/3 h-12 flex justify-center items-center text-white font-semibold text-base bg-gradient-to-r from-[#eb5017] to-[#F56630] rounded-xl hover:opacity-90 transition-all duration-200 shadow-md shadow-[#eb5017]/20"
        >
          {isEditing ? "Save" : "Edit Profile"}
        </button>
      </div>
    </form>
  );
};

export default ProfileDisabled;
