import Image from "next/image";
import OrganizationRegistrationForm from "@/components/display/auth/OrgDetailsComponent";


export const metadata = {
    title: 'Eventeev | Register your organization - Elevate Your Event Experience',
    description: 'Register your organization to start using Eventeev for your events.',
}

export default function OrganizationRegistration() {
  return (
    <section className="flex md:flex-col lg:flex-row items-center justify-center w-screen h-screen gap-10 overflow-hidden">
      <div className="w-2/4 h-full hidden md:flex items-center justify-center relative">
        <Image
          src="/org-deets.svg"
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
          width={150}
          height={100}
          className="absolute top-10 left-5 md:left-10"
        />
      </div>
      <div className="w-full md:w-2/4 h-full flex items-center justify-center">
        <OrganizationRegistrationForm/>
      </div>
    </section>
  );
}
