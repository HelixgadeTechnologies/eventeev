"use client";

import Image from "next/image";
import SignUpComponent from "@/components/auth/SignUpComponent";
import { useTranslations } from "next-intl";

export default function SignUpPage() {
  const t = useTranslations('Auth');
  
  return (
    <section className="flex md:flex-col lg:flex-row items-center justify-center w-screen h-screen gap-10 overflow-hidden">
      <div className="w-2/4 h-full hidden md:flex items-center justify-center relative">
        <Image
          src="/signup.svg"
          alt="Sign up background image"
          width={200}
          height={100}
          className="object-contain"
          style={{ height: "auto", width: "auto" }}
          priority
        />
        <Image
          src="/logo-white.svg"
          alt="Eventeev"
          width={150}
          height={100}
          className="absolute top-10 left-5 md:left-10"
        />
        <div className="flex flex-col gap-10 justify-center items-start absolute top-[40%] text-white/90">
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight max-w-[500px]">
            {t('elevateWorkflow')}
          </h1>
          <p className="w-[420px] font-extralight text-white/80 text-[15px] leading-relaxed">
            {t('platformDescription')}
          </p>
        </div>
      </div>
      <div className="w-full md:w-2/4 h-full flex items-center justify-center">
        <SignUpComponent />
      </div>
    </section>
  );
}
