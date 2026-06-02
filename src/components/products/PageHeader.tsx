export default function PageHeader() {
  return (
    <div className="relative overflow-hidden bg-[url('/productbanner2.jpg')] bg-cover bg-center min-h-[290px] md:min-h-[340px] flex items-center text-center border-b border-zinc-200">
      <div className="absolute inset-0 bg-linear-to-b from-black/65 via-black/50 to-black/65" />
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="inline-block bg-white/25 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded mb-5 backdrop-blur-sm border border-white/30">
          CATALOGUE
        </div>
        <h1 className="font-heading text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
          Our Products
        </h1>
        <p className="max-w-2xl mx-auto rounded-lg bg-black/55 px-5 py-3 text-sm font-medium text-white md:text-base backdrop-blur-sm">
          Premium Japanese teas for every business need
        </p>
      </div>
    </div>
  );
}
