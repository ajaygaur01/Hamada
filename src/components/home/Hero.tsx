import Link from 'next/link';

export default function Hero() {
  return (
    <section className="bg-zinc-50 flex-grow flex items-center justify-center py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 mb-6 max-w-4xl mx-auto">
          Premium Japanese Tea for Your Business
        </h1>
        <p className="text-lg md:text-xl text-zinc-600 mb-10 max-w-2xl mx-auto">
          Source directly from Kagoshima, Japan
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link 
            href="/sample" 
            className="w-full sm:w-auto bg-zinc-900 text-white font-medium px-8 py-3.5 rounded hover:bg-zinc-800 transition-colors"
          >
            Order a Sample
          </Link>
          <Link 
            href="/bulk" 
            className="w-full sm:w-auto bg-white text-zinc-900 border border-zinc-300 font-medium px-8 py-3.5 rounded hover:bg-zinc-50 transition-colors"
          >
            Place a Bulk Order
          </Link>
        </div>
      </div>
    </section>
  );
}
