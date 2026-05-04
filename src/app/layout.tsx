import type { Metadata } from "next";
import { Suspense } from "react";
import { Yeseva_One, Mulish } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { getServerAuthUser } from "@/lib/auth/server-session";
import "./globals.css";

const yesevaOne = Yeseva_One({
  weight: "400",
  variable: "--font-yeseva-one",
  subsets: ["latin"],
});

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kaori by Chiran | Premium Japanese Tea",
  description: "B2B wholesale Japanese tea, directly sourced from Kagoshima, Japan.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authUser = await getServerAuthUser();

  return (
    <html
      lang="en"
      className={`${yesevaOne.variable} ${mulish.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-cream font-sans">
        <Suspense fallback={null}>
          <AuthProvider initialUser={authUser}>
            <Navbar />
            <main className="flex-grow flex flex-col">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
