import LoginComponent from "@/components/auth/LoginComponent";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

export const metadata = {
  title: "Login - Eventeev",
  description: "Login to your Eventeev account",
};

export default function Home() {
  return (
    <section className="h-full w-full flex items-center justify-center bg-login relative">
      <div className="absolute top-6 right-6 z-20">
        <LanguageSwitcher />
      </div>
      <LoginComponent />
    </section>
  );
}
