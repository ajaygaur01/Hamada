"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Do I need to create an account to order a sample?",
    answer:
      "No, you don't need an account to order a sample. Simply browse our product catalogue, select the tea you'd like to try, and pay via UPI. We'll deliver directly to your door.",
  },
  {
    question: "What is the minimum quantity for a bulk order?",
    answer:
      "Minimum bulk order quantities vary by product. Typically, our minimum starts at 1kg for most teas. You can view the specific minimum quantity on each product's detail page.",
  },
  {
    question: "How does GST verification work for wholesale accounts?",
    answer:
      "When you create a wholesale account, we verify your GSTIN through a government API. Once verified, you'll have access to bulk pricing and GST-compliant invoicing for all your orders.",
  },
  {
    question: "How long does delivery take after placing a bulk order?",
    answer:
      "Bulk orders are typically dispatched within 2-3 business days. Delivery across India usually takes 5-7 business days depending on your location. We provide tracking details once your order is shipped.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-zinc-50 py-20 border-t border-zinc-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 mb-3">FAQ</p>
          <h2 className="text-2xl font-bold text-zinc-900 mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-zinc-500">
            Everything you need to know before getting started
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-zinc-200 rounded-lg overflow-hidden transition-all"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="text-sm font-medium text-zinc-900 pr-4">
                  {faq.question}
                </span>
                <div
                  className={`w-7 h-7 rounded-full border border-zinc-200 flex items-center justify-center flex-shrink-0 transition-transform ${
                    openIndex === index ? "rotate-45" : ""
                  }`}
                >
                  <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </button>

              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
