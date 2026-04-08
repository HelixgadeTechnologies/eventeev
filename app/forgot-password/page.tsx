"use client";

import { useState, ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import EmailInput from "@/components/ui/EmailInput";
import { MdMail } from "react-icons/md";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setEmail(value);
    };
  return (
    <section className="flex flex-col md:flex-row items-center justify-center w-screen h-screen overflow-hidden">
      {/* Left Panel: Background Image */}
      <div className="hidden md:flex w-1/2 h-full relative">
        <Image
          src="/password-reset-bg.png"
          alt="Cinema seats background"
          fill
          className="object-cover"
          priority
        />
        {/* Logo at top-left */}
        <div className="absolute top-10 left-10">
          <Image
            src="/logo-white.svg"
            alt="Eventeev"
            width={150}
            height={50}
            className="h-auto"
          />
        </div>
      </div>

      {/* Right Panel: Content */}
      <div className="w-full md:w-1/2 h-full flex flex-col items-center justify-center px-6 md:px-0">
        <div className="w-full max-w-[440px] space-y-8">
            <div className="space-y-2">
                <h2 className="text-[32px] md:text-[40px] font-bold text-[#1B1818] leading-tight mb-2">Password Reset</h2>
                <p className="text-[#667185] text-sm">
                    Don’t worry it happens to the best of us 🔐
                </p>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                <EmailInput
                    name="email"
                    value={email}
                    onChange={handleInputChange}
                    Icon={MdMail}
                    placeholder="godfrey@gmail.com"
                />
                <div className="mt-8">
                  <button
                    type="submit"
                    className="w-full bg-[#eb5017] text-white py-4 rounded-xl font-bold hover:bg-[#d64815] transition-all transform active:scale-[0.98] shadow-lg shadow-[#eb5017]/20"
                  >
                    Send Link
                  </button>
                </div>
            </form>

            <p className="text-center md:text-start text-sm text-[#667185] font-medium pt-4">
                <span>Remember your password?</span>
                <Link href="/" className="text-[#eb5017] font-bold hover:underline ml-2">
                    Log in
                </Link>
            </p>
        </div>
      </div>
    </section>
  );
}
