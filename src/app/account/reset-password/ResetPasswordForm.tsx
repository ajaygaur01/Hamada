"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Reset token is missing. Please check your email link or request a new password reset.");
    }
  }, [token]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;

    setError("");
    setSuccess(false);

    if (password.length < 8 || password.length > 128) {
      setError("Password must be between 8 and 128 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        setError(data.error ?? "Could not reset password. The link might be invalid or expired.");
        return;
      }

      setSuccess(true);
      setPassword("");
      setConfirmPassword("");

      // Redirect to home page with login modal open after 2 seconds
      setTimeout(() => {
        router.push("/?auth=login");
      }, 2500);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex-grow flex items-center justify-center min-h-[60vh] bg-brand-cream px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-md border border-zinc-100">
        {success ? (
          <div className="text-center py-6">
            <div className="flex justify-center mb-4">
              <CheckCircle2 size={48} className="text-emerald-600 animate-bounce" />
            </div>
            <h2 className="text-2xl font-semibold text-zinc-900 mb-2">Password Reset Successful</h2>
            <p className="text-zinc-600 text-sm">
              Your password has been successfully updated. Redirecting you to the login screen...
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#D04636]/10 text-[#D04636] mb-4">
                <KeyRound size={24} />
              </div>
              <h2 className="text-2xl font-semibold text-zinc-900 font-serif">Set New Password</h2>
              <p className="text-zinc-600 text-sm mt-1">
                Please enter a secure password of at least 8 characters.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password"
                  className="w-full rounded-lg border border-zinc-300 pl-3 pr-10 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500"
                  disabled={!token || submitting}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none flex items-center justify-center"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={!token || submitting}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full rounded-lg border border-zinc-300 pl-3 pr-10 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500"
                  disabled={!token || submitting}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none flex items-center justify-center"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  disabled={!token || submitting}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {error && <p className="text-sm text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">{error}</p>}

              <button
                type="submit"
                disabled={!token || submitting}
                className="w-full rounded-lg bg-[#D04636] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#B83C2D] disabled:cursor-not-allowed disabled:bg-zinc-400"
              >
                {submitting ? "Resetting password..." : "Reset Password"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="text-zinc-600 hover:text-zinc-950 underline underline-offset-2"
              >
                Back to Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
