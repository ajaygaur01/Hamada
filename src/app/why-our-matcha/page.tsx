// src/app/why-our-matcha/page.tsx
// Enhanced B2B Landing Page — Refined Japanese Craft × Premium Wholesale

import Image from "next/image";

export const metadata = {
  title: "Why Our Matcha – Premium Japanese Tea for B2B",
  description:
    "Discover the unparalleled quality, sustainability, and heritage behind our matcha. Perfect for wholesale partners seeking elite Japanese tea.",
};

const stats = [
  { value: "50+", label: "Years of cultivation" },
  { value: "100%", label: "Organic certified" },
  { value: "48hr", label: "Farm to dispatch" },
  { value: "60+", label: "Wholesale partners" },
];

const benefits = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Rigorous Quality Assurance",
    body: "Every batch undergoes triple-stage testing for purity, colour vibrancy, and flavour consistency before it leaves Kagoshima.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5H6m0 0v4.5m0-4.5h12m-12 4.5h12" />
      </svg>
    ),
    title: "Scalable Supply Chain",
    body: "From boutique cafés to national retail chains — custom packaging, private labelling, and MOQs tailored to your growth stage.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
    title: "Transparent Provenance",
    body: "Each batch ships with a farm-origin certificate. Share the story of the leaf — your customers will reward you for it.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
    title: "Seasonal Harvest Previews",
    body: "Choose taste profiles of tea that works for your business based on seasonal harvests.",
  },
];

const process = [
  { step: "01", title: "Shading", desc: "Leaves are covered 4 weeks before harvest, intensifying chlorophyll and amino acids." },
  { step: "02", title: "Harvesting", desc: "Only the youngest two leaves and bud are selected by experienced pickers each May." },
  { step: "03", title: "Steaming & Drying", desc: "Immediate steaming halts oxidation. Slow drying locks in colour, aroma and nutrients." },
  { step: "04", title: "Blending", desc: "Batches are balanced for colour, aroma, and consistency before final finishing." },
  { step: "05", title: "Milling", desc: "prevents heat, producing fresh, green, antioxidant-rich matcha" },
];

