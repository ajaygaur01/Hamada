import { Leaf, ShieldCheck, Globe2 } from "lucide-react";

const usps = [
  {
    icon: Globe2,
    title: "Founded in Japan. Trusted in India.",
    description: "Hamada Tea Co. heritage, served by Hamada Global Trading.",
  },
  {
    icon: Leaf,
    title: "50+ Years of Craft",
    description: "Premium teas refined since 1975 in Kagoshima.",
  },
  {
    icon: ShieldCheck,
    title: "Clean, Traceable Supply",
    description: "Batch-tested Japanese teas for dependable B2B sourcing.",
  },
];

export default function USPBanner() {
  return (
    <section className="border-y border-zinc-200 bg-brand-cream py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.18em] text-brand-brown/60">
          Our USP
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {usps.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center md:items-start md:text-left"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-brand-green/10">
                <Icon className="h-5 w-5 text-brand-green" />
              </div>
              <h3 className="font-heading mb-1 text-base text-brand-brown sm:text-lg">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-brand-brown/70">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
