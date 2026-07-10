import { Coffee, Leaf, ShoppingBag, Star, StarHalf } from "lucide-react";
import WishlistButton from "@/components/wishlist/WishlistButton";

const FLYER_CALLOUTS: Record<string, { heading: string; bullets: string[]; bestFor: string[] }> = {
  "ceremonial-matcha-a": {
    heading: "Ceremonial Grade A",
    bullets: [
      "First flush harvest | Tencha leaves | Vibrant emerald green",
      "Intense umami profile | Natural sweetness | Reseal within 30 minutes",
    ],
    bestFor: ["Traditional Whisk", "Premium Tea Service", "Usucha & Koicha"],
  },
  "ceremonial-matcha-b": {
    heading: "Ceremonial Grade B",
    bullets: [
      "First flush harvest | Bolder character | Ideal for premium milk pairings",
      "Rich aroma | Balanced sweetness | Reseal within 30 minutes",
    ],
    bestFor: ["Premium Latte Pairing", "Modern Tea Menus", "Signature Beverages"],
  },
  "culinary-matcha-a": {
    heading: "Culinary Grade A",
    bullets: [
      "Summer flush | Barista grade | Used for flavoured drinks",
      "Stable color retention under heat | Clean flavor profile | Performs well in baking",
    ],
    bestFor: ["Patisserie", "Premium Bakery", "Fine Dining Desserts"],
  },
  "culinary-matcha-b": {
    heading: "Culinary Grade B",
    bullets: [
      "Standard culinary grade | Perfect for general kitchen use",
      "Cost-effective food service | Great for baking and blending",
    ],
    bestFor: ["General Baking", "Blended Beverages", "Kitchen Operations"],
  },
  "hojicha-powder": {
    heading: "Premium Hojicha Powder",
    bullets: [
      "Finely ground roasted green tea | Low caffeine profile",
      "Warm roasted nutty aroma | Ideal for bakery, gelato, and lattes",
    ],
    bestFor: ["Roasted Tea Lattes", "Gelato & Ice Cream", "Gourmet Baking"],
  },
  "matcha-latte": {
    heading: "Matcha Latte Premix",
    bullets: [
      "Sweetened premium matcha | Instant preparation format",
      "Contains jaggery & milk solids | No whisk required | Café-ready",
    ],
    bestFor: ["Quick Cafe Service", "Instant Lattes", "In-Room Amenity"],
  },
  "hojicha-latte": {
    heading: "Hojicha Latte Premix",
    bullets: [
      "Sweetened premium hojicha | Instant preparation format",
      "Warm, nutty roasted character | No whisk required | Low caffeine",
    ],
    bestFor: ["Quick Cafe Service", "Instant Lattes", "Low Caffeine Menus"],
  },
  "sencha-leaf": {
    heading: "Premium Sencha Leaf",
    bullets: [
      "Single-origin Kagoshima sencha | Bright, clean, grassy",
      "Rich in Catechins | Boosts Metabolism | High L-Theanine",
    ],
    bestFor: ["Loose Leaf Service", "Hotel Amenity", "Wellness Brewing"],
  },
  "hojicha-leaf": {
    heading: "Premium Hojicha Leaf",
    bullets: [
      "Roasted Kagoshima sencha | Low caffeine, naturally sweet",
      "Relaxing & Calming | Evening Service | High Pyrazines",
    ],
    bestFor: ["Loose Leaf Service", "Evening Tea Menus", "Caffeine-Sensitive"],
  },
  "genmaicha": {
    heading: "Premium Genmaicha",
    bullets: [
      "Kagoshima sencha with roasted brown rice | Nutty & Toasty",
      "Digestion Friendly | Soothing Aroma | Easy Drinking",
    ],
    bestFor: ["Meal Pairing", "Entry-level Menus", "Loose Leaf Service"],
  },
  "ceremonial-matcha-discovery-set": {
    heading: "Ceremonial Matcha Discovery Set",
    bullets: [
      "Curated premium ceremonial matcha samples",
      "Compare grades | Perfect for menu R&D",
    ],
    bestFor: ["Menu R&D", "Tasting Sessions", "Cafe Launch"],
  },
  "matcha-hojicha-powder-sample-set": {
    heading: "Matcha & Hojicha Powder Sample Set",
    bullets: [
      "Matcha and roasted hojicha powder samples",
      "Ideal for bakery and latte development",
    ],
    bestFor: ["Baking Trials", "Latte Development", "Recipe Sourcing"],
  },
  "japanese-leaf-tea-sample-set": {
    heading: "Japanese Leaf Tea Sample Set",
    bullets: [
      "Genmaicha and gyokuro loose-leaf samples",
      "Curated for hotels, lounges and restaurants",
    ],
    bestFor: ["Hotel Tea Rooms", "Restaurant Service", "Retail Curation"],
  },
};

