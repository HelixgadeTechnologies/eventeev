import Image from "next/image";
import OTPVerificationComponent from "@/components/auth/OTPVerificationComponent";
import { Suspense } from "react";

export const metadata = {
  title: "Eventeev | Verify your email - Elevate Your Event Experience",
  description: "Verify your email address to continue your registration with Eventeev",
};

export default function OTPPage() {
  return (
    <section className="flex md:flex-col lg:flex-row items-center justify-center w-screen h-screen gap-10 overflow-hidden bg-white">
      <div className="w-2/4 h-full hidden md:flex items-center justify-center relative bg-[#1B1818]">
        <Image
          src="/logo-white.svg"
          alt="Eventeev 2024"
          width={150}
          height={100}
          className="absolute top-10 left-5 md:left-10"
        />
        <div className="flex flex-col gap-10 justify-center items-start px-10 text-white/90">
          <h1 className="text-6xl font-bold">
            Almost there! <br /> Just one more <br /> step
          </h1>
          <p className="w-[420px] font-extralight text-white/80 text-lg leading-relaxed">
            Verify your email to unlock all features of Eventeev. 
            We're excited to have you on board!
          </p>
        </div>
      </div>
      <div className="w-full md:w-2/4 h-full flex items-center justify-center">
        <Suspense fallback={<div>Loading...</div>}>
          <OTPVerificationComponent />
        </Suspense>
      </div>
    </section>
  );
}
