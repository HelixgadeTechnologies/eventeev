"use client";

import { useState, ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import EmailInput from "@/components/forms/EmailInput";
import PasswordInput from "@/components/forms/PasswordInput";
import Checkbox from "@/components/forms/Checkbox";
import Button from "@/components/forms/Button";
import ContinueWithGoogle from "@/components/forms/continue-with-google";
import Divider from "@/components/forms/Divider";

export default function LoginComponent() {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    checkbox: true, // Default to checked
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <section className="h-screen flex flex-col items-center justify-center space-y-5 w-[90%] md:w-fit">
      <Image
        src="/logo-white.svg"
        alt="Eventeev 2024"
        width={180}
        height={80}
        priority
      />
      <div className="w-full md:w-[450px] space-y-4 p-5 bg-white rounded-[16px]">
        <div className="text-center space-y-1">
          <h1 className="text-xl md:text-2xl">Sign in</h1>
          <p className="text-gray-500 text-xs md:text-sm">
            Enter your credentials to access your account
          </p>
        </div>
        <ContinueWithGoogle />
        <Divider text="OR" />
        <form action="" className="space-y-5">
          <EmailInput
            name="email"
            label="Email Address"
            value={userData.email}
            onChange={handleInputChange}
          />
          <PasswordInput
            name="password"
            label="Password"
            value={userData.password}
            onChange={handleInputChange}
          />
          <div className="flex items-center justify-between text-sm">
            <Checkbox label="Remember me for 30 days" name="checkbox" onChange={handleInputChange} checked={userData.checkbox} />
            <Link href="/forgot-password" className="text-[#eb5017] custom-underline text-xs whitespace-nowrap">
              Forgot Password?
            </Link>
          </div>
          <div className="mt-5">
            <Button content="Sign in" />
          </div>
        </form>
      </div>
      <div className="text-center text-sm text-gray-500 leading-6 space-x-1 h-[52px] px-7 py-4 rounded-[30px] bg-white">
        <span>Don&apos;t have an account?</span>
        <a href="/sign-up" className="text-[#eb5017] custom-underline">
          Sign up
        </a>
      </div>
    </section>
  );
}
