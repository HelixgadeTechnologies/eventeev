"use client";

import { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function OTPVerificationComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const { verifyOtp, resendOtp } = useAuth();

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [activeOtpIndex, setActiveOtpIndex] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    const newOtp = [...otp];
    
    // Only allow one digit
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (!value) {
      // If deleting, move back
      setActiveOtpIndex(index - 1 >= 0 ? index - 1 : 0);
    } else {
      // If entered, move forward
      setActiveOtpIndex(index + 1 < 6 ? index + 1 : 5);
    }
    
    if (error) setError("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index]) {
      setActiveOtpIndex(index - 1 >= 0 ? index - 1 : 0);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      setActiveOtpIndex(5);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    
    if (otpValue.length < 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { error: verifyError } = await verifyOtp(email, otpValue);

      if (verifyError) {
        setError(verifyError.message || "Invalid or expired verification code");
        setLoading(false);
      } else {
        // Success! Redirect to organization registration
        router.push("/sign-up/organization-registration");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    setLoading(true);
    const { error: resendError } = await resendOtp(email);
    setLoading(false);

    if (resendError) {
      setError(resendError.message || "Failed to resend code");
    } else {
      setResendTimer(30);
      setCanResend(false);
      setError("");
      setOtp(new Array(6).fill(""));
      setActiveOtpIndex(0);
    }
  };

  return (
    <div className="space-y-6 w-full md:w-[480px] m-4">
      <div className="space-y-2 text-center md:text-start">
        <h2 className="text-4xl font-semibold text-[#1B1818]">
          Verify your email
        </h2>
        <p className="text-black/60 text-sm">
          We've sent a 6-digit verification code to <br />
          <span className="font-semibold text-black">{email}</span>
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex justify-between gap-2 md:gap-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={index === activeOtpIndex ? inputRef : null}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-full h-14 md:h-16 text-center text-2xl font-bold border-2 rounded-xl focus:border-[#eb5017] focus:ring-1 focus:ring-[#eb5017] outline-none transition-all border-gray-200 text-gray-900"
            />
          ))}
        </div>

        <div className="space-y-4">
          <Button
            content={loading ? "Verifying..." : "Verify Code"}
            isLoading={loading}
            type="submit"
          />
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{" "}
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-[#eb5017] font-semibold hover:underline"
                >
                  Resend now
                </button>
              ) : (
                <span className="text-gray-400 font-medium">
                  Resend in {resendTimer}s
                </span>
              )}
            </p>
          </div>
        </div>
      </form>

      <div className="text-center">
        <Link href="/sign-up" className="text-sm text-gray-500 hover:text-[#eb5017] transition-colors">
          &larr; Back to Sign up
        </Link>
      </div>
    </div>
  );
}
