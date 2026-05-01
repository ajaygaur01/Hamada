export default function TrustedBy() {
  return (
    <section className="bg-zinc-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-xl font-bold text-zinc-900 mb-12">Trusted By</h2>
        
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 items-center">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="bg-zinc-200/60 w-32 h-12 rounded flex items-center justify-center">
              <span className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">LOGO</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
