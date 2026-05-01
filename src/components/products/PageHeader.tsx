export default function PageHeader() {
  return (
    <div className="bg-zinc-50 pt-16 pb-12 text-center border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="inline-block bg-zinc-200/50 text-zinc-500 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded mb-6">
          CATALOGUE
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
          Our Products
        </h1>
        <p className="text-zinc-500 max-w-2xl mx-auto">
          Premium Japanese teas for every business need
        </p>
      </div>
    </div>
  );
}
