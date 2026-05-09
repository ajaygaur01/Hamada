import Link from "next/link";

export default function WholesaleCTA() {
  return (
    <section className="bg-zinc-50 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Sample CTA (dark) */}
          <div className="bg-zinc-900 rounded-xl p-10 flex flex-col">
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Order a Sample to Get Started
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-8 flex-grow">
              Not ready to commit? Order sample packs of any of our teas and try
              them in your kitchen, cafe or restaurant before placing a full wholesale order.
            </p>
            <Link
              href="/products"
              className="inline-block bg-white text-zinc-900 font-medium px-6 py-3 rounded text-sm text-center hover:bg-white border border-[#D04636] text-[#D04636] transition-colors"
            >
              Order Samples
            </Link>
          </div>

          {/* Right: Custom Orders CTA (light) */}
          <div className="bg-white border border-zinc-200 rounded-xl p-10 flex flex-col">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-3">
              Contact Us for Custom Orders
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed mb-8 flex-grow">
              Need something unique? We&apos;re happy to discuss custom blends, private-label
              products, or large volume agreements. Reach out to our wholesale team directly.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-[#D04636] text-white font-medium px-6 py-3 rounded text-sm text-center hover:bg-[#B83C2D] transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
