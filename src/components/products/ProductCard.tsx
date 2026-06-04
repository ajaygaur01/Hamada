"use client";

import Link from "next/link";
import WishlistButton from "@/components/wishlist/WishlistButton";
import { Star, ArrowRight, Lock } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { isSampleSize, isBulkSize } from "@/lib/tea-size";

interface Variant {
  id: string;
  size: string;
  samplePrice: number;
  bulkPrice: number;
}

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  categoryName: string;
  useCases: string[];
  imageUrl?: string | null;
  status: "Sample Available" | "On Request";
  startingPrice?: number;
  averageRating?: number;
  reviewCount?: number;
  variants: Variant[];
}

export default function ProductCard({
  id, slug, name, description, categoryName, useCases, imageUrl,
  status, startingPrice, averageRating, reviewCount, variants
}: ProductCardProps) {
  const { user, openAuthModal } = useAuth();
  const isVerifiedBuyer = user?.gstin_verified === true;

  // Separate variants
  const sampleVariants = (variants || []).filter((v) => isSampleSize(v.size));
  const bulkVariants = (variants || []).filter((v) => isBulkSize(v.size));
  const primarySampleVariant = sampleVariants[0] || (variants || [])[0];

  const isFlagship = slug === "ceremonial-matcha-a";

  return (
    <div className={`relative group h-full flex flex-col rounded-2xl bg-[#FFFFFF] transition-all duration-300 overflow-hidden ${
      isFlagship
        ? "border-2 border-[#4c632e] shadow-[0_8px_30px_rgba(76,99,46,0.12)] scale-[1.01] hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(76,99,46,0.18)]"
        : "border border-[#e2d9c5] shadow-sm hover:-translate-y-1.5 hover:shadow-[0_16px_32px_rgba(76,99,46,0.12)]"
    }`}>
      
      {/* Flagship Badge */}
      {isFlagship && (
        <div className="absolute left-3 top-3 z-30">
          <span className="bg-[#4c632e] text-white text-[8px] font-bold px-2 py-0.5 rounded tracking-wider uppercase shadow-sm">
            Flagship Grade
          </span>
        </div>
      )}

      {/* Wishlist Button */}
      <div className="absolute right-2.5 top-2.5 z-20">
        <WishlistButton productId={id} />
      </div>

      {/* Image & Status Badge Link */}
      <Link href={`/products/${slug}`} className="relative w-full aspect-[16/10] bg-gradient-to-br from-[#f5f0e8] to-[#ede4d0] overflow-hidden block">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#9aa958]/60">
              Product Image
            </span>
          </div>
        )}
        {/* Status badge over image */}
        <div className="absolute bottom-2.5 left-2.5">
          <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold backdrop-blur-sm ${
            status === "Sample Available"
              ? "bg-[#D04636]/90 text-white"
              : "bg-[#4E3D33]/90 text-white"
          }`}>
            {status}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3.5">
        
        {/* Category & Rating Row */}
        <div className="flex items-center justify-between mb-1">
          <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-[#9aa958]">
            {categoryName}
          </p>
          
          <div className="flex items-center gap-1">
            {typeof averageRating === "number" && reviewCount && reviewCount > 0 ? (
              <>
                <Star className="text-amber-400 fill-amber-400 w-3 h-3" />
                <span className="text-[10px] font-semibold text-zinc-700">
                  {averageRating.toFixed(1)} <span className="text-zinc-400 font-normal">({reviewCount})</span>
                </span>
              </>
            ) : (
              <span className="text-[9px] text-zinc-400 italic">No reviews</span>
            )}
          </div>
        </div>

        {/* Product Name Link */}
        <Link href={`/products/${slug}`}>
          <h3 className="font-heading text-[16px] leading-snug text-[#3e4f25] mb-1 hover:text-[#4c632e] transition-colors font-bold">
            {name}
          </h3>
        </Link>

        {/* Short Description */}
        {description && (
          <p className="text-[11px] text-zinc-500 line-clamp-2 mb-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-2.5">
          {useCases.slice(0, 3).map((tag, i) => (
            <span 
              key={i} 
              className="rounded bg-[#f0f4ea] px-1.5 py-0.5 text-[9px] font-medium text-[#4c632e]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Bulk Tiers List */}
        {bulkVariants.length > 0 && (
          <div className="mb-2.5 border-t border-[#ede4d0] pt-2.5">
            <p className="text-[8px] font-bold tracking-wider text-zinc-400 uppercase mb-1.5">
              Wholesale Bulk Tiers
            </p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
              {bulkVariants.slice(0, 4).map((v) => (
                <div key={v.id} className="flex items-center justify-between py-0.5 border-b border-zinc-100/50">
                  <span className="text-zinc-500 font-medium">{v.size}</span>
                  {isVerifiedBuyer ? (
                    <span className="font-bold text-[#3e4f25]">₹{v.bulkPrice}</span>
                  ) : (
                    <span className="flex items-center gap-0.5 text-[#D04636]" title="GST required to view pricing">
                      <Lock className="w-2.5 h-2.5 shrink-0" />
                      <span className="blur-[2px] select-none text-zinc-400">₹999</span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Row - Price + CTA */}
        <div className="mt-auto pt-2.5 border-t border-[#ede4d0] space-y-2.5">
          <div className="flex items-center justify-between">
            {primarySampleVariant ? (
              <div>
                <p className="text-[9px] text-zinc-400 uppercase tracking-wider leading-none">
                  Sample ({primarySampleVariant.size})
                </p>
                <p className="text-[14px] font-bold text-[#3e4f25] mt-1 leading-none">
                  ₹{primarySampleVariant.samplePrice}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-[9px] text-zinc-400 uppercase tracking-wider leading-none">
                  Price
                </p>
                <p className="text-[14px] font-bold text-[#3e4f25] mt-1 leading-none">
                  Contact Us
                </p>
              </div>
            )}

            <Link
              href={`/sample-order?product=${slug}${primarySampleVariant ? `&variant=${primarySampleVariant.id}` : ""}`}
              className="bg-white border border-zinc-300 hover:border-[#D04636] hover:text-[#D04636] text-zinc-700 py-1 px-2.5 rounded-full text-center text-[10px] font-bold transition-all shadow-xs"
            >
              Order Sample
            </Link>
          </div>

          {/* Wholesale Lock/Verified CTA */}
          {!isVerifiedBuyer ? (
            <div className="space-y-1.5 pt-2 border-t border-dashed border-[#ede4d0]">
              <div className="flex items-start gap-1 text-[8px] text-[#D04636] font-semibold leading-tight">
                <Lock className="w-2.5 h-2.5 shrink-0" />
                <span>*GST details required to login as a verified buyer.</span>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openAuthModal("login");
                }}
                className="w-full bg-[#D04636] hover:bg-[#B83C2D] text-white py-1.5 px-3 rounded-lg text-center text-[10px] font-bold transition-all shadow-xs flex items-center justify-center gap-1"
              >
                <Lock className="w-2.5 h-2.5" />
                Login to See Wholesale Pricing
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-dashed border-[#ede4d0]">
              <Link
                href={`/products/${slug}`}
                className="w-full bg-[#3e4f25] hover:bg-[#4c632e] text-white py-1.5 px-3 rounded-lg text-center text-[10px] font-bold transition-all flex items-center justify-center gap-1"
              >
                Place Bulk Order
                <ArrowRight className="w-2.5 h-2.5" />
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}