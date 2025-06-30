import Image from "next/image";
import SignUp from "@/ui/auth/SignUpComponent";

export const metadata = {
  title: "Sign up | Eventeev",
  description: "Create an account to start using Eventeev",
};

export default function SignUpPage() {
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
          alt="Eventeev 2024"
          width={200}
          height={100}
          className="absolute top-5 left-5 md:left-10"
        />
        <div className="flex flex-col gap-5 justify-center items-start absolute top-[40%] text-white">
          <h1 className="text-6xl">
            Elevate your Event <br /> workflow with <br /> Eventeev
          </h1>
          <p className="w-[420px]">
            Our comprehensive Event platform offers you an unparalleled range of
            event component, sparking creativity and boosting efficiency.
          </p>
        </div>
      </div>
      <div className="w-full md:w-2/4 h-full flex items-center justify-center">
        <SignUp />
      </div>
    </section>
  );
}
