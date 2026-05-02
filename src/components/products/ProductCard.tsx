import Link from "next/link";
import WishlistButton from "@/components/wishlist/WishlistButton";

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  categoryName: string;
  useCases: string[];
  status: "Sample Available" | "On Request";
  averageRating?: number;
  reviewCount?: number;
}

export default function ProductCard({ id, slug, name, categoryName, useCases, status, averageRating, reviewCount }: ProductCardProps) {
  return (
    <div className="relative bg-white rounded-lg p-4 border border-zinc-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] flex flex-col h-full hover:shadow-md transition-shadow group">
      <div className="absolute right-3 top-3 z-10">
        <WishlistButton productId={id} />
      </div>
      <Link href={`/products/${slug}`} className="flex flex-col h-full">
        {/* Image Placeholder */}
        <div className="bg-zinc-100 aspect-4/3 rounded flex items-center justify-center mb-6">
          <span className="text-zinc-400 text-[10px] font-medium tracking-widest uppercase">Image Placeholder</span>
        </div>

        {/* Content */}
        <div className="grow flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400">
              {categoryName.toUpperCase()}
            </p>
            {status === "Sample Available" ? (
              <span className="bg-zinc-900 text-white text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
                Sample Available
              </span>
            ) : (
              <span className="bg-zinc-200 text-zinc-600 text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
                On Request
              </span>
            )}
          </div>

          <h3 className="text-sm font-semibold text-zinc-900 mb-1 grow group-hover:text-zinc-600 transition-colors">
            {name}
          </h3>

          {/* Star Rating */}
          {typeof averageRating === "number" && reviewCount !== undefined && reviewCount > 0 ? (
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className={`w-3.5 h-3.5 ${star <= Math.round(averageRating) ? "text-yellow-400 fill-current" : "text-zinc-200 fill-current"}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-[11px] text-zinc-500">{averageRating.toFixed(1)} ({reviewCount})</span>
            </div>
          ) : (
            <div className="mb-3" />
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-auto">
            {useCases.map((tag, i) => (
              <span key={i} className="border border-zinc-200 text-zinc-500 text-[10px] px-2 py-0.5 rounded-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}
