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
    <div className="min-h-[calc(100vh-64px)] bg-brand-cream flex flex-col items-center justify-center p-4 md:p-8 relative">
      
      {/* Decorative subtle element */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-brand-sage/10 to-transparent pointer-events-none" />

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-[#d2e0c2] overflow-hidden relative z-10">
        
        {/* Header Section */}
        <div className="px-8 pt-10 pb-6 text-center border-b border-zinc-100">
          <div className="mx-auto w-12 h-12 bg-brand-cream rounded-full flex items-center justify-center text-brand-green mb-4">
            <ShieldCheck size={24} strokeWidth={1.5} />
          </div>
          <h1 className="font-heading text-3xl text-[#3E4F25] mb-2">Wholesale Verification</h1>
          <p className="font-sans text-zinc-500 text-sm max-w-sm mx-auto leading-relaxed">
            Please verify your business GSTIN to access bulk pricing and exclusive wholesale formats.
          </p>
        </div>

        <div className="p-8">
          {!verifiedData ? (
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="gstin" className="block text-sm font-medium text-[#3E4F25]">
                  Business GSTIN
                </label>
                <div className="relative">
                  <input
                    id="gstin"
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    placeholder="e.g. 29ABCDE1234F1Z5"
                    className={`w-full uppercase rounded-lg border ${
                      gstin.length > 0 && !isValidFormat ? "border-red-400 focus:border-red-500 focus:ring-red-500" : "border-zinc-300 focus:border-brand-green focus:ring-brand-green"
                    } px-4 py-3.5 text-sm text-[#3E4F25] outline-none focus:ring-1 transition-all bg-zinc-50/50`}
                    maxLength={15}
                    required
                  />
                  {gstin.length > 0 && !isValidFormat && (
                    <p className="text-xs text-red-500 mt-2 font-medium">Please enter a valid 15-digit GSTIN.</p>
                  )}
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg flex items-start gap-2">
                  <div className="mt-0.5"><ShieldCheck size={16} /></div>
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={!isValidFormat || loading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#D04636] px-4 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#B83C2D] disabled:cursor-not-allowed disabled:bg-brand-sage disabled:opacity-60"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "Verifying with GST Portal..." : "Verify GSTIN"}
              </button>
            </form>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="p-6 bg-[#f0f4ea] border border-[#d2e0c2] rounded-xl text-center relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-brand-green/10">
                  <Building2 size={100} />
                </div>
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-green shadow-sm mb-3">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="text-[#3E4F25] font-bold text-lg mb-1">GSTIN Verified</h3>
                  <p className="text-sm text-brand-sage mb-6">Business details fetched successfully.</p>
                  
                  <div className="w-full bg-white/60 backdrop-blur-sm rounded-lg p-4 text-left border border-[#d2e0c2] space-y-3">
                    <div>
                      <p className="text-[11px] text-[#3E4F25]/60 uppercase font-bold tracking-wider mb-0.5">Registered Company Name</p>
                      <p className="font-medium text-[#3E4F25] text-sm leading-tight">{verifiedData.companyName}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-[#3E4F25]/60 uppercase font-bold tracking-wider mb-0.5">Registered Address</p>
                      <p className="text-sm text-[#3E4F25]/80 leading-relaxed">{verifiedData.companyAddress}</p>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg">
                  <p>{error}</p>
                </div>
              )}

              <div className="pt-4">
                <p className="text-sm text-center text-[#3E4F25]/70 mb-4 font-medium">Please confirm this is your business.</p>
                <div className="flex flex-col-reverse sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setVerifiedData(null);
                      setGstin("");
                    }}
                    disabled={confirming}
                    className="flex-1 rounded-lg border border-zinc-200 px-4 py-3.5 text-sm font-medium text-[#3E4F25] hover:bg-zinc-50 transition-colors disabled:opacity-50"
                  >
                    No, try another
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={confirming}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#D04636] px-4 py-3.5 text-sm font-medium text-white hover:bg-[#B83C2D] transition-colors disabled:opacity-70 disabled:cursor-wait"
                  >
                    {confirming && <Loader2 size={16} className="animate-spin" />}
                    {confirming ? "Confirming..." : "Yes, Confirm"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer text */}
        <div className="px-8 pb-8 text-center">
          <p className="text-xs text-zinc-400 font-sans">
            Your GST details are verified securely via government portals.
          </p>
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
