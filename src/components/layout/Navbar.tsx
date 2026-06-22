"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserCircle2, ShieldCheck, Menu, X } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import ProductUtilityStrip from "@/components/layout/ProductUtilityStrip";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, openAuthModal, logout } = useAuth();
  const pathname = usePathname();
  const isProductPage = pathname === "/products" || pathname?.startsWith("/products/");

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);


  return (
    <>
      {isProductPage && <ProductUtilityStrip />}
      <nav className={`w-full sticky ${isProductPage ? "top-[36px] md:top-0" : "top-0"} z-50 
                      bg-white/95 backdrop-blur-md 
                      border-b border-zinc-200 shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">

          {/* Logo */}
          <div className="shrink-0">
            <Link
              href="/"
              aria-label="Kaori by Chiran home"
            >
              <Image
                src="/logo.avif"
                alt="Hamada logo"
                width={168}
                height={48}
                className="h-12 w-auto object-contain sm:h-14"
                priority
              />
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { href: "/products", label: "Products" },
              { href: "/about", label: "About" },
              { href: "/why-our-matcha", label: "Why Our Matcha" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#D04636] 
                           hover:text-[#B83C2D] transition-colors 
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
                                  bg-[#D04636]/10 border border-[#D04636]/20
                                  px-2.5 py-1 rounded-full">
                    <ShieldCheck size={11} className="text-[#D04636]" />
                    <span className="text-[10px] font-bold tracking-wider 
                                     uppercase text-[#D04636]">
                      Verified
                    </span>
                  </div>
                )}

                {/* User greeting */}
                <span className="text-sm font-medium text-[#4E3D33]">
                  Hi, {user.username ?? "User"}
                </span>

                {/* Account link */}
                <Link
                  href="/account"
                  className="inline-flex items-center gap-1.5 
                             text-sm font-medium text-[#D04636] 
                             hover:text-[#B83C2D] transition-colors"
                >
                  <UserCircle2 size={16} />
                  Account
                </Link>

                {/* Logout */}
                <button
                  type="button"
                  onClick={() => void logout()}
                  className="text-sm font-medium text-[#4E3D33]/60 
                             hover:text-[#D04636] transition-colors"
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
                  className="text-sm font-medium text-[#D04636] 
                             hover:text-[#B83C2D] transition-colors"
                >
                  Login
                </button>
              </>
            )}


          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#D04636] hover:text-[#B83C2D] focus:outline-none transition-colors p-1"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="md:hidden border-t border-zinc-200 py-4 space-y-4">
            <div className="flex flex-col gap-3">
              {[
                { href: "/products", label: "Products" },
                { href: "/about", label: "About" },
                { href: "/why-our-matcha", label: "Why Our Matcha" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium text-[#D04636] hover:text-[#B83C2D] transition-colors py-1.5"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-zinc-100 pt-4 flex flex-col gap-3">
              {user ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#4E3D33]">
                      Hi, {user.username ?? "User"}
                    </span>
                    {user.gstin_verified && (
                      <div className="flex items-center gap-1.5 bg-[#D04636]/10 border border-[#D04636]/20 px-2.5 py-1 rounded-full">
                        <ShieldCheck size={11} className="text-[#D04636]" />
                        <span className="text-[10px] font-bold tracking-wider uppercase text-[#D04636]">
                          Verified
                        </span>
                      </div>
                    )}
                  </div>
                  <Link
                    href="/account"
                    className="inline-flex items-center gap-2 text-base font-medium text-[#D04636] hover:text-[#B83C2D] transition-colors py-1"
                  >
                    <UserCircle2 size={18} />
                    Account
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      void logout();
                    }}
                    className="text-left text-base font-medium text-[#4E3D33]/60 hover:text-[#D04636] transition-colors py-1"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    openAuthModal("login");
                  }}
                  className="w-full text-center rounded-lg bg-[#D04636] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#B83C2D]"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
    </>
  );
}