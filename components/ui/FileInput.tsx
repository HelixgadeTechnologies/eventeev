"use client";
import React, { useState } from "react";
import Image from "next/image";
import img from "@/public/file-upload.svg";

interface FileInputProps {
  onChange: (file: File | null) => void;
}

const FileInput = ({ onChange }: FileInputProps) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    onChange?.(selectedFile);
  };
  return (
    <div className="border-2 border-dashed border-[#D0D5DD] rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-2 w-full max-w-md mx-auto">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept=".svg,.png,.jpg,.jpeg,.gif"
        onChange={handleFileChange}
      />

      <label
        htmlFor="file-upload"
        className="cursor-pointer text-[#EB5017] font-medium flex flex-col justify-center items-center gap-y-4"
      >
        <Image src={img} alt="upload icon" />
        <div>
          <span className=" hover:underline">Click to upload</span> or{" "}
          <span className="hover:no-underline text-[#475367]">
            drag and drop
          </span>
        </div>
      </label>
      <p className="text-[#98A2B3] text-xs font-normal">
        SVG, PNG, JPG or GIF (max. 800×400px)
      </p>

      <div className="relative w-full flex justify-center before:absolute before:border before:border-[#F0F2F5] before:h-[0.5px] before:w-full before:left-0 before:top-1/2"><span className="bg-white p-2 flex justify-center items-center relative z-10 w-fit text-[#98A2B3]">or</span></div>

      <label
        htmlFor="file-upload"
        className="bg-[#EB5017] text-white px-4 py-2 rounded-md mt-2 cursor-pointer transition"
      >
        Browse Files
      </label>

      {file && (
        <div className="mt-4 text-sm text-gray-700">
          <p>
            <strong>File:</strong> {file.name}
          </p>
          <p>
            <strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB
          </p>
        </div>
      )}
    </div>
  );
};

export default FileInput;
