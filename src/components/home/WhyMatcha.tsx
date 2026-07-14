import { ShieldCheck, Sparkles, LayoutGrid, TrendingUp } from 'lucide-react';
import Image from 'next/image';

const pillars = [
  {
    icon: LayoutGrid,
    title: 'Versatile Ingredient',
    description: 'Perfect for traditional ceremonial service, custom café blends, pastries, and retail packaging.',
  },
  {
    icon: Sparkles,
    title: 'Nutrient-Dense Superfood',
    description: 'Rich in antioxidants (EGCG), L-Theanine for calm focus, and essential nutrients.',
  },
  {
    icon: ShieldCheck,
    title: 'Cross-Industry Applications',
    description: 'Crafted for cafes, retail brands, bakeries, beverage lines, and food businesses.',
  },
  {
    icon: TrendingUp,
    title: 'A Global Trend',
    description: 'Aligning with the global demand for clean, natural, energy-boosting alternatives.',
  },
];

export default function WhyMatcha() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#9AA958]">
            WHY MATCHA?
          </span>
          <h2 className="font-heading text-3xl font-bold text-brand-brown sm:text-4xl">
            Centuries of tradition, One vibrant green cup
          </h2>
          <div className="mx-auto mt-4 h-0.5 w-16 bg-brand-red opacity-35" />
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Column 1: 2x2 Grid of Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={index}
                  className="group rounded-2xl border border-zinc-100 bg-zinc-50/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg hover:border-brand-green/20"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading mb-2 text-base font-semibold tracking-wide text-brand-brown group-hover:text-brand-green transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-brand-brown/70">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Column 2: Matcha Bowl Image */}
          <div className="relative aspect-4/3 lg:aspect-square w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-sm max-w-lg mx-auto">
            <Image
              src="/HP 2.jpg"
              alt="Premium matcha bowl"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
