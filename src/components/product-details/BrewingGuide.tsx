const steps = [
  {
    number: 1,
    title: "Measure & Sift",
    description: "Use a fine mesh sieve to sift 1-2 grams of matcha into your bowl. This creates a smoother texture.",
    icon: (
      <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
  },
  {
    number: 2,
    title: "Add Warm Water",
    description: "Pour 60-70ml of water heated to 80°C (176°F). Avoid boiling water as it can make the tea bitter.",
    icon: (
      <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    number: 3,
    title: "Whisk & Serve",
    description: "Using a bamboo whisk (chasen), whisk vigorously in a W or M motion until frothy. Enjoy immediately.",
    icon: (
      <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export default function BrewingGuide() {
  return (
    <section className="bg-zinc-50 py-20 border-t border-zinc-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 mb-3">
          BREWING GUIDE
        </p>
        <h2 className="text-2xl font-bold text-zinc-900 mb-16">
          How to Prepare
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step) => (
            <div key={step.number} className="relative flex flex-col items-center">
              {/* Icon Circle */}
              <div className="relative w-24 h-24 rounded-full bg-white border border-zinc-200 flex items-center justify-center mb-6 shadow-sm">
                {step.icon}
                {/* Step number badge */}
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-zinc-900 text-white text-[10px] font-bold flex items-center justify-center">
                  {step.number}
                </div>
              </div>
              
              <h3 className="text-sm font-semibold text-zinc-900 mb-3">
                {step.title}
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
