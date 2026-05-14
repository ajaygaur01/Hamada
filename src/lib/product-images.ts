/**
 * Prisma relation args: hero images for cards — prefer primary, then display_order.
 * Avoid `where: { is_primary: true }` alone: legacy rows may have images but none marked primary.
 * `take` > 1 lets us skip blank URLs in `pickHeroImageUrl`.
 */
export const productCardImageInclude = {
  orderBy: [{ is_primary: "desc" as const }, { display_order: "asc" as const }],
  take: 8,
} as const;

/** First non-empty image_url after trim (handles stray blank rows). */
export function pickHeroImageUrl(images: { image_url: string }[]): string | null {
  for (const img of images) {
    const u = img.image_url?.trim();
    if (u) return u;
  }
  return null;
}

type GalleryImg = {
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  display_order: number | null;
};

/** Primary first, then display_order, for detail gallery + thumbnails */
export function sortProductImagesForGallery<T extends GalleryImg>(images: T[]): T[] {
  return [...images].sort((a, b) => {
    if (a.is_primary !== b.is_primary) {
      return Number(b.is_primary) - Number(a.is_primary);
    }
    return (a.display_order ?? 0) - (b.display_order ?? 0);
  });
}