export default function WhyOurMatcha() {
  return (
    <main className="min-h-screen bg-white text-gray-800 font-sans">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#4E3D33]">
        {/* Accent line top */}
        <div className="h-1 w-full bg-[#D04636]" />

        <div className="relative container mx-auto px-6 lg:px-16 py-16 lg:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Left copy */}
            <div className="lg:w-1/2 lg:pr-8">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="h-px w-8 bg-[#D04636]" />
                <span className="text-[#D04636] text-xs font-semibold tracking-[0.18em] uppercase">
                  B2B Wholesale Programme
                </span>
              </div>

              <h1
                className="font-heading text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-white leading-[1.1] mb-6"
                style={{ letterSpacing: "-0.02em" }}
              >
                Where Japanese
                <br />
                <span className="text-[#D04636]">craftsmanship</span>
                <br />
                meets your brand.
              </h1>

              <p className="text-lg text-[#E7DDC1] leading-relaxed mb-8 max-w-md">
                Sourced directly from the mist-clad fields of Kagoshima and stone-ground by fifth-generation artisans — matcha that earns its place on any premium shelf.
              </p>

              <ul className="space-y-3 mb-10">
                {[
                  // "100% organic, shade-grown tencha leaves",
                  // "Stone-ground at 30 RPM — antioxidants fully preserved",
                  // "Farm-origin traceability on every batch",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[#E7DDC1]">
                    <span className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-[#D04636] flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 4.707 7.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" />
                      </svg>
                    </span>
                    <span className="text-[0.95rem] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-[#D04636] hover:bg-[#B83C2D] text-white font-semibold py-3.5 px-7 rounded-lg transition-all duration-200 shadow-lg shadow-[#D04636]/20 text-sm tracking-wide"
                >
                  Request Wholesale Access
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <a
                  href="/catalogue"
                  className="inline-flex items-center justify-center gap-2 border border-[#E7DDC1]/30 hover:border-[#E7DDC1]/60 text-[#E7DDC1] hover:text-white font-medium py-3.5 px-7 rounded-lg transition-all duration-200 text-sm"
                >
                  Download Catalogue
                </a>
              </div>
            </div>

            {/* Right image */}
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative">
                {/* Decorative frame */}
                <div className="absolute -inset-3 border border-[#D04636]/30 rounded-2xl" />
                <div className="absolute -inset-6 border border-[#E7DDC1]/10 rounded-2xl" />
                <Image
                  src="/productbanner.avif"
                  alt="Premium matcha leaves from Kagoshima"
                  width={520}
                  height={520}
                  className="rounded-xl object-cover relative z-10"
                  style={{ boxShadow: "0 32px 64px rgba(0,0,0,0.4)" }}
                />
                {/* Floating badge */}
                {/* <div className="absolute -bottom-5 -left-5 z-20 bg-white rounded-xl px-5 py-4 shadow-xl">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Certified Organic</p>
                  <p className="text-[#4E3D33] font-bold text-sm">JAS · USDA · EU Organic</p>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STAT STRIP ───────────────────────────────────── */}
      <section className="bg-[#3A2D25] border-y border-[#D04636]/20">
        <div className="container mx-auto px-6 lg:px-16">
          {/* <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#E7DDC1]/10">
            {stats.map(({ value, label }) => (
              <div key={label} className="py-8 px-6 text-center">
                <p className="text-3xl font-bold text-[#D04636] mb-1">{value}</p>
                <p className="text-xs text-[#E7DDC1] opacity-70 uppercase tracking-widest">{label}</p>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* ── HERITAGE ─────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 mb-5">
                <span className="h-px w-8 bg-[#D04636]" />
                <span className="text-[#D04636] text-xs font-semibold tracking-[0.18em] uppercase">
                  Our Story
                </span>
              </div>
              <h2 className="font-heading text-4xl font-bold text-[#4E3D33] leading-tight mb-6" style={{ letterSpacing: "-0.02em" }}>
                A legacy honored<br />since 1975.
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4 text-[0.975rem]">
                The Hamada family has cultivated tea across five generations. Each refines the art of shading to capture what the leaf has to offer at its very best.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8 text-[0.975rem]">
                Our Kagoshima farms benefit from volcanic soil, cool mists, and daily humidity variance that produces the vivid emerald hue and smooth, buttery sweetness our partners have built menus around.
              </p>
              <blockquote className="border-l-4 border-[#D04636] pl-5 py-1">
                <p className="text-[#4E3D33] font-accent italic text-lg sm:text-xl leading-relaxed">
                  &ldquo;Partnering with us means inheriting a story that resonates with consumers who value authenticity.&rdquo;
                </p>
              </blockquote>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative">
                <Image
                  src="/about1.avif"
                  alt="Tea fields of Kagoshima"
                  width={640}
                  height={480}
                  className="rounded-2xl object-cover w-full"
                  style={{ boxShadow: "0 24px 48px rgba(78,61,51,0.15)" }}
                />
                {/* Year badge */}
                <div
                  className="absolute top-6 right-6 w-20 h-20 rounded-full flex flex-col items-center justify-center"
                  style={{ background: "#4E3D33" }}
                >
                  <span className="text-[#D04636] font-bold text-xl leading-none">50+</span>
                  <span className="text-[#E7DDC1] text-[10px] uppercase tracking-wider mt-0.5">years</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY KAGOSHIMA ─────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-[#FAF8F5]">
        <div className="container mx-auto px-6 lg:px-16 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Text Column */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 mb-5">
                <span className="h-px w-8 bg-[#D04636]" />
                <span className="text-[#D04636] text-xs font-semibold tracking-[0.18em] uppercase">
                  Why Kagoshima?
                </span>
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#4E3D33] mb-6" style={{ letterSpacing: "-0.02em" }}>
                Japan&apos;s celebrated tea-growing region
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-[0.975rem]">
                <p>
                  Kagoshima, located at the southern tip of Japan&apos;s Kyushu island, is one of the
                  country&apos;s most celebrated tea-growing regions. Volcanic soil, coastal breezes, and ideal
                  humidity create a microclimate that produces green tea with deep umami, low bitterness,
                  and a natural sweetness that&apos;s hard to replicate.
                </p>
                <p>
                  Home to some of the most progressive and sustainable tea farms in Japan, Kagoshima has
                  rapidly grown into a favorite among both traditional tea masters and contemporary tea
                  brands.
                </p>
              </div>
            </div>

            {/* Map Image Column */}
            <div className="lg:col-span-5 w-full flex justify-center">
              <div className="relative w-full max-w-md aspect-square overflow-hidden rounded-2xl border border-[#d2e0c2] bg-white shadow-lg shadow-[#4E3D33]/5 group">
                <Image
                  src="/map.avif"
                  alt="Kagoshima tea growing region map"
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(min-width: 1024px) 35vw, 100vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS ──────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-4 justify-center">
              <span className="h-px w-8 bg-[#D04636]" />
              <span className="text-[#D04636] text-xs font-semibold tracking-[0.18em] uppercase">Craft Process</span>
              <span className="h-px w-8 bg-[#D04636]" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-[#4E3D33]" style={{ letterSpacing: "-0.02em" }}>
              Shading → Harvesting → Steaming &amp; Drying → Blending → Milling
            </h2>
          </div>

          <div className="grid md:grid-cols-5 gap-0 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-px bg-[#D04636]/20" />

            {process.map(({ step, title, desc }) => (
              <div key={step} className="relative flex flex-col items-center text-center px-6 py-4">
                <div
                  className="relative z-10 w-16 h-16 rounded-full border-2 border-[#D04636] bg-white flex items-center justify-center mb-5"
                  style={{ boxShadow: "0 0 0 6px #FAF8F5" }}
                >
                  <span className="text-[#D04636] font-bold text-lg">{step}</span>
                </div>
                <h3 className="text-[#4E3D33] font-bold text-base mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS GRID ────────────────────────────────── */}
      <section className="pt-16 pb-12 md:pt-20 md:pb-16 bg-[#FAF8F5]">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
            {/* Left sticky heading */}
            <div className="lg:w-1/3 lg:sticky lg:top-24">
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="h-px w-8 bg-[#D04636]" />
                <span className="text-[#D04636] text-xs font-semibold tracking-[0.18em] uppercase">Why Partner</span>
              </div>
              <h2 className="font-heading text-3xl font-bold text-[#4E3D33] leading-tight mb-5" style={{ letterSpacing: "-0.02em" }}>
                Everything a serious wholesale partner needs.
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                We've built our operations around the demands of premium B2B buyers — from indie tea bars to national grocery chains.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#4E3D33] hover:bg-[#3A2D25] text-white text-sm font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Start a Conversation
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>

            {/* Right grid */}
            <div className="lg:w-2/3 grid sm:grid-cols-2 gap-5">
              {benefits.map(({ icon, title, body }) => (
                <div
                  key={title}
                  className="group p-6 rounded-xl border border-gray-100 hover:border-[#D04636]/30 bg-white hover:bg-[#FAF8F5] transition-all duration-200"
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
                >
                  <div className="w-11 h-11 rounded-lg bg-[#4E3D33]/5 group-hover:bg-[#D04636]/10 flex items-center justify-center mb-4 text-[#4E3D33] group-hover:text-[#D04636] transition-colors">
                    {icon}
                  </div>
                  <h3 className="font-semibold text-[#4E3D33] mb-2 text-[0.95rem]">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF STRIP ───────────────────────────── */}
      {/* <section className="pt-10 pb-12 md:pt-12 md:pb-16 bg-[#FAF8F5] border-y border-gray-100">
        <div className="container mx-auto px-6 lg:px-16 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-8">Trusted by premium partners across Asia-Pacific & Europe</p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-14 opacity-40">
            {["Partner Co.", "Tea House EU", "Café Chain JP", "Retail Group AU", "Specialty Foods UK"].map((name) => (
              <span key={name} className="text-[#4E3D33] font-semibold text-sm tracking-wide">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-[#4E3D33] relative overflow-hidden">
        <div className="relative container mx-auto px-6 lg:px-16 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 mb-6 justify-center">
            <span className="h-px w-8 bg-[#D04636]" />
            <span className="text-[#D04636] text-xs font-semibold tracking-[0.18em] uppercase">Get Started</span>
            <span className="h-px w-8 bg-[#D04636]" />
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-5 leading-tight" style={{ letterSpacing: "-0.02em" }}>
            Ready to elevate your offering with the finest Japanese matcha?
          </h2>
          <p className="text-[#E7DDC1] text-base mb-10 max-w-xl mx-auto leading-relaxed">
            Speak with our wholesale team, request a sample pack, or download the full product catalogue — no commitment required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-[#D04636] hover:bg-[#B83C2D] text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg shadow-[#D04636]/25 text-sm tracking-wide"
            >
              Request a Sample Pack
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="/catalogue"
              className="inline-flex items-center justify-center gap-2 border border-[#E7DDC1]/30 hover:border-[#E7DDC1]/60 text-[#E7DDC1] hover:text-white font-medium py-4 px-8 rounded-lg transition-all duration-200 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download Catalogue
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}