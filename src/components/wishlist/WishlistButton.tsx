"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

type Props = {
  productId: string;
  className?: string;
};

export default function WishlistButton({ productId, className }: Props) {
  const { user, openAuthModal } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadWishlistStatus() {
      if (!user) {
        setIsWishlisted(false);
        return;
      }

      const response = await fetch("/api/wishlist", { cache: "no-store" });
      if (!response.ok) return;
      const data = (await response.json()) as { items?: { productId: string }[] };
      setIsWishlisted(Boolean(data.items?.some((item) => item.productId === productId)));
    }

    void loadWishlistStatus();
  }, [productId, user]);

  async function toggleWishlist(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
      openAuthModal("login");
      return;
    }

    setIsSaving(true);
    try {
      if (isWishlisted) {
        const response = await fetch(`/api/wishlist/${productId}`, { method: "DELETE" });
        if (response.ok) setIsWishlisted(false);
      } else {
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        if (response.ok) setIsWishlisted(true);
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggleWishlist}
      disabled={isSaving}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={className ?? "rounded-full border border-zinc-200 bg-white p-2 text-zinc-600 hover:text-zinc-900"}
    >
      <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
    </button>
  );
}
