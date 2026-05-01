export default function OurStory() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Placeholder */}
          <div className="bg-zinc-100 aspect-[4/3] rounded-lg flex items-center justify-center border border-zinc-200">
            <span className="text-zinc-400 text-[10px] font-medium tracking-widest uppercase">
              Image Placeholder
            </span>
          </div>

          {/* Content */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-sm text-zinc-600 leading-relaxed">
              <p>
                Hamada Tea Co. was founded in 1976 in the heart of Japan, with a singular
                mission — to bring the purest forms of Japanese tea through generations
                of dedicated craftsmanship. Over four decades later, that commitment remains
                unchanged: every leaf, every blend, every batch reflects the discipline and
                artistry that has always defined the way we grow tea.
              </p>
              <p>
                Our fields are sourced exclusively from the lush, volcanic hillsides of Kagoshima
                — a region celebrated for its minerals-rich soil, ideal climate, and long history with
                tea culture. We work hand-in-hand with local farmers who share our devotion to
                quality, ensuring that what we send from these mountains finds its way to your
                cup with every ounce of freshness, every deep & guided by tradition, integrity, and a quiet
                respect for the land.
              </p>
            </div>
            <p className="text-[10px] text-zinc-400 mt-6 font-medium tracking-wider uppercase">
              Est. 1976 · Kagoshima, Japan
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
