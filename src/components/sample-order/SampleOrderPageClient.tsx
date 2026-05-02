"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

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

function validateFormValues(values: FormState) {
  if (values.customerName.trim().length < 2) return "Please enter a valid name.";
  if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) return "Please enter a valid email.";
  if (!/^\d{10}$/.test(values.phone.trim())) return "Please enter a valid 10-digit phone number.";
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

  const validateBeforePayment = () => {
    setErrorMessage("");
    setSuccessMessage("");
    const formError = validateFormValues(formValues);
    if (formError) {
      setErrorMessage(formError);
      return false;
    }

    if (!selectedProduct || !selectedVariant) {
      setErrorMessage("Please select the product sample size again from product details.");
      return false;
    }

    return true;
  };

  const handleOnlinePayment = async () => {
    if (!validateBeforePayment()) return;
    if (!selectedProduct || !selectedVariant) return;

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

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
        name: "Kaori by Chiran",
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

            setSuccessMessage(`Order placed successfully. Order number: ${verifyData.orderNumber}`);
            setFormValues({
              ...INITIAL_FORM,
              customerName: initialUser.username,
              email: initialUser.email,
              phone: initialUser.phone,
            });
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

  return (
    <div className="min-h-screen bg-zinc-100">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 text-sm text-zinc-600">
          <Link href="/" className="font-semibold text-zinc-900">
            Kaori
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link href="/products" className="hover:text-zinc-900">
              Products
            </Link>
            <Link href="/how-it-works" className="hover:text-zinc-900">
              How It Works
            </Link>
            <Link href="/contact" className="hover:text-zinc-900">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-10 md:py-14">
        <section className="rounded-xl border border-zinc-200 bg-white p-6 md:p-8">
          <h1 className="text-center text-3xl font-semibold text-zinc-900">Order a Sample</h1>
          <p className="mt-2 text-center text-sm text-zinc-500">Fast checkout for your selected sample.</p>

          <div className="mt-8 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
            <span className="font-semibold">Important:</span> This page supports prepaid sample checkout only.
          </div>

          <div className="mt-6 space-y-4">
            {!selectedProduct || !selectedVariant ? (
              <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-800">
                Please select a product sample from product details first.
                <Link href="/products" className="ml-2 font-medium underline">
                  Go to products
                </Link>
              </div>
            ) : null}

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Name</label>
              <input
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-500"
                placeholder="Your full name"
                value={formValues.customerName}
                onChange={(event) => setFormValues((prev) => ({ ...prev, customerName: event.target.value }))}
                readOnly={Boolean(initialUser.username)}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Business Name</label>
              <input
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-500"
                placeholder="Your business or brand name"
                value={formValues.businessName}
                onChange={(event) => setFormValues((prev) => ({ ...prev, businessName: event.target.value }))}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Email</label>
              <input
                type="email"
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-500"
                placeholder="you@example.com"
                value={formValues.email}
                onChange={(event) => setFormValues((prev) => ({ ...prev, email: event.target.value }))}
                readOnly={Boolean(initialUser.email)}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Phone</label>
              <input
                type="tel"
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-500"
                placeholder="+91 XXXXXXXXXX"
                value={formValues.phone}
                onChange={(event) => setFormValues((prev) => ({ ...prev, phone: event.target.value }))}
                readOnly={Boolean(initialUser.phone)}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Address Line 1</label>
              <input
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-500"
                placeholder="House no, street, area"
                value={formValues.addressLine1}
                onChange={(event) => setFormValues((prev) => ({ ...prev, addressLine1: event.target.value }))}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Address Line 2 (Optional)</label>
              <input
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-500"
                placeholder="Apartment, suite, floor"
                value={formValues.addressLine2}
                onChange={(event) => setFormValues((prev) => ({ ...prev, addressLine2: event.target.value }))}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Landmark (Optional)</label>
              <input
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-500"
                placeholder="Near metro station, mall, etc."
                value={formValues.landmark}
                onChange={(event) => setFormValues((prev) => ({ ...prev, landmark: event.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">City</label>
                <input
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-500"
                  placeholder="City"
                  value={formValues.deliveryCity}
                  onChange={(event) => setFormValues((prev) => ({ ...prev, deliveryCity: event.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">State</label>
                <input
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-500"
                  placeholder="State"
                  value={formValues.deliveryState}
                  onChange={(event) => setFormValues((prev) => ({ ...prev, deliveryState: event.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">Country</label>
                <input
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-500"
                  placeholder="Country"
                  value={formValues.country}
                  onChange={(event) => setFormValues((prev) => ({ ...prev, country: event.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">Pincode</label>
                <input
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-500"
                  placeholder="6-digit pincode"
                  value={formValues.pincode}
                  onChange={(event) => setFormValues((prev) => ({ ...prev, pincode: event.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">Selected Product</label>
              <div className="rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-800">
                {selectedProduct ? selectedProduct.name : "No product selected"}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">Sample Size</label>
              <div className="flex flex-wrap gap-2">
                {selectedProduct?.variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setCurrentVariantId(variant.id)}
                    className={`rounded-md border px-4 py-2 text-sm transition ${
                      currentVariantId === variant.id
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400"
                    }`}
                  >
                    {variant.size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Additional Note (Optional)</label>
              <textarea
                className="min-h-24 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-500"
                placeholder="Add delivery preferences or any special instructions"
                value={formValues.additionalNote}
                onChange={(event) => setFormValues((prev) => ({ ...prev, additionalNote: event.target.value }))}
              />
            </div>

            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-sm text-zinc-500">Payable amount</p>
              <p className="mt-1 text-xl font-semibold text-zinc-900">
                {isQuoteLoading ? "Calculating..." : `INR ${payableAmount?.toFixed(2) ?? "0.00"}`}
              </p>
            </div>

            {errorMessage && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>}
            {successMessage && <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{successMessage}</p>}

            <button
              type="button"
              onClick={handleOnlinePayment}
              disabled={isSubmitting || !selectedProduct || !selectedVariant || !payableAmount}
              className="w-full rounded-md bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Processing..." : "Pay & Place Sample Order"}
            </button>

            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center text-sm text-zinc-600">
              We will confirm your sample request within 24 hours after successful payment confirmation.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
