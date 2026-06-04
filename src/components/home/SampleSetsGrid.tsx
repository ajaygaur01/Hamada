'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';

interface Variant {
  id: string;
  size: string;
  sample_price: number | any;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  images: { image_url: string }[];
  variants: Variant[];
}

interface Props {
  products: Product[];
}

const DISPLAY_MAP: Record<string, { title: string; description: string }> = {
  'ceremonial-matcha-discovery-set': {
    title: 'Matcha Samples — 4 grades',
    description: 'Matcha samples of our regular house blends. Matcha Ceremonial Grade A, Ceremonial Grade B, Culinary Grade A',
  },
  'matcha-hojicha-powder-sample-set': {
    title: 'Matcha ceremonials + Hojicha Powder',
    description: 'Matcha samples of our ceremonial grades and dark roast Hojicha powder.',
  },
  'japanese-leaf-tea-sample-set': {
    title: 'Japanese Tea Samples (loose leaf)',
    description: 'Loose teas. Sencha, Hojicha, Genmaicha',
  },
};

export default function SampleSetsGrid({ products }: Props) {
  // Map product slug to its active variant ID
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    products.forEach((p) => {
      if (p.variants.length > 0) {
        initial[p.id] = p.variants[0].id;
      }
    });
    return initial;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* 3 Cards Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {products.map((product) => {
          const display = DISPLAY_MAP[product.slug] || {
            title: product.name,
            description: product.short_description,
          };

          const activeVariantId = selectedVariants[product.id];
          const activeVariant = product.variants.find((v) => v.id === activeVariantId) || product.variants[0];
          const isLeafSet = product.slug === 'japanese-leaf-tea-sample-set';

          return (
            <div
              key={product.id}
              className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              {/* Card Header & Description */}
              <div className="flex-grow">
                <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-[0.15em] text-[#9AA958]">
                  Sample Set
                </span>
                <h3 className="mb-3 font-heading text-lg font-bold text-zinc-900 leading-tight">
                  {display.title}
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-zinc-500">
                  {display.description}
                </p>
              </div>

              {/* Selector / Price Area */}
              <div className="mt-auto pt-6 border-t border-zinc-100">
                {/* Size Options Toggle */}
                {!isLeafSet && product.variants.length > 1 ? (
                  <div className="mb-5 flex flex-col gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Select Size
                    </span>
                    <div className="flex gap-2">
                      {product.variants.map((v) => (
                        <button
                          key={v.id}
                          onClick={() =>
                            setSelectedVariants((prev) => ({
                              ...prev,
                              [product.id]: v.id,
                            }))
                          }
                          className={`flex-1 rounded-lg border py-2 text-xs font-semibold transition-all cursor-pointer ${
                            activeVariantId === v.id
                              ? 'bg-brand-brown text-white border-brand-brown shadow-xs'
                              : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300'
                          }`}
                        >
                          {v.size}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Spacer/Placeholder for leaf tea set with single variant to maintain alignment */
                  <div className="mb-5 h-[53px] flex items-center">
                    <span className="text-xs font-medium text-zinc-400">
                      Standard loose leaf assortment
                    </span>
                  </div>
                )}

                {/* Price Display */}
                <div className="mb-5 flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Price
                  </span>
                  <span className="font-heading text-2xl font-bold text-brand-green">
                    ₹{activeVariant ? Number(activeVariant.sample_price) : 0}
                    <span className="text-xs font-normal text-zinc-500"> / set</span>
                  </span>
                </div>

                {/* CTA Order Button */}
                {activeVariant && (
                  <Link
                    href={`/sample-order?product=${product.slug}&variant=${activeVariant.id}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-red px-5 py-3 text-sm font-semibold text-white shadow-md shadow-brand-red/10 transition-all hover:bg-brand-red/90 hover:scale-[1.01]"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Order Sample Set
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* View Full Catalogue Bottom CTA */}
      <div className="mt-16 text-center">
        <Link
          href="/products"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-brand-brown hover:text-brand-brown/85 transition-colors border-b border-brand-brown pb-0.5"
        >
          View full catalogue
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