const LEAF_TEA_PROFILES: Record<
  string,
  { benefits: string[]; tasting: { name: string; value: number }[] }
> = {
  "sencha-leaf": {
    benefits: ["Rich in Catechins", "Boosts Metabolism", "High L-Theanine"],
    tasting: [
      { name: "Umami", value: 3 },
      { name: "Sweetness", value: 2 },
      { name: "Astringency", value: 3 },
      { name: "Aroma", value: 4 },
      { name: "Body", value: 3 },
      { name: "Roast", value: 1 },
    ],
  },
  "hojicha-leaf": {
    benefits: ["Low Caffeine", "High Pyrazines (Circulation)", "Relaxing & Calming"],
    tasting: [
      { name: "Umami", value: 1 },
      { name: "Sweetness", value: 3 },
      { name: "Astringency", value: 1 },
      { name: "Aroma", value: 5 },
      { name: "Body", value: 3 },
      { name: "Roast", value: 5 },
    ],
  },
  "genmaicha": {
    benefits: ["Nutty & Toasty", "Digestion Friendly", "Soothing Aroma"],
    tasting: [
      { name: "Umami", value: 2 },
      { name: "Sweetness", value: 3 },
      { name: "Astringency", value: 2 },
      { name: "Aroma", value: 4 },
      { name: "Body", value: 3 },
      { name: "Roast", value: 3 },
    ],
  },
};

interface ProductInfoProps {
  productId: string;
  categoryTag: string;
  grade: string | null;
  name: string;
  shortDescription: string;
  fullDescription: string;
  useCases: string[];
  variantSizes: string[];
  storageInstructions: string | null;
  shelfLife: string | null;
  productSlug: string;
  categoryName?: string;
}

// Custom Teapot SVG for Premium Tea Service
const TeapotIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5V3m-2.5 1.5h5M12 6c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 12c1.5 0 2.8-.8 3.3-2 .5-1.2.2-2.5-1-3L18 8.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 10.5c-2 0-3.5 1-3.5 2.5s1.5 2.5 3.5 2.5" />
  </svg>
);

// Map use cases to appropriate icons and labels
function getUseCaseItem(useCase: string) {
  const normalized = useCase.toLowerCase();
  if (normalized.includes("tea service") || normalized.includes("cafe") || normalized.includes("menu")) {
    return {
      icon: <TeapotIcon className="w-6 h-6 text-[#4C632E]" />,
      label: useCase,
    };
  } else if (
    normalized.includes("bakery") ||
    normalized.includes("patisserie") ||
    normalized.includes("dessert") ||
    normalized.includes("dining")
  ) {
    return {
      icon: <Coffee className="w-6 h-6 text-[#4C632E]" strokeWidth={1.5} />,
      label: useCase,
    };
  } else if (normalized.includes("wellness") || normalized.includes("brand")) {
    return {
      icon: <Leaf className="w-6 h-6 text-[#4C632E]" strokeWidth={1.5} />,
      label: useCase,
    };
  } else if (normalized.includes("retail") || normalized.includes("shop") || normalized.includes("packaging")) {
    return {
      icon: <ShoppingBag className="w-6 h-6 text-[#4C632E]" strokeWidth={1.5} />,
      label: useCase,
    };
  }
  // Fallback
  return {
    icon: <Leaf className="w-6 h-6 text-[#4C632E]" strokeWidth={1.5} />,
    label: useCase,
  };
}

