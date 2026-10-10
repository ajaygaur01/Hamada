"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, ShieldCheck, FileText, Globe, UserCheck, MessageSquare } from "lucide-react";
import { isSampleSize } from "@/lib/tea-size";

interface Variant {
  id: string;
  size: string;
  samplePrice: number;
  bulkPrice: number | null;
  minBulkQuantity: number;
}

interface OrderFormProps {
  variants: Variant[];
  productSlug: string;
}

export default function OrderForm({ variants, productSlug }: OrderFormProps) {
  // Filter for samples (or fallback to all variants if none matched isSampleSize)
  const sampleVariants = variants.filter((v) => isSampleSize(v.size));
  const activeVariants = sampleVariants.length > 0 ? sampleVariants : variants;

  const [selectedSampleIdx, setSelectedSampleIdx] = useState(0);
  const selectedSampleVariant = activeVariants[selectedSampleIdx] || activeVariants[0];

  const sampleCheckoutUrl = selectedSampleVariant
    ? `/sample-order?product=${encodeURIComponent(productSlug)}&variant=${encodeURIComponent(selectedSampleVariant.id)}`
    : `/sample-order?product=${encodeURIComponent(productSlug)}`;

  const activeSizeStr = selectedSampleVariant?.size || "";
  const whatsappMsg = `Hi Hamada, I am interested in inquiring about the ${productSlug} (${activeSizeStr}).`;
  const whatsappUrl = `https://wa.me/919899923445?text=${encodeURIComponent(whatsappMsg)}`;

  const trustItems = [
    { icon: <ShieldCheck className="w-4 h-4 text-zinc-600" />, text: "Direct Kagoshima single origin" },
    { icon: <FileText className="w-4 h-4 text-zinc-600" />, text: "Export documentation included" },
    { icon: <Globe className="w-4 h-4 text-zinc-600" />, text: "Pan-India & worldwide shipping" },
    { icon: <UserCheck className="w-4 h-4 text-zinc-600" />, text: "Dedicated tea sommelier support" },
  ];

  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 md:p-8 space-y-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      
      {/* Header */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold tracking-[0.2em] text-[#D04636] uppercase">
          Sample Available
        </span>
        <div className="flex items-baseline gap-2">
          <h2 className="font-serif text-3xl font-bold text-zinc-800 leading-tight">
            ₹{selectedSampleVariant?.samplePrice ?? 0}
          </h2>
          <span className="text-xs font-normal text-zinc-500 italic">
            ({selectedSampleVariant?.size})
          </span>
        </div>
        <p className="text-xs text-zinc-500 font-medium mt-1">
          Evaluate authentic flavor, aroma, and grade before scaling.
        </p>
      </div>

      {/* SELECT SAMPLE SIZE */}
      {activeVariants.length > 0 && (
        <div className="space-y-2.5">
          <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400">
            Select Sample Size
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {activeVariants.map((v, idx) => {
              const isSelected = selectedSampleIdx === idx;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedSampleIdx(idx)}
                  className={`relative flex flex-col items-center justify-center py-3.5 px-2 text-center rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? "border-2 border-[#D04636] bg-[#fdf8f7] shadow-xs text-[#D04636]"
                      : "border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                  }`}
                >
                  <span className={`text-[15px] font-bold leading-tight ${
                    isSelected ? "text-[#D04636]" : "text-zinc-800"
                  }`}>
                    {v.size}
                  </span>
                  <span className={`text-[11px] font-medium mt-0.5 leading-none ${
                    isSelected ? "text-[#D04636]/80" : "text-zinc-400"
                  }`}>
                    ₹{v.samplePrice}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Call-to-Action Buttons */}
      <div className="space-y-2.5 pt-1">
        {/* Request Sample Kit Button */}
        <Link
          href={sampleCheckoutUrl}
          className="flex flex-col items-center justify-center w-full bg-[#D04636] hover:bg-[#B83C2D] text-white py-3.5 rounded-xl transition-all shadow-[0_4px_12px_rgba(208,70,54,0.2)] text-center group cursor-pointer"
        >
          <div className="flex items-center justify-center gap-2 font-bold text-sm leading-none">
            <Package className="w-4 h-4" />
            <span>Order Sample Kit</span>
          </div>
          <span className="text-[10px] text-white/80 font-medium mt-1 leading-none">
            Shipped directly to your doorstep
          </span>
        </Link>

        {/* Chat on WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center w-full bg-transparent border border-zinc-200 hover:bg-zinc-50 py-3 rounded-xl transition-all text-center group cursor-pointer"
        >
          <div className="flex items-center justify-center gap-2 font-semibold text-sm leading-none text-zinc-800">
            <MessageSquare className="w-4 h-4 text-[#25D366] fill-[#25D366]/10" />
            <span>Inquire on WhatsApp</span>
          </div>
          <span className="text-[10px] text-zinc-400 font-medium mt-1 leading-none">
            Direct team support &amp; consultation
          </span>
        </a>
      </div>

      {/* Trust Badges List */}
      <div className="border-t border-zinc-200 pt-5 space-y-2.5">
        {trustItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 text-xs font-medium text-zinc-600 leading-none">
            <div className="w-6 h-6 rounded-full bg-zinc-50 flex items-center justify-center border border-zinc-200 shrink-0">
              {item.icon}
            </div>
            <span>{item.text}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
