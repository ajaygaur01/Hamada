"use client";

import { useState } from "react";
import Link from "next/link";

interface Variant {
  id: string;
  size: string;
  samplePrice: number;
  bulkPrice: number;
  minBulkQuantity: number;
}

interface OrderFormProps {
  variants: Variant[];
}

export default function OrderForm({ variants }: OrderFormProps) {
  // Split variants into sample sizes and bulk sizes
  const sampleVariants = variants.filter(v => {
    const num = parseInt(v.size);
    return num <= 100; // 10g, 30g, 100g are sample sizes
  });
  const bulkVariants = variants.filter(v => {
    const num = parseInt(v.size);
    return num > 100; // 500g, 1kg are bulk sizes
  });

  // If no split makes sense, show all in both
  const sampleSizes = sampleVariants.length > 0 ? sampleVariants : variants;
  const bulkSizes = bulkVariants.length > 0 ? bulkVariants : variants;

  const [selectedSampleIdx, setSelectedSampleIdx] = useState(0);
  const [selectedBulkIdx, setSelectedBulkIdx] = useState(0);
  const [bulkQuantity, setBulkQuantity] = useState(1);

  const selectedBulk = bulkSizes[selectedBulkIdx];

  return (
    <div className="space-y-6">
      {/* Sample Order Card */}
      <div className="border border-zinc-200 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-bold text-zinc-900">Order a Sample</h3>
          <span className="text-[10px] text-zinc-400 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            No account needed
          </span>
        </div>

        <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 mb-3">SELECT SIZE</p>
        <div className="flex gap-2 mb-6">
          {sampleSizes.map((v, idx) => (
            <button
              key={v.id}
              onClick={() => setSelectedSampleIdx(idx)}
              className={`px-4 py-2 text-xs font-medium rounded transition-colors ${
                selectedSampleIdx === idx
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              {v.size}
            </button>
          ))}
        </div>

        <button className="w-full bg-zinc-900 text-white font-medium py-3 rounded text-sm hover:bg-zinc-800 transition-colors">
          Order Sample
        </button>
      </div>

      {/* Bulk Order Card */}
      <div className="border border-zinc-200 rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-bold text-zinc-900">Place a Bulk Order</h3>
          <Link href="/login" className="text-[10px] text-zinc-400 flex items-center gap-1 hover:text-zinc-600 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Login required
          </Link>
        </div>

        <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 mb-3">SELECT SIZE</p>
        <div className="flex gap-2 mb-6">
          {bulkSizes.map((v, idx) => (
            <button
              key={v.id}
              onClick={() => setSelectedBulkIdx(idx)}
              className={`px-4 py-2 text-xs font-medium rounded transition-colors ${
                selectedBulkIdx === idx
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              {v.size}
            </button>
          ))}
        </div>

        <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 mb-3">QUANTITY</p>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center border border-zinc-200 rounded">
            <button
              onClick={() => setBulkQuantity(Math.max(1, bulkQuantity - 1))}
              className="px-3 py-2 text-zinc-500 hover:text-zinc-900 transition-colors text-sm"
            >
              −
            </button>
            <span className="px-4 py-2 text-sm font-medium text-zinc-900 border-x border-zinc-200 min-w-[40px] text-center">
              {bulkQuantity}
            </span>
            <button
              onClick={() => setBulkQuantity(bulkQuantity + 1)}
              className="px-3 py-2 text-zinc-500 hover:text-zinc-900 transition-colors text-sm"
            >
              +
            </button>
          </div>
          <span className="text-xs text-zinc-400">units</span>
        </div>

        <Link 
          href="/login"
          className="block w-full bg-zinc-200 text-zinc-700 font-medium py-3 rounded text-sm text-center hover:bg-zinc-300 transition-colors"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Login to Order Bulk
          </span>
        </Link>
      </div>
    </div>
  );
}