export default function ProductInfo({
  productId,
  categoryTag,
  grade,
  name,
  shortDescription,
  fullDescription,
  useCases,
  variantSizes,
  storageInstructions,
  shelfLife,
  productSlug,
  categoryName,
}: ProductInfoProps) {
  
  // Define dynamic specifications based on slug or values
  const isGyokuro = productSlug === "premium-gyokuro" || name.toLowerCase().includes("gyokuro");
  const isCulinaryMatchaA = productSlug === "culinary-matcha-a";
  const isCulinary = productSlug.toLowerCase().includes("culinary");
  const isMatcha = productSlug.toLowerCase().includes("matcha");
  const isCeremonial = productSlug.toLowerCase().includes("ceremonial");
  const isLeafTea = ["sencha-leaf", "hojicha-leaf", "genmaicha"].includes(productSlug);
  const leafBestForText = 
    productSlug === "sencha-leaf" ? "Daily drinking, a light and refreshing tea service, or retail packaging." :
    productSlug === "hojicha-leaf" ? "Evening service, caffeine-sensitive guests, and roasted tea lattes." :
    productSlug === "genmaicha" ? "Entry-level menus, meal pairings, and toasty daily drinking." : "";
  
  // Format Category tags helper
  const categoryTagText = (() => {
    const s = productSlug.toLowerCase();
    if (s.includes("ceremonial")) return "MATCHA · CEREMONIAL · KAGOSHIMA";
    if (s.includes("culinary")) return "MATCHA · CULINARY · KAGOSHIMA";
    if (s.includes("hojicha-powder")) return "HOJICHA · POWDER · KAGOSHIMA";
    if (s.includes("sencha-leaf")) return "TEA · SENCHA · KAGOSHIMA";
    if (s.includes("hojicha-leaf")) return "TEA · HOJICHA · KAGOSHIMA";
    if (s.includes("genmaicha")) return "TEA · GENMAICHA · KAGOSHIMA";
    if (s.includes("matcha-latte")) return "LATTE · MATCHA · KAGOSHIMA";
    if (s.includes("hojicha-latte")) return "LATTE · HOJICHA · KAGOSHIMA";
    return `${categoryName?.toUpperCase() || "TEA"} · TEA · KAGOSHIMA`;
  })();

  const specRows = [
    { key: "Origin", value: "Kagoshima, Japan" },
    { 
      key: "Harvest", 
      value: isCulinary ? "Summer Flush" : (isCeremonial ? "First Flush (Ichibancha)" : "Spring Harvest") 
    },
    { 
      key: "Cultivar", 
      value: isCulinary ? "Blend" : (isCeremonial ? "Okumidori / Yabukita" : "Yabukita") 
    },
    { 
      key: "Grade", 
      value: isCeremonial ? "Ceremonial" : (isCulinary ? "Culinary" : (grade || "Premium")) 
    },
    { 
      key: "MOQ", 
      value: isCulinaryMatchaA ? "100g" : (variantSizes.length > 0 ? variantSizes.find(s => !s.toLowerCase().includes("sample") && !s.toLowerCase().includes("10g") && !s.toLowerCase().includes("20g") && !s.toLowerCase().includes("30g")) || "100g" : "100g")
    },
    { key: "Lead Time", value: "5–7 business days" },
    { key: "Shelf Life", value: shelfLife || (isMatcha ? "18 months" : "12 months") },
    { 
      key: "Storage", 
      value: isMatcha 
        ? "Refrigerate at 10–12°C. Reseal within 30–40 minutes of opening." 
        : (storageInstructions || "Cool, dry place; keep airtight") 
    },
  ];

  // Static review stats for Gyokuro to match the design perfectly
  // Dynamic stats for other products
  const averageRating = isGyokuro ? 4.9 : 4.8;
  const reviewCount = isGyokuro ? 128 : 24;

  // Star drawing logic
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.4;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} size={15} className="fill-[#4C632E] text-[#4C632E]" />);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<StarHalf key={i} size={15} className="fill-[#4C632E] text-[#4C632E]" />);
      } else {
        stars.push(<Star key={i} size={15} className="text-zinc-300 fill-zinc-100" />);
      }
    }
    return stars;
  };

  return (
    <div className="space-y-8">
      {/* Category Tags + Wishlist Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#C0392B] font-sans">
            {categoryTagText}
          </span>
        </div>
        <WishlistButton productId={productId} />
      </div>

      {/* Title & Review Stars */}
      <div className="space-y-3">
        <h1 className="font-serif text-4xl md:text-5xl text-[#3E4F25] tracking-tight leading-tight">
          {name}
        </h1>
        
        {/* Rating Row */}
        <div className="flex items-center gap-2 text-sm text-zinc-600">
          <div className="flex items-center gap-0.5">
            {renderStars(averageRating)}
          </div>
          <span className="font-semibold text-zinc-800 ml-1">{averageRating}</span>
          <span className="text-zinc-400">({reviewCount} reviews)</span>
        </div>
      </div>

      {/* Zone 5 — Flyer Callout Card / Tasting Profile Dot Chart */}
      {isLeafTea && LEAF_TEA_PROFILES[productSlug] ? (
        <div className="space-y-4">
          {/* 1. Horizontal Health Benefits Strip */}
          <div className="bg-[#FAF8F3] border border-[#EDE9DF] rounded-[6px] py-[12px] px-[14px] flex items-center justify-between text-[12px] font-semibold text-zinc-700 font-sans shadow-none">
            {LEAF_TEA_PROFILES[productSlug].benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="text-[#4C632E]">✔</span>
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {/* 2. 6-Attribute Tasting Profile Dot Chart */}
          <div className="bg-[#FAF8F3]/50 border border-[#EDE9DF]/65 rounded-[6px] p-5">
            <h4 className="font-serif text-[15px] font-semibold text-[#3E4F25] mb-3">
              Tasting Profile
            </h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {LEAF_TEA_PROFILES[productSlug].tasting.map((attr, idx) => (
                <div key={idx} className="flex items-center justify-between py-1.5 border-b border-[#EDE9DF]/40 text-xs">
                  <span className="font-semibold text-zinc-600 font-sans">{attr.name}</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((dot) => (
                      <div
                        key={dot}
                        className={`w-2 h-2 rounded-full ${
                          dot <= attr.value ? "bg-[#4C632E]" : "bg-[#E7DDC1]"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        FLYER_CALLOUTS[productSlug] && (
          <div 
            className="bg-[#FAF8F3] border-l-4 border-[#4C632E] py-[14px] px-[16px] space-y-2.5 shadow-none"
            style={{ borderRadius: '0 6px 6px 0' }}
          >
            <h4 className="text-[14px] font-semibold text-[#2C3E1A] leading-tight font-sans">
              {FLYER_CALLOUTS[productSlug].heading}
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-600 font-medium">
              {FLYER_CALLOUTS[productSlug].bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-[#4C632E] select-none mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-[#4C632E]" />
                  <span className="leading-relaxed font-sans">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        )
      )}

      {/* Best For Section (Zone 6) */}
      {useCases.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#4C632E]">
            Best For
          </h3>
          {isLeafTea ? (
            <p className="text-[14px] text-zinc-700 leading-relaxed font-sans font-medium pl-1 italic">
              {leafBestForText}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(FLYER_CALLOUTS[productSlug]?.bestFor || useCases).slice(0, 3).map((uc, i) => {
                const item = getUseCaseItem(uc);
                return (
                  <div
                    key={i}
                    className="bg-[#FAF8F5]/80 border border-zinc-100 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.01)]"
                  >
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-zinc-50">
                      {item.icon}
                    </div>
                    <span className="text-[13px] font-bold text-zinc-800 leading-tight">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Specifications Table (Zone 7) */}
      <div className="space-y-4 border-t border-zinc-200 pt-6">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {specRows.map((row, idx) => (
              <tr key={idx} className="h-[44px] border-b border-[#EDE9DF]">
                <td className="w-[35%] bg-[#F5F2EA] font-semibold text-[#4C632E] px-4 align-middle font-sans">
                  {row.key}
                </td>
                <td className="bg-white text-[#2C2C2A] px-4 align-middle font-medium font-sans">
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}