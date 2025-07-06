"use client";

import { useState, ChangeEvent } from "react";
import Link from "next/link";
import InputComponent from "@/components/ui/InputComponent";
import EmailInput from "@/components/ui/EmailInput";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "@/components/ui/Button";
import ContinueWithGoogle from "@/components/ui/ContinueWithGoogle";
import Divider from "@/components/ui/Divider";

export default function SignUpComponent() {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div className="space-y-2 w-full md:w-[480px] m-4">
      <h2 className="text-4xl text-center md:text-start font-semibold text-[#1B1818] mb-10">
        Sign up!
      </h2>
      <form action="" className="space-y-2.5 md:space-y-5">
        <div className="flex gap-2.5 flex-col md:flex-row w-full">
          <div className="w-full md:w-1/2">
            <InputComponent
              name="firstName"
              label="First Name"
              value={userData.firstName}
              onChange={handleInputChange}
              placeholder="John"
            />
          </div>
          <div className="w-full md:w-1/2">
            <InputComponent
              name="lastName"
              label="Last Name"
              value={userData.lastName}
              onChange={handleInputChange}
              placeholder="Doe"
            />
          </div>
        </div>
        <EmailInput
          name="email"
          value={userData.email}
          onChange={handleInputChange}
          label="Email Address"
        />
        <PasswordInput
          value={userData.password}
          onChange={handleInputChange}
          label="Password"
          name="password"
        />
        <div className="mt-5">
          <Button content="Sign up" href="/sign-up/organization-registration" />
        </div>
      </form>
      <section className="space-y-5 mt-5 mb-3">
        <p className="text-center text-sm text-black leading-6 space-x-2">
          <span>Already have an account?</span>
          <Link href="/" className="text-[#eb5017] custom-underline font-semibold">
            Login
          </Link>
        </p>
        <Divider />
        <ContinueWithGoogle />
      </section>
    </div>
  );
}
