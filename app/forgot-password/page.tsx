"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import EmailInput from "@/components/ui/EmailInput";
import { MdMail } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";

export default function ForgotPassword() {
    const { resetPassword, user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (!authLoading && user) {
            router.push("/events");
        }
    }, [user, authLoading, router]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setEmail(value);
        if (message) setMessage(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (!email) {
            setMessage({ type: 'error', text: "Please enter your email address." });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage({ type: 'error', text: "Please enter a valid email address." });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            await resetPassword(email);
            // Always show success to prevent email enumeration (information leakage)
            setMessage({ type: 'success', text: "If an account with that email exists, a reset link has been sent." });
        } catch (err) {
            setMessage({ type: 'error', text: "An unexpected error occurred." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex flex-col md:flex-row items-center justify-center w-screen h-screen overflow-hidden">
            {/* ... existing panels ... */}
            <div className="hidden md:flex w-1/2 h-full relative">
                <Image
                    src="/password-reset-bg.png"
                    alt="Cinema seats background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute top-10 left-10">
                    <Image
                        src="/logo-white.svg"
                        alt="Eventeev"
                        width={150}
                        height={50}
                        className="h-auto"
                    />
                </div>
            </div>

            <div className="w-full md:w-1/2 h-full flex flex-col items-center justify-center px-6 md:px-0">
                <div className="w-full max-w-[440px] space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-[32px] md:text-[40px] font-bold text-[#1B1818] leading-tight mb-2">Password Reset</h2>
                        <p className="text-[#667185] text-sm">
                            Don’t worry it happens to the best of us 🔐
                        </p>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-xl text-sm font-medium border ${
                            message.type === 'success' 
                                ? 'bg-green-50 border-green-100 text-green-700' 
                                : 'bg-red-50 border-red-100 text-red-700'
                        }`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <EmailInput
                            name="email"
                            value={email}
                            onChange={handleInputChange}
                            Icon={MdMail}
                            placeholder="godfrey@gmail.com"
                        />
                        <div className="mt-8">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-[#eb5017] text-white py-4 rounded-xl font-bold hover:bg-[#d64815] transition-all transform active:scale-[0.98] shadow-lg shadow-[#eb5017]/20 ${
                                    loading ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                            >
                                {loading ? "Sending..." : "Send Link"}
                            </button>
                        </div>
                    </form>

            <p className="text-center md:text-start text-sm text-[#667185] font-medium pt-4">
                <span>Remember your password?</span>
                <Link href="/" className="text-[#eb5017] font-bold hover:underline ml-2">
                    Log in
                </Link>
            </p>
        </div>
      </div>
    </section>
  );
}
