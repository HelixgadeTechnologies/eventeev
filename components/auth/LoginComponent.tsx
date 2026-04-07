"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import EmailInput from "@/components/ui/EmailInput";
import PasswordInput from "@/components/ui/PasswordInput";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import ContinueWithGoogle from "@/components/ui/ContinueWithGoogle";
import Divider from "@/components/ui/Divider";
import { useAuth } from "@/context/AuthContext";

export default function LoginComponent() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    checkbox: false, // Default to checked
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!userData.email || !userData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const { error: signInError } = await signIn(userData.email, userData.password);

      if (signInError) {
        setError(signInError.message || "Invalid email or password");
        setLoading(false);
      } else {
        router.push("/events");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <section className="h-screen flex flex-col items-center justify-center space-y-10 md:space-y-6 w-[90%] md:w-fit">
      <Image
        src="/logo-white.svg"
        alt="Eventeev 2024"
        width={150}
        height={60}
        priority={true}
      />
      <div className="w-full md:w-[380px] space-y-3 p-5 bg-white rounded-lg">
        <div className="text-center space-y-1">
          <h1 className="text-xl md:text-2xl">Sign in</h1>
          <p className="text-gray-500 text-xs md:text-sm">
            Enter your credentials to access your account
          </p>
        </div>
        <ContinueWithGoogle />
        <Divider text="OR" />
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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
            <Checkbox
              label="Remember me for 30 days"
              name="checkbox"
              onChange={handleInputChange}
              checked={userData.checkbox}
            />
            <Link
              href="/sign-in/forgot-password"
              className="text-[#eb5017] custom-underline text-xs whitespace-nowrap"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="mt-5">
            <Button 
              content="Sign in" 
              isLoading={loading}
              type="submit"
            />
          </div>
        </form>
      </div>
      <div className="text-center text-xs text-black leading-6 space-x-1 h-[52px] px-4 py-2 rounded-[30px] bg-white flex justify-center items-center">
        <span>Don&apos;t have an account?</span>
        <a
          href="/sign-up"
          className="text-[#eb5017] custom-underline font-semibold"
        >
          Sign up
        </a>
      </div>
    </section>
  );
}
