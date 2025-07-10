import LoginComponent from "@/components/auth/LoginComponent";

export const metadata = {
  title: "Eventeev | Log in - Elevate Your Event Experience",
  description: "Login to your Eventeev account",
};

export default function Home() {
  return (
    <section className="h-full w-full flex items-center justify-center bg-login">
      <LoginComponent />
    </section>
  );
}
