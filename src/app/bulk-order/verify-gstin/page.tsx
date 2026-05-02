"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

// Regex for 15-digit GSTIN
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

function VerifyGstinInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/products";

  const [gstin, setGstin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verifiedData, setVerifiedData] = useState<{
    companyName: string;
    companyAddress: string;
  } | null>(null);
  const [confirming, setConfirming] = useState(false);

  const isValidFormat = GSTIN_REGEX.test(gstin);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidFormat) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/gstin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", gstin }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to verify GSTIN");
        return;
      }

      setVerifiedData({
        companyName: data.companyName,
        companyAddress: data.companyAddress,
      });
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!verifiedData) return;

    setConfirming(true);
    setError("");

    try {
      const res = await fetch("/api/gstin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "confirm",
          gstin,
          companyName: verifiedData.companyName,
          companyAddress: verifiedData.companyAddress,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save verification.");
        setConfirming(false);
        return;
      }

      // Redirect back to where the user came from (e.g. checkout page)
      router.push(returnTo);
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setConfirming(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-zinc-900 p-6 text-center">
          <h1 className="text-2xl font-bold text-white tracking-tight">GST Verification</h1>
          <p className="text-zinc-400 text-sm mt-2">Required for wholesale access</p>
        </div>

        <div className="p-8">
          {!verifiedData ? (
            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label htmlFor="gstin" className="block text-sm font-medium text-zinc-700 mb-1">
                  Enter 15-digit GSTIN
                </label>
                <input
                  id="gstin"
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  placeholder="e.g. 22AAAAA0000A1Z5"
                  className={`w-full uppercase rounded-lg border ${
                    gstin.length > 0 && !isValidFormat ? "border-red-500" : "border-zinc-300"
                  } px-4 py-3 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 transition-shadow`}
                  maxLength={15}
                  required
                />
                {gstin.length > 0 && !isValidFormat && (
                  <p className="text-xs text-red-500 mt-2">Invalid GSTIN format.</p>
                )}
              </div>

              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

              <button
                type="submit"
                disabled={!isValidFormat || loading}
                className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400 disabled:opacity-70"
              >
                {loading ? "Verifying..." : "Verify GSTIN"}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium text-sm flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  GSTIN Verified Successfully
                </p>
                <div className="space-y-1 text-sm text-zinc-700">
                  <p><strong>Company:</strong> {verifiedData.companyName}</p>
                  <p><strong>Address:</strong> {verifiedData.companyAddress}</p>
                </div>
              </div>

              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

              <div className="pt-4 border-t border-zinc-100">
                <p className="text-sm text-center text-zinc-600 mb-4">Is this your business?</p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setVerifiedData(null);
                      setGstin("");
                    }}
                    disabled={confirming}
                    className="flex-1 rounded-lg border border-zinc-300 px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition disabled:opacity-50"
                  >
                    No, try again
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={confirming}
                    className="flex-1 rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-800 transition disabled:opacity-70 disabled:cursor-wait"
                  >
                    {confirming ? "Saving..." : "Yes, Confirm"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyGstinPage() {
  return (
    <Suspense>
      <VerifyGstinInner />
    </Suspense>
  );
}
