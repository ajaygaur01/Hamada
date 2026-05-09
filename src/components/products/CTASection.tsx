import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-[#4E3D33] py-20 text-center text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-4">
          Not sure which product fits your needs?
        </h2>
        <p className="text-[#d7dfc9] mb-10 text-sm">
          Our team can help you find the right tea for your menu, kitchen, or store. Request a sample or get in touch.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/sample" 
            className="w-full sm:w-auto bg-white text-zinc-900 font-medium px-8 py-3 rounded text-sm hover:bg-white border border-[#D04636] text-[#D04636] transition-colors"
          >
            Order a Sample
          </Link>
          <Link 
            href="/contact" 
            className="w-full sm:w-auto border border-[#5d7340] text-white font-medium px-8 py-3 rounded text-sm hover:bg-[#4a5f2f] transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
