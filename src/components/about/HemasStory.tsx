import Image from "next/image";

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

          <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-zinc-200 shadow-sm">
            <Image
              src="/about2.avif"
              alt="Hema's Story"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
