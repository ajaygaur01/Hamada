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
      <div className="space-y-3">
        <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-zinc-100">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-zinc-200 flex items-center justify-center">
              <ImageIcon className="w-7 h-7 text-zinc-400" strokeWidth={1} />
            </div>
            <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-zinc-400">
              No Image Available
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-zinc-100">
        <img
          src={images[selectedIndex].url}
          alt={images[selectedIndex].alt}
          className="w-full h-full object-cover transition-all duration-300"
        />

        {/* Top left badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-[#D04636] text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">
            Premium
          </span>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative aspect-square rounded-xl overflow-hidden bg-zinc-100 transition-all duration-200 ${
                selectedIndex === idx
                  ? "ring-2 ring-[#D04636] ring-offset-2"
                  : "opacity-50 hover:opacity-80"
              }`}
            >
              <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}