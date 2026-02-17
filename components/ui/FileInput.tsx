"use client";
import React, { useState } from "react";
import Image from "next/image";
import img from "@/public/file-upload.svg";

interface FileInputProps {
  onChange: (file: File | null) => void;
  defaultValue?: string;
  className?: string;
}

const FileInput = ({ onChange, defaultValue, className }: FileInputProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(defaultValue || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    onChange?.(selectedFile);
    
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  return (
    <div className={`border-2 border-dashed border-[#D0D5DD] rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 w-full mx-auto relative overflow-hidden ${className}`}>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept=".svg,.png,.jpg,.jpeg,.gif"
        onChange={handleFileChange}
      />

      <label
        htmlFor="file-upload"
        className="cursor-pointer text-[#EB5017] font-medium flex flex-col justify-center items-center gap-y-2 w-full h-full z-10"
      >
        {preview ? (
          <div className="absolute inset-0 w-full h-full bg-white">
            <Image src={preview} alt="preview" fill className="object-cover" />
            {/* Hover overlay to show upload text */}
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2">
              <Image src={img} alt="upload icon" className="brightness-0 invert" />
              <span className="text-xs font-bold uppercase tracking-wider">Change Image</span>
            </div>
          </div>
        ) : (
          <>
            <Image src={img} alt="upload icon" />
            <div className="text-[10px]">
              <span className=" hover:underline">Click to upload</span> or{" "}
              <span className="hover:no-underline text-[#475367]">
                drag and drop
              </span>
            </div>
            {!preview && (
              <p className="text-[#98A2B3] text-[9px] font-normal px-4">
                SVG, PNG, JPG (Ideal for aspect ratio)
              </p>
            )}
          </>
        )}
      </label>

      {!preview && (
        <>
          <div className="relative w-full flex justify-center before:absolute before:border before:border-[#F0F2F5] before:h-[0.5px] before:w-full before:left-0 before:top-1/2">
            <span className="bg-white px-2 flex justify-center items-center relative z-10 w-fit text-[#98A2B3] text-[9px]">or</span>
          </div>

          <label
            htmlFor="file-upload"
            className="bg-[#EB5017] text-white px-3 py-1.5 rounded-lg mt-1 cursor-pointer transition text-[10px] font-bold uppercase tracking-wider"
          >
            Browse Files
          </label>
        </>
      )}
    </div>
  );
};

export default FileInput;
