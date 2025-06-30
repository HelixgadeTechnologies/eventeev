"use client";

import { useState, ChangeEvent } from "react";
import Link from "next/link";
import InputComponent from "@/components/forms/InputComponent";
import EmailInput from "@/components/forms/EmailInput";
import PasswordInput from "@/components/forms/PasswordInput";
import Button from "@/components/forms/Button";
import { FcGoogle } from "react-icons/fc";

export default function SignUp() {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

        const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setUserData((prev) => ({
                ...prev,
                [name]: value,
            }));
        };
    return (
        <div className="space-y-3 w-full md:w-fit m-4">
            <h2 className="text-4xl text-center md:text-start font-semibold text-[#1B1818] mb-10">Sign up!</h2>
            <form action="" className="space-y-5">
                <div className="flex gap-5 flex-col md:flex-row">
                    <InputComponent name="firstName" label="First Name" value={userData.firstName} onChange={handleInputChange} />
                    <InputComponent name="lastName" label="Last Name" value={userData.lastName} onChange={handleInputChange} />
                </div>
                <EmailInput name="email" value={userData.email} onChange={handleInputChange} label="Email Address" />
                <PasswordInput value={userData.password} onChange={handleInputChange} label="Password" name="password" />
                <div className="mt-5">
                    <Button content="Sign up" />
                </div>
            </form>
            <section className="space-y-5 my-3">
                <p className="text-center text-sm text-gray-500 leading-6 space-x-2">
                    <span>Already have an account?</span>
                    <Link href="/" className="text-[#eb5017] custom-underline">Login</Link>
                </p>
                <div className="flex items-center justify-center gap-2.5">
                    <span className="h-1 w-full border-t border-gray-300"></span>
                    <span className="text-center text-sm text-gray-500 leading-6 ">Or</span>
                    <span className="h-1 w-full border-t border-gray-300"></span>
                </div>
                <div className="rounded-[8px] h-10 md:h-12 w-full px-5 md:px-6 leading-6 hover:cursor-pointer border border-gray-400 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors duration-300">
                    <FcGoogle className="inline-block mr-2 text-2xl" />
                    <span className="text-sm font-semibold">Continue with Google</span>
                </div>
            </section>
        </div>
    )
}