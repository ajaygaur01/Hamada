"use client";

import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";

interface ImageData {
  url: string;
  alt: string;
  isPrimary: boolean;
}

interface ImageGalleryProps {
  images: ImageData[];
  badge?: string | null;
}

export default function ImageGallery({ images, badge }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // If no images, show placeholder
  if (!images || images.length === 0) {
    return (
      <div className="relative h-[384px] w-full rounded-[6px] overflow-hidden bg-zinc-100 border border-zinc-200">
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

  // Ensure selectedIndex is within range
  const activeIndex = selectedIndex < images.length ? selectedIndex : 0;

  return (
    <div className="flex flex-row gap-3 h-[384px] w-full items-start">
      {/* Left Stack - Vertical Thumbnails (fixed width 72px, 72x72px items, 6px gap) */}
      {images.length > 1 && (
        <div className="flex flex-col gap-[6px] shrink-0 w-[72px] h-full overflow-y-auto no-scrollbar">
          {images.map((img, idx) => {
            const isCurrent = activeIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative w-[72px] h-[72px] rounded-[6px] overflow-hidden bg-zinc-50 border transition-all duration-200 shrink-0 cursor-pointer ${
                  isCurrent
                    ? "border-2 border-[#4C632E] shadow-sm"
                    : "border border-[#D4C9A8] opacity-70 hover:opacity-100 hover:border-zinc-400"
                }`}
              >
                <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
              </button>
            );
          })}
        </div>
      )}

      {/* Right Side - Main Hero Image (fills remaining width, same height as strip) */}
      <div className="relative h-full flex-grow rounded-[6px] overflow-hidden bg-[#FAF8F5] border border-zinc-200/80">
        <img
          src={images[activeIndex].url}
          alt={images[activeIndex].alt}
          className="w-full h-full object-cover transition-all duration-300"
        />

        {/* Top left badge */}
        {badge && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-[#C0392B] text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-[4px] shadow-sm select-none">
              {badge}
            </span>
          </div>
        )}

        {/* Bottom right zoom icon */}
        <div className="absolute bottom-4 right-4 z-10">
          <button 
            type="button" 
            className="bg-white text-zinc-700 hover:text-black p-2.5 rounded-full shadow-md flex items-center justify-center transition-colors cursor-pointer border border-zinc-100"
          >
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