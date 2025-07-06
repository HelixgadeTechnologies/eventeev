"use client";

import { useState, ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import EmailInput from "@/components/ui/EmailInput";
import Button from "@/components/ui/Button";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setEmail(value);
    };
  return (
    <section className="flex flex-col md:flex-row items-center justify-center w-screen h-screen gap-10 overflow-hidden">
      <div className="hidden md:flex w-full md:w-2/4 h-full items-center justify-center relative">
        <Image
          src="/password-reset.svg"
          alt="Sign up background image"
          width={200}
          height={100}
          style={{ height: "auto", width: "auto" }}
          className="object-contain h-full"
          priority
        />
        <Image
          src="/logo-white.svg"
          alt="Eventeev 2024"
          width={150}
          height={100}
          className="absolute top-10 left-6 md:left-10"
        />
      </div>
      <div className="w-full md:w-2/4 h-full flex items-center justify-center">
        <div className="space-y-4 md:w-[75%]">
            <h2 className="text-3xl md:text-4xl">Password Reset</h2>
            <p className="text-black/80">
                Don’t worry it happens to the best of us 🔐
            </p>
            <form action="">
                <EmailInput
                    name="email"
                    value={email}
                    onChange={handleInputChange}
                />
                <div className="mt-4">
                  <Button content="Send Link" href="/sign-in/password-reset" />
                </div>
            </form>
            <p className="text-start text-sm text-black/70 leading-6 space-x-2">
                <span>Remember your password?</span>
                <Link href="/" className="text-[#eb5017] custom-underline font-semibold">
                    Login
                </Link>
            </p>
        </div>
      </div>
    </section>
  );
}
