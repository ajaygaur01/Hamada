"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, ShieldCheck, FileText, Globe, UserCheck, MessageSquare, Lock } from "lucide-react";
import { isBulkSize, isSampleSize } from "@/lib/tea-size";
import { useAuth } from "@/components/auth/AuthProvider";

interface Variant {
  id: string;
  size: string;
  samplePrice: number;
  bulkPrice: number;
  minBulkQuantity: number;
}

interface OrderFormProps {
  variants: Variant[];
  productSlug: string;
}

export default function OrderForm({ variants, productSlug }: OrderFormProps) {
  const { user, openAuthModal } = useAuth();
  const isVerifiedBuyer = user?.gstin_verified === true;

  // Separate variants into sample and bulk categories
  const sampleVariants = variants.filter((v) => isSampleSize(v.size));
  const bulkVariants = variants.filter((v) => isBulkSize(v.size));

  // State for active choices
  const [selectedBulkIdx, setSelectedBulkIdx] = useState(0);
  const [selectedSampleIdx, setSelectedSampleIdx] = useState(0);
  const [bulkQty, setBulkQty] = useState(1);

  const selectedBulkVariant = bulkVariants[selectedBulkIdx];
  const selectedSampleVariant = sampleVariants[selectedSampleIdx] || variants[selectedSampleIdx];

  const minBulkQty = selectedBulkVariant?.minBulkQuantity || 1;
  const currentBulkQty = Math.max(minBulkQty, bulkQty);

  // Dynamic URLs
  const sampleCheckoutUrl = selectedSampleVariant
    ? `/sample-order?product=${encodeURIComponent(productSlug)}&variant=${encodeURIComponent(selectedSampleVariant.id)}`
    : `/sample-order?product=${encodeURIComponent(productSlug)}`;

  const bulkCheckoutUrl = selectedBulkVariant
    ? `/bulk-order/checkout?variant=${encodeURIComponent(selectedBulkVariant.id)}&qty=${currentBulkQty}`
    : `/bulk-order/checkout`;

  const activeSizeStr = selectedBulkVariant?.size || selectedSampleVariant?.size || "";
  const whatsappMsg = `Hi Hamada, I am interested in wholesale pricing for the ${productSlug} (${activeSizeStr}).`;
  const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(whatsappMsg)}`;

  // Trust items under the WhatsApp button
  const trustItems = [
    { icon: <ShieldCheck className="w-4 h-4 text-zinc-600" />, text: "Secure & easy inquiry" },
    { icon: <FileText className="w-4 h-4 text-zinc-600" />, text: "Export documentation included" },
    { icon: <Globe className="w-4 h-4 text-zinc-600" />, text: "Pan-India & global shipping" },
    { icon: <UserCheck className="w-4 h-4 text-zinc-600" />, text: "Dedicated account support" },
  ];

  // Helper to format bulk option text and badges
  const getBulkFormatInfo = (vSize: string, idx: number) => {
    const is500g = vSize.toLowerCase().includes("500g");
    const isBulk = vSize.toLowerCase().includes("5kg") || vSize.toLowerCase().includes("bulk");
    
    // Add "Pouch" or format details for wholesale
    let displayName = vSize;
    if (!displayName.toLowerCase().includes("pouch") && !isBulk) {
      displayName = `${vSize} Pouch`;
    }
    
    return {
      name: displayName,
      badge: is500g ? (
        <span className="text-[9px] font-bold bg-[#FAF8F5] border border-zinc-200 text-zinc-500 px-1.5 py-0.5 rounded uppercase">
          MOQ
        </span>
      ) : isBulk ? (
        <span className="text-[9px] font-bold bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded uppercase">
          Contact Sales
        </span>
      ) : null,
    };
  };

  // Helper to format sample format text and check for badges
  const getSampleFormatInfo = (vSize: string, idx: number) => {
    const is100g = vSize.toLowerCase().includes("100g") || idx === 1;
    
    let displayName = vSize;
    if (!displayName.toLowerCase().includes("pack") && !displayName.toLowerCase().includes("sample")) {
      displayName = `${vSize} Sample Pack`;
    }
    
    return {
      name: displayName,
      isRecommended: is100g,
    };
  };

  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 md:p-8 space-y-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      
      {/* Sticky Sidebar Header */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold tracking-[0.2em] text-[#4C632E] uppercase">
          Wholesale Only
        </span>
        <h2 className="font-serif text-3xl font-bold text-zinc-800 leading-tight">
          MOQ {bulkVariants[0]?.size || "500g"}
        </h2>
        {isVerifiedBuyer && selectedBulkVariant ? (
          <p className="text-2xl font-bold text-[#4C632E] mt-1">
            ₹{selectedBulkVariant.bulkPrice}
            <span className="text-xs font-normal text-zinc-500 italic ml-1">
              per pack
            </span>
          </p>
        ) : (
          <p className="text-sm text-zinc-500 font-medium italic mt-1">
            {!isVerifiedBuyer ? "*GST required to view wholesale pricing" : "Pricing available on request"}
          </p>
        )}
      </div>

      {/* SELECT FORMAT (Bulk variants) */}
      {bulkVariants.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400">
            Select Format
          </h3>
          <div className="space-y-2">
            {bulkVariants.map((v, idx) => {
              const info = getBulkFormatInfo(v.size, idx);
              const isSelected = selectedBulkIdx === idx;
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedBulkIdx(idx)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold rounded-xl bg-white border transition-all text-left ${
                    isSelected
                      ? "border-[#D04636] ring-1 ring-[#D04636] text-[#D04636] shadow-sm"
                      : "border-zinc-200 text-zinc-700 hover:border-zinc-300"
                  }`}
                >
                  <div className="flex flex-col">
                    <span>{info.name}</span>
                    <span className="text-xs font-normal text-zinc-400 mt-0.5">
                      Price: {isVerifiedBuyer ? `₹${v.bulkPrice}` : (
                        <span className="inline-flex items-center gap-1 text-[#D04636] font-semibold">
                          <Lock className="w-2.5 h-2.5" />
                          <span className="blur-[3px] select-none">₹9,999</span>
                        </span>
                      )}
                    </span>
                  </div>
                  {info.badge}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SELECT SAMPLE SIZE */}
      {sampleVariants.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400">
            Select Sample Size
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {sampleVariants.map((v, idx) => {
              const info = getSampleFormatInfo(v.size, idx);
              const isSelected = selectedSampleIdx === idx;
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedSampleIdx(idx)}
                  className={`relative flex flex-col items-center justify-center py-4 px-2 text-center rounded-xl bg-white border transition-all ${
                    isSelected
                      ? "border-[#4C632E] ring-1 ring-[#4C632E] text-[#4C632E] shadow-sm"
                      : "border-zinc-200 text-zinc-700 hover:border-zinc-300"
                  }`}
                >
                  {info.isRecommended && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#4C632E] text-white text-[8px] font-bold px-1.5 py-0.5 rounded tracking-wide whitespace-nowrap">
                      Most Ordered
                    </span>
                  )}
                  <span className="text-sm font-bold text-zinc-800 leading-tight">
                    {v.size.replace(/[^0-9gkg]/gi, "")}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-medium mt-0.5 leading-none">
                    Sample Pack
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Call-to-Action Buttons */}
      <div className="space-y-3 pt-2">
        {/* Request Sample Kit Button */}
        <Link
          href={sampleCheckoutUrl}
          className="flex flex-col items-center justify-center w-full bg-[#D04636] hover:bg-[#B83C2D] text-white py-3.5 rounded-xl transition-all shadow-[0_4px_12px_rgba(208,70,54,0.15)] text-center group"
        >
          <div className="flex items-center justify-center gap-2 font-bold text-sm leading-none">
            <Package className="w-4 h-4" />
            <span>Request Sample Kit</span>
          </div>
          <span className="text-[10px] text-white/80 font-medium mt-1 group-hover:text-white transition-colors leading-none">
            Taste before you scale
          </span>
        </Link>

        {/* Wholesale pricing action */}
        {!isVerifiedBuyer ? (
          <button
            onClick={() => openAuthModal("login")}
            className="flex flex-col items-center justify-center w-full bg-[#3e4f25] hover:bg-[#4c632e] text-white py-3.5 rounded-xl transition-all text-center group shadow-md"
          >
            <div className="flex items-center justify-center gap-2 font-bold text-sm leading-none">
              <Lock className="w-4 h-4" />
              <span>Login to See Wholesale Pricing</span>
            </div>
            <span className="text-[10px] text-white/80 font-medium mt-1 leading-none">
              GST Registration Required
            </span>
          </button>
        ) : (
          <div className="space-y-3">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between border border-zinc-200 rounded-xl px-4 py-2.5 bg-[#FAF8F5]">
              <span className="text-xs font-semibold text-zinc-600">Bulk Quantity</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBulkQty((prev) => Math.max(minBulkQty, prev - 1))}
                  disabled={currentBulkQty <= minBulkQty}
                  className="w-8 h-8 rounded-lg border border-zinc-300 flex items-center justify-center font-bold text-zinc-600 bg-white hover:bg-zinc-50 active:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed select-none"
                >
                  -
                </button>
                <input
                  type="number"
                  min={minBulkQty}
                  value={currentBulkQty}
                  onChange={(e) => setBulkQty(Math.max(minBulkQty, parseInt(e.target.value) || minBulkQty))}
                  className="w-14 text-center rounded-lg border border-zinc-300 py-1 text-xs font-semibold text-zinc-900 focus:border-[#D04636] focus:ring-1 focus:ring-[#D04636] bg-white outline-none"
                />
                <button
                  type="button"
                  onClick={() => setBulkQty((prev) => Math.max(minBulkQty, prev + 1))}
                  className="w-8 h-8 rounded-lg border border-zinc-300 flex items-center justify-center font-bold text-zinc-600 bg-white hover:bg-zinc-50 active:bg-zinc-100 select-none"
                >
                  +
                </button>
              </div>
            </div>

            <Link
              href={bulkCheckoutUrl}
              className="flex flex-col items-center justify-center w-full bg-[#3e4f25] hover:bg-[#4c632e] text-white py-3.5 rounded-xl transition-all text-center group shadow-md"
            >
              <div className="font-bold text-sm leading-none flex items-center gap-1.5">
                <span>Place Bulk Order</span>
              </div>
              <span className="text-[10px] text-white/80 font-medium mt-1 leading-none">
                Proceed to Checkout ({currentBulkQty} {currentBulkQty === 1 ? "pack" : "packs"})
              </span>
            </Link>
          </div>
        )}

        {/* Chat on WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center w-full bg-[#FAF8F5] border border-zinc-200/80 hover:bg-zinc-100/50 py-3.5 rounded-xl transition-all text-center group"
        >
          <div className="flex items-center justify-center gap-2 font-bold text-sm leading-none text-zinc-800">
            <MessageSquare className="w-4 h-4 text-[#25D366] fill-[#25D366]/10" />
            <span>Chat on WhatsApp</span>
          </div>
          <span className="text-[10px] text-zinc-400 font-medium mt-1 leading-none">
            Quick response
          </span>
        </a>
      </div>

      {/* Trust Badges List */}
      <div className="border-t border-zinc-200 pt-6 space-y-3">
        {trustItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 text-xs font-semibold text-zinc-700 leading-none">
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.01)] border border-zinc-100 shrink-0">
              {item.icon}
            </div>
            <span>{item.text}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
