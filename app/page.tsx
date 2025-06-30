import LoginComponent from "@/ui/auth/LoginComponent"

export const metadata = {
  title: 'Login | Eventeev',
  description: 'Login to your Eventeev account',
}

export default function Home() {
  return (
    <section className="h-screen w-full flex items-center justify-center bg-login">
      <LoginComponent />
    </section>
  )
}