"use client";

import React from "react";
import { User } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { SpeakerDataType } from "@/lib/demo-data/speakers";
import { uploadService } from "@/lib/services/upload.service";
import { Loader2 } from "lucide-react";
import ActionConfirmationModal from "@/components/ui/ActionConfirmationModal";

interface SpeakerFormProps {
  initialData?: SpeakerDataType;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  submitLabel?: string;
}

const SpeakerForm = ({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Save Speaker",
}: SpeakerFormProps) => {
  const [isUploading, setIsUploading] = React.useState(false);
  const [photoUrl, setPhotoUrl] = React.useState(initialData?.avatar || "");
  const [alertModal, setAlertModal] = React.useState({
    isOpen: false,
    title: "",
    description: "",
    variant: "primary" as "primary" | "danger" | "success" | "error"
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const { data, error } = await uploadService.uploadImage(file);
    setIsUploading(false);

    if (data?.url) {
      setPhotoUrl(data.url);
    } else {
      console.error("Upload error:", error);
      setAlertModal({ isOpen: true, title: "Upload Failed", description: "Failed to upload image. Please try again.", variant: "error" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formElement = e.currentTarget as HTMLFormElement;
    const formData = new FormData(formElement);
    const data = Object.fromEntries(formData.entries());
    
    onSubmit({ 
      ...data, 
      photo: photoUrl 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Profile Photo & Socials */}
        <div className="md:col-span-4 space-y-3.5">
          {/* Profile Photo */}
          <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 flex flex-col items-center text-center">
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5 self-start">
              Profile Photo
            </Label>
            <div className="relative group mb-2.5">
              <div className="w-20 h-20 rounded-full border-2 border-white shadow-md overflow-hidden bg-white ring-1 ring-gray-100 flex items-center justify-center">
                {isUploading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-[#EB5017]" />
                ) : photoUrl ? (
                  <img src={photoUrl} alt="Speaker" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-gray-300" />
                )}
                {!isUploading && (
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-[9px] text-white font-bold uppercase tracking-wider">Change</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
                  </label>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="cursor-pointer bg-white border border-gray-200 text-[#1D2739] px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-all shadow-xs active:scale-95 text-center">
                {isUploading ? "Uploading..." : "Upload Photo"}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
              </label>
              {photoUrl && !isUploading && (
                <button 
                  type="button" 
                  onClick={() => setPhotoUrl("")}
                  className="text-red-500 text-xs font-medium hover:underline px-1.5"
                >
                  Remove
                </button>
              )}
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5 font-medium">
              JPG or PNG. Max 2MB.
            </p>
          </div>

          {/* Social Links */}
          <div className="space-y-2.5 p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#EB5017]" />
              <h4 className="text-[10px] font-bold text-[#1D2739] uppercase tracking-wider">Social Handles</h4>
            </div>

            <div className="space-y-1">
              <Label htmlFor="twitter" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Speaker X
              </Label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-bold text-gray-400">@</span>
                <Input
                  id="twitter"
                  name="twitter"
                  defaultValue={initialData?.twitterHandle?.replace("@", "")}
                  placeholder="username"
                  className="bg-white border-gray-200 rounded-lg pl-7 pr-3 py-1.5 text-xs font-medium focus:ring-1 focus:ring-[#EB5017]/20 focus:border-[#EB5017] transition-all h-8.5"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="companyTwitter" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Company X
              </Label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-bold text-gray-400">@</span>
                <Input
                  id="companyTwitter"
                  name="companyTwitter"
                  placeholder="company_x"
                  className="bg-white border-gray-200 rounded-lg pl-7 pr-3 py-1.5 text-xs font-medium focus:ring-1 focus:ring-[#EB5017]/20 focus:border-[#EB5017] transition-all h-8.5"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Speaker Details, Topic & Bio */}
        <div className="md:col-span-8 flex flex-col justify-between space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="firstName" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                required
                defaultValue={initialData?.name.split(" ")[0]}
                placeholder="e.g. Sarah"
                className="bg-gray-50/50 border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:ring-1 focus:ring-[#EB5017]/20 focus:border-[#EB5017] transition-all h-9.5"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastName" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last Name *</Label>
              <Input
                id="lastName"
                name="lastName"
                required
                defaultValue={initialData?.name.split(" ").slice(1).join(" ")}
                placeholder="e.g. Jenkins"
                className="bg-gray-50/50 border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:ring-1 focus:ring-[#EB5017]/20 focus:border-[#EB5017] transition-all h-9.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="title" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Professional Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={initialData?.title}
                placeholder="e.g. Senior UI Designer"
                className="bg-gray-50/50 border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:ring-1 focus:ring-[#EB5017]/20 focus:border-[#EB5017] transition-all h-9.5"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="company" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Company / Org</Label>
              <Input
                id="company"
                name="company"
                defaultValue={initialData?.company}
                placeholder="e.g. TechFlow Inc."
                className="bg-gray-50/50 border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:ring-1 focus:ring-[#EB5017]/20 focus:border-[#EB5017] transition-all h-9.5"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="topic" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Presentation Topic</Label>
            <Input
              id="topic"
              name="topic"
              defaultValue={initialData?.topic}
              placeholder="e.g. The Future of Generative AI in Creative Industries"
              className="bg-gray-50/50 border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:ring-1 focus:ring-[#EB5017]/20 focus:border-[#EB5017] transition-all h-9.5"
            />
          </div>

          <div className="space-y-1 flex-1 flex flex-col">
            <Label htmlFor="bio" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Short Bio</Label>
            <textarea
              id="bio"
              name="bio"
              placeholder="Tell us about the speaker's background..."
              defaultValue={(initialData as any)?.bio || ""}
              className="w-full flex-1 min-h-[148px] bg-gray-50/50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-1 focus:ring-[#EB5017]/20 focus:border-[#EB5017] transition-all outline-none resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded-xl text-sm font-semibold text-[#667185] hover:bg-gray-50 transition-all active:scale-95"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-[#EB5017] hover:bg-[#d64815] text-white px-7 py-2 rounded-xl text-sm font-semibold shadow-md shadow-[#EB5017]/20 transition-all transform active:scale-95"
        >
          {submitLabel}
        </button>
      </div>

      <ActionConfirmationModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={() => setAlertModal(prev => ({ ...prev, isOpen: false }))}
        title={alertModal.title}
        description={alertModal.description}
        variant={alertModal.variant}
        confirmLabel="OK"
        hideCancelButton
      />
    </form>
  );
};

export default SpeakerForm;
