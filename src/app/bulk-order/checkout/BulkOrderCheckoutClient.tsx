"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface BulkOrderCheckoutClientProps {
  variantId: string;
  quantity: number;
  productName: string;
  variantSize: string;
  bulkPrice: number;
  companyName: string;
  companyAddress: string;
  gstin: string;
  razorpayKeyId: string;
}

export default function BulkOrderCheckoutClient({
  variantId,
  quantity,
  productName,
  variantSize,
  bulkPrice,
  companyName,
  companyAddress,
  gstin,
  razorpayKeyId,
}: BulkOrderCheckoutClientProps) {
  const router = useRouter();
  const [address, setAddress] = useState(companyAddress);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = bulkPrice * quantity;
  const gstRate = 0.05;
  const gstAmount = subtotal * gstRate;
  const total = subtotal + gstAmount;

  const handlePayment = async () => {
    if (!address.trim()) {
      setError("Please provide a delivery address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bulk-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: [{ variantId, quantity }],
          address,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create order.");
        setLoading(false);
        return;
      }

      // Open Razorpay
      const options = {
        key: razorpayKeyId,
        amount: data.amount,
        currency: "INR",
        name: "Kaori by Chiran",
        description: `Bulk Order – ${productName} (${variantSize} × ${quantity})`,
        order_id: data.razorpayOrderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/bulk-orders/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: data.orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              router.push(`/bulk-order/success/${data.orderId}`);
            } else {
              setError("Payment verification failed. Please contact support.");
            }
          } catch {
            setError("Payment verification error.");
          }
        },
        prefill: {
          name: companyName,
        },
        theme: { color: "#18181b" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setError(response.error.description || "Payment failed.");
        setLoading(false);
      });
      rzp.open();
      setLoading(false);
    } catch {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">Confirm Bulk Order</h1>
        <p className="text-sm text-zinc-500 mb-10">Review your order details before proceeding to payment.</p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Left: Order Details */}
          <div className="md:col-span-3 space-y-6">

            {/* Product Summary */}
            <div className="bg-white rounded-xl border border-zinc-200 p-6">
              <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Order Summary</h2>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-zinc-900">{productName}</p>
                  <p className="text-sm text-zinc-500 mt-0.5">{variantSize} · {quantity} units</p>
                </div>
                <p className="font-semibold text-zinc-900">₹{subtotal.toFixed(2)}</p>
              </div>
              <div className="border-t border-zinc-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-zinc-500">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-zinc-500">
                  <span>GST (5%)</span>
                  <span>₹{gstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-zinc-900 text-base pt-2 border-t border-zinc-100">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-xl border border-zinc-200 p-6">
              <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Delivery Address</h2>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:ring-2 focus:ring-zinc-900 outline-none"
                placeholder="Enter complete delivery address"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">{error}</div>
            )}

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full rounded-xl bg-[#D04636] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#B83C2D] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
            </button>
          </div>

          {/* Right: Business Info */}
          <div className="md:col-span-2">
            <div className="bg-zinc-50 rounded-xl border border-zinc-200 p-6 sticky top-24">
              <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Billing Details</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1">Company</p>
                  <p className="text-zinc-900 font-medium">{companyName || "—"}</p>
                </div>
                <div>
                  <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1">GSTIN</p>
                  <p className="text-zinc-900 font-mono">{gstin || "—"}</p>
                </div>
                <div>
                  <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1">Registered Address</p>
                  <p className="text-zinc-600 leading-relaxed">{companyAddress || "—"}</p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-200">
                <span className="inline-flex items-center gap-1.5 text-[11px] text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1 font-medium">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Verified Wholesale Buyer
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
