"use client";

import { useState } from "react";

type TabId = "catalog" | "japanese" | "kagoshima";

const tabs: { id: TabId; label: string }[] = [
  { id: "catalog", label: "Our Products" },
  { id: "japanese", label: "Why Japanese Teas" },
  { id: "kagoshima", label: "Why Kagoshima Matcha" },
];

export default function ProductInfoTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("catalog");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
      <div className="flex flex-wrap gap-2 border-b border-[#d2e0c2] pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-[#D04636] text-white"
                : "bg-transparent border border-zinc-300 text-zinc-600 hover:border-[#D04636] hover:text-[#D04636]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "japanese" && (
        <div className="mt-6 max-w-3xl rounded-2xl border border-[#d2e0c2] bg-[#FAF9F6] p-6 sm:p-8">
          <h2 className="font-heading mb-3 text-2xl text-[#3E4F25]">
            Why Japanese Teas
          </h2>
          <div className="space-y-4 text-sm leading-relaxed text-brand-brown/80 sm:text-base">
            <p>
              Japanese teas are prized for their clarity of flavour, low bitterness,
              and the care taken at every stage — from shading and harvest timing to
              steaming and finishing.
            </p>
            <p>
              For cafés, hotels, and retail brands, that consistency translates into
              menus guests remember: vivid matcha, clean sencha, and roasted profiles
              that pair naturally with food and dairy.
            </p>
            <p>
              Hamada brings that standard to India with direct farm relationships,
              batch-level quality checks, and formats sized for real wholesale workflows.
            </p>
          </div>
        </div>
      )}

      {activeTab === "kagoshima" && (
        <div className="mt-6 max-w-3xl rounded-2xl border border-[#d2e0c2] bg-[#FAF9F6] p-6 sm:p-8">
          <h2 className="font-heading mb-3 text-2xl text-[#3E4F25]">
            Why Kagoshima Matcha
          </h2>
          <div className="space-y-4 text-sm leading-relaxed text-brand-brown/80 sm:text-base">
            <p>
              Kagoshima, at the southern tip of Japan&apos;s Kyushu island, is one of the
              country&apos;s most celebrated tea-growing regions. Volcanic Shirasu soil, coastal
              breezes, and ideal humidity create a microclimate that produces green tea with
              deep umami, low bitterness, and natural sweetness that&apos;s hard to replicate.
            </p>
            <p>
              Our Kagoshima farms benefit from cool Kirishima mists and daily humidity
              variance that help develop the vivid emerald hue and smooth character our
              partners build menus around.
            </p>
            <p>
              Home to some of the most progressive and sustainable tea farms in Japan,
              Kagoshima has become a favourite among traditional tea masters and contemporary
              brands alike — and the foundation of Hamada&apos;s matcha programme.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
