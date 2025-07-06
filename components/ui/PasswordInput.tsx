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
    <div className="space-y-2.5 md:space-y-3">
        {isLabelShown && <label htmlFor="" className="text-xs font-medium leading-6 block">{label}</label>}
        <div className="relative">
            <input
            type={showPassword ? "text" :"password"}
            value={value}
            name={name}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full border border-gray-300 rounded-[6px] px-2 h-10 outline-none placeholder:text-gray-400 placeholder:font-light font-normal text-sm leading-6 focus:border-[#eb5017] focus:ring-1 focus:ring-[#eb5017] focus:outline-none transition duration-200"
            autoComplete="password"
            />
            <span onClick={() => setShowPassword(!showPassword)} className="absolute right-1.5 top-[20%] md:right-3 md:top-[25%] text-gray-400 text-lg md:text-xl hover:cursor-pointer">{showPassword ? <GoEye /> : <GoEyeClosed /> }</span>
        </div>
    </div>
  );

}