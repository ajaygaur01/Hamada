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

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 md:gap-5 justify-center">
          {clientTypes.map((client, index) => {
            const Icon = client.icon;
            return (
              <div
                key={index}
                className="rounded-2xl bg-white/75 px-5 py-6 shadow-[0_6px_20px_rgba(76,99,46,0.08)] backdrop-blur-sm flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 hover:bg-white"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-green/10">
                  <Icon className="h-6 w-6 text-brand-green" />
                </div>
                <h4 className="font-heading text-sm font-semibold tracking-wide text-brand-brown">
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

