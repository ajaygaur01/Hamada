// src/app/why-our-matcha/page.tsx

import Image from "next/image";

export const metadata = {
  title: "Why Our Matcha – Premium Japanese Tea for B2B",
  description: "Discover the unparalleled quality, sustainability, and heritage behind our matcha. Perfect for wholesale partners seeking elite Japanese tea.",
};

export default function WhyOurMatcha() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#fff8f0] via-[#fff1e6] to-[#ffe8d5] py-20">
        <div className="container mx-auto px-6 lg:px-12 flex flex-col-reverse lg:flex-row items-center">
          <div className="lg:w-1/2">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#3E4F25] mb-6 leading-tight">
              Why Our Matcha Sets the Standard for B2B Excellence
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              Sourced directly from the mist‑clad tea fields of Kagoshima, our matcha is cultivated, harvested, and stone‑ground by generations of artisans. The result is a vibrant, umami‑rich tea that elevates any menu, retail shelf, or corporate offering.
            </p>
            <ul className="space-y-4 text-gray-700 mb-8">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-[#D04636] flex-shrink-0 mr-3" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 4.707 7.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"/></svg>
                <span>100% organic, shade‑grown leaves for unmatched flavor depth.</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-[#D04636] flex-shrink-0 mr-3" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 4.707 7.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"/></svg>
                <span>Stone‑ground using traditional granite mills – preserving antioxidants.</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-[#D04636] flex-shrink-0 mr-3" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 4.707 7.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"/></svg>
                <span>Transparent supply chain – each batch is traceable to its farm.</span>
              </li>
            </ul>
            <a
              href="/contact"
              className="inline-block bg-[#D04636] text-white font-medium py-3 px-6 rounded-lg hover:bg-[#B83C2D] transition-colors shadow-md"
            >
              Get in Touch – Wholesale Inquiry
            </a>
          </div>
          <div className="lg:w-1/2 mb-10 lg:mb-0 flex justify-center">
            <Image
              src="/productbanner.avif"
              alt="Premium matcha leaves"
              width={500}
              height={500}
              className="rounded-xl shadow-lg object-cover"
            />
          </div>
        </div>
      </section>

      {/* Story & Heritage Section */}
      <section className="py-16 bg-[#F9FAF5]">
        <div className="container mx-auto px-6 lg:px-12 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Image
              src="/about1.avif"
              alt="Tea fields of Kagoshima"
              width={600}
              height={400}
              className="rounded-xl shadow-md"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#3E4F25] mb-4">
              A Legacy Honored for Over a Century
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Kaori’s family has cultivated tea since 1895. Each generation refines the art of shading, picking, and stone‑grinding to capture the essence of the leaf. Our farms benefit from volcanic soil, mist‑filled mornings, and meticulous hand‑picking, guaranteeing a vivid green hue and a smooth, buttery finish.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Partnering with us means you inherit not only a product but a story that resonates with discerning consumers who value authenticity and sustainability.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits for B2B Clients */}
      <section className="py-16">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl font-bold text-[#3E4F25] mb-8">Why Wholesale Partners Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-zinc-200 hover:shadow-md transition-shadow">
              <svg className="w-12 h-12 mx-auto text-[#D04636] mb-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.61.07-.61 1 .07 1.53 1.02 1.53 1.02.89 1.51 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-2 1.03-2.71-.1-.25-.45-1.28.1-2.66 0 0 .84-.27 2.75 1.03a9.54 9.54 0 015 0c1.9-1.3 2.74-1.03 2.74-1.03.55 1.38.2 2.41.1 2.66.64.71 1.03 1.62 1.03 2.71 0 3.84-2.34 4.68-4.57 4.93.36.31.68.93.68 1.88v2.79c0 .27.18.58.69.48A10 10 0 0012 2z"/></svg>
              <h3 className="font-semibold text-lg mb-2 text-[#3E4F25]">Premium Quality Assurance</h3>
              <p className="text-gray-600">Every batch undergoes rigorous testing for purity, colour, and flavour consistency.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border border-zinc-200 hover:shadow-md transition-shadow">
              <svg className="w-12 h-12 mx-auto text-[#D04636] mb-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8V4l8 8-8 8v-4H4V8z"/></svg>
              <h3 className="font-semibold text-lg mb-2 text-[#3E4F25]">Scalable Supply Chain</h3>
              <p className="text-gray-600">From boutique cafés to large‑scale retailers, we adapt packaging and volume to your needs.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border border-zinc-200 hover:shadow-md transition-shadow">
              <svg className="w-12 h-12 mx-auto text-[#D04636] mb-4" fill="currentColor" viewBox="0 0 24 24"><path d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5zm7 12l-5-5h10l-5 5z"/></svg>
              <h3 className="font-semibold text-lg mb-2 text-[#3E4F25]">Sustainability Commitment</h3>
              <p className="text-gray-600">Eco‑friendly farming and recyclable packaging reduce environmental impact.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
