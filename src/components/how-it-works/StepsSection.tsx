import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Shading',
    description: 'Leaves are covered 4 weeks before harvest, intensifying chlorophyll and amino acids.',
  },
  {
    number: '02',
    title: 'Harvesting',
    description: 'Only the youngest two leaves and bud are selected by experienced pickers each May.',
  },
  {
    number: '03',
    title: 'Steaming & Drying',
    description: 'Immediate steaming halts oxidation. Slow drying locks in colour, aroma and nutrients.',
  },
  {
    number: '04',
    title: 'Blending',
    description: 'Batches are blended for colour, aroma, and consistency before final finishing.',
  },
  {
    number: '05',
    title: 'Milling',
    description: 'Granite mills rotate at 30 RPM to prevent heat build-up, preserving antioxidants.',
  },
];

export default function StepsSection() {
  return (
    <section className="bg-[#FAF9F6] py-20 sm:py-24 overflow-hidden border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9AA958] mb-4">
            The Process
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#3E4F25] mb-4">
            Our Craft Process
          </h2>
          <div className="w-20 h-0.5 bg-[#D04636] mx-auto opacity-35"></div>
        </div>

        {/* Infographic Layout */}
        <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between gap-12 md:gap-4 max-w-5xl mx-auto mb-16">
          
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-[40px] left-[10%] right-[10%] h-[2px] bg-zinc-200 z-0"></div>

          {steps.map((step, idx) => (
            <div 
              key={step.number} 
              className="group relative z-10 flex flex-col items-center text-center flex-1"
            >
              {/* Numbered Node */}
              <div className="w-20 h-20 rounded-full border-2 border-brand-green bg-white flex items-center justify-center font-bold text-lg text-brand-green shadow-xs transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-green group-hover:text-white">
                {step.number}
              </div>

              {/* Title & Description */}
              <h3 className="font-heading text-base font-bold text-[#3E4F25] mt-5 mb-2 group-hover:text-[#D04636] transition-colors">
                {step.title}
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed max-w-[180px] mx-auto">
                {step.description}
              </p>

              {/* Connector line for mobile */}
              {idx < steps.length - 1 && (
                <div className="md:hidden absolute top-[80px] bottom-[-48px] w-0.5 border-r-2 border-dashed border-zinc-200 z-0"></div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            href="/products"
            className="group inline-flex items-center gap-3 bg-[#D04636] text-white font-bold px-10 py-4.5 rounded-full text-[12px] tracking-widest uppercase hover:bg-[#B83C2D] transition-all hover:px-11 shadow-lg shadow-brand-red/20"
          >
            Explore Catalog
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

