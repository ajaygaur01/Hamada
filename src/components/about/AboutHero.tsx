export default function AboutHero() {
  return (
    <div className="relative overflow-hidden bg-[url('/aboutheading.jpg')] bg-cover bg-center min-h-[290px] md:min-h-[340px] flex items-center text-center border-b border-zinc-200">
      <div className="absolute inset-0 bg-linear-to-b from-black/45 via-black/20 to-black/45" />
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="inline-block bg-white/25 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded mb-5 backdrop-blur-sm border border-white/30">
          OUR HISTORY
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-white max-w-3xl mx-auto leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
          40 Years of Japanese Tea Craftsmanship
        </h1>
      </div>
    </div>
  );
}
