"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { useTranslations } from "next-intl";

/**
 * Sub-component that actually uses the Google Login hook.
 * This is separated to prevent crashes when the GoogleOAuthProvider is missing.
 */
const GoogleLoginButton = () => {
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
      toast.error("Google Sign-In failed. Please try again.");
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
};

/**
 * Placeholder button shown when Google Auth is not configured.
 */
const DisabledGoogleButton = () => {
  const t = useTranslations('Auth');
  return (
    <div 
        className="rounded-xl h-12 w-full px-6 flex items-center justify-center border border-[#E4E7EC] bg-[#F9FAFB] text-[#98A2B3] cursor-not-allowed shadow-sm"
        title="Google Sign-In is currently unavailable"
    >
        <FcGoogle className="text-2xl mr-3 opacity-50 grayscale" />
        <span className="text-base font-bold">{t('continueWithGoogle')}</span>
    </div>
  );
};

export default function ContinueWithGoogle() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Only render the button that uses the hook if we have a Client ID.
  // This prevents the app from crashing if the provider is missing.
  if (!clientId) {
    return <DisabledGoogleButton />;
  }

  return <GoogleLoginButton />;
}