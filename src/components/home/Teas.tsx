import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import prisma from '@/lib/prisma';

const DUMMY_PRODUCT_IMAGE =
  "https://imgs.search.brave.com/gQdAjE-qYlp5B-yAhkkCBsnD8kqeE5IlpTKZrsXK5ns/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRpYS5pc3RvY2twaG90by5jb20vaWQvMTE4NTcxNTc5NS9waG90by9jdXAtb2YtdGVhLXdpdGgtbGVtb24tYW5kLWEtY3VwLW9mLWNvZmZlZS1vbi1hLXdvb2Rlbi1zdXJmYWNlLXRoZS1jaG9pY2UtYmV0d2Vlbi1jb2ZmZWUtYW5kLmpwZz9zPTYxMng2MTImdz0wJms9MjAmYz1uMHlmZkNGYmNCWmt2WFd4Q3VlOHdwWHdNd2Z5dThqTjBWYkluc19nbnpzPQ";

export default async function Teas() {
  // Fetch featured products with their review stats
  const products = await prisma.product.findMany({
    where: { is_active: true, is_featured: true },
    include: {
      reviews: { select: { rating: true } },
      images: {
        where: { is_primary: true },
        select: { image_url: true },
        take: 1,
      },
    },
    take: 4,
    orderBy: { created_at: 'asc' },
  });

  // Fallback: if no featured products, just take first 4 active products
  const featuredProducts = products.length >= 1 ? products : await prisma.product.findMany({
    where: { is_active: true },
    include: {
      reviews: { select: { rating: true } },
      images: {
        where: { is_primary: true },
        select: { image_url: true },
        take: 1,
      },
    },
    take: 4,
    orderBy: { created_at: 'asc' },
  });

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
            const imageSrc = DUMMY_PRODUCT_IMAGE;

            return (
              <div key={product.id} className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="relative aspect-4/3 overflow-hidden bg-zinc-100">
                  <img
                    src={imageSrc}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
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
