import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { SidebarProvider } from "@/context/SidebarContext";
import { AuthProvider } from "@/context/AuthContext";
import ReduxProvider from "@/store/reduxProvider";
import GoogleAuthProvider from "@/components/providers/GoogleAuthProvider";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import { Toaster } from 'sonner';

const featherFont = localFont({
  src: "../../public/fonts/feather.ttf",
  variable: "--font-feather",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eventeev - Elevate Your Event Experience",
  description: "Eventeev is the premier platform for creating, managing, and discovering events. Join us to find tickets to your next favorite event or manage your own.",
  keywords: ["events", "ticketing", "event management", "event platform", "buy tickets"],
  authors: [{ name: "Eventeev" }],
  openGraph: {
    title: "Eventeev - Elevate Your Event Experience",
    description: "Eventeev is the premier platform for creating, managing, and discovering events.",
    url: "https://eventeev.com",
    siteName: "Eventeev",
    images: [
      {
        url: "/favicon.png",
        width: 800,
        height: 600,
        alt: "Eventeev Platform",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eventeev - Elevate Your Event Experience",
    description: "Eventeev is the premier platform for creating, managing, and discovering events.",
    images: ["/favicon.png"],
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
};

import { GoogleAnalytics } from '@next/third-parties/google';

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  const direction = locale === 'ar' ? 'rtl' : 'ltr';
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.className} ${featherFont.variable} antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ReduxProvider>
            <AuthProvider>
              <GoogleAuthProvider>
                <SidebarProvider>{children}</SidebarProvider>
                <Toaster position="top-center" richColors />
              </GoogleAuthProvider>
            </AuthProvider>
          </ReduxProvider>
        </NextIntlClientProvider>
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
