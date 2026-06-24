import { Coffee, Heart, Package, Gift, Store } from 'lucide-react';

const clientTypes = [
  {
    icon: Coffee,
    title: "Cafés & restaurants",
  },
  {
    icon: Heart,
    title: "Health & wellness brands",
  },
  {
    icon: Package,
    title: "Ingredient suppliers",
  },
  {
    icon: Gift,
    title: "Hospitality & gifting partners",
  },
  {
    icon: Store,
    title: "Gourmet retailers",
  }
];

export default function Features() {
  return (
    <section className="bg-[#4E3D33] py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Content Block */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-cream/80">
            Sourcing Simplified. Quality Assured.
          </p>
          <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl mb-4">
            Your B2B Partner in Japanese Tea
          </h2>
          <p className="text-sm sm:text-base md:text-lg leading-relaxed text-brand-cream/90">
            Whether you&apos;re launching a new menu or scaling your tea line, we ensure consistency, traceability, and full support from inquiry to delivery.
          </p>
        </div>

        {/* Sub-block Header */}
        <div className="mx-auto mb-8 text-center">
          <h3 className="font-heading text-lg font-bold uppercase tracking-[0.15em] text-white border-b border-white/10 pb-4 max-w-md mx-auto">
            Who Do We Work With?
          </h3>
        </div>

        {/* Minimal Categories (No Rectangle Box) */}
        <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-5 md:gap-x-8 mt-12 justify-center max-w-5xl mx-auto">
          {clientTypes.map((client, index) => {
            const Icon = client.icon;
            return (
              <div
                key={index}
                className="group flex flex-col items-center text-center transition-all duration-300 cursor-default"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-all duration-300 group-hover:border-brand-cream group-hover:bg-brand-cream/10 group-hover:text-white group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(250,249,246,0.15)]">
                  <Icon className="h-7 w-7 transition-transform duration-300" />
                </div>
                <h4 className="font-heading text-xs sm:text-sm font-semibold tracking-wider text-brand-cream/90 group-hover:text-white transition-colors uppercase max-w-[150px] leading-relaxed">
                  {client.title}
                </h4>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

