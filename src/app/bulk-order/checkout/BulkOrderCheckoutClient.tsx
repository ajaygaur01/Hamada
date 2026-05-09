"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Check } from "lucide-react";

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

type FormState = {
  contactName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  deliveryCity: string;
  deliveryState: string;
  country: string;
  pincode: string;
  additionalNote: string;
};

const INITIAL_FORM: FormState = {
  contactName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  deliveryCity: "",
  deliveryState: "",
  country: "India",
  pincode: "",
  additionalNote: "",
};

function validateStep1(values: FormState) {
  if (values.contactName.trim().length < 2) return "Please enter a valid contact name.";
  if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) return "Please enter a valid email.";
  if (!/^\d{10}$/.test(values.phone.trim().replace(/\D/g, ""))) return "Please enter a valid 10-digit phone number.";
  return null;
}

function validateStep2(values: FormState) {
  if (values.addressLine1.trim().length < 5) return "Please enter a valid address line 1.";
  if (values.deliveryState.trim().length < 2) return "Please enter your state.";
  if (values.deliveryCity.trim().length < 2) return "Please enter your city.";
  if (!/^\d{6}$/.test(values.pincode.trim())) return "Please enter a valid 6-digit pincode.";
  return null;
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
  
  // Pre-fill addressLine1 with company address as a helpful default
  const [formValues, setFormValues] = useState<FormState>({
    ...INITIAL_FORM,
    addressLine1: companyAddress || "",
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = bulkPrice * quantity;
  const gstRate = 0.05;
  const gstAmount = subtotal * gstRate;
  const total = subtotal + gstAmount;

  const handleNext = () => {
    setError("");
    if (currentStep === 1) {
      const stepError = validateStep1(formValues);
      if (stepError) {
        setError(stepError);
        return;
      }
    } else if (currentStep === 2) {
      const stepError = validateStep2(formValues);
      if (stepError) {
        setError(stepError);
        return;
      }
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError("");
    setCurrentStep((prev) => prev - 1);
  };

  const handlePayment = async () => {
    setError("");
    
    // Final validation
    const step1Err = validateStep1(formValues);
    const step2Err = validateStep2(formValues);
    if (step1Err || step2Err) {
      setError("Please ensure all previous steps are filled correctly.");
      return;
    }

    setLoading(true);

    // Combine granular address fields into a single string for the API
    const fullAddress = [
      formValues.addressLine1,
      formValues.addressLine2,
      formValues.landmark ? `Near ${formValues.landmark}` : "",
      formValues.deliveryCity,
      `${formValues.deliveryState} - ${formValues.pincode}`,
      formValues.country,
      `Contact: ${formValues.contactName} (${formValues.phone})`
    ]
      .filter(Boolean)
      .join(", ");

    try {
      const res = await fetch("/api/bulk-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: [{ variantId, quantity }],
          address: fullAddress,
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
          name: formValues.contactName || companyName,
          email: formValues.email,
          contact: formValues.phone,
        },
        theme: { color: "#D04636" },
        modal: {
          ondismiss: () => {
            setError("Payment was not completed. You can retry anytime.");
          },
        },
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

  const steps = [
    { id: 1, title: "Contact Details" },
    { id: 2, title: "Shipping" },
    { id: 3, title: "Review & Pay" }
  ];

  return (
    <>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div className="min-h-screen bg-[#fdfdfc]">
        {/* Simplified Header */}
        <header className="bg-[#4E3D33] text-[#E7DDC1] py-4 shadow-sm relative z-10">
          <div className="mx-auto flex w-full max-w-4xl items-center justify-center px-4">
            <Link href="/" className="font-heading text-xl font-bold text-white tracking-wide">
              KAORI
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-3xl px-4 py-8 md:py-12">
          
          {/* Stepper */}
          <div className="mb-10">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-zinc-200 -z-10"></div>
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#D04636] -z-10 transition-all duration-500 ease-in-out" 
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              ></div>
              
              {steps.map((step) => {
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;
                
                return (
                  <div key={step.id} className="flex flex-col items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${
                      isCompleted ? "bg-[#D04636] text-white" :
                      isCurrent ? "bg-[#4E3D33] text-white ring-4 ring-[#E7DDC1]" :
                      "bg-white border-2 border-zinc-300 text-zinc-400"
                    }`}>
                      {isCompleted ? <Check size={16} strokeWidth={3} /> : step.id}
                    </div>
                    <span className={`text-xs font-medium uppercase tracking-wider hidden sm:block ${
                      isCurrent ? "text-[#4E3D33]" : isCompleted ? "text-zinc-900" : "text-zinc-400"
                    }`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <section className="rounded-2xl border border-zinc-100 bg-white p-6 md:p-10 shadow-sm relative overflow-hidden min-h-[400px]">
            
            <h1 className="text-2xl font-heading text-[#4E3D33] mb-6 flex items-center justify-between">
              <span>
                {currentStep === 1 && "Contact Details"}
                {currentStep === 2 && "Shipping Address"}
                {currentStep === 3 && "Review & Pay"}
              </span>
            </h1>

            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* STEP 1: CONTACT */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  {/* Verified Company Box */}
                  <div className="bg-[#f0f4ea] border border-[#d2e0c2] rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 size={18} className="text-brand-green" />
                      <h3 className="font-semibold text-brand-green">Verified Wholesale Buyer</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-zinc-500 uppercase font-semibold text-[10px] tracking-wider mb-1">Company Name</p>
                        <p className="font-medium text-zinc-900">{companyName || "—"}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500 uppercase font-semibold text-[10px] tracking-wider mb-1">GSTIN</p>
                        <p className="font-medium text-zinc-900 font-mono">{gstin || "—"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-zinc-100 pt-6">
                    <h3 className="text-sm font-semibold text-zinc-900 mb-4">Point of Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-zinc-700">Contact Person Name</label>
                        <input
                          className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-[#D04636] focus:ring-1 focus:ring-[#D04636] focus:bg-white"
                          placeholder="John Doe"
                          value={formValues.contactName}
                          onChange={(e) => setFormValues((prev) => ({ ...prev, contactName: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-zinc-700">Email Address</label>
                        <input
                          type="email"
                          className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-[#D04636] focus:ring-1 focus:ring-[#D04636] focus:bg-white"
                          placeholder="john@company.com"
                          value={formValues.email}
                          onChange={(e) => setFormValues((prev) => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-zinc-700">Phone Number</label>
                        <input
                          type="tel"
                          className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-[#D04636] focus:ring-1 focus:ring-[#D04636] focus:bg-white"
                          placeholder="9876543210"
                          value={formValues.phone}
                          onChange={(e) => setFormValues((prev) => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: SHIPPING */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-zinc-700">Address Line 1</label>
                    <input
                      className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-[#D04636] focus:ring-1 focus:ring-[#D04636] focus:bg-white"
                      placeholder="Building, street, area"
                      value={formValues.addressLine1}
                      onChange={(e) => setFormValues((prev) => ({ ...prev, addressLine1: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-zinc-700">Address Line 2 (Optional)</label>
                      <input
                        className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-[#D04636] focus:ring-1 focus:ring-[#D04636] focus:bg-white"
                        placeholder="Apartment, suite, etc."
                        value={formValues.addressLine2}
                        onChange={(e) => setFormValues((prev) => ({ ...prev, addressLine2: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-zinc-700">Landmark (Optional)</label>
                      <input
                        className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-[#D04636] focus:ring-1 focus:ring-[#D04636] focus:bg-white"
                        placeholder="Near metro, mall"
                        value={formValues.landmark}
                        onChange={(e) => setFormValues((prev) => ({ ...prev, landmark: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-zinc-700">City</label>
                      <input
                        className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-[#D04636] focus:ring-1 focus:ring-[#D04636] focus:bg-white"
                        placeholder="City"
                        value={formValues.deliveryCity}
                        onChange={(e) => setFormValues((prev) => ({ ...prev, deliveryCity: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-zinc-700">State</label>
                      <input
                        className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-[#D04636] focus:ring-1 focus:ring-[#D04636] focus:bg-white"
                        placeholder="State"
                        value={formValues.deliveryState}
                        onChange={(e) => setFormValues((prev) => ({ ...prev, deliveryState: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-zinc-700">Pincode</label>
                      <input
                        className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-[#D04636] focus:ring-1 focus:ring-[#D04636] focus:bg-white"
                        placeholder="6-digit pincode"
                        value={formValues.pincode}
                        onChange={(e) => setFormValues((prev) => ({ ...prev, pincode: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-zinc-700">Country</label>
                      <input
                        className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-[#D04636] focus:ring-1 focus:ring-[#D04636] focus:bg-white"
                        placeholder="Country"
                        value={formValues.country}
                        onChange={(e) => setFormValues((prev) => ({ ...prev, country: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: REVIEW & PAY */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  
                  {/* Order Summary Card */}
                  <div className="bg-[#4E3D33] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                    <h3 className="text-[#E7DDC1] text-sm font-medium uppercase tracking-wider mb-4">Order Summary</h3>
                    
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-xl font-heading mb-1">{productName}</p>
                        <p className="text-[#E7DDC1]/70 text-sm">{variantSize} · {quantity} units</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                        <p className="text-white font-medium">₹{subtotal.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-4 space-y-2">
                      <div className="flex justify-between text-sm text-[#E7DDC1]/80">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-[#E7DDC1]/80">
                        <span>GST (5%)</span>
                        <span>₹{gstAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-end mt-4 pt-4 border-t border-white/10">
                        <p className="text-[#E7DDC1]/80 text-sm">Total Payable</p>
                        <p className="text-2xl font-bold">
                          ₹{total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Note */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-zinc-700">Additional Note (Optional)</label>
                    <textarea
                      className="min-h-24 w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-[#D04636] focus:ring-1 focus:ring-[#D04636] focus:bg-white resize-none"
                      placeholder="Add delivery preferences or any special instructions..."
                      value={formValues.additionalNote}
                      onChange={(e) => setFormValues((prev) => ({ ...prev, additionalNote: e.target.value }))}
                    />
                  </div>

                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-6 mt-6 border-t border-zinc-100">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={loading}
                    className="px-6 py-3 rounded-xl border border-zinc-300 text-zinc-700 font-medium hover:bg-zinc-50 transition-colors disabled:opacity-50"
                  >
                    Back
                  </button>
                )}
                
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 bg-[#D04636] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#B83C2D] transition-colors flex justify-center items-center gap-2"
                  >
                    Next Step <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePayment}
                    disabled={loading}
                    className="flex-1 bg-[#D04636] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#B83C2D] transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-[#D04636]/20"
                  >
                    {loading ? "Processing Payment..." : `Pay ₹${total.toFixed(2)}`}
                  </button>
                )}
              </div>

            </div>
          </section>
        </main>
      </div>
    </>
  );
}
