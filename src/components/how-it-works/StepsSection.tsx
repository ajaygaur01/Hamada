import Link from "next/link";
import { Package, Users, ShoppingBag, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Order a Sample",
    description: "Experience the quality firsthand. Choose any tea, pay via UPI, and we'll deliver directly to your door with no account required.",
    icon: <Package className="w-8 h-8 text-[#D04636]" />,
  },
  {
    number: "02",
    title: "Test With Your Team",
    description: "The most important step. Share the samples with your chef or barista, brew under your service conditions, and select your favorites.",
    icon: <Users className="w-8 h-8 text-[#D04636]" />,
  },
  {
    number: "03",
    title: "Place Your Bulk Order",
    description: "Ready to scale? Create a verified business account with your GST details to unlock wholesale pricing and bulk quantities.",
    icon: <ShoppingBag className="w-8 h-8 text-[#D04636]" />,
  },
];

export default function StepsSection() {
  return (
    <section className="bg-[#FAF9F6] py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9AA958] mb-4">
            Our Process
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-[#3E4F25] mb-6">
            Simple, Transparent, Professional
          </h2>
          <div className="w-20 h-1 bg-[#D04636] mx-auto opacity-20"></div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-20 relative">
          
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/4 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-[#E2D9C5] to-transparent z-0"></div>

          {steps.map((step, idx) => (
            <div 
              key={step.number} 
              className="group relative z-10 flex flex-col items-center text-center p-8 lg:p-10 rounded-3xl bg-white border border-[#E2D9C5] shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(76,99,46,0.08)]"
            >
              {/* Step Number Badge */}
              <div className="absolute -top-4 right-8 bg-[#D04636] text-white text-[12px] font-bold px-3 py-1 rounded-full shadow-lg transform transition-transform group-hover:scale-110">
                Step {step.number}
              </div>

              {/* Icon Container */}
              <div className="relative mb-8">
                <div className="w-20 h-20 rounded-2xl bg-[#F5F0E8] flex items-center justify-center transition-transform duration-500 group-hover:rotate-[10deg]">
                  {step.icon}
                </div>
                <div className="absolute -inset-2 bg-[#D04636]/5 rounded-3xl -z-10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              <h3 className="font-heading text-xl text-[#3E4F25] mb-4 group-hover:text-[#D04636] transition-colors">
                {step.title}
              </h3>
              
              <p className="text-[14px] text-zinc-500 leading-relaxed max-w-[260px] mx-auto">
                {step.description}
              </p>

              {/* Connector dots for mobile */}
              {idx < steps.length - 1 && (
                <div className="md:hidden mt-8 w-1 h-8 border-r border-dashed border-[#E2D9C5]"></div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            href="/products"
            className="group inline-flex items-center gap-3 bg-[#D04636] text-white font-bold px-10 py-5 rounded-full text-[13px] tracking-widest uppercase hover:bg-[#B83C2D] transition-all hover:px-12 shadow-xl hover:shadow-[0_12px_24px_rgba(208,70,54,0.3)]"
          >
            Explore Catalog
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          
          <p className="mt-8 text-[12px] text-zinc-400 font-medium">
            Starting your wholesale journey has never been easier.
          </p>
        </div>
      </div>
    </section>
  );
}
