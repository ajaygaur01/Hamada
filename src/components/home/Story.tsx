import Image from "next/image";
import Link from "next/link";

export default function Story() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-sm">
            <Image
              src="/aboutheading.jpg"
              alt="Hamada and farmer in tea fields"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="max-w-xl">
            <div className="mb-5 inline-block rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
              Unit of Hamada Tea Co Ltd
            </div>
            <h2 className="font-heading mb-5 text-3xl font-bold leading-tight text-zinc-900 md:text-4xl">
              Founded in Japan. Trusted in India.
            </h2>
            <div className="space-y-4 text-[15px] leading-relaxed text-zinc-600 sm:text-base">
              <p>
                Hamada Tea Co. has crafted premium teas for over 50 years, since 1975. Today, Hamada Global Trading Pvt. Ltd. carries that legacy forward to serve India&apos;s growing demand for clean, high-quality Japanese teas.
              </p>
            </div>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center justify-center rounded-lg bg-[#D04636] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#B83C2D]"
            >
              Know More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

