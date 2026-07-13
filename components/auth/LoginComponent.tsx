"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Image from "next/image";
import { useRouter, Link } from "@/i18n/routing";
import { useTranslations } from 'next-intl';
import EmailInput from "@/components/ui/EmailInput";
import PasswordInput from "@/components/ui/PasswordInput";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import ContinueWithGoogle from "@/components/ui/ContinueWithGoogle";
import Divider from "@/components/ui/Divider";
import { useAuth } from "@/context/AuthContext";
import Modal from "@/components/ui/Modal";
import { AlertCircle } from "lucide-react";


export default function LoginComponent() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const { signIn } = useAuth();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    checkbox: false, // Default to checked
  });
  const [error, setError] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const { error: signInError } = await signIn(userData.email, userData.password);

      if (signInError) {
        setError(signInError.message || "Invalid email or password");
        setShowErrorModal(true);
        setLoading(false);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("An unexpected error occurred. Please try again.");
      setShowErrorModal(true);
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
          <h1 className="text-xl md:text-2xl">{t('login')}</h1>
          <p className="text-gray-500 text-xs md:text-sm">
            {t('welcomeBack')}
          </p>
        </div>
        <ContinueWithGoogle />
        <Divider text="OR" />
        
        {/* Error Modal */}
        <Modal 
          isOpen={showErrorModal} 
          onClose={() => setShowErrorModal(false)}
          className="p-0 overflow-hidden max-w-sm"
        >
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-black text-[#1B1818] uppercase tracking-tight">Login Failed</h3>
              <p className="text-sm text-gray-500 font-medium">
                {error}
              </p>
            </div>

            <button 
              onClick={() => setShowErrorModal(false)}
              className="w-full px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white bg-[#1B1818] hover:bg-gray-900 transition-all shadow-lg active:scale-95"
            >
              Try Again
            </button>
          </div>
        </Modal>

        <form onSubmit={handleSubmit} className="space-y-5">
          <EmailInput
            name="email"
            label={t('email')}
            value={userData.email}
            onChange={handleInputChange}
          />
          <PasswordInput
            name="password"
            label={t('password')}
            value={userData.password}
            onChange={handleInputChange}
          />
          <div className="flex items-center justify-between text-sm">
            <Checkbox
              label={t('rememberMe')}
              name="checkbox"
              onChange={handleInputChange}
              checked={userData.checkbox}
            />
            <Link
              href="/forgot-password"
              className="text-[#eb5017] custom-underline text-xs whitespace-nowrap"
            >
              {t('forgotPassword')}
            </Link>
          </div>
          <div className="mt-5">
            <Button 
              content={t('login')} 
              isLoading={loading}
              type="submit"
            />
          </div>
        </form>
      </div>
      <div className="text-center text-xs text-black leading-6 space-x-1 h-[52px] px-4 py-2 rounded-[30px] bg-white flex justify-center items-center">
        <span>{t('dontHaveAccount')}</span>
        <Link
          href="/sign-up"
          className="text-[#eb5017] custom-underline font-semibold"
        >
          {t('signup')}
        </Link>
      </div>

    </section>
  );
}
