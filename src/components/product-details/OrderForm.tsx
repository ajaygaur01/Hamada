"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, Truck, Lock, ShieldCheck } from "lucide-react";

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
  // Split variants into sample sizes and bulk sizes
  // Filter samples to only 10gm and 30gm as per user request
  const sampleVariants = variants.filter(v => 
    parseInt(v.size) <= 100 && (v.size.toLowerCase().includes("10g") || v.size.toLowerCase().includes("30g") || v.size === "10" || v.size === "30")
  );
  const bulkVariants = variants.filter(v => parseInt(v.size) > 100);

  const sampleSizes = sampleVariants.length > 0 ? sampleVariants : variants.filter(v => parseInt(v.size) <= 100);
  const bulkSizes = bulkVariants.length > 0 ? bulkVariants : variants;

  const [selectedSampleIdx, setSelectedSampleIdx] = useState(0);
  const [selectedBulkIdx, setSelectedBulkIdx] = useState(0);
  const [bulkQuantity, setBulkQuantity] = useState(bulkSizes[0]?.minBulkQuantity || 1);

  const selectedBulkVariant = bulkSizes[selectedBulkIdx];
  const minQty = selectedBulkVariant?.minBulkQuantity || 1;

  const bulkCheckoutUrl = selectedBulkVariant
    ? `/bulk-order/checkout?variant=${encodeURIComponent(selectedBulkVariant.id)}&qty=${bulkQuantity}`
    : `/bulk-order/checkout`;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both">
      
      {/* Sample Order Card */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#d2e0c2] relative overflow-hidden">
        {/* Soft decorative background element */}
        <div className="absolute -right-10 -top-10 text-[#f0f4ea] pointer-events-none">
          <Package size={120} strokeWidth={1} />
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-heading text-2xl text-[#3E4F25] mb-1">Order a Sample</h3>
              <p className="text-sm text-brand-sage">Test with your team and menu. No account needed.</p>
            </div>
            <div className="bg-[#f0f4ea] text-brand-green p-2 rounded-full">
              <Truck size={20} strokeWidth={1.5} />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-brand-sage mb-2">SELECT SIZE</p>
              <div className="flex flex-wrap gap-2">
                {sampleSizes.map((v, idx) => (
                  <button
                     key={v.id}
                     onClick={() => setSelectedSampleIdx(idx)}
                     className={`px-4 py-2 text-sm font-medium rounded-lg transition-all border ${
                       selectedSampleIdx === idx 
                         ? "bg-[#D04636] border-[#D04636] text-white shadow-sm" 
                         : "bg-white border-[#d2e0c2] text-[#3E4F25] hover:border-[#D04636] hover:text-[#D04636]"
                     }`}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>

            {sampleSizes[selectedSampleIdx] && (
              <div className="pt-4 pb-2">
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-[#3E4F25]">
                    ₹{sampleSizes[selectedSampleIdx].samplePrice.toLocaleString()}
                  </span>
                  <span className="text-sm text-brand-sage font-medium mb-1.5">/ sample pack</span>
                </div>
              </div>
            )}

            <Link
              href={`/sample-order?product=${encodeURIComponent(productSlug)}&variant=${encodeURIComponent(sampleSizes[selectedSampleIdx]?.id ?? "")}`}
              className="flex items-center justify-center w-full bg-[#D04636] text-white font-medium py-3.5 rounded-xl hover:bg-[#B83C2D] transition-colors shadow-sm"
            >
              Order Sample
            </Link>
          </div>
        </div>
      </div>

      {/* Bulk Order Card */}
      <div className="bg-brand-cream/50 rounded-2xl p-6 md:p-8 border border-[#d2e0c2] relative">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-heading text-2xl text-[#3E4F25] mb-1">Place a Bulk Order</h3>
            <p className="text-sm text-brand-sage">For verified wholesale buyers.</p>
          </div>
          <div className="bg-white text-brand-sage p-2 rounded-full border border-[#d2e0c2]">
            <Lock size={20} strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-brand-sage mb-2">SELECT SIZE</p>
            <div className="flex flex-wrap gap-2">
              {bulkSizes.map((v, idx) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedBulkIdx(idx);
                    setBulkQuantity(v.minBulkQuantity || 1);
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all border ${
                    selectedBulkIdx === idx 
                      ? "bg-white border-[#D04636] text-[#D04636] shadow-sm" 
                      : "bg-white/50 border-[#d2e0c2] text-[#3E4F25]/70 hover:border-[#D04636] hover:text-[#D04636]"
                  }`}
                >
                  {v.size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-2">
              <p className="text-[10px] font-bold tracking-widest uppercase text-brand-sage">QUANTITY</p>
              {minQty > 1 && (
                <p className="text-[10px] font-medium text-brand-sage">Minimum: {minQty} units</p>
              )}
            </div>
            <div className="flex items-center gap-4 bg-white border border-[#d2e0c2] rounded-lg p-1 w-fit shadow-sm">
              <button
                onClick={() => setBulkQuantity(Math.max(minQty, bulkQuantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-[#3E4F25] hover:bg-[#f0f4ea] rounded-md transition-colors"
              >
                −
              </button>
              <span className="w-12 text-center text-sm font-bold text-[#3E4F25]">
                {bulkQuantity}
              </span>
              <button
                onClick={() => setBulkQuantity(bulkQuantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-[#3E4F25] hover:bg-[#f0f4ea] rounded-md transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {selectedBulkVariant && (
            <div className="pt-2">
              <p className="text-sm text-[#3E4F25] font-medium">
                Bulk pricing available upon verification.
              </p>
            </div>
          )}

          <div className="pt-2">
            <Link
              href={bulkCheckoutUrl}
              className="flex items-center justify-center gap-2 w-full bg-[#D04636] text-white font-medium py-3.5 rounded-xl hover:bg-[#B83C2D] transition-colors shadow-sm"
            >
              <ShieldCheck size={18} />
              Login to Verify & Order
            </Link>
          </div>
        </div>
      </div>
      
    </div>
  );
}
