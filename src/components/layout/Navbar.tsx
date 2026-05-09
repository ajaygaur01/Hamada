"use client";

import Link from "next/link";
import Image from "next/image";
import { UserCircle2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export default function Navbar() {
  const { user, openAuthModal, logout } = useAuth();

  return (
    <nav className="w-full sticky top-0 z-50 
                    bg-[#4E3D33]/95 backdrop-blur-md 
                    border-b border-[#3e3028]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 py-4">

          {/* Logo */}
          <div className="shrink-0">
            <Link
              href="/"
              aria-label="Kaori by Chiran home"
            >
              <Image
                src="/logo.avif"
                alt="Kaori by Chiran logo"
                width={112}
                height={32}
                className="h-8 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { href: "/products", label: "Products" },
              { href: "/how-it-works", label: "How It Works" },
              { href: "/about", label: "About" },
              { href: "/wholesale", label: "Wholesale" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#E7DDC1]/80 
                           hover:text-white transition-colors 
                           tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-5">
            {user ? (
              <>
                {/* Verified badge */}
                {user.gstin_verified && (
                  <div className="flex items-center gap-1.5 
                                  bg-[#E7DDC1]/10 border border-[#E7DDC1]/20
                                  px-2.5 py-1 rounded-full">
                    <ShieldCheck size={11} className="text-[#E7DDC1]" />
                    <span className="text-[10px] font-bold tracking-wider 
                                     uppercase text-[#E7DDC1]">
                      Verified
                    </span>
                  </div>
                )}

                {/* User greeting */}
                <span className="text-sm font-medium text-[#E7DDC1]/80">
                  Hi, {user.username ?? "User"}
                </span>

                {/* Account link */}
                <Link
                  href="/account"
                  className="inline-flex items-center gap-1.5 
                             text-sm font-medium text-[#E7DDC1] 
                             hover:text-white transition-colors"
                >
                  <UserCircle2 size={16} />
                  Account
                </Link>

                {/* Logout */}
                <button
                  type="button"
                  onClick={() => void logout()}
                  className="text-sm font-medium text-[#E7DDC1]/60 
                             hover:text-white transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Login */}
                <button
                  type="button"
                  onClick={() => openAuthModal("login")}
                  className="text-sm font-medium text-[#E7DDC1]/80 
                             hover:text-white transition-colors"
                >
                  Login
                </button>
              </>
            )}


          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center gap-3">

            <button className="text-[#E7DDC1] hover:text-white 
                               focus:outline-none transition-colors">
              <svg className="h-5 w-5" fill="none" 
                   viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" 
                      strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}