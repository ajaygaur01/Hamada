"use client";

import Link from "next/link";
import { Heart, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { WishlistItem } from "../AccountPageClient";

interface WishlistSectionProps {
  wishlist: WishlistItem[];
  onRemove: (id: string) => void;
  loading: boolean;
}

export default function WishlistSection({ wishlist, onRemove, loading }: WishlistSectionProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#D04636]"></div>
        <p className="mt-4 text-zinc-500 font-medium">Loading your favorites...</p>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-20 bg-[#FAF9F6] rounded-3xl border border-dashed border-[#E2D9C5]">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Heart className="w-8 h-8 text-zinc-300" />
        </div>
        <h3 className="font-heading text-2xl text-[#3E4F25] mb-3">Your wishlist is empty</h3>
        <p className="text-zinc-500 max-w-xs mx-auto mb-8">
          Save items you love and they will appear here for easy access later.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-[#D04636] text-white px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#B83C2D] transition-all"
        >
          Browse Products
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-heading text-2xl text-[#3E4F25]">My Wishlist</h2>
        <span className="text-sm font-medium text-[#9AA958] bg-[#9AA958]/10 px-3 py-1 rounded-full">
          {wishlist.length} Items
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item) => (
          <div 
            key={item.id} 
            className="group bg-white rounded-2xl border border-[#E2D9C5] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
          >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-zinc-100">
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-300 text-[10px] font-bold uppercase tracking-widest">
                  No Image
                </div>
              )}
              
              <button 
                onClick={() => onRemove(item.id)}
                className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-white transition-all shadow-sm"
                title="Remove from wishlist"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-heading text-lg text-[#3E4F25] mb-1 line-clamp-1">
                {item.name}
              </h3>
              
              <div className="flex items-center justify-between mt-4">
                {item.price ? (
                  <div className="text-[#3E4F25] font-bold">
                    <span className="text-xs text-zinc-400 font-normal mr-1">from</span>
                    ₹{item.price}
                  </div>
                ) : (
                  <div className="text-xs text-zinc-400 italic">Contact for price</div>
                )}
                
                <Link 
                  href={`/products/${item.slug}`}
                  className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#D04636] hover:text-[#B83C2D] transition-colors"
                >
                  View Detail
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
