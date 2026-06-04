export default function PageHeader() {
  return (
    <>
      <div className="relative overflow-hidden bg-[url('/productbanner2.jpg')] bg-cover bg-center min-h-[220px] md:min-h-[260px] flex items-center text-center border-b border-zinc-200">
        <div className="absolute inset-0 bg-black/60 z-0" />
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <div className="inline-block bg-white/20 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded mb-4 backdrop-blur-xs border border-white/25">
            CATALOGUE
          </div>
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-md">
            Our Products
          </h1>
        </div>
      </div>
      <div className="bg-brand-cream border-b border-zinc-200/80 py-4 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm md:text-base font-semibold text-brand-brown tracking-wide">
            Premium Japanese teas for every business need
          </p>
        </div>
      </div>
    </>
  );
}

