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
          <label className="block text-xs font-medium text-zinc-700 mb-2">
            Monthly Requirement Estimate{" "}
            <span className="text-zinc-400 font-normal">(optional)</span>
          </label>

          {/* Dropdown */}
          <select 
            value={selectedQuantity}
            onChange={(e) => setSelectedQuantity(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 text-zinc-700 text-sm py-3 px-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px] bg-[right_16px_center] bg-no-repeat"
          >
            <option value="">Select approximate quantity</option>
            {quantityOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#D04636] text-white font-medium py-3.5 rounded-lg text-sm hover:bg-[#B83C2D] transition-colors flex items-center justify-center gap-2"
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
