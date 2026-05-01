"use client";

import { useState } from "react";

export default function ImageGallery() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const thumbnails = [0, 1, 2, 3, 4];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="bg-zinc-100 aspect-square rounded-lg flex items-center justify-center border border-zinc-200">
        <div className="text-center">
          <svg className="w-12 h-12 text-zinc-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-zinc-400 text-[10px] font-medium tracking-widest uppercase">Image Placeholder</span>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex space-x-3">
        {thumbnails.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={`w-16 h-16 rounded border flex items-center justify-center transition-all ${
              selectedIndex === idx 
                ? "border-zinc-900 ring-1 ring-zinc-900" 
                : "border-zinc-200 hover:border-zinc-400"
            }`}
          >
            <div className="bg-zinc-100 w-full h-full rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
