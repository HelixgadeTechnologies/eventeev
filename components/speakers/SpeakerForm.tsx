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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Profile Photo Section */}
      <section className="flex flex-col md:flex-row gap-8 items-start pb-8 border-b border-gray-100">
        <div className="w-full md:w-1/3 space-y-2">
          <h4 className="text-sm font-bold text-[#1B1818] uppercase tracking-wider">Profile Photo</h4>
          <p className="text-xs text-gray-400 leading-relaxed font-medium">
            Upload a high-quality headshot. Supports JPG, PNG. Max 2MB.
          </p>
        </div>
        <div className="flex-1 flex items-center gap-6">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-50 ring-1 ring-gray-100 flex items-center justify-center">
              {isUploading ? (
                <Loader2 className="w-8 h-8 animate-spin text-[#EB5017]" />
              ) : photoUrl ? (
                <img src={photoUrl} alt="Speaker" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-gray-300" />
              )}
              {!isUploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <span className="text-[10px] text-white font-bold uppercase tracking-widest">Change</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="cursor-pointer bg-white border border-gray-200 text-[#1B1818] px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all shadow-sm active:scale-95 text-center">
              {isUploading ? "Uploading..." : "Upload New"}
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
            </label>
            {photoUrl && !isUploading && (
              <button 
                type="button" 
                onClick={() => setPhotoUrl("")}
                className="text-red-500 text-[10px] font-bold uppercase tracking-wider hover:underline text-left px-4"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Basic Info Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#EB5017]" />
          <h4 className="text-xs font-bold text-[#1B1818] uppercase tracking-[0.15em]">Speaker Information</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label htmlFor="firstName" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              required
              defaultValue={initialData?.name.split(" ")[0]}
              placeholder="e.g. Sarah"
              className="bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-[#EB5017]/10 focus:border-[#EB5017] transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              required
              defaultValue={initialData?.name.split(" ").slice(1).join(" ")}
              placeholder="e.g. Jenkins"
              className="bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-[#EB5017]/10 focus:border-[#EB5017] transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Professional Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={initialData?.title}
              placeholder="e.g. Senior UI Designer"
              className="bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-[#EB5017]/10 focus:border-[#EB5017] transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="company" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Company / Organization</Label>
            <Input
              id="company"
              name="company"
              defaultValue={initialData?.company}
              placeholder="e.g. TechFlow Inc."
              className="bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-[#EB5017]/10 focus:border-[#EB5017] transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="bio" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Short Bio</Label>
          <textarea
            id="bio"
            name="bio"
            placeholder="Tell us about the speaker's background..."
            rows={3}
            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-[#EB5017]/10 focus:border-[#EB5017] transition-all outline-none resize-none"
          />
        </div>
      </section>

      {/* Socials & Topic Section */}
      <section className="space-y-6 pt-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#EB5017]" />
          <h4 className="text-xs font-bold text-[#1B1818] uppercase tracking-[0.15em]">Content & Socials</h4>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="topic" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Presentation Topic</Label>
          <Input
            id="topic"
            name="topic"
            defaultValue={initialData?.topic}
            placeholder="e.g. The Future of Generative AI in Creative Industries"
            className="bg-gray-50/50 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-[#EB5017]/10 focus:border-[#EB5017] transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label htmlFor="twitter" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Speaker X (Twitter)</Label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-xs font-bold text-gray-400">@</span>
              <Input
                id="twitter"
                name="twitter"
                defaultValue={initialData?.twitterHandle.replace("@", "")}
                placeholder="username"
                className="bg-gray-50/50 border-gray-100 rounded-xl pl-8 pr-4 py-3 text-sm font-medium focus:ring-1 focus:ring-[#EB5017]/10 focus:border-[#EB5017] transition-all"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="companyTwitter" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Company X (Twitter)</Label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-xs font-bold text-gray-400">@</span>
              <Input
                id="companyTwitter"
                name="companyTwitter"
                placeholder="company_x"
                className="bg-gray-50/50 border-gray-100 rounded-xl pl-8 pr-4 py-3 text-sm font-medium focus:ring-1 focus:ring-[#EB5017]/10 focus:border-[#EB5017] transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-full text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all active:scale-95"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-[#EB5017] text-white px-8 py-3 rounded-full text-sm font-black shadow-xl shadow-[#EB5017]/20 hover:bg-[#d64815] transition-all transform active:scale-95 uppercase tracking-widest"
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
