"use client";

import { useState } from "react";

const quantityOptions = [
  "Less than 5 kg/month",
  "5 – 20 kg/month",
  "10 – 50 kg/month",
  "50+ kg/month",
];

export default function InquiryForm() {
  const [selectedQuantity, setSelectedQuantity] = useState("5 – 20 kg/month");

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm">
      <h2 className="text-xl font-bold text-zinc-900 mb-2">Send an Inquiry</h2>
      <p className="text-xs text-zinc-500 mb-8">
        Fill out the details below and we&apos;ll get back to you shortly.
      </p>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {/* Your Name */}
        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-2">Your Name</label>
          <input
            type="text"
            placeholder="e.g. Rahul Sharma"
            className="w-full bg-zinc-50 border border-zinc-200 text-zinc-700 text-sm py-3 px-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 placeholder:text-zinc-400"
          />
        </div>

        {/* Business Name */}
        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-2">Business Name</label>
          <input
            type="text"
            placeholder="e.g. Brew & Co. Cafe"
            className="w-full bg-zinc-50 border border-zinc-200 text-zinc-700 text-sm py-3 px-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 placeholder:text-zinc-400"
          />
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-2">Email Address</label>
          <input
            type="email"
            placeholder="e.g. rahul@mycafe.com"
            className="w-full bg-zinc-50 border border-zinc-200 text-zinc-700 text-sm py-3 px-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 placeholder:text-zinc-400"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-2">Message</label>
          <textarea
            rows={4}
            placeholder="Tell us about your requirements..."
            className="w-full bg-zinc-50 border border-zinc-200 text-zinc-700 text-sm py-3 px-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 placeholder:text-zinc-400 resize-none"
          />
        </div>

        {/* Monthly Requirement Estimate */}
        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1">
            Monthly Requirement Estimate{" "}
            <span className="text-zinc-400 font-normal">(optional)</span>
          </label>

          {/* Dropdown */}
          <select className="w-full bg-zinc-50 border border-zinc-200 text-zinc-700 text-sm py-3 px-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 mb-4 appearance-none">
            <option>Select approximate quantity</option>
            {quantityOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          {/* Radio buttons */}
          <div className="space-y-2.5">
            {quantityOptions.map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedQuantity === opt
                      ? "border-zinc-900"
                      : "border-zinc-300 group-hover:border-zinc-400"
                  }`}
                >
                  {selectedQuantity === opt && (
                    <div className="w-2 h-2 rounded-full bg-zinc-900" />
                  )}
                </div>
                <span className="text-xs text-zinc-600">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-zinc-900 text-white font-medium py-3.5 rounded-lg text-sm hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
        >
          Submit Inquiry
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>

        <p className="text-[10px] text-zinc-400 text-center">
          By submitting, you agree to our privacy policy. We&apos;ll never share your data.
        </p>
      </form>
    </div>
  );
}
