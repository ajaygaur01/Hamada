import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative grow flex items-center justify-center py-24 sm:py-32 overflow-hidden">
      <Image
        src="/banner2.avif"
        alt="Hamada tea landing banner"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/35" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 max-w-4xl mx-auto">
          Premium Japanese Tea for Your Business
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
          Source directly from Kagoshima, Japan
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link 
            href="/sample" 
            className="w-full sm:w-auto bg-brand-red text-white font-medium px-8 py-3.5 rounded hover:opacity-90 transition-opacity"
          >
            Order a Sample
          </Link>
          <Link 
            href="/bulk" 
            className="w-full sm:w-auto bg-white/95 text-brand-brown border border-white/80 font-medium px-8 py-3.5 rounded hover:bg-white transition-colors"
          >
            Place a Bulk Order
          </Link>
        </div>
      </div>
    </section>
  );
}
