"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Image from "next/image";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function ResetPassword() {
    const t = useTranslations('Auth');
    const params = useParams();
    const router = useRouter();
    const { updatePassword, user, loading: authLoading } = useAuth();
    const token = params.token as string;

    useEffect(() => {
        if (!authLoading && user) {
            router.push("/events");
        }
    }, [user, authLoading, router]);

    const [userData, setUserData] = useState({
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

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

        if (!userData.password || !userData.confirmPassword) {
            setError("Please fill in all fields");
            return;
        }

        if (userData.password !== userData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(userData.password)) {
            setError("Password must be at least 8 characters and include uppercase, lowercase, and numbers");
            return;
        }

        setLoading(true);

        try {
            const { error: resetError } = await updatePassword(token, userData.password);
            if (resetError) {
                setError(resetError.message || "Failed to reset password. The link may be expired.");
            } else {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/");
                }, 3000);
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center w-screen h-screen gap-6 p-5">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center max-w-[400px]">
                    <div className="flex justify-center mb-4 text-green-500">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-green-900 mb-2">{t('passwordUpdated')}</h2>
                    <p className="text-green-700">
                        {t('redirectingToLogin')}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <section>
            <div className="flex flex-col items-center justify-center w-screen h-screen gap-10 overflow-hidden p-5">
                <Image
                    src="/logo-black.svg"
                    alt="Eventeev"
                    width={120}
                    height={50}
                    priority={true}
                />
                <div className="space-y-4 w-full md:w-[400px]">
                    <h2 className="text-2xl md:text-3xl text-center font-bold text-[#1B1818]">{t('createNewPassword')}</h2>
                    <p className="text-[#667185] text-sm text-center">
                        {t('oneStepAway')}
                    </p>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl text-sm font-medium text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <PasswordInput
                            name="password"
                            value={userData.password}
                            onChange={handleInputChange}
                            label={t('newPassword')}
                        />
                        <PasswordInput
                            name="confirmPassword"
                            value={userData.confirmPassword}
                            onChange={handleInputChange}
                            label={t('confirmPassword')}
                        />
                        <div className="mt-6">
                            <Button 
                                content={loading ? t('resetting') : t('resetPassword')} 
                                type="submit" 
                                disabled={loading}
                            />
                        </div>
                    </form>
                    <p className="text-start text-sm text-[#667185] leading-6 space-x-2 pt-4 font-medium">
                        <span>{t('rememberMe')}</span>
                        <Link href="/" className="text-[#eb5017] font-bold hover:underline">
                            {t('login')}
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
}
