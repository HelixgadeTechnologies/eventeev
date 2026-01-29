import Image from "next/image";
import SignInComponent from "@/components/auth/SignInComponent";

export const metadata = {
  title: "Eventeev | Sign in - Elevate Your Event Experience",
  description: "Sign in to your Eventeev account",
};

export default function SignInPage() {
  return (
    <section className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/login-bg.png"
          alt="Conference hall background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-[480px] px-4">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/logo-white.svg"
            alt="Eventeev"
            width={180}
            height={60}
            className="h-auto"
          />
        </div>

        {/* Sign In Card */}
        <SignInComponent />
      </div>
    </section>
  );
}
