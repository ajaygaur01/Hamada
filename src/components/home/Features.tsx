import { Leaf, Award, Truck } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: "Sourced from Kagoshima",
  },
  {
    icon: Award,
    title: "Quality Certified",
  },
  {
    icon: Truck,
    title: "Reliable Pan India Delivery",
  }
];

export default function Features() {
  return (
    <section className="bg-white py-24 border-y border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-zinc-100">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className={`flex flex-col items-center justify-center ${index !== 0 ? 'pt-12 md:pt-0' : ''}`}>
                <div className="bg-zinc-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-zinc-700" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-900 tracking-wide">
                  {feature.title}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
