import { ShieldCheck, Factory, Truck, Tag, Warehouse } from 'lucide-react';

const usps = [
  {
    icon: Factory,
    title: 'In-house matcha manufacturing',
    description: 'Authentic production controlled from our own facilities in Japan.',
  },
  {
    icon: ShieldCheck,
    title: 'Rigorous Quality Control',
    description: 'Strict testing protocols enforced in both India and Japan.',
  },
  {
    icon: Truck,
    title: 'Direct supply to India',
    description: 'Sourced and shipped directly to our clients with zero middlemen.',
  },
  {
    icon: Tag,
    title: 'White labelling solutions',
    description: 'Custom branding and packaging options in our local India unit.',
  },
  {
    icon: Warehouse,
    title: 'Stock maintenance in India',
    description: 'Local warehousing to ensure continuous, uninterrupted supply.',
  },
];

export default function USPBanner() {
  return (
    <section className="border-y border-zinc-200 bg-brand-cream py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#9AA958]">

        </p>
        <h2 className="mx-auto mb-12 max-w-3xl font-heading text-2xl font-bold text-brand-brown sm:text-3xl lg:text-4xl tracking-wider">
          END to END CONTROL
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 md:gap-6 justify-items-center">
          {usps.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center p-5 bg-white/40 backdrop-blur-xs rounded-xl border border-zinc-300/30 w-full hover:shadow-xs transition-shadow"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-green/10">
                <Icon className="h-6 w-6 text-brand-green" />
              </div>
              <h3 className="font-heading mb-2 text-sm font-bold text-brand-brown leading-snug">
                {title}
              </h3>
              <p className="text-xs leading-relaxed text-brand-brown/75">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

