export default function Story() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Placeholder */}
          <div className="bg-zinc-100 aspect-square rounded-lg flex items-center justify-center border border-zinc-200">
            <span className="text-zinc-400 text-sm font-medium tracking-widest uppercase">Image Placeholder</span>
          </div>
          
          {/* Content */}
          <div>
            <div className="inline-block bg-zinc-50 border border-zinc-200 text-zinc-500 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded mb-6">
              Our Story
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6 leading-tight">
              40 Years of Japanese Tea Craftsmanship
            </h2>
            <div className="space-y-4 text-zinc-600 leading-relaxed">
              <p>
                Founded in 1975 in the heart of Kagoshima, Japan, Hamada Tea Co. has dedicated over four decades to perfecting the art of tea cultivation and processing.
              </p>
              <p>
                Our commitment to traditional methods, combined with modern quality control, ensures that every leaf delivers the authentic taste of Japan to your business. We partner with local farmers to bring you the finest matcha, sencha, and specialty blends, carefully nurtured in the rich volcanic soil of our region.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
