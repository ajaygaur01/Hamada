import Image from 'next/image';

const premiumBrands = [
  { name: 'Foodstories', style: 'font-serif tracking-wider text-lg font-semibold text-stone-800' },
  { name: 'Modern Bazaar', style: 'font-sans uppercase tracking-[0.15em] text-xs font-bold text-stone-900' },
  { name: 'Sekai Ichiba', style: 'font-serif italic tracking-widest text-base font-bold text-stone-800' },
  { name: 'Tata Consumer Products', style: 'font-sans font-bold tracking-tight text-[10px] uppercase text-stone-900' },
  { name: 'Coffeeza', style: 'font-sans font-black tracking-[0.2em] text-xs uppercase text-stone-800' },
  { name: 'CoCo Curry House', style: 'font-sans font-bold uppercase tracking-wider text-[11px] text-stone-800' },
  { name: 'BoJee cafe', style: 'font-serif italic tracking-wide text-base text-stone-700' },
  { name: 'Bakebook Baker', style: 'font-sans tracking-widest uppercase text-[10px] font-semibold text-stone-700' },
];

export default function TrustedBy() {
  const marqueeItems = [
    ...premiumBrands,
    { name: 'and more', style: 'font-accent italic text-sm text-zinc-400 tracking-wide' }
  ];

  return (
    <section className="bg-zinc-50/30 py-20 sm:py-24 border-t border-zinc-100/80 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D04636] font-sans">
          Partnerships
        </p>
        <h2 className="mx-auto mb-4 max-w-3xl font-heading text-3xl font-bold text-[#4E3D33] tracking-tight sm:text-4xl">
          Trusted by India&apos;s leading premium brands
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-sm text-zinc-500 sm:text-base leading-relaxed">
          Long-term sourcing relationships built on consistency, quality, and dependable nationwide fulfillment.
        </p>

        {/* Scrolling Marquee Container */}
        <div className="relative w-full overflow-hidden py-6">
          {/* Edge Fades for Premium look */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-zinc-50 via-zinc-50/50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-zinc-50 via-zinc-50/50 to-transparent z-10 pointer-events-none" />

          {/* Scrolling track */}
          <div className="flex gap-8 animate-marquee-reverse">
            {/* Set 1 */}
            <div className="flex items-center gap-8 shrink-0">
              {marqueeItems.map((brand, idx) => (
                <div
                  key={`set1-${idx}`}
                  className={`flex h-16 items-center justify-center rounded-2xl ${
                    brand.name === 'and more'
                      ? 'px-6 py-2 bg-transparent text-stone-400 font-accent italic text-sm'
                      : 'border border-zinc-200/40 bg-white/70 backdrop-blur-md px-8 py-3.5 text-center shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_24px_rgba(208,70,54,0.06)] hover:border-[#D04636]/20 transition-all duration-500 hover:-translate-y-1 hover:bg-white'
                  }`}
                >
                  <span className={`${brand.style} whitespace-nowrap`}>{brand.name}</span>
                </div>
              ))}
            </div>

            {/* Set 2 (Duplicate for infinite seamless looping) */}
            <div className="flex items-center gap-8 shrink-0">
              {marqueeItems.map((brand, idx) => (
                <div
                  key={`set2-${idx}`}
                  className={`flex h-16 items-center justify-center rounded-2xl ${
                    brand.name === 'and more'
                      ? 'px-6 py-2 bg-transparent text-stone-400 font-accent italic text-sm'
                      : 'border border-zinc-200/40 bg-white/70 backdrop-blur-md px-8 py-3.5 text-center shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_24px_rgba(208,70,54,0.06)] hover:border-[#D04636]/20 transition-all duration-500 hover:-translate-y-1 hover:bg-white'
                  }`}
                >
                  <span className={`${brand.style} whitespace-nowrap`}>{brand.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

