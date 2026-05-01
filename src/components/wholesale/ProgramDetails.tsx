const features = [
  {
    title: "Minimum Order Benefits",
    description: "Start with just 1 kg per SKU for standard wholesale, or 10 kg per SKU for enterprise pricing. No lock-in — order what you need, when you need it.",
    icon: (
      <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    title: "Lead Times",
    description: "Standard orders ship within 5–7 business days. Enterprise accounts receive priority dispatch within 2–3 days. Track your shipment in real time.",
    icon: (
      <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Packaging Options",
    description: "Choose from our standard bulk bags, nitrogen-sealed pouches, or custom private-label packaging to suit your brand. All packs comply with FSSAI regulations.",
    icon: (
      <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
  },
  {
    title: "Private Label",
    description: "Launch your own branded Japanese tea range. We handle sourcing, blending, and packaging while you build your brand. Available for enterprise accounts.",
    icon: (
      <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
];

export default function ProgramDetails() {
  return (
    <section className="bg-white py-24 border-y border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-zinc-100 text-zinc-500 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded mb-5">
            PROGRAMME DETAILS
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-4">
            Everything You Need to Know
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((f, idx) => (
            <div key={idx}>
              <div className="w-12 h-12 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mb-5">
                {f.icon}
              </div>
              <h3 className="text-sm font-bold text-zinc-900 mb-3">{f.title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
