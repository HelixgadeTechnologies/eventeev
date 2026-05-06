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
      // If the Client ID is missing, Google's library will trigger onError or show a popup error
      toast.error(`Google Sign-In failed: ${error.error_description || 'Check your configuration'}`);
    },
    flow: 'auth-code',
    scope: 'https://www.googleapis.com/auth/calendar.events openid email profile',
  });

  return (
    <div 
        onClick={() => login()}
        className="rounded-xl h-12 w-full px-6 flex items-center justify-center border border-[#D0D5DD] bg-white text-[#344054] hover:bg-gray-50 transition-all duration-200 cursor-pointer shadow-sm group"
    >
        <FcGoogle className="text-2xl mr-3 group-hover:scale-110 transition-transform" />
        <span className="text-base font-bold">{t('continueWithGoogle')}</span>
    </div>
  );
}