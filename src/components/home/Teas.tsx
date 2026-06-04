import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import prisma from '@/lib/prisma';
import { productCardImageInclude } from '@/lib/product-images';
import SampleSetsGrid from './SampleSetsGrid';

const teasProductInclude = {
  reviews: { select: { rating: true } },
  images: {
    ...productCardImageInclude,
    select: { image_url: true },
  },
  variants: {
    where: { is_active: true },
    select: {
      id: true,
      size: true,
      sample_price: true,
    },
    orderBy: { sample_price: 'asc' as const },
  },
} as const;

export default async function Teas() {
  const rawProducts = await prisma.product.findMany({
    where: {
      is_active: true,
      category: {
        slug: 'sample-sets',
      },
    },
    include: teasProductInclude,
    orderBy: { created_at: 'asc' },
  });

  const featuredProducts = rawProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    short_description: p.short_description,
    images: p.images.map((img) => ({ image_url: img.image_url })),
    variants: p.variants.map((v) => ({
      id: v.id,
      size: v.size,
      sample_price: Number(v.sample_price),
    })),
  }));

  return (
    <section className="bg-zinc-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#9AA958]">
            Wholesale Samples
          </span>
          <h2 className="font-heading text-3xl font-bold text-brand-brown sm:text-4xl">
            Start with a sample set
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-500 sm:text-base">
            Test our teas with your team and menu before committing to bulk. No account required.
          </p>
          <div className="mx-auto mt-4 h-0.5 w-16 bg-brand-red opacity-35" />
        </div>

        {/* Dynamic Client Grid */}
        <SampleSetsGrid products={featuredProducts} />
      </div>
    </section>
  );
}

