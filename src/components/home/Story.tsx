import Image from "next/image";

export default function Story() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-sm">
            <Image
              src="/team.avif"
              alt="Hamada team standing together"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="max-w-xl">
            <div className="mb-5 inline-block rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
              Our Story
            </div>
            <h2 className="mb-5 text-3xl font-bold leading-tight text-zinc-900 md:text-4xl">
              40 Years of Japanese Tea Craftsmanship
            </h2>
            <div className="space-y-4 text-[15px] leading-relaxed text-zinc-600 sm:text-base">
              <p>
                Founded in 1975 in the heart of Kagoshima, Japan, Hamada Tea Co. has dedicated over four decades to perfecting the art of tea cultivation and processing.
              </p>
              <p>
                Our commitment to traditional methods, combined with modern quality control, ensures that every leaf delivers the authentic taste of Japan to your business. We partner with local farmers to bring you the finest matcha, sencha, and specialty blends, carefully nurtured in the rich volcanic soil of our region.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
