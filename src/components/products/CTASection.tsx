import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-zinc-900 py-20 text-center text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-4">
          Not sure which product fits your needs?
        </h2>
        <p className="text-zinc-400 mb-10 text-sm">
          Our team can help you find the right tea for your menu, kitchen, or store. Request a sample or get in touch.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/sample" 
            className="w-full sm:w-auto bg-white text-zinc-900 font-medium px-8 py-3 rounded text-sm hover:bg-zinc-100 transition-colors"
          >
            Order a Sample
          </Link>
          <Link 
            href="/contact" 
            className="w-full sm:w-auto border border-zinc-700 text-white font-medium px-8 py-3 rounded text-sm hover:bg-zinc-800 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
