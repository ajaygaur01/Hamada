"use client";

import Link from "next/link";
import { UserCircle2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export default function Navbar() {
  const { user, openAuthModal, logout } = useAuth();

  return (
    <nav className="w-full border-b border-zinc-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Placeholder */}
          <div className="shrink-0 flex items-center">
            <Link href="/" className="bg-zinc-100 text-zinc-800 px-4 py-2 text-xs font-bold tracking-widest uppercase rounded">
              Logo Placeholder
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">Products</Link>
            <Link href="/how-it-works" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">How It Works</Link>
            <Link href="/about" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">About</Link>
            <Link href="/wholesale" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">Wholesale</Link>
            <Link href="/contact" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">Contact</Link>
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <span className="text-sm font-medium text-zinc-700">
                  Hi, {user.username ?? "User"}
                </span>
                <Link
                  href="/account"
                  className="inline-flex items-center gap-1 text-sm font-medium text-zinc-900 hover:text-zinc-600 transition-colors"
                >
                  <UserCircle2 className="h-4 w-4" />
                  Account
                </Link>
                <button
                  type="button"
                  onClick={() => void logout()}
                  className="text-sm font-medium text-zinc-900 hover:text-zinc-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => openAuthModal("login")}
                  className="text-sm font-medium text-zinc-900 hover:text-zinc-600 transition-colors"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal("signup")}
                  className="text-sm font-medium text-zinc-900 hover:text-zinc-600 transition-colors"
                >
                  Signup
                </button>
              </>
            )}
            <Link href="/sample-order" className="bg-zinc-900 text-white text-sm font-medium px-5 py-2.5 rounded hover:bg-zinc-800 transition-colors">
              Order a Sample
            </Link>
          </div>
          
          {/* Mobile menu button (placeholder for actual implementation) */}
          <div className="md:hidden flex items-center">
            <button className="text-zinc-500 hover:text-zinc-900 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
