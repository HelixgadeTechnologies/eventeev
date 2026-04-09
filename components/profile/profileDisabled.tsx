"use client";

import React, { useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { profileService } from "@/lib/services/profile.service";
import ActionConfirmationModal from "../ui/ActionConfirmationModal";
import { Loader2 } from "lucide-react";

const GENDERS = ["Male", "Female", "I rather not say"];

const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Entertainment",
  "Marketing",
  "Real Estate",
  "Hospitality",
  "Retail",
  "Energy",
  "Manufacturing",
  "Legal",
  "Other"
];

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
  "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const TIMEZONES = Intl.supportedValuesOf('timeZone');

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
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Sync with user data when it changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        gender: user.gender || "Female",
        tZone: user.tZone || "Africa/Lagos",
        country: user.country || "Nigeria",
        orgName: user.orgName || "",
        orgWebsite: user.orgWebsite || "",
        orgIndustry: user.orgIndustry || ""
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const fieldMap: { [key: string]: string } = {
      fName: "firstName",
      lName: "lastName",
      email: "email",
      orgName: "orgName",
      orgWebsite: "orgWebsite"
    };

    const stateKey = fieldMap[id];
    if (stateKey) {
      setFormData(prev => ({ ...prev, [stateKey]: value }));
    }
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const toggleEdit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isEditing) {
      setIsEditing(true);
    } else {
      setIsSaving(true);
      try {
        if (!user?.id) throw new Error("User ID not found");

        // 1. Update general profile fields
        const profileResult = await profileService.updateUserProfile(user.id, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          gender: formData.gender,
          tZone: formData.tZone,
          country: formData.country
        });

        if (profileResult.error) throw new Error(profileResult.error.message || "Failed to update profile");

        // 2. Update organisation details
        const orgResult = await profileService.updateOrganisationDetails({
          orgName: formData.orgName,
          orgWebsite: formData.orgWebsite,
          orgIndustry: formData.orgIndustry
        });

        if (orgResult.error) throw new Error(orgResult.error.message || "Failed to update organisation details");

        setShowSuccessModal(true);
        setIsEditing(false);
      } catch (error: any) {
        console.error("Save error:", error);
        alert(error.message || "An error occurred while saving profile data.");
      } finally {
        setIsSaving(false);
      }
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
            <Select 
              value={formData.gender} 
              onValueChange={(val) => handleSelectChange("gender", val)}
              disabled={!isEditing}
            >
              <SelectTrigger 
                className={`h-12 w-full border-[#D0D5DD] rounded-xl px-4 focus:ring-2 focus:ring-[#eb5017]/20 focus:border-[#eb5017] transition-all duration-200 ${!isEditing ? "bg-[#F9FAFB]/50" : "bg-white text-gray-900"}`}
              >
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#D0D5DD] rounded-xl shadow-lg">
                {GENDERS.map((gender) => (
                  <SelectItem key={gender} value={gender} className="focus:bg-orange-50 focus:text-[#eb5017] cursor-pointer py-3">
                    {gender}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Select 
              value={formData.tZone} 
              onValueChange={(val) => handleSelectChange("tZone", val)}
              disabled={!isEditing}
            >
              <SelectTrigger 
                className={`h-12 w-full border-[#D0D5DD] rounded-xl px-4 focus:ring-2 focus:ring-[#eb5017]/20 focus:border-[#eb5017] transition-all duration-200 ${!isEditing ? "bg-[#F9FAFB]/50" : "bg-white text-gray-900"}`}
              >
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#D0D5DD] rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz} value={tz} className="focus:bg-orange-50 focus:text-[#eb5017] cursor-pointer py-2">
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-y-2">
            <Label
              htmlFor="country"
              className="text-[#344054] font-sans text-sm font-medium ml-1"
            >
              Country
            </Label>
            <Select 
              value={formData.country} 
              onValueChange={(val) => handleSelectChange("country", val)}
              disabled={!isEditing}
            >
              <SelectTrigger 
                className={`h-12 w-full border-[#D0D5DD] rounded-xl px-4 focus:ring-2 focus:ring-[#eb5017]/20 focus:border-[#eb5017] transition-all duration-200 ${!isEditing ? "bg-[#F9FAFB]/50" : "bg-white text-gray-900"}`}
              >
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#D0D5DD] rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {COUNTRIES.map((country) => (
                  <SelectItem key={country} value={country} className="focus:bg-orange-50 focus:text-[#eb5017] cursor-pointer py-2">
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Select 
              value={formData.orgIndustry} 
              onValueChange={(val) => handleSelectChange("orgIndustry", val)}
              disabled={!isEditing}
            >
              <SelectTrigger 
                className={`h-12 w-full border-[#D0D5DD] rounded-xl px-4 focus:ring-2 focus:ring-[#eb5017]/20 focus:border-[#eb5017] transition-all duration-200 ${!isEditing ? "bg-[#F9FAFB]/50" : "bg-white text-gray-900"}`}
              >
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#D0D5DD] rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {INDUSTRIES.map((industry) => (
                  <SelectItem key={industry} value={industry} className="focus:bg-orange-50 focus:text-[#eb5017] cursor-pointer py-2">
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          disabled={isSaving}
          className="w-full sm:w-2/3 h-12 flex justify-center items-center text-white font-semibold text-base bg-gradient-to-r from-[#eb5017] to-[#F56630] rounded-xl hover:opacity-90 transition-all duration-200 shadow-md shadow-[#eb5017]/20 disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isEditing ? (
            "Save Changes"
          ) : (
            "Edit Profile"
          )}
        </button>
      </div>

      <ActionConfirmationModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onConfirm={() => setShowSuccessModal(false)}
        title="Success!"
        description="Profile data saved successfully. Your information has been updated across the platform."
        confirmLabel="Great!"
        cancelLabel="Close"
      />
    </form>
  );
};

export default ProfileDisabled;
