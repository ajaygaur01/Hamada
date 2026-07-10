const businesses = [
  {
    icon: (
      <svg className="w-7 h-7 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Cafes & Coffee Shops",
    description: "Offer your customers carefully sourced matcha, hojicha and more. Flexible blends available for cold and hot menus.",
  },
  {
    icon: (
      <svg className="w-7 h-7 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
      </svg>
    ),
    title: "Bakeries & Patisseries",
    description: "White-label matcha for cakes, croissants and desserts. Consistent quality and guaranteed freshness every delivery.",
  },
  {
    icon: (
      <svg className="w-7 h-7 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: "Hotels & Resorts",
    description: "Offer premium in-room and restaurant tea services, special Japanese tea menus, and branded tea amenities for your guests.",
  },
  {
    icon: (
      <svg className="w-7 h-7 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
    title: "Airlines & Lounges",
    description: "Premium teas for in-flight service and exclusive airport lounges. Compliant with all food safety and packaging regulations.",
  },
  {
    icon: (
      <svg className="w-7 h-7 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: "Wellness Studios",
    description: "Complement your wellness programs with premium Japanese teas. Perfect for yoga studios, spas, and health retreats.",
  },
  {
    icon: (
      <svg className="w-7 h-7 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    title: "Gourmet Retailers",
    description: "Stock authentic Japanese teas for discerning customers. Branded, shelf-ready packaging available for retail.",
  },
];

export default function BusinessTypes() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-zinc-100 text-zinc-500 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded mb-5">
            FOR EVERY BUSINESS
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-4">
            Perfect for Every Business
          </h2>
          <p className="text-sm text-zinc-500 max-w-2xl mx-auto">
            We supply to a wide range of Japanese tea businesses across India
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((b, idx) => (
            <div key={idx} className="border border-zinc-100 rounded-xl p-8 hover:border-zinc-300 transition-colors bg-zinc-50/50">
              <div className="w-14 h-14 rounded-full bg-white border border-zinc-200 flex items-center justify-center mb-6 shadow-sm">
                {b.icon}
              </div>
              <h3 className="text-sm font-bold text-zinc-900 mb-3">{b.title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
