import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative flex min-h-[calc(100svh-5rem)] items-center justify-center overflow-hidden">
      <Image
        src="/banner2.avif"
        alt="Hamada tea landing banner"
        fill
        priority
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/45 via-black/40 to-black/55" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
        <span className="mb-5 inline-flex items-center rounded-full border border-white/35 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
          Sourced from Kagoshima, Japan
        </span>
        <h1 className="mx-auto mb-5 max-w-4xl text-balance text-4xl font-bold tracking-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.3)] sm:text-5xl lg:text-6xl">
          Premium Japanese Tea for Your Business
        </h1>
        <p className="mx-auto mb-9 max-w-2xl text-base text-white/90 sm:text-lg md:text-xl">
          Reliable wholesale supply, curated lots, and support for cafes, retailers, and hospitality teams.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/sample-order"
            className="inline-flex w-full items-center justify-center rounded-md bg-brand-red px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-red/30 transition-all hover:-translate-y-0.5 hover:bg-brand-red/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/75 sm:w-auto"
          >
            Order a Sample
          </Link>
          <Link
            href="/bulk-order"
            className="inline-flex w-full items-center justify-center rounded-md border border-white/70 bg-white/95 px-7 py-3 text-sm font-semibold text-brand-brown shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/75 sm:w-auto"
          >
            Place a Bulk Order
          </Link>
        </div>
      </div>
    </section>
  );
}
