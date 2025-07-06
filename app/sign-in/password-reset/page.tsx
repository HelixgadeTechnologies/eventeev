"use client";

import { useState, ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "@/components/ui/Button";

export default function ResetPassword() {
    const [userData, setUserData] = useState({
        password: "",
        confirmPassword: "",
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <section>
            <div className="flex flex-col items-center justify-center w-screen h-screen gap-10 overflow-hidden p-5">
                    <Image
                        src="/logo-black.svg"
                        alt="Eventeev 2024"
                        width={120}
                        height={50}
                        priority={true}
                      />
                    <div className="space-y-4 w-full md:w-[400px]">
                        <h2 className="text-2xl md:text-3xl text-center">Create New Password</h2>
                        <p className="text-black/80 text-sm text-center">
                            One more step to go and you are back into your account
                        </p>
                        <form action="">
                            <PasswordInput
                                name="password"
                                value={userData.password}
                                onChange={handleInputChange}
                                label="New Password"
                            />
                            <PasswordInput
                                name="confirmPassword"
                                value={userData.confirmPassword}
                                onChange={handleInputChange}
                                label="Confirm Password"
                            />
                            <div className="mt-4">
                                <Button content="Reset Password" href="/" />
                            </div>
                        </form>
                        <p className="text-start text-sm text-black/70 leading-6 space-x-2">
                            <span>Remember your password?</span>
                            <Link href="/" className="text-[#eb5017] custom-underline font-semibold">
                                Login
                            </Link>
                        </p>
                    </div>
            </div>
        </section>
    )
}