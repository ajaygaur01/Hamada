"use client";

import { Leaf, MapPin, FileText, Package, Truck, Globe } from "lucide-react";

export default function ProductUtilityStrip() {
  const items = [
    { icon: <Leaf className="w-3.5 h-3.5 shrink-0" />, text: "Japan-grown" },
    { icon: <MapPin className="w-3.5 h-3.5 shrink-0" />, text: "Direct from Kagoshima" },
    { icon: <FileText className="w-3.5 h-3.5 shrink-0" />, text: "Export Documentation Included" },
    { icon: <Package className="w-3.5 h-3.5 shrink-0" />, text: "MOQ Friendly" },
    { icon: <Truck className="w-3.5 h-3.5 shrink-0" />, text: "Pan-India Supply" },
    { icon: <Globe className="w-3.5 h-3.5 shrink-0" />, text: "Ship Worldwide" },
  ];

  return (
    <div className="w-full bg-[#4C632E] text-white text-[12px] h-[36px] flex items-center overflow-x-auto whitespace-nowrap no-scrollbar sticky top-0 z-[51] md:static md:z-auto border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between md:justify-center w-full min-w-max md:min-w-0 gap-4 md:gap-6 lg:gap-8 h-full">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 h-full">
            <div className="flex items-center gap-2 font-medium tracking-wide">
              {item.icon}
              <span>{item.text}</span>
            </div>
            {idx < items.length - 1 && (
              <span className="text-white/20 font-light select-none text-[14px]">|</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
