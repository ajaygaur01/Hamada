import Link from "next/link";
import WishlistButton from "@/components/wishlist/WishlistButton";
import { Star } from "lucide-react";

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  categoryName: string;
  useCases: string[];
  status: "Sample Available" | "On Request";
  startingPrice?: number;
  averageRating?: number;
  reviewCount?: number;
}

export default function ProductCard({ 
  id, slug, name, categoryName, useCases, status, startingPrice, averageRating, reviewCount 
}: ProductCardProps) {
  return (
    <div className="relative flex flex-col h-full group">
      <div className="absolute right-3 top-3 z-10">
        <WishlistButton productId={id} />
      </div>
      <Link href={`/products/${slug}`} className="flex flex-col h-full">
        {/* Image Placeholder */}
        <div className="bg-zinc-100 aspect-square sm:aspect-4/3 rounded-xl overflow-hidden flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-[1.02]">
          <span className="text-zinc-400 text-[10px] font-medium tracking-widest uppercase">Product Image</span>
        </div>

        {/* Content */}
        <div className="grow flex flex-col px-1">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-bold tracking-widest uppercase text-brand-sage">
              {categoryName}
            </p>
          </div>

          <h3 className="font-heading text-lg text-[#3E4F25] mb-1 grow group-hover:text-brand-green transition-colors">
            {name}
          </h3>

          <div className="flex items-center justify-between mt-2 mb-4">
            <div className="flex items-center gap-1.5">
              {typeof averageRating === "number" && reviewCount !== undefined && reviewCount > 0 ? (
                <>
                  <Star size={14} className="text-amber-500 fill-amber-500" />
                  <span className="text-xs font-medium text-zinc-600">{averageRating.toFixed(1)} <span className="text-zinc-400 font-normal">({reviewCount})</span></span>
                </>
              ) : (
                <span className="text-xs text-zinc-400">No reviews</span>
              )}
            </div>
            
            {startingPrice !== undefined && (
              <span className="text-sm font-semibold text-[#3E4F25]">
                Samples from ₹{startingPrice}
              </span>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {useCases.slice(0, 3).map((tag, i) => (
              <span key={i} className="bg-[#f0f4ea] text-brand-green text-[10px] font-medium px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
            {useCases.length > 3 && (
              <span className="bg-zinc-100 text-zinc-500 text-[10px] font-medium px-2 py-0.5 rounded-full">
                +{useCases.length - 3}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
