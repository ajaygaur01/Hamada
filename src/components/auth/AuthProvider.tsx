"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ServerAuthUser } from "@/lib/auth/server-session";
import { X, Eye, EyeOff } from "lucide-react";


type AuthUser = ServerAuthUser;

type AuthMode = "login" | "signup" | "forgot-password";

type AuthContextValue = {
  user: AuthUser | null;
  openAuthModal: (mode: AuthMode) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<AuthUser | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function AuthModal({
  mode,
  onModeChange,
  onClose,
  onAuthSuccess,
}: {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
  onAuthSuccess: (user: AuthUser, redirectPath?: string) => void;
}) {
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError("");
    setSuccessMessage("");
  }, [mode]);

  const redirectPath = searchParams.get("redirect") ?? undefined;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PHONE_REGEX = /^[6-9]\d{9}$/;

    if (mode === "signup") {
      if (username.trim().length < 2 || username.trim().length > 80) {
        setError("Username must be between 2 and 80 characters.");
        return;
      }
      if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
        setError("Please enter a valid email address.");
        return;
      }
      const cleanPhone = phone.replace(/\D/g, "");
      if (!PHONE_REGEX.test(cleanPhone)) {
        setError("Please enter a valid 10-digit Indian phone number.");
        return;
      }
      if (password.length < 8 || password.length > 128) {
        setError("Password must be between 8 and 128 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    } else if (mode === "login") {
      const cleanIdentifier = identifier.trim().toLowerCase();
      if (!cleanIdentifier) {
        setError("Email or phone number is required.");
        return;
      }
      if (!password) {
        setError("Password is required.");
        return;
      }
      const isEmail = EMAIL_REGEX.test(cleanIdentifier);
      const cleanPhone = cleanIdentifier.replace(/\D/g, "");
      const isPhone = PHONE_REGEX.test(cleanPhone);
      if (!isEmail && !isPhone) {
        setError("Please enter a valid email address or 10-digit phone number.");
        return;
      }
      if (password.length < 8 || password.length > 128) {
        setError("Password must be between 8 and 128 characters.");
        return;
      }
    } else if (mode === "forgot-password") {
      if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
        setError("Please enter a valid email address.");
        return;
      }
    }

    setSubmitting(true);

    try {
      if (mode === "forgot-password") {
        const response = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim().toLowerCase() }),
        });
        const data = (await response.json()) as { error?: string; message?: string };
        if (!response.ok) {
          setError(data.error ?? "Could not send password reset email.");
          return;
        }
        setSuccessMessage(data.message ?? "Password reset link sent successfully.");
        setEmail("");
      } else {
        const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
        const payload =
          mode === "signup"
            ? {
                username,
                email: email.trim().toLowerCase(),
                phone: phone.replace(/\D/g, ""),
                password,
              }
            : {
                identifier: identifier.trim().toLowerCase(),
                password,
              };

        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await response.json()) as { error?: string; user?: AuthUser };

        if (!response.ok) {
          setError(data.error ?? "Authentication failed.");
          return;
        }

        if (!data.user) {
          setError("Authentication failed.");
          return;
        }

        onAuthSuccess(data.user, redirectPath);
      }
    } catch {
      setError("Could not complete request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold text-zinc-900">
              {mode === "login"
                ? "Login to your account"
                : mode === "signup"
                  ? "Create your account"
                  : "Reset your password"}
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              {mode === "login"
                ? "Use your email or phone number and password."
                : mode === "signup"
                  ? "Sign up with username, Gmail, phone number, and password."
                  : "Enter your email address and we will send you a reset link."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-[#D04636] hover:bg-[#D04636]/10 border border-[#D04636] hover:text-[#B83C2D] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D04636] flex items-center justify-center"
            aria-label="Close auth modal"
          >
            <X size={18} />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <>
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Username"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500"
                required
              />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Gmail address"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500"
                required
              />
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Phone number"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500"
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  className="w-full rounded-lg border border-zinc-300 pl-3 pr-10 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none flex items-center justify-center"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm password"
                  className="w-full rounded-lg border border-zinc-300 pl-3 pr-10 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none flex items-center justify-center"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </>
          )}

          {mode === "login" && (
            <>
              <input
                type="text"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder="Gmail or phone number"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500"
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  className="w-full rounded-lg border border-zinc-300 pl-3 pr-10 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none flex items-center justify-center"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setSuccessMessage("");
                    onModeChange("forgot-password");
                  }}
                  className="text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            </>
          )}

          {mode === "forgot-password" && (
            <>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500"
                required
              />
            </>
          )}

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {successMessage ? <p className="text-sm text-emerald-600">{successMessage}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-[#D04636] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#B83C2D] disabled:cursor-not-allowed disabled:bg-zinc-500"
          >
            {submitting
              ? mode === "login"
                ? "Logging in..."
                : mode === "signup"
                  ? "Creating account..."
                  : "Sending link..."
              : mode === "login"
                ? "Login"
                : mode === "signup"
                  ? "Signup"
                  : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-zinc-600">
          {mode === "forgot-password" ? (
            <button
              type="button"
              onClick={() => {
                setError("");
                setSuccessMessage("");
                onModeChange("login");
              }}
              className="font-medium text-zinc-900 underline-offset-2 hover:underline"
            >
              Back to login
            </button>
          ) : (
            <>
              {mode === "login" ? "No account yet?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setSuccessMessage("");
                  onModeChange(mode === "login" ? "signup" : "login");
                }}
                className="font-medium text-zinc-900 underline-offset-2 hover:underline"
              >
                {mode === "login" ? "Signup" : "Login"}
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: AuthUser | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const authQuery = searchParams.get("auth");
  const queryMode =
    authQuery === "login" || authQuery === "signup" || authQuery === "forgot-password"
      ? authQuery
      : null;
  const visibleMode = queryMode ?? authMode;
  const modalVisible = isModalOpen;

  // Sync URL query mode changes to local state to trigger opening the modal
  useEffect(() => {
    if (queryMode) {
      setIsModalOpen(true);
    }
  }, [queryMode]);

  const openAuthModal = useCallback((mode: AuthMode) => {
    setAuthMode(mode);
    setIsModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsModalOpen(false);

    if (searchParams.get("auth")) {
      const next = new URLSearchParams(searchParams.toString());
      next.delete("auth");
      next.delete("redirect");
      router.replace(next.size ? `${pathname}?${next.toString()}` : pathname);
    }
  }, [pathname, router, searchParams]);

  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return data.user;
      } else {
        setUser(null);
        return null;
      }
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.refresh();
  }, [router]);

  const handleAuthSuccess = useCallback(
    async (nextUser: AuthUser, redirectPath?: string) => {
      setUser(nextUser);
      setIsModalOpen(false);

      if (redirectPath) {
        router.replace(redirectPath);
      } else {
        router.refresh();
      }
    },
    [router],
  );

  const value = useMemo(
    () => ({
      user,
      openAuthModal,
      logout,
      refreshUser,
    }),
    [logout, openAuthModal, user, refreshUser],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      {modalVisible ? (
        <AuthModal
          mode={visibleMode}
          onModeChange={setAuthMode}
          onClose={closeAuthModal}
          onAuthSuccess={handleAuthSuccess}
        />
      ) : null}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
