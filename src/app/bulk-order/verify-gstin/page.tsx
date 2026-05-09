"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle2, Building2, ShieldCheck, Loader2 } from "lucide-react";

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
    <div className="min-h-[calc(100vh-64px)] bg-white flex flex-col items-center justify-center p-4 md:p-8">

      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center text-[#D04636] mb-5">
            <ShieldCheck size={28} strokeWidth={1.5} />
          </div>
          <h1 className="font-heading text-3xl text-zinc-900 mb-2">Wholesale Verification</h1>
          <p className="text-zinc-500 text-sm max-w-sm mx-auto leading-relaxed">
            Verify your business GSTIN to unlock bulk pricing and exclusive wholesale formats.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-zinc-200 overflow-hidden">
          <div className="p-8">
            {!verifiedData ? (
              <form onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="gstin" className="block text-sm font-medium text-zinc-700">
                    Enter your GSTIN
                  </label>
                  <input
                    id="gstin"
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    placeholder="29ABCDE1234F1Z5"
                    className={`w-full uppercase rounded-xl border ${
                      gstin.length > 0 && !isValidFormat ? "border-red-400 focus:border-red-500 focus:ring-red-500" : "border-zinc-300 focus:border-[#D04636] focus:ring-[#D04636]"
                    } px-4 py-3.5 text-sm text-zinc-900 outline-none focus:ring-1 transition-all bg-zinc-50 focus:bg-white font-mono tracking-widest text-center`}
                    maxLength={15}
                    required
                  />
                  {gstin.length > 0 && !isValidFormat && (
                    <p className="text-xs text-red-500 mt-1.5 font-medium text-center">Please enter a valid 15-digit GSTIN.</p>
                  )}
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl text-center">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!isValidFormat || loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#D04636] px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#B83C2D] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {loading ? "Verifying..." : "Verify GSTIN"}
                </button>
              </form>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                
                {/* Success indicator */}
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-3">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="text-zinc-900 font-bold text-lg">GSTIN Verified</h3>
                  <p className="text-sm text-zinc-500 mt-1">We found your business details.</p>
                </div>

                {/* Company details card */}
                <div className="bg-zinc-50 rounded-xl p-5 border border-zinc-200 space-y-4">
                  <div>
                    <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider mb-1">Company Name</p>
                    <p className="font-semibold text-zinc-900 text-sm">{verifiedData.companyName}</p>
                  </div>
                  <div className="border-t border-zinc-200 pt-4">
                    <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider mb-1">Registered Address</p>
                    <p className="text-sm text-zinc-600 leading-relaxed">{verifiedData.companyAddress}</p>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl text-center">
                    {error}
                  </div>
                )}

                <div>
                  <p className="text-sm text-center text-zinc-500 mb-4">Is this your business?</p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setVerifiedData(null);
                        setGstin("");
                      }}
                      disabled={confirming}
                      className="flex-1 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors disabled:opacity-50"
                    >
                      No, retry
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirm}
                      disabled={confirming}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#D04636] px-4 py-3 text-sm font-semibold text-white hover:bg-[#B83C2D] transition-colors disabled:opacity-70 disabled:cursor-wait"
                    >
                      {confirming && <Loader2 size={16} className="animate-spin" />}
                      {confirming ? "Saving..." : "Yes, Confirm"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="px-8 pb-6 flex items-center justify-center gap-2 text-[11px] text-zinc-400">
            <ShieldCheck size={12} />
            <span>Verified securely via government portals</span>
          </div>
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
