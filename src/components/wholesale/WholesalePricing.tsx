import Link from "next/link";

export default function WholesalePricing() {
  return (
    <section className="bg-zinc-900 py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-zinc-800 text-zinc-400 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded mb-5">
            PRICING
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Wholesale Pricing
          </h2>
          <p className="text-sm text-zinc-400 max-w-2xl mx-auto">
            Transparent tiers so you know exactly what to expect from your first order to your thousandth.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Standard Plan */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                <svg className="w-4 h-4 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400">STANDARD</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Standard</h3>
            <p className="text-xs text-zinc-400 mb-8">For growing businesses</p>

            <ul className="space-y-3 mb-8">
              {[
                "MOQ: 1 kg per SKU",
                "Wholesale rates (up to 20% off)",
                "Standard lead time: 5–7 days",
                "Free delivery packaging",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-xs text-zinc-300">
                  <svg className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="/contact"
              className="block w-full text-center border border-zinc-600 text-white font-medium py-3 rounded text-sm hover:bg-zinc-700 transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Custom Plan */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400">ENTERPRISE</span>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-1">Custom</h3>
            <p className="text-xs text-zinc-500 mb-8">For large scale businesses</p>

            <ul className="space-y-3 mb-8">
              {[
                "MOQ: 10 kg per SKU",
                "Preferential bulk pricing",
                "Priority lead time: 2–3 days",
                "Private label available",
                "Dedicated account manager",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-xs text-zinc-700">
                  <svg className="w-4 h-4 text-zinc-900 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="/contact"
              className="block w-full text-center bg-zinc-900 text-white font-medium py-3 rounded text-sm hover:bg-zinc-800 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
