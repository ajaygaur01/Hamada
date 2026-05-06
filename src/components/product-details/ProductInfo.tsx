import WishlistButton from "@/components/wishlist/WishlistButton";
import { Leaf, Clock, Package } from "lucide-react";

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
}: ProductInfoProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Top tags */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-widest uppercase text-brand-sage">
            {categoryTag}
          </span>
          {grade && (
            <>
              <span className="w-1 h-1 rounded-full bg-brand-sage" />
              <span className="text-zinc-600 text-[10px] uppercase tracking-wider font-semibold">
                {grade}
              </span>
            </>
          )}
        </div>
        <WishlistButton productId={productId} />
      </div>

      {/* Title */}
      <div className="space-y-4">
        <h1 className="font-heading text-4xl md:text-5xl text-[#3E4F25] leading-tight">
          {name}
        </h1>
        <p className="text-lg text-[#3E4F25]/80 font-medium leading-relaxed max-w-2xl">
          {shortDescription}
        </p>
      </div>

      {/* Full description block */}
      <div className="prose prose-zinc prose-p:leading-loose text-[#3E4F25]/80 border-l-2 border-[#d2e0c2] pl-6 my-8">
        <p>
          {fullDescription}
        </p>
      </div>

      {/* Best For */}
      {useCases.length > 0 && (
        <div>
          <h3 className="text-[10px] font-bold tracking-widest uppercase text-brand-sage mb-3">
            BEST FOR
          </h3>
          <div className="flex flex-wrap gap-2">
            {useCases.map((uc, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 bg-[#f0f4ea] text-brand-green text-xs font-semibold px-4 py-2 rounded-full border border-[#d2e0c2]/50">
                <Leaf size={12} strokeWidth={2.5} />
                {uc}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Available Formats */}
      {variantSizes.length > 0 && (
        <div className="pt-4 border-t border-[#d2e0c2]/50">
          <h3 className="text-[10px] font-bold tracking-widest uppercase text-brand-sage mb-3">
            AVAILABLE FORMATS
          </h3>
          <div className="flex flex-wrap gap-2">
            {variantSizes.map((size, i) => (
              <span key={i} className="bg-white/50 border border-[#d2e0c2] text-[#3E4F25] text-xs font-semibold px-4 py-2 rounded-lg backdrop-blur-sm shadow-sm">
                {size}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Storage & Shelf Life */}
      {(storageInstructions || shelfLife) && (
        <div className="flex flex-col sm:flex-row gap-6 pt-4 border-t border-[#d2e0c2]/50">
          {storageInstructions && (
            <div className="flex-1 bg-white/40 p-4 rounded-xl border border-[#d2e0c2]/50">
              <div className="flex items-center gap-2 mb-2">
                <Package size={14} className="text-brand-sage" />
                <p className="text-[10px] font-bold tracking-widest uppercase text-brand-sage">STORAGE</p>
              </div>
              <p className="text-sm text-[#3E4F25]/80 font-medium">{storageInstructions}</p>
            </div>
          )}
          {shelfLife && (
            <div className="flex-1 bg-white/40 p-4 rounded-xl border border-[#d2e0c2]/50">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={14} className="text-brand-sage" />
                <p className="text-[10px] font-bold tracking-widest uppercase text-brand-sage">SHELF LIFE</p>
              </div>
              <p className="text-sm text-[#3E4F25]/80 font-medium">{shelfLife}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
