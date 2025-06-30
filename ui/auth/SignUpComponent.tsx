"use client";

import { useState, ChangeEvent } from "react";
import Link from "next/link";
import InputComponent from "@/components/forms/InputComponent";
import EmailInput from "@/components/forms/EmailInput";
import PasswordInput from "@/components/forms/PasswordInput";
import Button from "@/components/forms/Button";
import ContinueWithGoogle from "@/components/forms/continue-with-google";
import Divider from "@/components/forms/Divider";

export default function SignUp() {
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
    <div className="space-y-3 w-full md:w-fit m-4">
      <h2 className="text-4xl text-center md:text-start font-semibold text-[#1B1818] mb-10">
        Sign up!
      </h2>
      <form action="" className="space-y-5">
        <div className="flex gap-5 flex-col md:flex-row">
          <InputComponent
            name="firstName"
            label="First Name"
            value={userData.firstName}
            onChange={handleInputChange}
          />
          <InputComponent
            name="lastName"
            label="Last Name"
            value={userData.lastName}
            onChange={handleInputChange}
          />
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
          <Button content="Sign up" />
        </div>
      </form>
      <section className="space-y-5 my-3">
        <p className="text-center text-sm text-gray-500 leading-6 space-x-2">
          <span>Already have an account?</span>
          <Link href="/" className="text-[#eb5017] custom-underline">
            Login
          </Link>
        </p>
        <Divider />
        <ContinueWithGoogle />
      </section>
    </div>
  );
}
