import { Leaf, Award, Truck } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: "Sourced from Kagoshima",
    description: "Direct partner-farm sourcing from Japan's leading tea-growing region.",
  },
  {
    icon: Award,
    title: "Quality Certified",
    description: "Batch-level checks and certifications to maintain consistent quality.",
  },
  {
    icon: Truck,
    title: "Reliable Pan India Delivery",
    description: "Dependable dispatch workflows for repeat wholesale fulfillment.",
  }
];

export default function Features() {
  return (
    <section className="bg-[#4E3D33] py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-cream/80">
            Why Businesses Choose Hamada
          </p>
          <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
            Built for dependable B2B tea sourcing
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-3 md:gap-5">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="rounded-2xl bg-white/75 px-6 py-8 shadow-[0_6px_20px_rgba(76,99,46,0.08)] backdrop-blur-sm"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/10">
                  <Icon className="h-6 w-6 text-brand-green" />
                </div>
                <h3 className="font-heading mb-2 text-base font-semibold tracking-wide text-brand-brown">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-brand-brown/75">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
