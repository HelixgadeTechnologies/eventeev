"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiOutlineBookOpen, HiOutlineChevronRight, HiOutlinePhotograph, HiOutlineTrash } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { uploadService } from "@/lib/services/upload.service";
import { toast } from "sonner";

interface CreateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: (data: { title: string; description: string; category: string; coverImage: string }) => void;
  categories: { id: string; name: string }[];
}

export default function CreateQuizModal({ isOpen, onClose, onNext, categories }: CreateQuizModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "trivia",
    coverImage: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { data, error } = await uploadService.uploadImage(file);
      if (error) throw new Error(error.message);
      setFormData({ ...formData, coverImage: data.url });
      toast.success("Cover image uploaded!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, coverImage: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    onNext(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-[32px] shadow-2xl z-[151] overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF2F0] flex items-center justify-center text-[#EB5017]">
                  <HiOutlineBookOpen size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#1B1818] tracking-tight">Create New Quiz</h2>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">Step 1 of 2: Basic Info</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-[#1B1818] hover:bg-white transition-all"
              >
                <IoClose size={24} />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {/* Cover Image Section */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#1B1818] uppercase tracking-widest">Quiz Cover Image</label>
                <div 
                  onClick={() => !formData.coverImage && fileInputRef.current?.click()}
                  className={`relative w-full h-48 rounded-[24px] border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 overflow-hidden group ${
                    formData.coverImage 
                      ? "border-transparent bg-gray-50" 
                      : "border-gray-200 bg-gray-50/50 hover:border-[#EB5017] hover:bg-[#FFF2F0] cursor-pointer"
                  }`}
                >
                  {formData.coverImage ? (
                    <>
                      <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button 
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="p-3 bg-white rounded-full text-[#1B1818] hover:bg-[#EB5017] hover:text-white transition-all shadow-lg"
                        >
                          <HiOutlinePhotograph size={20} />
                        </button>
                        <button 
                          type="button"
                          onClick={removeImage}
                          className="p-3 bg-white rounded-full text-[#EB5017] hover:bg-red-600 hover:text-white transition-all shadow-lg"
                        >
                          <HiOutlineTrash size={20} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-[#EB5017] transition-all">
                        {isUploading ? (
                          <div className="w-6 h-6 border-2 border-[#EB5017] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <HiOutlinePhotograph size={24} />
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-[#1B1818]">
                          {isUploading ? "Uploading..." : "Click to upload cover image"}
                        </p>
                        <p className="text-xs font-medium text-gray-400 mt-0.5">JPG, PNG or WEBP (Max 5MB)</p>
                      </div>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#1B1818] uppercase tracking-widest">Quiz Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. World History Trivia"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-[#1B1818] outline-none focus:border-[#EB5017] focus:bg-white transition-all placeholder:text-gray-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#1B1818] uppercase tracking-widest">Description</label>
                <textarea
                  placeholder="Tell us what this quiz is about..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-[#1B1818] outline-none focus:border-[#EB5017] focus:bg-white transition-all placeholder:text-gray-300 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#1B1818] uppercase tracking-widest">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-[#1B1818] outline-none focus:border-[#EB5017] focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  {categories.filter(c => c.id !== "all").map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#EB5017] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-[#d64815] transition-all transform active:scale-95 shadow-xl shadow-[#EB5017]/20 mt-4"
              >
                Continue to Editor
                <HiOutlineChevronRight size={20} />
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
