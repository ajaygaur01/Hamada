"use client";

import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";

interface ImageData {
  url: string;
  alt: string;
  isPrimary: boolean;
}

export default function ImageGallery({ images }: { images: ImageData[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // If no images, show placeholder
  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-zinc-100">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="w-16 h-16 rounded-full bg-zinc-200 flex items-center justify-center">
            <ImageIcon className="w-7 h-7 text-zinc-400" strokeWidth={1} />
          </div>
          <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-zinc-400">
            No Image Available
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Left Stack - Thumbnails (on mobile: horizontal row below main image) */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-x-visible shrink-0 md:w-20">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative aspect-square w-14 h-14 md:w-20 md:h-20 rounded-xl overflow-hidden bg-zinc-50 border transition-all duration-200 shrink-0 ${
                selectedIndex === idx
                  ? "border-[#4C632E] border-2 shadow-sm"
                  : "border-zinc-200 opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Right Side - Main Image */}
      <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#faf8f5] border border-zinc-100 flex-1">
        <img
          src={images[selectedIndex].url}
          alt={images[selectedIndex].alt}
          className="w-full h-full object-cover transition-all duration-300"
        />

        {/* Top left badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-[#D04636] text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-[4px]">
            Premium
          </span>
        </div>

        {/* Bottom right zoom icon */}
        <div className="absolute bottom-4 right-4">
          <button className="bg-white text-zinc-700 hover:text-black p-2.5 rounded-full shadow-md flex items-center justify-center transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637ZM10.5 7.5v6m3-3h-6"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}