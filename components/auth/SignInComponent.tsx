"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import EmailInput from "@/components/ui/EmailInput";
import PasswordInput from "@/components/ui/PasswordInput";
import ContinueWithGoogle from "@/components/ui/ContinueWithGoogle";
import Divider from "@/components/ui/Divider";
import { useAuth } from "@/context/AuthContext";

export default function SignInComponent() {
  const { signIn } = useAuth();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    if (!userData.email || !userData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const { error } = await signIn(userData.email, userData.password);

      if (error) {
        setError(error.message);
        setLoading(false);
      }
      // On success, the useAuth hook will automatically redirect to /events
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 w-full">
        <div className="text-center mb-10">
          <h2 className="text-[28px] font-bold text-[#1B1818] mb-2 leading-tight">
            Sign in
          </h2>
          <p className="text-[#667185] text-sm">
            Enter your credentials to access your account
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm text-center">{error}</p>
          </div>
        )}

        <ContinueWithGoogle />

        <div className="my-8">
          <Divider text="OR" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <EmailInput
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            label="Email Address"
            type="email"
            placeholder=""
          />
          <PasswordInput
            value={userData.password}
            onChange={handleInputChange}
            label="Password"
            name="password"
            placeholder="Enter Password"
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-[#eb5017] focus:ring-[#eb5017]"
              />
              <span className="text-sm text-[#475367] font-medium group-hover:text-black transition-colors">
                Remember me for 30 days
              </span>
            </label>
            <Link
              href="/sign-in/forgot-password"
              className="text-sm text-[#eb5017] font-semibold hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#eb5017] text-white py-3.5 rounded-xl font-bold hover:bg-[#d64815] transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#eb5017]/20"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 flex justify-center">
        <div className="bg-white px-6 py-2.5 rounded-full shadow-lg">
          <p className="text-sm text-[#475367] flex items-center gap-2">
            Don't have an account?
            <Link
              href="/sign-up"
              className="text-[#eb5017] font-bold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
