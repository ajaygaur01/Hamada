"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  image: string;
  variants: {
    id: string;
    size: string;
    bulk_price: number;
  }[];
};

type CartItem = {
  productId: string;
  variantId: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
};

export default function BulkOrderCartClient({ 
  products,
  companyAddress
}: { 
  products: Product[];
  companyAddress: string;
}) {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [address, setAddress] = useState(companyAddress);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateQuantity = (product: Product, variantId: string, size: string, price: number, delta: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.variantId === variantId);
      if (existing) {
        const newQty = Math.max(0, existing.quantity + delta);
        if (newQty === 0) {
          return prev.filter((item) => item.variantId !== variantId);
        }
        return prev.map((item) =>
          item.variantId === variantId ? { ...item, quantity: newQty } : item
        );
      } else if (delta > 0) {
        return [...prev, {
          productId: product.id,
          variantId,
          name: product.name,
          size,
          price,
          quantity: delta,
        }];
      }
      return prev;
    });
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const gstRate = 0.05; // 5% GST for tea
  const gstAmount = subtotal * gstRate;
  const total = subtotal + gstAmount;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!address.trim()) {
      setError("Please provide a delivery address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create Razorpay Order
      const res = await fetch("/api/bulk-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, address }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create order");
        setLoading(false);
        return;
      }

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mockkey", // Fallback for testing
        amount: data.amount,
        currency: "INR",
        name: "Kaori by Chiran",
        description: "Bulk Tea Order",
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
          name: "Wholesale Buyer",
        },
        theme: {
          color: "#18181b",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setError(response.error.description || "Payment failed.");
      });
      rzp.open();
      setLoading(false);

    } catch {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Product List */}
      <div className="lg:col-span-2 space-y-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6 flex flex-col md:flex-row gap-6">
            <div className="relative w-32 h-32 shrink-0 rounded-lg overflow-hidden bg-zinc-100">
              <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-zinc-900">{product.name}</h3>
              <div className="mt-4 space-y-3">
                {product.variants.map((variant) => {
                  const cartItem = cart.find(c => c.variantId === variant.id);
                  const qty = cartItem?.quantity || 0;
                  return (
                    <div key={variant.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="w-16 font-medium text-zinc-700">{variant.size}</span>
                        <span className="text-zinc-500">₹{variant.bulk_price}/unit</span>
                      </div>
                      <div className="flex items-center gap-3 border border-zinc-200 rounded-lg p-1">
                        <button 
                          onClick={() => updateQuantity(product, variant.id, variant.size, variant.bulk_price, -1)}
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-zinc-100 text-zinc-600 transition"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{qty}</span>
                        <button 
                          onClick={() => updateQuantity(product, variant.id, variant.size, variant.bulk_price, 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-zinc-100 text-zinc-600 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6 sticky top-24">
          <h2 className="text-xl font-bold text-zinc-900 mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-zinc-600">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>GST (5%)</span>
              <span>₹{gstAmount.toFixed(2)}</span>
            </div>
            <div className="border-t border-zinc-200 pt-4 flex justify-between font-bold text-lg text-zinc-900">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-zinc-700 mb-2">Delivery Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:ring-2 focus:ring-zinc-900 outline-none"
              rows={3}
              placeholder="Enter complete delivery address"
            />
          </div>

          {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || loading}
            className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Proceed to Payment"}
          </button>

          {/* Add Razorpay script to page */}
          <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
        </div>
      </div>
    </div>
  );
}
