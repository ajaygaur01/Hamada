"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Check } from "lucide-react";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: Record<string, unknown>) => void) => void;
    };
  }
}

type ProductOption = {
  id: string;
  slug: string;
  name: string;
  variants: {
    id: string;
    size: string;
    samplePrice: number;
  }[];
};

type Props = {
  selectedProduct: ProductOption | null;
  selectedVariantId: string;
  initialUser: {
    username: string;
    email: string;
    phone: string;
  };
};

type FormState = {
  customerName: string;
  businessName: string;
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
  customerName: "",
  businessName: "",
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

let razorpayScriptPromise: Promise<boolean> | null = null;

function loadRazorpayScript() {
  if (typeof window === "undefined") return Promise.resolve(false);

  if (window.Razorpay) return Promise.resolve(true);
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  return razorpayScriptPromise;
}

function validateStep1(values: FormState) {
  if (values.customerName.trim().length < 2) return "Please enter a valid name.";
  if (values.businessName.trim().length < 2) return "Please enter your business or brand name.";
  if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) return "Please enter a valid email.";
  if (!/^\d{10}$/.test(values.phone.trim().replace(/\D/g, ''))) return "Please enter a valid 10-digit phone number.";
  return null;
}

function validateStep2(values: FormState) {
  if (values.addressLine1.trim().length < 5) return "Please enter a valid address line 1.";
  if (values.deliveryState.trim().length < 2) return "Please enter your state.";
  if (values.deliveryCity.trim().length < 2) return "Please enter your city.";
  if (!/^\d{6}$/.test(values.pincode.trim())) return "Please enter a valid 6-digit pincode.";
  return null;
}

