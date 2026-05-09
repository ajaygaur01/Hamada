import Link from "next/link";

export default function WholesaleHero() {
  return (
    <section className="bg-zinc-900 py-24 sm:py-32 text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="inline-block bg-zinc-800 text-zinc-400 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded mb-8">
          WHOLESALE
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
          Wholesale Japanese Tea<br />for Indian Businesses
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-xl mx-auto mb-10">
          Partner with Kaori by Chiran to bring authentic Japanese tea directly from Kagoshima to your business. Flexible MOQs, competitive pricing, and pan-India wholesale delivery.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/contact"
            className="w-full sm:w-auto bg-white text-zinc-900 font-medium px-8 py-3.5 rounded text-sm hover:bg-white border border-[#D04636] text-[#D04636] transition-colors"
          >
            Email Contact
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto border border-zinc-700 text-white font-medium px-8 py-3.5 rounded text-sm hover:bg-[#B83C2D] transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
