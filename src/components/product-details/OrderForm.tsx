"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, Truck, Lock, ShieldCheck } from "lucide-react";
import { isBulkSize, isSampleSize } from "@/lib/tea-size";

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
  const sampleVariants = variants.filter((v) => isSampleSize(v.size));
  const bulkVariants = variants.filter((v) => isBulkSize(v.size));

  const sampleSizes =
    sampleVariants.length > 0 ? sampleVariants : variants.filter((v) => !isBulkSize(v.size));
  const bulkSizes =
    bulkVariants.length > 0 ? bulkVariants : variants.filter((v) => !isSampleSize(v.size));

  const [selectedSampleIdx, setSelectedSampleIdx] = useState(0);
  const [selectedBulkIdx, setSelectedBulkIdx] = useState(0);
  const [bulkQuantity, setBulkQuantity] = useState(bulkSizes[0]?.minBulkQuantity || 1);

  const selectedBulkVariant = bulkSizes[selectedBulkIdx];
  const minQty = selectedBulkVariant?.minBulkQuantity || 1;

  const bulkCheckoutUrl = selectedBulkVariant
    ? `/bulk-order/checkout?variant=${encodeURIComponent(selectedBulkVariant.id)}&qty=${bulkQuantity}`
    : `/bulk-order/checkout`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both items-start">
      
      {/* Sample Order Card */}
      <div className="bg-white rounded-2xl p-5 md:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-shadow duration-300 border border-[#e5e7eb] relative overflow-hidden flex flex-col">
        <div className="absolute -right-10 -top-10 text-[#f0f4ea] pointer-events-none">
          <Package size={120} strokeWidth={1} />
        </div>

        <div className="relative z-10 flex flex-col">
          <div className="flex justify-between items-start mb-5">
            <div>
              <h3 className="font-heading text-xl lg:text-2xl text-[#3E4F25] mb-1 leading-tight">Order a Sample</h3>
              <p className="text-xs md:text-sm text-[#3E4F25]/70 pr-2">Test with your team and menu. No account needed.</p>
            </div>
            <div className="bg-[#f0f4ea] text-[#3E4F25] p-1.5 md:p-2 rounded-full shrink-0">
              <Truck size={18} strokeWidth={1.5} />
            </div>
          </div>

          <div className="space-y-5 flex flex-col">
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
                         : "bg-white border-[#e5e7eb] text-[#3E4F25] hover:border-[#D04636] hover:text-[#D04636]"
                     }`}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>

            {sampleSizes[selectedSampleIdx] && (
              <div className="pt-2">
                <div className="flex items-end gap-2">
                  <span className="text-2xl lg:text-3xl font-bold text-[#3E4F25]">
                    ₹{sampleSizes[selectedSampleIdx].samplePrice.toLocaleString()}
                  </span>
                  <span className="text-xs lg:text-sm text-[#3E4F25]/70 font-medium mb-1 lg:mb-1.5">/ sample pack</span>
                </div>
              </div>
            )}

            <Link
              href={`/sample-order?product=${encodeURIComponent(productSlug)}&variant=${encodeURIComponent(sampleSizes[selectedSampleIdx]?.id ?? "")}`}
              className="flex items-center justify-center w-full bg-white text-[#D04636] border border-[#e5e7eb] hover:border-[#D04636] font-medium py-3 rounded-xl hover:bg-[#D04636] hover:text-white transition-all shadow-[0_2px_10px_rgba(0,0,0,0.03)] text-sm lg:text-base mt-2"
            >
              Order Sample
            </Link>
          </div>
        </div>
      </div>

      {/* Bulk Order Card */}
      <div className="bg-white rounded-2xl p-5 md:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-shadow duration-300 border border-[#e5e7eb] relative flex flex-col">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h3 className="font-heading text-xl lg:text-2xl text-[#3E4F25] mb-1 leading-tight">Place a Bulk Order</h3>
            <p className="text-xs md:text-sm text-[#3E4F25]/70 pr-2">For verified wholesale buyers.</p>
          </div>
          <div className="bg-[#f0f4ea] text-[#3E4F25] p-1.5 md:p-2 rounded-full shrink-0">
            <Lock size={18} strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-5 flex flex-col">
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
                      : "bg-white/50 border-[#e5e7eb] text-[#3E4F25]/70 hover:border-[#D04636] hover:text-[#D04636]"
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
            <div className="flex items-center gap-4 bg-white border border-[#e5e7eb] rounded-lg p-1 w-fit shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
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
              <p className="text-xs lg:text-sm text-[#3E4F25]/80 font-medium leading-tight">
                Bulk pricing available upon verification.
              </p>
            </div>
          )}

          <div className="pt-2 mt-2">
            <Link
              href={bulkCheckoutUrl}
              className="flex items-center justify-center gap-2 w-full bg-[#D04636] text-white font-medium py-3 rounded-xl hover:bg-[#B83C2D] transition-all shadow-[0_2px_10px_rgba(208,70,54,0.2)] text-sm lg:text-base px-2"
            >
              <ShieldCheck size={18} />
              Login to Verify
            </Link>
          </div>
        </div>
      </div>
      
    </div>
  );
}
