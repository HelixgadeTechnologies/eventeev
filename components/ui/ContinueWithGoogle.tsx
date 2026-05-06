"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";

export default function ContinueWithGoogle() {
  const { googleLogin } = useAuth();
  const router = useRouter();

  const handleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      try {
        const { error } = await googleLogin(credentialResponse.credential);
        if (error) {
          toast.error(error || "Google login failed");
        } else {
          toast.success("Login successful!");
          router.push("/events");
        }
      } catch (err) {
        console.error("Google Login Error:", err);
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleError = () => {
    console.error("Google Login Failed");
    toast.error("Google Sign-In failed. Please try again.");
  };

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        theme="outline"
        shape="pill"
        width="100%"
        size="large"
      />
    </div>
  );
}