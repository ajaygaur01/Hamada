const steps = [
  {
    number: "01",
    title: "Measure & Sift",
    description: "Sift 1–2g of matcha through a fine mesh into your bowl. This ensures a silky, lump-free texture.",
    detail: "1–2g per serving",
  },
  {
    number: "02", 
    title: "Add Warm Water",
    description: "Pour 60–70ml of water at 80°C. Never use boiling water — it damages the delicate flavour compounds.",
    detail: "80°C · 60–70ml",
  },
  {
    number: "03",
    title: "Whisk & Serve",
    description: "Whisk in brisk W or M motions with a bamboo chasen until a fine foam forms. Serve immediately.",
    detail: "Serve fresh",
  },
];

export default function BrewingGuide() {
  return (
    <section className="py-24 bg-[#4E3D33]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end 
                        justify-between mb-16 gap-4">
          <div>
            <p className="text-[#9aa958] text-[10px] font-bold 
                          tracking-[0.25em] uppercase mb-3">
              PREPARATION
            </p>
            <h2 className="font-heading text-4xl md:text-5xl 
                           text-[#E7DDC1] leading-tight">
              How to Prepare
            </h2>
          </div>
          <p className="text-[#E7DDC1]/50 text-sm max-w-xs leading-relaxed">
            The Japanese way — precise, unhurried, and deeply satisfying.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px 
                        bg-[#E7DDC1]/10 rounded-2xl overflow-hidden">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className="bg-[#4E3D33] p-10 flex flex-col 
                         hover:bg-[#3e3028] transition-colors duration-300"
            >
              {/* Number */}
              <span className="font-heading text-[80px] leading-none 
                               text-[#E7DDC1]/10 mb-6 select-none">
                {step.number}
              </span>

              {/* Detail pill */}
              <span className="self-start bg-[#9aa958]/20 text-[#9aa958] 
                               text-[10px] font-bold tracking-widest 
                               uppercase px-3 py-1.5 rounded-full mb-6">
                {step.detail}
              </span>

              {/* Title */}
              <h3 className="font-heading text-xl text-[#E7DDC1] mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-[#E7DDC1]/55 text-sm leading-relaxed 
                            mt-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}