"use client";

import { useState } from "react";
import { GoEye, GoEyeClosed } from "react-icons/go";

type PasswordInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label: string;
  isLabelShown?: boolean;
  name: string;
}

export default function PasswordInput ({
  value,
  onChange,
  placeholder = "******",
  label = "Password",
  isLabelShown = true,
  name = "password",
}: PasswordInputProps) {

    const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="space-y-2">
        {isLabelShown && <label htmlFor={name} className="text-sm font-bold text-[#1B1818] block">{label}</label>}
        <div className="relative">
            <input
            type={showPassword ? "text" :"password"}
            id={name}
            value={value}
            name={name}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full border border-[#D0D5DD] rounded-xl px-4 h-11 outline-none placeholder:text-[#98A2B3] font-normal text-sm focus:border-[#eb5017] focus:ring-1 focus:ring-[#eb5017]/10 transition-all duration-200"
            autoComplete="current-password"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl hover:text-gray-600 transition-colors"
            >
              {showPassword ? <GoEye /> : <GoEyeClosed /> }
            </button>
        </div>
    </div>
  );

}