import WishlistButton from "@/components/wishlist/WishlistButton";
import { Clock, Package } from "lucide-react";

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
    <div className="space-y-7">

      {/* Category + Wishlist row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-[0.25em] 
                           uppercase text-[#9aa958]">
            {categoryTag}
          </span>
          {grade && (
            <>
              <span className="text-[#9aa958]/40 text-xs">·</span>
              <span className="text-[10px] font-bold tracking-[0.2em] 
                               uppercase text-[#3E4F25]/50">
                {grade}
              </span>
            </>
          )}
        </div>
        <WishlistButton productId={productId} />
      </div>

      {/* Title */}
      <div>
        <h1 className="font-heading text-[42px] leading-[1.1] 
                       text-[#3E4F25] mb-3">
          {name}
        </h1>
        <p className="text-base text-[#3E4F25]/60 leading-relaxed">
          {shortDescription}
        </p>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#d2c9b5]" />

      {/* Full description */}
      <p className="text-sm text-[#3E4F25]/70 leading-loose 
                    border-l-2 border-[#9aa958] pl-5">
        {fullDescription}
      </p>

      {/* Best For */}
      {useCases.length > 0 && (
        <div>
          <p className="text-[10px] font-bold tracking-[0.25em] 
                        uppercase text-[#9aa958] mb-3">
            Best For
          </p>
          <div className="flex flex-wrap gap-2">
            {useCases.map((uc, i) => (
              <span
                key={i}
                className="text-xs font-semibold text-[#4C632E] 
                           bg-[#4C632E]/8 border border-[#4C632E]/20
                           px-3 py-1.5 rounded-lg"
              >
                {uc}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Available Formats */}
      {variantSizes.length > 0 && (
        <div>
          <p className="text-[10px] font-bold tracking-[0.25em] 
                        uppercase text-[#9aa958] mb-3">
            Available Formats
          </p>
          <div className="flex flex-wrap gap-2">
            {variantSizes.map((size, i) => (
              <span
                key={i}
                className="text-xs font-bold text-[#3E4F25] 
                           border-2 border-[#3E4F25]/20
                           px-4 py-2 rounded-lg"
              >
                {size}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Storage + Shelf Life */}
      {(storageInstructions || shelfLife) && (
        <div className="grid grid-cols-2 gap-3 pt-2">
          {storageInstructions && (
            <div className="bg-[#4E3D33] rounded-2xl p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Package size={12} className="text-[#9aa958]" />
                <p className="text-[9px] font-bold tracking-[0.2em] 
                               uppercase text-[#9aa958]">
                  Storage
                </p>
              </div>
              <p className="text-sm text-[#E7DDC1]/80 font-medium 
                            leading-snug">
                {storageInstructions}
              </p>
            </div>
          )}
          {shelfLife && (
            <div className="bg-[#4E3D33] rounded-2xl p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Clock size={12} className="text-[#9aa958]" />
                <p className="text-[9px] font-bold tracking-[0.2em] 
                               uppercase text-[#9aa958]">
                  Shelf Life
                </p>
              </div>
              <p className="text-sm text-[#E7DDC1]/80 font-medium 
                            leading-snug">
                {shelfLife}
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}