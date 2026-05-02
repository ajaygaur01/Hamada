import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import prisma from '@/lib/prisma';

export default async function Teas() {
  // Fetch featured products with their review stats
  const products = await prisma.product.findMany({
    where: { is_active: true, is_featured: true },
    include: {
      reviews: { select: { rating: true } },
    },
    take: 4,
    orderBy: { created_at: 'asc' },
  });

  // Fallback: if no featured products, just take first 4 active products
  const featuredProducts = products.length >= 1 ? products : await prisma.product.findMany({
    where: { is_active: true },
    include: {
      reviews: { select: { rating: true } },
    },
    take: 4,
    orderBy: { created_at: 'asc' },
  });

  return (
    <section className="bg-zinc-50 py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-zinc-900 mb-12">Our Teas</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => {
            const reviewCount = product.reviews.length;
            const averageRating = reviewCount > 0
              ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
              : 0;
            const category = product.name.split(' ')[0].toUpperCase();

            return (
              <div key={product.id} className="bg-white rounded-lg p-4 border border-zinc-100 shadow-sm hover:shadow-md transition-shadow group">
                {/* Image Placeholder */}
                <div className="bg-zinc-100 aspect-square rounded flex items-center justify-center mb-6">
                  <span className="text-zinc-400 text-xs font-medium tracking-widest uppercase">Image Placeholder</span>
                </div>
                
                {/* Content */}
                <div className="px-2 pb-2">
                  <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2">
                    {category}
                  </p>
                  <h3 className="text-sm font-semibold text-zinc-900 mb-1">
                    {product.name}
                  </h3>

                  {/* Star Rating */}
                  {reviewCount > 0 ? (
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

                  <Link 
                    href={`/products/${product.slug}`}
                    className="inline-flex items-center text-xs font-semibold text-zinc-900 hover:text-zinc-600 transition-colors"
                  >
                    Order Sample 
                    <ArrowRight className="ml-1 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
