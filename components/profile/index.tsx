"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import Avatar from "../ui/Avatar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { profileService } from "@/lib/services/profile.service";
import { uploadService } from "@/lib/services/upload.service";
import ActionConfirmationModal from "../ui/ActionConfirmationModal";
import { 
  User, 
  Lock, 
  Users, 
  UserCheck, 
  Bell, 
  CreditCard, 
  Download, 
  Trash2, 
  Camera, 
  MapPin, 
  Briefcase, 
  Globe, 
  Mail, 
  Phone, 
  BookOpen, 
  Building, 
  Clock, 
  Edit3, 
  Check, 
  X, 
  Plus, 
  Settings, 
  ChevronRight, 
  ShieldAlert,
  Loader2 
} from "lucide-react";

// Dropdown Constants
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

const TIMEZONES = Intl.supportedValuesOf('timeZone');

// Sidebar Tabs Configuration
const TABS = [
  { id: "profile", label: "My Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "teams", label: "Teams", icon: Users },
  { id: "member", label: "Team Member", icon: UserCheck },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "export", label: "Data Export", icon: Download },
];

// Helper functions for user-specific localStorage extras
const getProfileExtras = (userId: string) => {
  if (typeof window === "undefined") return {};
  try {
    const data = localStorage.getItem(`eventeev_profile_extras_${userId}`);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error("Failed to load profile extras", e);
    return {};
  }
};

const saveProfileExtras = (userId: string, extras: any) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`eventeev_profile_extras_${userId}`, JSON.stringify(extras));
  } catch (e) {
    console.error("Failed to save profile extras", e);
  }
};

