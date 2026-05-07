"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { useTranslations } from "next-intl";

export default function ContinueWithGoogle() {
  const t = useTranslations('Auth');
  const { googleLogin } = useAuth();
  const router = useRouter();

  const isConfigured = !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      console.log("[Google Auth] Code received:", codeResponse.code);
      try {
        const { error } = await googleLogin(codeResponse.code);
        if (error) {
          toast.error(error || "Google login failed");
        } else {
          toast.success("Login successful!");
          router.push("/events");
        }
      } catch (err) {
        console.error("Google Login Error:", err);
        toast.error("An unexpected error occurred during login");
      }
    },
    onError: (error) => {
      console.error("Google Login Failed:", error);
      toast.error(`Google Sign-In failed: ${error.error_description || 'Check your configuration'}`);
    },
    flow: 'auth-code',
    scope: 'https://www.googleapis.com/auth/calendar.events openid email profile',
  });

  const handleLoginClick = () => {
    if (!isConfigured) {
      toast.error("Google Sign-In is not configured. Please add NEXT_PUBLIC_GOOGLE_CLIENT_ID to your .env.local file and restart your server.", {
        duration: 5000,
        description: "Environment variable is missing or empty."
      });
      return;
    }
    login();
  };

  return (
    <div 
        onClick={handleLoginClick}
        className={`rounded-xl h-12 w-full px-6 flex items-center justify-center border border-[#D0D5DD] bg-white text-[#344054] hover:bg-gray-50 transition-all duration-200 cursor-pointer shadow-sm group ${!isConfigured ? 'opacity-70 grayscale-[0.5]' : ''}`}
    >
        <FcGoogle className="text-2xl mr-3 group-hover:scale-110 transition-transform" />
        <span className="text-base font-bold">{t('continueWithGoogle')}</span>
    </div>
  );
}