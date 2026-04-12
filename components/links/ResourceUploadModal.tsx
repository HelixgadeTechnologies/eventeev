"use client";

import React, { useState, useEffect, useRef } from "react";
import Modal from "../ui/Modal";
import FileInput from "../ui/FileInput";
import InputComponent from "../ui/InputComponent";
import { Textarea } from "../ui/textarea";
import { HiOutlineDocumentAdd, HiOutlineCheckCircle, HiOutlineX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

interface ResourceUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (data: { file: File, title: string, description: string }) => void;
}

const ResourceUploadModal = ({ isOpen, onClose, onUploadComplete }: ResourceUploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "complete">("idle");
  const [progress, setProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState("0 MB/s");
  
  const simulationRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen]);

  const resetState = () => {
    setFile(null);
    setTitle("");
    setDescription("");
    setUploadStatus("idle");
    setProgress(0);
    setUploadSpeed("0 MB/s");
    if (simulationRef.current) clearInterval(simulationRef.current);
  };

  const startUpload = () => {
    if (!file) return;
    setUploadStatus("uploading");
    
    let currentProgress = 0;
    
    simulationRef.current = setInterval(() => {
      // Simulate variability in upload speed
      const increment = Math.random() * 15; 
      currentProgress += increment;
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(simulationRef.current!);
        setUploadStatus("complete");
        setTimeout(() => {
          onUploadComplete({ 
            file, 
            title: title || file.name, 
            description: description || `Uploaded file: ${file.name}` 
          });
          onClose();
        }, 1500);
      }
      
      setProgress(currentProgress);
      
      // Calculate a "fake" speed between 2.0 and 8.0 MB/s
      const speed = (Math.random() * 6 + 2).toFixed(1);
      setUploadSpeed(`${speed} MB/s`);
    }, 200);
  };

  const handleFileSelect = (url: string, selectedFile: File | null) => {
    setFile(selectedFile);
    if (selectedFile && !title) {
        setTitle(selectedFile.name);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-0 overflow-hidden bg-white/95 backdrop-blur-xl">
      <div className="relative">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EB5017]/10 flex items-center justify-center text-[#EB5017]">
              <HiOutlineDocumentAdd size={20} />
            </div>
            <div>
              <h3 className="font-black text-[#1B1818] uppercase tracking-tight">Upload Resource</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Add files to your event</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
          >
            <HiOutlineX size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {uploadStatus === "idle" && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <FileInput onChange={handleFileSelect} />
                  
                  {file && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-4 pt-2"
                    >
                      <InputComponent 
                        label="Document Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        name="title"
                        placeholder="Enter a title for this file"
                      />
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium leading-6 block">Description</label>
                        <Textarea 
                          placeholder="What is this document about?"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="min-h-[80px]"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
                
                <button
                  onClick={startUpload}
                  disabled={!file}
                  className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl ${
                    file 
                      ? "bg-[#EB5017] text-white hover:bg-[#d64815] shadow-[#EB5017]/20 active:scale-[0.98]" 
                      : "bg-gray-100 text-gray-300 cursor-not-allowed shadow-none"
                  }`}
                >
                  Start Upload
                </button>
              </motion.div>
            )}

            {uploadStatus === "uploading" && (
              <motion.div 
                key="uploading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center space-y-8"
              >
                <div className="space-y-2">
                   <div className="relative w-24 h-24 mx-auto mb-6">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="44"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-gray-100"
                        />
                        <motion.circle
                          cx="48"
                          cy="48"
                          r="44"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray="276"
                          initial={{ strokeDashoffset: 276 }}
                          animate={{ strokeDashoffset: 276 - (276 * progress) / 100 }}
                          className="text-[#EB5017]"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-black text-[#1B1818]">{Math.round(progress)}%</span>
                      </div>
                   </div>
                   <h4 className="text-lg font-black text-[#1B1818] uppercase tracking-tight">Uploading File...</h4>
                   <p className="text-xs text-gray-400 font-medium truncate max-w-xs mx-auto">{file?.name}</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Speed</p>
                    <p className="text-sm font-black text-[#EB5017]">{uploadSpeed}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Size</p>
                    <p className="text-sm font-black text-gray-600">{(file!.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
              </motion.div>
            )}

            {uploadStatus === "complete" && (
              <motion.div 
                key="complete"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-14 text-center space-y-4"
              >
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HiOutlineCheckCircle size={48} className="animate-in zoom-in duration-500" />
                </div>
                <h4 className="text-2xl font-black text-[#1B1818] uppercase tracking-tight">Upload Success!</h4>
                <p className="text-sm text-gray-400 font-medium px-10">Your resource has been uploaded and added to the list.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Modal>
  );
};

export default ResourceUploadModal;
