import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Order a Sample",
    description: "No account needed. Choose any tea, pay via UPI, delivered to your door.",
    icon: (
      <svg className="w-7 h-7 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Test With Your Team",
    description: "Try the items, share with your chef or barista, see what works.",
    icon: (
      <svg className="w-7 h-7 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Place Your Bulk Order",
    description: "Create a verified account with GST verification and order in bulk quantities.",
    icon: (
      <svg className="w-7 h-7 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
];

export default function StepsSection() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          {steps.map((step) => (
            <div key={step.number} className="text-center bg-zinc-50 rounded-xl p-8 border border-zinc-100">
              {/* Icon circle */}
              <div className="relative w-20 h-20 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto mb-6">
                {step.icon}
                {/* Number */}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-3xl font-bold text-zinc-200 select-none">
                  {step.number}
                </span>
              </div>

              <h3 className="text-sm font-bold text-zinc-900 mb-3">{step.title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed max-w-[220px] mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-[#D04636] text-white font-medium px-8 py-3.5 rounded text-sm hover:bg-[#B83C2D] transition-colors"
          >
            Browse Our Products
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
