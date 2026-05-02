"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ServerAuthUser } from "@/lib/auth/server-session";

type AuthUser = ServerAuthUser;

type AuthMode = "login" | "signup";

type AuthContextValue = {
  user: AuthUser | null;
  openAuthModal: (mode: AuthMode) => void;
  logout: () => Promise<void>;
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
  const [submitting, setSubmitting] = useState(false);

  const redirectPath = searchParams.get("redirect") ?? undefined;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
    const payload =
      mode === "signup"
        ? {
            username,
            email,
            phone,
            password,
          }
        : {
            identifier,
            password,
          };

    try {
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
    } catch {
      setError("Could not complete request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/45 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">
              {mode === "login" ? "Login to your account" : "Create your account"}
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              {mode === "login"
                ? "Use your email or phone number and password."
                : "Sign up with username, Gmail, phone number, and password."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800"
            aria-label="Close auth modal"
          >
            X
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === "signup" ? (
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
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500"
                required
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm password"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500"
                required
              />
            </>
          ) : (
            <>
              <input
                type="text"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder="Gmail or phone number"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500"
                required
              />
            </>
          )}

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-500"
          >
            {submitting
              ? mode === "login"
                ? "Logging in..."
                : "Creating account..."
              : mode === "login"
                ? "Login"
                : "Signup"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-zinc-600">
          {mode === "login" ? "No account yet?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => onModeChange(mode === "login" ? "signup" : "login")}
            className="font-medium text-zinc-900 underline-offset-2 hover:underline"
          >
            {mode === "login" ? "Signup" : "Login"}
          </button>
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
  const queryMode = authQuery === "login" || authQuery === "signup" ? authQuery : null;
  const visibleMode = queryMode ?? authMode;
  const modalVisible = isModalOpen || Boolean(queryMode);

  const openAuthModal = useCallback((mode: AuthMode) => {
    setAuthMode(mode);
    setIsModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsModalOpen(false);

    if (searchParams.get("auth")) {
      const next = new URLSearchParams(searchParams.toString());
      next.delete("auth");
      if (!next.get("redirect")) {
        router.replace(next.size ? `${pathname}?${next.toString()}` : pathname);
      }
    }
  }, [pathname, router, searchParams]);

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
    }),
    [logout, openAuthModal, user],
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
