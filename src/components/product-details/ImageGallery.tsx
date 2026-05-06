"use client";

import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";

export default function ImageGallery() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const thumbnails = [0, 1, 2, 3];

  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      {/* Main Image */}
      <div className="relative bg-zinc-100 aspect-[4/5] sm:aspect-square w-full rounded-2xl overflow-hidden shadow-sm">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <ImageIcon className="w-16 h-16 text-zinc-300 mb-4" strokeWidth={1} />
          <span className="text-zinc-400 text-[10px] font-bold tracking-widest uppercase">
            Full-Width Natural Image
          </span>
          <p className="text-zinc-400 text-[10px] mt-2 max-w-[200px]">
            No white boxes. No floating cutouts.
          </p>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {thumbnails.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={`relative shrink-0 w-20 h-24 sm:w-24 sm:h-24 rounded-xl overflow-hidden transition-all duration-300 ${
              selectedIndex === idx 
                ? "ring-2 ring-brand-green ring-offset-2 ring-offset-brand-cream opacity-100" 
                : "opacity-60 hover:opacity-100"
            }`}
          >
            <div className="absolute inset-0 bg-zinc-200 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-zinc-400" strokeWidth={1.5} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
