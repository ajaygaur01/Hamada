export default function HowItWorksHeader() {
  return (
    <div className="relative overflow-hidden bg-[url('/how.avif')] bg-cover bg-center min-h-[290px] md:min-h-[340px] flex items-center text-center border-b border-zinc-200">
      <div className="absolute inset-0 bg-linear-to-b from-black/45 via-black/20 to-black/45" />
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="inline-block bg-white/25 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded mb-5 backdrop-blur-sm border border-white/30">
          PROCESS
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
          How It Works
        </h1>
        <p className="text-zinc-100/95 max-w-2xl mx-auto text-sm md:text-base drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
          From sample to bulk in three simple steps
        </p>
      </div>
    </div>
  );
}