export default function SampleOrderPageClient({
  selectedProduct,
  selectedVariantId,
  initialUser,
}: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formValues, setFormValues] = useState<FormState>({
    ...INITIAL_FORM,
    customerName: initialUser.username,
    email: initialUser.email,
    phone: initialUser.phone,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentVariantId, setCurrentVariantId] = useState(selectedVariantId);
  const [payableAmount, setPayableAmount] = useState<number | null>(null);
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);

  const selectedVariant = useMemo(
    () => selectedProduct?.variants.find((variant) => variant.id === currentVariantId),
    [currentVariantId, selectedProduct],
  );

  useEffect(() => {
    async function fetchQuote() {
      if (!selectedProduct || !selectedVariant) {
        setPayableAmount(null);
        return;
      }

      setIsQuoteLoading(true);
      try {
        const response = await fetch(
          `/api/sample-orders/quote?productSlug=${encodeURIComponent(selectedProduct.slug)}&variantId=${encodeURIComponent(selectedVariant.id)}`,
          { cache: "no-store" },
        );
        const data = (await response.json()) as { payableAmount?: number };
        if (response.ok && typeof data.payableAmount === "number") {
          setPayableAmount(data.payableAmount);
        } else {
          setPayableAmount(null);
        }
      } catch {
        setPayableAmount(null);
      } finally {
        setIsQuoteLoading(false);
      }
    }

    void fetchQuote();
  }, [selectedProduct, selectedVariant]);

  const handleNext = () => {
    setErrorMessage("");
    if (currentStep === 1) {
      const error = validateStep1(formValues);
      if (error) {
        setErrorMessage(error);
        return;
      }
    } else if (currentStep === 2) {
      const error = validateStep2(formValues);
      if (error) {
        setErrorMessage(error);
        return;
      }
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setErrorMessage("");
    setCurrentStep((prev) => prev - 1);
  };

  const handleOnlinePayment = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    // Final check before payment
    const step1Err = validateStep1(formValues);
    const step2Err = validateStep2(formValues);
    if (step1Err || step2Err) {
      setErrorMessage("Please ensure all previous steps are filled correctly.");
      return;
    }
    if (!selectedProduct || !selectedVariant) {
      setErrorMessage("Please select the product sample size again from product details.");
      return;
    }

    setIsSubmitting(true);

    try {
      const createOrderResponse = await fetch("/api/sample-orders/create-payment-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formValues,
          variantId: currentVariantId,
          productSlug: selectedProduct.slug,
        }),
      });

      const createOrderData = await createOrderResponse.json();
      if (!createOrderResponse.ok) {
        throw new Error(createOrderData.error ?? "Could not create payment order.");
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error("Razorpay SDK failed to load. Please try again.");
      }

      setIsSubmitting(false);

      const razorpay = new window.Razorpay({
        key: createOrderData.razorpayKeyId,
        amount: createOrderData.amountInPaise,
        currency: "INR",
        name: "Hamada",
        description: `Sample order for ${selectedProduct.name}`,
        order_id: createOrderData.razorpayOrderId,
        prefill: {
          name: formValues.customerName,
          email: formValues.email,
          contact: formValues.phone,
        },
        notes: {
          variantSize: selectedVariant?.size ?? "",
          sampleOrderId: createOrderData.sampleOrderId,
        },
        theme: {
          color: "#D04636"
        },
        modal: {
          ondismiss: () => {
            setErrorMessage("Payment was not completed. You can retry anytime.");
          },
        },
        handler: async (response: Record<string, unknown>) => {
          setIsSubmitting(true);
          try {
            const verifyResponse = await fetch("/api/sample-orders/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();
            if (!verifyResponse.ok) {
              throw new Error(verifyData.error ?? "Payment verification failed.");
            }

            setSuccessMessage(`Order placed successfully! Order ID: ${verifyData.orderNumber}`);
            setCurrentStep(4); // Move to a success view
          } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Payment verification failed.");
          } finally {
            setIsSubmitting(false);
          }
        },
      });

      razorpay.on("payment.failed", async (response: Record<string, unknown>) => {
        await fetch("/api/sample-orders/mark-failed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: createOrderData.razorpayOrderId,
            reason: (response.error as { description?: string } | undefined)?.description ?? "payment.failed",
          }),
        });
        setErrorMessage("Payment failed. Your order was not confirmed. Please try again.");
      });

      razorpay.open();
    } catch (error) {
      setIsSubmitting(false);
      setErrorMessage(error instanceof Error ? error.message : "Unable to process online payment.");
    }
  };

  const steps = [
    { id: 1, title: "Contact Details" },
    { id: 2, title: "Shipping" },
    { id: 3, title: "Review & Pay" }
  ];

  if (currentStep === 4) {
    // Success View
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-zinc-100 p-8 text-center shadow-lg animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-[#f0f4ea] text-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-heading text-zinc-900 mb-2">Order Confirmed!</h1>
          <p className="text-zinc-500 mb-8">{successMessage}</p>

          <div className="bg-zinc-50 rounded-xl p-4 mb-8 text-left border border-zinc-100">
            <p className="text-sm text-zinc-500 mb-1">Shipping to:</p>
            <p className="font-medium text-zinc-900">{formValues.customerName}</p>
            <p className="text-sm text-zinc-700">{formValues.addressLine1}</p>
            <p className="text-sm text-zinc-700">{formValues.deliveryCity}, {formValues.deliveryState} {formValues.pincode}</p>
          </div>

          <Link href="/account" className="block w-full bg-[#4E3D33] text-white py-3 rounded-xl font-medium hover:bg-[#3e3028] transition-colors">
            Track Order in Dashboard
          </Link>
          <Link href="/products" className="block w-full text-zinc-500 py-3 mt-2 font-medium hover:text-zinc-900 transition-colors">
            Continue Exploring
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfdfc]">
      {/* Simplified Header */}
      <header className="bg-[#4E3D33] text-[#E7DDC1] py-4 shadow-sm relative z-10">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-center px-4">
          <Link href="/" className="font-heading text-xl font-bold text-white tracking-wide">
            HAMADA
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
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${isCompleted ? "bg-[#D04636] text-white" :
                      isCurrent ? "bg-[#4E3D33] text-white ring-4 ring-[#E7DDC1]" :
                        "bg-white border-2 border-zinc-300 text-zinc-400"
                    }`}>
                    {isCompleted ? <Check size={16} strokeWidth={3} /> : step.id}
                  </div>
                  <span className={`text-xs font-medium uppercase tracking-wider hidden sm:block ${isCurrent ? "text-[#4E3D33]" : isCompleted ? "text-zinc-900" : "text-zinc-400"
                    }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <section className="rounded-2xl border border-zinc-100 bg-white p-6 md:p-10 shadow-sm relative overflow-hidden min-h-[400px]">

          {/* Missing Product Warning */}
          {!selectedProduct || !selectedVariant ? (
            <div className="absolute inset-0 z-20 bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">!</span>
              </div>
              <h2 className="text-xl font-bold text-zinc-900 mb-2">No Product Selected</h2>
              <p className="text-zinc-500 mb-6 max-w-md">Please select a product and sample size from our catalog before proceeding to checkout.</p>
              <Link href="/products" className="bg-[#4E3D33] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#3e3028] transition-colors">
                Browse Products
              </Link>
            </div>
          ) : null}

          <h1 className="text-2xl font-heading text-[#4E3D33] mb-6">
            {currentStep === 1 && "Contact Details"}
            {currentStep === 2 && "Shipping Address"}
            {currentStep === 3 && "Review & Pay"}
          </h1>

          {errorMessage && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-in slide-in-from-top-2">
              {errorMessage}
            </div>
          )}

          <div className="space-y-6">
            {/* STEP 1: CONTACT */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-zinc-700">Full Name</label>
                    <input
                      className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-[#D04636] focus:ring-1 focus:ring-[#D04636] focus:bg-white"
                      placeholder="John Doe"
                      value={formValues.customerName}
                      onChange={(e) => setFormValues((prev) => ({ ...prev, customerName: e.target.value }))}
                      readOnly={Boolean(initialUser.username)}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-zinc-700">Business/Brand Name</label>
                    <input
                      className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-[#D04636] focus:ring-1 focus:ring-[#D04636] focus:bg-white"
                      placeholder="Your Company Ltd."
                      value={formValues.businessName}
                      onChange={(e) => setFormValues((prev) => ({ ...prev, businessName: e.target.value }))}
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
                      readOnly={Boolean(initialUser.email)}
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
                      readOnly={Boolean(initialUser.phone)}
                    />
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
                      <p className="text-xl font-heading mb-1">{selectedProduct?.name}</p>
                      <p className="text-[#E7DDC1]/70 text-sm">Sample Size</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                      <select
                        value={currentVariantId}
                        onChange={(e) => setCurrentVariantId(e.target.value)}
                        className="bg-transparent text-white font-medium outline-none cursor-pointer appearance-none text-right pr-4 relative"
                      >
                        {selectedProduct?.variants.map((v) => (
                          <option key={v.id} value={v.id} className="text-zinc-900">{v.size}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4 flex justify-between items-end">
                    <p className="text-[#E7DDC1]/80 text-sm">Total Payable</p>
                    <p className="text-2xl font-bold">
                      {isQuoteLoading ? "..." : `₹${payableAmount?.toFixed(2) ?? "0.00"}`}
                    </p>
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

                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800 flex gap-3">
                  <div className="mt-0.5">•</div>
                  <p>Sample requests will be processed and confirmed within 24 hours after successful payment.</p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-6 mt-6 border-t border-zinc-100">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
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
                  onClick={handleOnlinePayment}
                  disabled={isSubmitting || !selectedProduct || !selectedVariant || !payableAmount}
                  className="flex-1 bg-[#D04636] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#B83C2D] transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-[#D04636]/20"
                >
                  {isSubmitting ? "Processing Payment..." : "Pay & Place Order"}
                </button>
              )}
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}