const ShowProfile = () => {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("profile");
  
  // Edit card toggles
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingOrg, setIsEditingOrg] = useState(false);

  // General state
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  
  // Status feedback modals
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    variant: "success" | "error";
  }>({
    isOpen: false,
    title: "",
    description: "",
    variant: "success",
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Form Fields State
  const [formData, setFormData] = useState({
    // API direct properties
    firstName: "",
    lastName: "",
    email: "",
    gender: "Female",
    tZone: "Africa/Lagos",
    country: "Nigeria",
    orgName: "",
    orgWebsite: "",
    orgIndustry: "",
    avatar: "",

    // UI custom properties (persisted locally)
    jobTitle: "Event Organizer",
    location: "Lagos, Nigeria",
    phone: "(234) 812-345-6789",
    bio: "Passionate event organizer craftings memorable tech conferences and networking gatherings.",
    cityState: "Lagos State",
    postalCode: "100001",
    taxId: "TX-9988223",
  });

  const [countryData, setCountryData] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/states")
      .then(res => res.json())
      .then(data => {
        if (!data.error && data.data) {
          setCountryData(data.data);
        }
      })
      .catch(err => console.error("Error fetching countries:", err));
  }, []);

  // Load profile state
  useEffect(() => {
    if (user) {
      const extras = getProfileExtras(user.id);
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        gender: user.gender || "Female",
        tZone: user.timezone || user.tZone || "Africa/Lagos",
        country: user.country || "Nigeria",
        orgName: user.organisationName || user.orgName || "",
        orgWebsite: user.organisationWebsite || user.orgWebsite || "",
        orgIndustry: user.organisationIndustry || user.orgIndustry || "",
        avatar: user.avatar || "",

        // Extended fallback / custom properties
        jobTitle: extras.jobTitle || user.jobTitle || "Event Organizer",
        location: extras.location || user.location || `${user.country || "Nigeria"}`,
        phone: extras.phone || user.phone || "(234) 812-345-6789",
        bio: extras.bio || user.bio || "Event coordinator shaping incredible communities.",
        cityState: extras.cityState || "Lagos State",
        postalCode: extras.postalCode || "100001",
        taxId: extras.taxId || "TX-9988223",
      }));
    }
  }, [user]);

  // Handle standard input change
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Generic Save Logic
  const handleSaveCard = async (section: "profile" | "personal" | "address" | "org") => {
    if (!user?.id) return;
    setIsSaving(true);
    try {
      // 1. Update API-supported fields
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        tZone: formData.tZone,
        country: formData.country,
        avatar: formData.avatar,
        orgName: formData.orgName,
        orgWebsite: formData.orgWebsite,
        orgIndustry: formData.orgIndustry,
      };

      const profileResult = await profileService.updateUserProfile(user.id, payload);
      if (profileResult.error) throw new Error(profileResult.error.message || "Failed to update profile details");

      // 2. Also call organization redundant endpoint if modifying organization card
      if (section === "org") {
        const orgResult = await profileService.updateOrganisationDetails({
          orgName: formData.orgName,
          orgWebsite: formData.orgWebsite,
          orgIndustry: formData.orgIndustry
        });
        if (orgResult.error) console.warn("Organisation-specific detail syncing warning:", orgResult.error);
      }

      // 3. Save custom properties to local storage
      const updatedExtras = {
        jobTitle: formData.jobTitle,
        location: formData.location,
        phone: formData.phone,
        bio: formData.bio,
        cityState: formData.cityState,
        postalCode: formData.postalCode,
        taxId: formData.taxId,
      };
      saveProfileExtras(user.id, updatedExtras);

      // Refresh auth global states
      await refreshUser();

      // Reset card editing toggles
      if (section === "profile") setIsEditingProfile(false);
      if (section === "personal") setIsEditingPersonal(false);
      if (section === "address") setIsEditingAddress(false);
      if (section === "org") setIsEditingOrg(false);

      setStatusModal({
        isOpen: true,
        title: "Profile Card Saved!",
        description: "Your modifications have been synchronized successfully.",
        variant: "success",
      });
    } catch (err: any) {
      console.error("Failed to save profile cards:", err);
      setStatusModal({
        isOpen: true,
        title: "Synchronization Error",
        description: err.message || "An unexpected error occurred while storing changes.",
        variant: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Trigger file upload dialog
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Handle selected image file upload and backend saving
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      const { data, error } = await uploadService.uploadImage(file);
      if (error) {
        throw new Error(error.message || "Failed to upload avatar image");
      }
      if (data?.url) {
        // Update local state first
        setFormData(prev => ({ ...prev, avatar: data.url }));

        // Instantly save to database if user is logged in
        if (user?.id) {
          const payload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            gender: formData.gender,
            tZone: formData.tZone,
            country: formData.country,
            avatar: data.url, // new avatar secure URL
            orgName: formData.orgName,
            orgWebsite: formData.orgWebsite,
            orgIndustry: formData.orgIndustry,
          };
          const profileResult = await profileService.updateUserProfile(user.id, payload);
          if (profileResult.error) {
            throw new Error(profileResult.error.message || "Failed to save new avatar to your profile database");
          }
          await refreshUser();
        }

        setStatusModal({
          isOpen: true,
          title: "Avatar Updated Successfully!",
          description: "Your new profile picture has been uploaded and synchronized.",
          variant: "success",
        });
      }
    } catch (err: any) {
      console.error("Failed to upload avatar:", err);
      setStatusModal({
        isOpen: true,
        title: "Avatar Upload Error",
        description: err.message || "An unexpected error occurred while uploading avatar.",
        variant: "error",
      });
    } finally {
      setIsUploadingAvatar(false);
      // Reset input element value to allow selecting same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // ----------------------------------------------------
  // SUB-PANE COMPONENT 1: My Profile
  // ----------------------------------------------------
  const renderMyProfileTab = () => {
    return (
      <div className="space-y-6 animate-fadeIn">
        {/* CARD 1: PROFILE SUMMARY */}
        <div className="bg-white border border-[#E4E7EC] rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#FFECE5] shadow-sm flex justify-center items-center bg-[#eb5017]/10">
                  {isUploadingAvatar ? (
                    <Loader2 className="w-8 h-8 animate-spin text-[#eb5017]" />
                  ) : (
                    <Avatar 
                      src={formData.avatar}
                      name={user ? `${formData.firstName} ${formData.lastName}` : "Organizer User"}
                      isBigger={true}
                      disableLink={true}
                    />
                  )}
                </div>
                {!isUploadingAvatar && (
                  <div className="absolute inset-0 bg-black/45 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                {isEditingProfile ? (
                  <div className="space-y-2">
                    <Input 
                      value={`${formData.firstName} ${formData.lastName}`} 
                      disabled
                      className="h-10 text-lg font-bold text-[#1D2739] max-w-[240px] bg-gray-50 border-[#D0D5DD] rounded-lg"
                    />
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Job Title"
                        value={formData.jobTitle} 
                        onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                        className="h-8 text-sm text-[#475367] border-[#D0D5DD] rounded-lg"
                      />
                      <Input 
                        placeholder="Location"
                        value={formData.location} 
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        className="h-8 text-sm text-[#475367] border-[#D0D5DD] rounded-lg"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-[#1D2739] font-sans font-bold text-2xl tracking-tight flex items-center gap-2">
                      {formData.firstName || formData.lastName ? `${formData.firstName} ${formData.lastName}` : "Eventeev Planner"}
                    </h2>
                    <p className="text-base font-semibold text-[#eb5017] flex items-center justify-center sm:justify-start gap-1">
                      <Briefcase className="w-4 h-4 text-[#eb5017]/70" />
                      {formData.jobTitle}
                    </p>
                    <p className="text-sm font-normal text-[#667185] flex items-center justify-center sm:justify-start gap-1">
                      <MapPin className="w-4 h-4 text-[#667185]/70" />
                      {formData.location}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="flex sm:flex-col justify-end gap-2 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
              {isEditingProfile ? (
                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="flex-1 sm:flex-none h-10 px-4 flex justify-center items-center text-xs font-semibold text-[#344054] border border-[#D0D5DD] rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveCard("profile")}
                    disabled={isSaving}
                    className="flex-1 sm:flex-none h-10 px-4 flex justify-center items-center text-xs font-semibold text-white bg-[#eb5017] rounded-lg hover:bg-[#eb5017]/90 transition-colors gap-1 disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="w-full sm:w-auto h-10 px-5 flex justify-center items-center gap-2 text-[#344054] font-semibold text-sm border border-[#D0D5DD] bg-white rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm"
                >
                  <Edit3 className="w-4 h-4 text-[#667185]" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* CARD 2: PERSONAL INFORMATION */}
        <div className="bg-white border border-[#E4E7EC] rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#F0F2F5] pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#1D2739]">Personal Information</h3>
                <p className="text-xs text-[#667185] mt-0.5">Manage your core account credentials and bios.</p>
              </div>
              
              {!isEditingPersonal && (
                <button
                  onClick={() => setIsEditingPersonal(true)}
                  className="h-9 px-4 flex justify-center items-center gap-1.5 text-[#344054] font-semibold text-xs border border-[#D0D5DD] bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#667185]" />
                  Edit
                </button>
              )}
            </div>

            {isEditingPersonal ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-[#344054]">First Name</Label>
                    <Input 
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="h-10 border-[#D0D5DD] rounded-lg focus-visible:ring-[#eb5017]/25 focus-visible:border-[#eb5017]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-[#344054]">Last Name</Label>
                    <Input 
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="h-10 border-[#D0D5DD] rounded-lg focus-visible:ring-[#eb5017]/25 focus-visible:border-[#eb5017]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-[#344054]">Email Address</Label>
                    <Input 
                      value={formData.email}
                      disabled
                      className="h-10 border-[#D0D5DD] rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed focus-visible:ring-[#eb5017]/25 focus-visible:border-[#eb5017]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-[#344054]">Phone Number</Label>
                    <Input 
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="h-10 border-[#D0D5DD] rounded-lg focus-visible:ring-[#eb5017]/25 focus-visible:border-[#eb5017]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-[#344054]">Gender</Label>
                    <Select 
                      value={formData.gender} 
                      onValueChange={(val) => handleInputChange("gender", val)}
                    >
                      <SelectTrigger className="h-10 w-full border-[#D0D5DD] rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {GENDERS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-[#344054]">Time Zone</Label>
                    <Select 
                      value={formData.tZone} 
                      onValueChange={(val) => handleInputChange("tZone", val)}
                    >
                      <SelectTrigger className="h-10 w-full border-[#D0D5DD] rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white max-h-60 overflow-y-auto">
                        {TIMEZONES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#344054]">Bio Description</Label>
                  <textarea 
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    rows={3}
                    className="w-full text-sm border border-[#D0D5DD] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#eb5017]/25 focus:border-[#eb5017] transition-all bg-white"
                  />
                </div>

                <div className="flex justify-end gap-2 border-t border-[#F0F2F5] pt-4">
                  <button
                    onClick={() => setIsEditingPersonal(false)}
                    className="h-10 px-4 text-xs font-semibold text-[#344054] border border-[#D0D5DD] rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveCard("personal")}
                    disabled={isSaving}
                    className="h-10 px-5 text-xs font-semibold text-white bg-[#eb5017] rounded-lg hover:bg-[#eb5017]/90 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                <div className="space-y-1">
                  <span className="text-xs text-[#667185] font-normal uppercase tracking-wider block">First Name</span>
                  <span className="text-sm font-semibold text-[#1D2739] block">{formData.firstName || "Not provided"}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-[#667185] font-normal uppercase tracking-wider block">Last Name</span>
                  <span className="text-sm font-semibold text-[#1D2739] block">{formData.lastName || "Not provided"}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-[#667185] font-normal uppercase tracking-wider block">Email Address</span>
                  <span className="text-sm font-semibold text-[#1D2739] block flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#667185]/70" />
                    {formData.email}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-[#667185] font-normal uppercase tracking-wider block">Phone Number</span>
                  <span className="text-sm font-semibold text-[#1D2739] block flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#667185]/70" />
                    {formData.phone}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-[#667185] font-normal uppercase tracking-wider block">Gender</span>
                  <span className="text-sm font-semibold text-[#1D2739] block">{formData.gender}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-[#667185] font-normal uppercase tracking-wider block">Time Zone</span>
                  <span className="text-sm font-semibold text-[#1D2739] block flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#667185]/70" />
                    {formData.tZone}
                  </span>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <span className="text-xs text-[#667185] font-normal uppercase tracking-wider block">Bio</span>
                  <span className="text-sm font-semibold text-[#344054] block leading-relaxed flex items-start gap-2">
                    <BookOpen className="w-4 h-4 text-[#667185]/50 mt-0.5 shrink-0" />
                    {formData.bio}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CARD 3: ADDRESS */}
        <div className="bg-white border border-[#E4E7EC] rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#F0F2F5] pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#1D2739]">Address details</h3>
                <p className="text-xs text-[#667185] mt-0.5">Physical location coordinates and tax references.</p>
              </div>

              {!isEditingAddress && (
                <button
                  onClick={() => setIsEditingAddress(true)}
                  className="h-9 px-4 flex justify-center items-center gap-1.5 text-[#344054] font-semibold text-xs border border-[#D0D5DD] bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#667185]" />
                  Edit
                </button>
              )}
            </div>

            {isEditingAddress ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-[#344054]">Country</Label>
                    <Select 
                      value={formData.country} 
                      onValueChange={(val) => {
                        handleInputChange("country", val);
                        handleInputChange("cityState", "");
                      }}
                    >
                      <SelectTrigger className="h-10 w-full border-[#D0D5DD] rounded-lg">
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent className="bg-white max-h-60 overflow-y-auto">
                        {countryData.map((c: any) => <SelectItem key={c.iso3 || c.name} value={c.name}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-[#344054]">City / State</Label>
                    {(() => {
                      const selectedCountryObj = countryData.find((c: any) => c.name === formData.country);
                      const availableStates = selectedCountryObj?.states || [];
                      
                      return availableStates.length > 0 ? (
                        <Select 
                          value={formData.cityState}
                          onValueChange={(val) => handleInputChange("cityState", val)}
                        >
                          <SelectTrigger className="h-10 w-full border-[#D0D5DD] rounded-lg">
                            <SelectValue placeholder="Select State/City" />
                          </SelectTrigger>
                          <SelectContent className="bg-white max-h-60 overflow-y-auto">
                            {availableStates.map((s: any) => <SelectItem key={s.state_code || s.name} value={s.name}>{s.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input 
                          value={formData.cityState}
                          onChange={(e) => handleInputChange("cityState", e.target.value)}
                          className="h-10 border-[#D0D5DD] rounded-lg focus-visible:ring-[#eb5017]/25 focus-visible:border-[#eb5017]"
                          placeholder="Type city/state"
                        />
                      );
                    })()}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-[#344054]">Postal Code</Label>
                    <Input 
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange("postalCode", e.target.value)}
                      className="h-10 border-[#D0D5DD] rounded-lg focus-visible:ring-[#eb5017]/25 focus-visible:border-[#eb5017]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-[#344054]">TAX ID</Label>
                    <Input 
                      value={formData.taxId}
                      onChange={(e) => handleInputChange("taxId", e.target.value)}
                      className="h-10 border-[#D0D5DD] rounded-lg focus-visible:ring-[#eb5017]/25 focus-visible:border-[#eb5017]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-[#F0F2F5] pt-4">
                  <button
                    onClick={() => setIsEditingAddress(false)}
                    className="h-10 px-4 text-xs font-semibold text-[#344054] border border-[#D0D5DD] rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveCard("address")}
                    disabled={isSaving}
                    className="h-10 px-5 text-xs font-semibold text-white bg-[#eb5017] rounded-lg hover:bg-[#eb5017]/90 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                <div className="space-y-1">
                  <span className="text-xs text-[#667185] font-normal uppercase tracking-wider block">Country</span>
                  <span className="text-sm font-semibold text-[#1D2739] block flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#667185]/70" />
                    {formData.country}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-[#667185] font-normal uppercase tracking-wider block">City / State</span>
                  <span className="text-sm font-semibold text-[#1D2739] block">{formData.cityState}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-[#667185] font-normal uppercase tracking-wider block">Postal Code</span>
                  <span className="text-sm font-semibold text-[#1D2739] block">{formData.postalCode}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-[#667185] font-normal uppercase tracking-wider block">TAX ID</span>
                  <span className="text-sm font-semibold text-[#1D2739] block uppercase">{formData.taxId}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CARD 4: ORGANISATION */}
        <div className="bg-white border border-[#E4E7EC] rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#F0F2F5] pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#1D2739]">Organisation details</h3>
                <p className="text-xs text-[#667185] mt-0.5">Your official company branding credentials.</p>
              </div>

              {!isEditingOrg && (
                <button
                  onClick={() => setIsEditingOrg(true)}
                  className="h-9 px-4 flex justify-center items-center gap-1.5 text-[#344054] font-semibold text-xs border border-[#D0D5DD] bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#667185]" />
                  Edit
                </button>
              )}
            </div>

            {isEditingOrg ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-[#344054]">Organisation Name</Label>
                    <Input 
                      value={formData.orgName}
                      onChange={(e) => handleInputChange("orgName", e.target.value)}
                      placeholder="Helixgade Tech"
                      className="h-10 border-[#D0D5DD] rounded-lg focus-visible:ring-[#eb5017]/25 focus-visible:border-[#eb5017]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-[#344054]">Organisation Website</Label>
                    <Input 
                      value={formData.orgWebsite}
                      onChange={(e) => handleInputChange("orgWebsite", e.target.value)}
                      placeholder="https://example.com"
                      className="h-10 border-[#D0D5DD] rounded-lg focus-visible:ring-[#eb5017]/25 focus-visible:border-[#eb5017]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-[#344054]">Organisation Industry</Label>
                    <Select 
                      value={formData.orgIndustry} 
                      onValueChange={(val) => handleInputChange("orgIndustry", val)}
                    >
                      <SelectTrigger className="h-10 w-full border-[#D0D5DD] rounded-lg">
                        <SelectValue placeholder="Select Industry" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {INDUSTRIES.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-[#F0F2F5] pt-4">
                  <button
                    onClick={() => setIsEditingOrg(false)}
                    className="h-10 px-4 text-xs font-semibold text-[#344054] border border-[#D0D5DD] rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveCard("org")}
                    disabled={isSaving}
                    className="h-10 px-5 text-xs font-semibold text-white bg-[#eb5017] rounded-lg hover:bg-[#eb5017]/90 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                <div className="space-y-1">
                  <span className="text-xs text-[#667185] font-normal uppercase tracking-wider block">Company Name</span>
                  <span className="text-sm font-semibold text-[#1D2739] block flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#667185]/70" />
                    {formData.orgName || "Not configured"}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-[#667185] font-normal uppercase tracking-wider block">Website Link</span>
                  {formData.orgWebsite ? (
                    <a 
                      href={formData.orgWebsite} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm font-semibold text-[#eb5017] hover:underline block break-all"
                    >
                      {formData.orgWebsite}
                    </a>
                  ) : (
                    <span className="text-sm font-semibold text-[#667185] block">Not configured</span>
                  )}
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-[#667185] font-normal uppercase tracking-wider block">Industry Domain</span>
                  <span className="text-sm font-semibold text-[#1D2739] block">{formData.orgIndustry || "Not configured"}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ----------------------------------------------------
  // SUB-PANE COMPONENT 2: Security
  // ----------------------------------------------------
  const [securityData, setSecurityData] = useState({
    currentPass: "",
    newPass: "",
    confirmPass: "",
  });
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);

  const handleSecurityChange = (field: string, val: string) => {
    setSecurityData(prev => ({ ...prev, [field]: val }));
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!securityData.currentPass || !securityData.newPass || !securityData.confirmPass) {
      setStatusModal({
        isOpen: true,
        title: "Validation Incomplete",
        description: "Please populate all security password forms fully before saving.",
        variant: "error"
      });
      return;
    }
    if (securityData.newPass !== securityData.confirmPass) {
      setStatusModal({
        isOpen: true,
        title: "Match Mismatch",
        description: "Your new password and confirmation password do not match. Please verify.",
        variant: "error"
      });
      return;
    }

    setIsSavingSecurity(true);
    // Simulate premium visual updating API
    setTimeout(() => {
      setIsSavingSecurity(false);
      setSecurityData({ currentPass: "", newPass: "", confirmPass: "" });
      setStatusModal({
        isOpen: true,
        title: "Password Updated!",
        description: "Your account credentials have been successfully updated across all modules.",
        variant: "success"
      });
    }, 1500);
  };

  const renderSecurityTab = () => {
    return (
      <div className="bg-white border border-[#E4E7EC] rounded-2xl shadow-sm p-6 md:p-8 space-y-6 animate-fadeIn">
        <div>
          <h3 className="text-lg font-bold text-[#1D2739]">Change Security Password</h3>
          <p className="text-xs text-[#667185] mt-0.5">Maintain password hygiene by updating your security codes regularly.</p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-5">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#344054]">Current Password</Label>
            <Input 
              type="password"
              placeholder="••••••••••••"
              value={securityData.currentPass}
              onChange={(e) => handleSecurityChange("currentPass", e.target.value)}
              className="h-10 border-[#D0D5DD] rounded-lg focus-visible:ring-[#eb5017]/25 focus-visible:border-[#eb5017]"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#344054]">New Password</Label>
            <Input 
              type="password"
              placeholder="••••••••••••"
              value={securityData.newPass}
              onChange={(e) => handleSecurityChange("newPass", e.target.value)}
              className="h-10 border-[#D0D5DD] rounded-lg focus-visible:ring-[#eb5017]/25 focus-visible:border-[#eb5017]"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#344054]">Confirm New Password</Label>
            <Input 
              type="password"
              placeholder="••••••••••••"
              value={securityData.confirmPass}
              onChange={(e) => handleSecurityChange("confirmPass", e.target.value)}
              className="h-10 border-[#D0D5DD] rounded-lg focus-visible:ring-[#eb5017]/25 focus-visible:border-[#eb5017]"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-[#F0F2F5]">
            <button
              type="submit"
              disabled={isSavingSecurity}
              className="h-11 px-6 font-semibold text-white bg-[#eb5017] rounded-lg hover:bg-[#eb5017]/90 transition-all shadow-sm shadow-[#eb5017]/10 flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSavingSecurity ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              Update Password
            </button>
          </div>
        </form>
      </div>
    );
  };

  // ----------------------------------------------------
  // SUB-PANE COMPONENT 3: Teams
  // ----------------------------------------------------
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Organizer");
  const [isSendingInvite, setIsSendingInvite] = useState(false);

  // Fetch all teammates from the live database
  const fetchTeammates = async () => {
    setLoadingTeams(true);
    const { data, error } = await profileService.getTeammates();
    setLoadingTeams(false);
    if (!error && data) {
      const mapped = data.map((item: any) => {
        const userObj = item.user;
        const name = userObj ? `${userObj.firstName} ${userObj.lastName}` : "Invited Teammate";
        const email = userObj ? userObj.email : "";
        const id = userObj ? (userObj.id || userObj._id) : "";
        return {
          id,
          name,
          email,
          role: item.role || "Organizer",
          status: item.status || "Pending"
        };
      });
      setTeamMembers(mapped);
    }
  };

  useEffect(() => {
    if (activeTab === "teams") {
      fetchTeammates();
    }
  }, [activeTab]);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      setStatusModal({
        isOpen: true,
        title: "Validation Error",
        description: "Please enter a valid email address.",
        variant: "error"
      });
      return;
    }

    setIsSendingInvite(true);
    const { data, error } = await profileService.inviteTeammate(inviteEmail.toLowerCase().trim(), inviteRole);
    setIsSendingInvite(false);

    if (error) {
      setStatusModal({
        isOpen: true,
        title: "Invitation Failed",
        description: error.message || "Failed to invite teammate. Please try again.",
        variant: "error"
      });
    } else {
      setInviteEmail("");
      setStatusModal({
        isOpen: true,
        title: "Team Invite Dispatched!",
        description: data.message || `An official invitation has been sent to ${inviteEmail} as role ${inviteRole}.`,
        variant: "success"
      });
      fetchTeammates(); // Refresh list
    }
  };

  const handleDeleteTeamMember = async (index: number) => {
    const memberToDelete = teamMembers[index];
    if (memberToDelete.role === "Owner") {
      setStatusModal({
        isOpen: true,
        title: "Access Restricted",
        description: "The primary workspace Owner cannot be deleted from the team.",
        variant: "error"
      });
      return;
    }

    // Direct removal
    const { error } = await profileService.removeTeammate(memberToDelete.id);

    if (error) {
      setStatusModal({
        isOpen: true,
        title: "Action Malfunction",
        description: error.message || "Failed to remove teammate. Please try again.",
        variant: "error"
      });
    } else {
      setStatusModal({
        isOpen: true,
        title: "Team Member Removed",
        description: `${memberToDelete.name} has been removed from the team workspace.`,
        variant: "success"
      });
      fetchTeammates(); // Refresh list
    }
  };

  const renderTeamsTab = () => {
    return (
      <div className="space-y-6 animate-fadeIn">
        {/* INVITE BOX */}
        <div className="bg-white border border-[#E4E7EC] rounded-2xl shadow-sm p-6 md:p-8 space-y-5">
          <div>
            <h3 className="text-lg font-bold text-[#1D2739]">Invite Team Members</h3>
            <p className="text-xs text-[#667185] mt-0.5">Extend permissions to teammates to help moderate and launch upcoming events.</p>
          </div>

          <form onSubmit={handleSendInvite} className="flex flex-col sm:flex-row items-end gap-4 bg-gray-50 border border-[#E4E7EC] p-4 rounded-xl">
            <div className="flex-1 space-y-1 w-full">
              <Label className="text-xs font-semibold text-[#344054]">Teammate Email</Label>
              <Input 
                type="email"
                placeholder="colleague@domain.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="h-10 border-[#D0D5DD] bg-white rounded-lg focus-visible:ring-[#eb5017]/25 focus-visible:border-[#eb5017]"
                disabled={isSendingInvite}
              />
            </div>
            <div className="w-full sm:w-48 space-y-1">
              <Label className="text-xs font-semibold text-[#344054]">Assign Access Role</Label>
              <Select 
                value={inviteRole} 
                onValueChange={(val) => setInviteRole(val)}
                disabled={isSendingInvite}
              >
                <SelectTrigger className="h-10 w-full border-[#D0D5DD] bg-white rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Organizer">Organizer</SelectItem>
                  <SelectItem value="Coordinator">Coordinator</SelectItem>
                  <SelectItem value="Staff">Event Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <button
              type="submit"
              disabled={isSendingInvite || !inviteEmail}
              className="w-full sm:w-auto h-10 px-5 flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-[#eb5017] rounded-lg hover:bg-[#eb5017]/90 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isSendingInvite ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {isSendingInvite ? "Inviting..." : "Send Invite"}
            </button>
          </form>
        </div>

        {/* TEAM BOARD */}
        <div className="bg-white border border-[#E4E7EC] rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#F0F2F5]">
            <h4 className="text-md font-bold text-[#1D2739]">Active Teammates</h4>
            <p className="text-xs text-[#667185] mt-0.5">Management permissions for members assigned to your workspace.</p>
          </div>
          
          {loadingTeams ? (
            <div className="p-12 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-[#eb5017] animate-spin" />
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Teammates...</p>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="p-12 text-center text-gray-400 space-y-2">
              <p className="text-sm font-bold">No teammates found</p>
              <p className="text-xs">Invite colleagues above to build your event organization team!</p>
            </div>
          ) : (
            <div className="divide-y divide-[#F0F2F5] overflow-x-auto">
              {teamMembers.map((m, idx) => (
                <div key={idx} className="p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F9FAFB]/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#eb5017]/10 flex items-center justify-center font-bold text-[#eb5017]">
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-[#1D2739]">{m.name}</h5>
                      <p className="text-xs text-[#667185]">{m.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-between sm:justify-end w-full sm:w-auto">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full border border-gray-200">
                        {m.role}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide ${m.status === "Active" ? "bg-green-50 border-green-200 text-green-700" : "bg-orange-50 border-orange-200 text-orange-700"}`}>
                        {m.status}
                      </span>
                    </div>

                    {m.role !== "Owner" ? (
                      <button
                        onClick={() => handleDeleteTeamMember(idx)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 shrink-0 cursor-pointer"
                        title="Remove Teammate"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="w-8 shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ----------------------------------------------------
  // SUB-PANE COMPONENT 4: Team Member
  // ----------------------------------------------------
  const renderTeamMemberTab = () => {
    return (
      <div className="bg-white border border-[#E4E7EC] rounded-2xl shadow-sm p-6 md:p-8 space-y-6 animate-fadeIn">
        <div>
          <h3 className="text-lg font-bold text-[#1D2739]">Workspace Permission Settings</h3>
          <p className="text-xs text-[#667185] mt-0.5">Inspect and customize accessibility boundaries for organizers.</p>
        </div>

        <div className="space-y-4">
          <div className="p-4 border border-[#E4E7EC] rounded-xl flex items-start gap-3 hover:border-[#eb5017]/30 transition-all duration-200">
            <Settings className="w-5 h-5 text-[#eb5017] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-[#1D2739]">Event Publishing Rights</h4>
              <p className="text-xs text-[#667185] mt-1 leading-relaxed">
                Allows team members to create new drafts, modify coordinates, update pricing, and instantly publish events to the Helixgade catalog.
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#eb5017] cursor-pointer hover:underline">
                Configure matrices <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          <div className="p-4 border border-[#E4E7EC] rounded-xl flex items-start gap-3 hover:border-[#eb5017]/30 transition-all duration-200">
            <Users className="w-5 h-5 text-[#eb5017] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-[#1D2739]">Attendee Check-in Privileges</h4>
              <p className="text-xs text-[#667185] mt-1 leading-relaxed">
                Grants mobile application access code creation to staff members to check in ticket holders on Event Day.
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#eb5017] cursor-pointer hover:underline">
                Configure matrices <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ----------------------------------------------------
  // SUB-PANE COMPONENT 5: Notifications
  // ----------------------------------------------------
  const [notifyPreferences, setNotifyPreferences] = useState({
    registrations: true,
    rsvps: true,
    critical: true,
    chat: false,
    marketing: false,
  });

  const handleToggleNotify = (key: keyof typeof notifyPreferences) => {
    setNotifyPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderNotificationsTab = () => {
    return (
      <div className="bg-white border border-[#E4E7EC] rounded-2xl shadow-sm p-6 md:p-8 space-y-6 animate-fadeIn">
        <div>
          <h3 className="text-lg font-bold text-[#1D2739]">Notification Preferences</h3>
          <p className="text-xs text-[#667185] mt-0.5">Control how and when Eventeev sends workspace updates.</p>
        </div>

        <div className="space-y-6 divide-y divide-[#F0F2F5]">
          <div className="flex items-center justify-between gap-4 pt-4 first:pt-0">
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-[#1D2739]">Ticket Sales & Registrations</h4>
              <p className="text-xs text-[#667185]">Get notified instantly when an attendee purchases a ticket.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={notifyPreferences.registrations} 
                onChange={() => handleToggleNotify("registrations")}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#eb5017]" />
            </label>
          </div>

          <div className="flex items-center justify-between gap-4 pt-4">
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-[#1D2739]">Attendee RSVP Updates</h4>
              <p className="text-xs text-[#667185]">Receive weekly summaries of registration RSVP lists.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={notifyPreferences.rsvps} 
                onChange={() => handleToggleNotify("rsvps")}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#eb5017]" />
            </label>
          </div>

          <div className="flex items-center justify-between gap-4 pt-4">
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-[#1D2739]">Critical System Warnings</h4>
              <p className="text-xs text-[#667185]">Warnings regarding security issues, plan expirations, and billing alerts.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={notifyPreferences.critical} 
                onChange={() => handleToggleNotify("critical")}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#eb5017]" />
            </label>
          </div>

          <div className="flex items-center justify-between gap-4 pt-4">
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-[#1D2739]">In-App Chat Alerts</h4>
              <p className="text-xs text-[#667185]">Immediate notifications for chats sent inside your networking lobbies.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={notifyPreferences.chat} 
                onChange={() => handleToggleNotify("chat")}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#eb5017]" />
            </label>
          </div>
        </div>
      </div>
    );
  };

  // ----------------------------------------------------
  // SUB-PANE COMPONENT 6: Billing
  // ----------------------------------------------------
  const renderBillingTab = () => {
    return (
      <div className="space-y-6 animate-fadeIn">
        {/* PRICING PLANS COMPLEMENTS */}
        <div className="bg-white border border-[#E4E7EC] rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0F2F5] pb-6">
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-[#FFECE5] text-[#eb5017] rounded-full border border-[#eb5017]/20 uppercase tracking-wide">
                Current Tier
              </span>
              <h3 className="text-xl font-extrabold text-[#1D2739] mt-2">Eventeev Standard</h3>
              <p className="text-xs text-[#667185] mt-1">Enjoy launching standard size networking events for free.</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-3xl font-extrabold text-[#1D2739]">$0</span>
              <span className="text-xs text-[#667185] ml-1">/ forever</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#eb5017]/5 via-[#F56630]/5 to-transparent border border-[#eb5017]/20 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <h4 className="text-sm font-bold text-[#1D2739] flex items-center gap-1.5 justify-center md:justify-start">
                🚀 Upgrade to Premium Pro Tier
              </h4>
              <p className="text-xs text-[#475367] max-w-md">
                Unlock custom branding, ticketing structures with zero commissions, multi-organizer streams, and comprehensive real-time check-in stats.
              </p>
            </div>
            <button
              onClick={() => {
                setStatusModal({
                  isOpen: true,
                  title: "Billing Portal Gateway",
                  description: "Stripe and subscription management pipelines will activate upon official platform release. Thank you for your support!",
                  variant: "success"
                });
              }}
              className="w-full md:w-auto h-10 px-5 text-xs font-semibold text-white bg-[#eb5017] rounded-lg hover:bg-[#eb5017]/90 transition-colors shadow-sm"
            >
              Upgrade for $49/mo
            </button>
          </div>
        </div>

        {/* INVOICES */}
        <div className="bg-white border border-[#E4E7EC] rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#F0F2F5]">
            <h4 className="text-md font-bold text-[#1D2739]">Billing History</h4>
            <p className="text-xs text-[#667185] mt-0.5">Records of payments made to Helixgade Technologies.</p>
          </div>
          <div className="divide-y divide-[#F0F2F5] overflow-x-auto">
            <div className="p-4 md:p-6 flex justify-between items-center gap-4 text-xs font-semibold text-[#667185] bg-gray-50 uppercase tracking-wider">
              <span>Invoice Ref</span>
              <span>Date</span>
              <span>Total Cost</span>
              <span>Status</span>
            </div>
            <div className="p-4 md:p-6 flex justify-between items-center gap-4 hover:bg-[#F9FAFB]/50 transition-colors">
              <span className="text-xs font-bold text-[#1D2739]">#INV-88772</span>
              <span className="text-xs text-[#667185]">May 15, 2026</span>
              <span className="text-xs font-bold text-[#1D2739]">$0.00</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase bg-green-50 border-green-200 text-green-700">
                Processed
              </span>
            </div>
            <div className="p-4 md:p-6 flex justify-between items-center gap-4 hover:bg-[#F9FAFB]/50 transition-colors">
              <span className="text-xs font-bold text-[#1D2739]">#INV-88102</span>
              <span className="text-xs text-[#667185]">Apr 15, 2026</span>
              <span className="text-xs font-bold text-[#1D2739]">$0.00</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase bg-green-50 border-green-200 text-green-700">
                Processed
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ----------------------------------------------------
  // SUB-PANE COMPONENT 7: Data Export
  // ----------------------------------------------------
  const triggerDataDownload = (format: "json" | "csv") => {
    try {
      const mockEventData = [
        { id: "e1", title: "Cyber Tech Meetup", date: "2026-05-25", organizer: `${formData.firstName} ${formData.lastName}` },
        { id: "e2", title: "Design Sprint Showcase", date: "2026-06-12", organizer: `${formData.firstName} ${formData.lastName}` }
      ];

      let fileData = "";
      let filename = `eventeev_export_${user?.id || "user"}`;
      let mimeType = "";

      if (format === "json") {
        fileData = JSON.stringify({ user: formData, events: mockEventData }, null, 2);
        filename += ".json";
        mimeType = "application/json";
      } else {
        fileData = "EventID,Title,StartDate,Organizer\n" + 
          mockEventData.map(e => `"${e.id}","${e.title}","${e.date}","${e.organizer}"`).join("\n");
        filename += ".csv";
        mimeType = "text/csv";
      }

      const blob = new Blob([fileData], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setStatusModal({
        isOpen: true,
        title: "Export Success!",
        description: `Your credential file ${filename} has been prepared and downloaded successfully.`,
        variant: "success"
      });
    } catch (e) {
      console.error(e);
      setStatusModal({
        isOpen: true,
        title: "Export Malfunction",
        description: "Failed to construct the raw downloadable data files locally.",
        variant: "error"
      });
    }
  };

  const renderDataExportTab = () => {
    return (
      <div className="bg-white border border-[#E4E7EC] rounded-2xl shadow-sm p-6 md:p-8 space-y-6 animate-fadeIn">
        <div>
          <h3 className="text-lg font-bold text-[#1D2739]">Export Workspace Data</h3>
          <p className="text-xs text-[#667185] mt-0.5">Retrieve complete copies of your organizer settings and attendees.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 border border-[#E4E7EC] rounded-xl space-y-4 hover:border-[#eb5017]/30 transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#eb5017]/10 flex items-center justify-center">
              <Download className="w-5 h-5 text-[#eb5017]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1D2739]">Event Records (JSON)</h4>
              <p className="text-xs text-[#667185] mt-1 leading-relaxed">
                Includes all profile coordinates, company logs, and customized configurations in structured JSON format.
              </p>
            </div>
            <button
              onClick={() => triggerDataDownload("json")}
              className="h-10 w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-[#eb5017] border border-[#eb5017]/20 bg-[#FFECE5]/20 hover:bg-[#FFECE5]/40 rounded-lg transition-colors"
            >
              Export JSON File
            </button>
          </div>

          <div className="p-5 border border-[#E4E7EC] rounded-xl space-y-4 hover:border-[#eb5017]/30 transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#eb5017]/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#eb5017]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1D2739]">Attendee Registries (CSV)</h4>
              <p className="text-xs text-[#667185] mt-1 leading-relaxed">
                Exports check-in timelines, names, emails, and phone indices in a standard spreadsheet compatible format.
              </p>
            </div>
            <button
              onClick={() => triggerDataDownload("csv")}
              className="h-10 w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-[#eb5017] border border-[#eb5017]/20 bg-[#FFECE5]/20 hover:bg-[#FFECE5]/40 rounded-lg transition-colors"
            >
              Export CSV File
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ----------------------------------------------------
  // SUB-PANE COMPONENT 8: Delete Account Modal
  // ----------------------------------------------------
  const handleDeleteAccountConfirm = () => {
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setStatusModal({
        isOpen: true,
        title: "Access Restricted",
        description: "For security, account deletion is managed by system admins. Please contact Support to request permanent closure.",
        variant: "error"
      });
    }, 1500);
  };

  // Switch right content panels
  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderMyProfileTab();
      case "security":
        return renderSecurityTab();
      case "teams":
        return renderTeamsTab();
      case "member":
        return renderTeamMemberTab();
      case "notifications":
        return renderNotificationsTab();
      case "billing":
        return renderBillingTab();
      case "export":
        return renderDataExportTab();
      default:
        return renderMyProfileTab();
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 animate-fadeIn">
      {/* Dynamic Header Welcomes */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#1D2739] tracking-tight">Account Settings</h1>
        <p className="text-sm text-[#667185] mt-1">Configure your personal credentials, custom brandings, and billing records.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* SIDEBAR NAVIGATION COLUMN */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-[#E4E7EC] rounded-2xl p-4 shadow-sm flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1.5 pb-4 lg:pb-4 scrollbar-none">
            {TABS.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl whitespace-nowrap transition-all duration-200 ${
                    isActive 
                      ? "bg-[#FFECE5] text-[#eb5017] border-l-4 border-[#eb5017] shadow-sm shadow-[#eb5017]/5" 
                      : "text-[#667185] hover:text-[#1B1818] hover:bg-gray-50"
                  }`}
                >
                  <TabIcon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#eb5017]" : "text-[#667185]"}`} />
                  {tab.label}
                </button>
              );
            })}

            <div className="hidden lg:block border-t border-[#F0F2F5] my-4" />

            <button
              onClick={() => setDeleteModalOpen(true)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 rounded-xl hover:bg-red-50 hover:text-red-700 transition-all duration-200 whitespace-nowrap"
            >
              <Trash2 className="w-4 h-4 shrink-0 text-red-600" />
              Delete Account
            </button>
          </div>
        </div>

        {/* CONTENT COLUMN */}
        <div className="lg:col-span-3">
          {renderTabContent()}
        </div>
      </div>

      {/* Confirmation & Status Modals */}
      <ActionConfirmationModal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
        title={statusModal.title}
        description={statusModal.description}
        confirmLabel="Understood"
        hideCancelButton={true}
        variant={statusModal.variant}
      />

      <ActionConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteAccountConfirm}
        title="Delete Your Account?"
        description="Are you absolutely sure you want to delete your profile? This will permanently close your Eventeev access and erase all workspace metrics."
        confirmLabel={isDeleting ? "Deleting..." : "Permanently Delete"}
        variant="error"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ShowProfile;
