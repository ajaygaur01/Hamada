"use client";

import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";

export default function ImageGallery() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const thumbnails = [0, 1, 2, 3];

  return (
    <div className="space-y-3">
      
      {/* Main Image */}
      <div className="relative aspect-[3/4] w-full rounded-3xl 
                      overflow-hidden bg-[#2d3d1a]">
        
        {/* Texture overlay */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 20%, 
              #9aa958 0%, transparent 50%), 
              radial-gradient(circle at 80% 80%, 
              #4C632E 0%, transparent 40%)`
          }}
        />
        
        {/* Placeholder content */}
        <div className="absolute inset-0 flex flex-col 
                        items-center justify-center gap-3">
          <div className="w-16 h-16 rounded-full 
                          bg-[#E7DDC1]/10 border border-[#E7DDC1]/20
                          flex items-center justify-center">
            <ImageIcon 
              className="w-7 h-7 text-[#E7DDC1]/40" 
              strokeWidth={1} 
            />
          </div>
          <span className="text-[9px] font-bold tracking-[0.3em] 
                           uppercase text-[#E7DDC1]/30">
            Product Photo
          </span>
        </div>

        {/* Top left badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-[#9aa958] text-white text-[10px] 
                           font-bold tracking-widest uppercase 
                           px-3 py-1.5 rounded-full">
            Premium
          </span>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-2">
        {thumbnails.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={`relative aspect-square rounded-xl overflow-hidden
                        bg-[#2d3d1a] transition-all duration-200 ${
              selectedIndex === idx
                ? "ring-2 ring-[#4C632E] ring-offset-2 ring-offset-[#E7DDC1]"
                : "opacity-40 hover:opacity-70"
            }`}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon
                className="w-4 h-4 text-[#E7DDC1]/40"
                strokeWidth={1}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}