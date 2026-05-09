import Link from "next/link";
import WishlistButton from "@/components/wishlist/WishlistButton";
import { Star, ArrowRight } from "lucide-react";

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
  id, slug, name, categoryName, useCases, 
  status, startingPrice, averageRating, reviewCount
}: ProductCardProps) {
  return (
    <div className="relative group h-full">
      
      {/* Wishlist Button */}
      <div className="absolute right-3 top-3 z-20">
        <WishlistButton productId={id} />
      </div>

      <Link
        href={`/products/${slug}`}
        className="flex h-full flex-col rounded-2xl bg-[#FFFFFF] border border-[#e2d9c5] shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_32px_rgba(76,99,46,0.12)] overflow-hidden"
      >
        {/* Image */}
        <div className="relative w-full aspect-[3/2] bg-gradient-to-br from-[#f5f0e8] to-[#ede4d0] overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#9aa958]/60">
              Product Image
            </span>
          </div>
          {/* Status badge over image */}
          <div className="absolute bottom-3 left-3">
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold backdrop-blur-sm ${
              status === "Sample Available"
                ? "bg-[#4c632e]/90 text-white"
                : "bg-[#635233]/90 text-white"
            }`}>
              {status}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4">
          
          {/* Category */}
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#9aa958] mb-1.5">
            {categoryName}
          </p>

          {/* Product Name */}
          <h3 className="font-heading text-[18px] leading-snug text-[#3e4f25] mb-3 line-clamp-2 group-hover:text-[#4c632e] transition-colors">
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            {typeof averageRating === "number" && reviewCount && reviewCount > 0 ? (
              <>
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map((star) => (
                    <Star 
                      key={star} 
                      size={11} 
                      className={star <= Math.round(averageRating) 
                        ? "text-amber-400 fill-amber-400" 
                        : "text-zinc-300 fill-zinc-300"
                      } 
                    />
                  ))}
                </div>
                <span className="text-[11px] font-medium text-zinc-600">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-[11px] text-zinc-400">
                  ({reviewCount})
                </span>
              </>
            ) : (
              <span className="text-[11px] text-zinc-400 italic">
                No reviews yet
              </span>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {useCases.slice(0, 3).map((tag, i) => (
              <span 
                key={i} 
                className="rounded-full bg-[#f0f4ea] border border-[#d2e0c2] px-2.5 py-0.5 text-[10px] font-medium text-[#4c632e]"
              >
                {tag}
              </span>
            ))}
            {useCases.length > 3 && (
              <span className="rounded-full bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 text-[10px] font-medium text-zinc-500">
                +{useCases.length - 3}
              </span>
            )}
          </div>

          {/* Bottom Row - Price + CTA */}
          <div className="mt-auto flex items-center justify-between pt-3 border-t border-[#ede4d0]">
            {startingPrice !== undefined ? (
              <div>
                <p className="text-[10px] text-zinc-400 uppercase tracking-wider">
                  Samples from
                </p>
                <p className="text-[15px] font-bold text-[#3e4f25]">
                  ₹{startingPrice}
                </p>
              </div>
            ) : (
              <span className="text-[12px] text-zinc-400">
                Contact for pricing
              </span>
            )}

            <div className="flex items-center gap-1.5 rounded-full bg-[#4c632e] px-3 py-1.5 text-white text-[11px] font-semibold group-hover:bg-[#3e4f25] transition-colors">
              View
              <ArrowRight size={11} />
            </div>
          </div>

        </div>
      </Link>
    </div>
  );
}