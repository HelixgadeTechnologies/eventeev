"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter, Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import InputComponent from "@/components/ui/InputComponent";
import EmailInput from "@/components/ui/EmailInput";
import PasswordInput from "@/components/ui/PasswordInput";

import ContinueWithGoogle from "@/components/ui/ContinueWithGoogle";
import Divider from "@/components/ui/Divider";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import ConnectEventForm from "@/components/events/public/ConnectEventForm";

export default function SignUpComponent() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const { signUp, user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(userData.password)) {
      setError("Password must be at least 8 characters and include uppercase, lowercase, and numbers");
      setLoading(false);
      return;
    }

    try {
      const { error: signUpError } = await signUp(
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.password
      );

      if (signUpError) {
        setError(signUpError.message || "An error occurred during sign up");
        setLoading(false);
      } else {
        setSuccess(true);
        setLoading(false);
        // Redirect after successful signup
        setTimeout(() => {
          router.push(`/sign-up/otp?email=${encodeURIComponent(userData.email)}`);
        }, 2000);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-4 w-full md:w-[480px] m-4 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex justify-center mb-4">
            <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-green-900 mb-2">Registration Successful!</h2>
          <p className="text-green-700 mb-4">
            Your account has been created. Redirecting to email verification...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 w-full md:w-[480px] m-4">
      <h2 className="text-4xl text-center md:text-start font-semibold text-[#1B1818] mb-10">
        {t('signup')}!
      </h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-center">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2.5 md:space-y-5">
        <div className="flex gap-2.5 flex-col md:flex-row w-full">
            <div className="w-full md:w-1/2">
              <InputComponent
                name="firstName"
                label={t('firstName')}
                value={userData.firstName}
                onChange={handleInputChange}
                placeholder="John"
              />
            </div>
            <div className="w-full md:w-1/2">
              <InputComponent
                name="lastName"
                label={t('lastName')}
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
          label={t('email')}
          type="email"
        />
        <PasswordInput
          value={userData.password}
          onChange={handleInputChange}
          label={t('password')}
          name="password"
        />
        <div className="mt-5">
          <Button
            content={t('signup')}
            isLoading={loading}
            type="submit"
          />
        </div>
      </form>
      <section className="space-y-5 mt-5 mb-3">
        <p className="text-center text-sm text-black leading-6 space-x-2">
          <span>{t('alreadyHaveAccount')}</span>
          <Link href="/" className="text-[#eb5017] custom-underline font-semibold">
            {t('login')}
          </Link>
        </p>
        <Divider />
        <ContinueWithGoogle />
        <Divider text="OR" />
        <div className="w-full bg-white rounded-lg space-y-4">
          <div className="text-center">
            <h2 className="text-lg font-bold">Have an Event Code?</h2>
            <p className="text-xs text-gray-500">Connect directly using your event ID</p>
          </div>
          <ConnectEventForm />
        </div>
      </section>
    </div>
  );
}
