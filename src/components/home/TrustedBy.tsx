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
  return (
    <section className="bg-zinc-50/50 py-16 sm:py-20 border-t border-zinc-100">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
          Partnerships
        </p>
        <h2 className="mx-auto mb-4 max-w-3xl text-2xl font-bold text-zinc-900 sm:text-3xl">
          Trusted by India&apos;s leading premium brands
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-sm text-zinc-600 sm:mb-12 sm:text-base">
          Long-term sourcing relationships built on consistency, quality, and dependable nationwide fulfillment.
        </p>

        <div className="mx-auto flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-5xl">
          {premiumBrands.map((brand) => (
            <div
              key={brand.name}
              className="flex h-14 items-center justify-center rounded-lg border border-zinc-200/50 bg-white px-5 py-2 text-center shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-zinc-300"
            >
              <span className={`${brand.style} whitespace-nowrap`}>{brand.name}</span>
            </div>
          ))}
          <div className="flex h-14 items-center justify-center px-3 py-2 text-center">
            <span className="font-accent italic text-sm text-zinc-400 tracking-wide whitespace-nowrap">
              and more
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

