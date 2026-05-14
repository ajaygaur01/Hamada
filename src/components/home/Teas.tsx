import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import prisma from '@/lib/prisma';
import { pickHeroImageUrl, productCardImageInclude } from '@/lib/product-images';

const TEAS_SECTION_LIMIT = 4;

const teasProductInclude = {
  reviews: { select: { rating: true } },
  images: {
    ...productCardImageInclude,
    select: { image_url: true },
  },
} as const;

export default async function Teas() {
  // Featured first (up to 4), then fill with other active products so the grid is not a single card
  const featured = await prisma.product.findMany({
    where: { is_active: true, is_featured: true },
    include: teasProductInclude,
    take: TEAS_SECTION_LIMIT,
    orderBy: { created_at: "asc" },
  });

  const need = TEAS_SECTION_LIMIT - featured.length;
  const extras =
    need > 0
      ? await prisma.product.findMany({
          where: {
            is_active: true,
            id: { notIn: featured.map((p) => p.id) },
          },
          include: teasProductInclude,
          take: need,
          orderBy: { created_at: "asc" },
        })
      : [];

  const featuredProducts = [...featured, ...extras];

  return (
    <section className="bg-zinc-50 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">Featured Collection</p>
            <h2 className="text-2xl font-bold text-zinc-900 sm:text-3xl">Our Teas</h2>
          </div>
          <Link
            href="/products"
            className="hidden text-sm font-semibold text-zinc-700 transition-colors hover:text-zinc-900 sm:inline-flex sm:items-center sm:gap-1"
          >
            View all teas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => {
            const reviewCount = product.reviews.length;
            const averageRating = reviewCount > 0
              ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
              : 0;
            const category = product.name.split(' ')[0].toUpperCase();
            const imageSrc = pickHeroImageUrl(product.images);

            return (
              <div key={product.id} className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="relative aspect-4/3 overflow-hidden bg-zinc-100">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-zinc-300 text-xs uppercase tracking-widest">Product Image</div>
                  )}
                </div>

                <div className="px-4 pb-5 pt-4">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-400">
                    {category}
                  </p>
                  <h3 className="mb-2 line-clamp-2 min-h-10 text-base font-semibold text-zinc-900">
                    {product.name}
                  </h3>

                  {reviewCount > 0 ? (
                    <div className="mb-4 flex items-center gap-1.5">
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
                    <p className="mb-4 text-xs text-zinc-400">No reviews yet</p>
                  )}

                  <Link
                    href={`/products/${product.slug}`}
                    className="inline-flex items-center text-sm font-semibold text-zinc-900 transition-colors hover:text-zinc-600"
                  >
                    Order Sample
                    <ArrowRight className="ml-1 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-8 sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-700 transition-colors hover:text-zinc-900"
          >
            View all teas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
