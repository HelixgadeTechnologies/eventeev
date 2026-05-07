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
      {!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
        <div className="absolute top-0 left-0 w-full bg-red-600 text-white p-2 text-center text-xs font-bold z-50 animate-pulse">
          ⚠️ CONFIGURATION ERROR: NEXT_PUBLIC_GOOGLE_CLIENT_ID IS MISSING. RESTART SERVER AFTER FIXING .env.local
        </div>
      )}
      <LoginComponent />
      {/* Temporary Debug Info - Can be removed once resolved */}
      <div className="absolute bottom-2 left-2 text-[10px] text-gray-400 opacity-20 hover:opacity-100 transition-opacity">
        G-ID: {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? `Loaded (${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID.slice(0, 5)}...)` : 'Missing'}
      </div>
    </section>
  );
}
