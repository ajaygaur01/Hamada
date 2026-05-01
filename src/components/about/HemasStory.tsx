export default function HemasStory() {
  return (
    <section className="bg-zinc-50 py-24 border-y border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Content - Left Side */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-6">
              Hema&apos;s Story
            </h2>
            <div className="space-y-4 text-sm text-zinc-600 leading-relaxed">
              <p>
                For Hema, tea has never just a beverage — it&apos;s a memory, a ritual, and a
                deep cultural connection to Japan. Having spent years immersed in Japanese
                culture and cuisine, she discovered the irreplaceable simplicity of a perfect
                Japanese tea and the beauty of sharing it with those around her.
              </p>
              <p>
                But selling in India, Hema found that the kind of authentic, high-quality
                Japanese tea she sought wasn&apos;t accessible to business owners looking to offer
                truly exceptional drinks. That gap became her purpose. Kaori by Chiran was born from
                a deep desire to connect Japanese tea heritage with Indian hospitality —
                bringing the best of Japan directly to cafes, restaurants, hotels, and wellness brands across India.
              </p>
              <p>
                She&apos;s made it her mission to ensure that every person who sips one of her blends
                feels a step closer to the real Japan — naturally. For Hema, sharing good tea is an act
                of love.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-200">
              <p className="text-xs text-zinc-400 italic">
                &ldquo;Good tea speaks softly. But profoundly.&rdquo;
              </p>
            </div>
          </div>

          {/* Image Placeholder - Right Side */}
          <div className="bg-zinc-100 aspect-[4/3] rounded-lg flex items-center justify-center border border-zinc-200">
            <span className="text-zinc-400 text-[10px] font-medium tracking-widest uppercase">
              Image Placeholder
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
