import Image from "next/image";

const partnerLogos = [
  { src: "/1.png", alt: "Trusted partner logo 1" },
  { src: "/2.png", alt: "Trusted partner logo 2" },
  { src: "/3.png", alt: "Trusted partner logo 3" },
  { src: "/4.png", alt: "Trusted partner logo 4" },
  { src: "/5.png", alt: "Trusted partner logo 5" },
];

export default function TrustedBy() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
          Partnerships
        </p>
        <h2 className="mx-auto mb-4 max-w-3xl text-2xl font-bold text-zinc-900 sm:text-3xl">
          Trusted by Cafes, Retailers & Hospitality Teams
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-sm text-zinc-600 sm:mb-12 sm:text-base">
          Long-term sourcing relationships built on consistency, quality, and dependable nationwide fulfillment.
        </p>

        <div className="mx-auto grid max-w-5xl grid-cols-2 place-items-center gap-x-7 gap-y-8 sm:grid-cols-3 md:grid-cols-5 md:gap-x-10">
          {partnerLogos.map((logo) => (
            <div
              key={logo.src}
              className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-100/80 p-2.5 shadow-[0_4px_14px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-100 sm:h-28 sm:w-28"
            >
              <div className="relative h-16 w-16 overflow-hidden rounded-full bg-white sm:h-20 sm:w-20">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  fill
                  sizes="80px"
                  className="object-cover opacity-90 transition-all duration-300 hover:opacity-100"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
