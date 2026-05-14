import Image from "next/image";

type SubMilestone = { year: string; text: string };

type TimelineEntry = {
  year: string;
  body: string[];
  subMilestones?: SubMilestone[];
  imagePosition: "left" | "right";
  showBrandLogo?: boolean;
};

const timeline: TimelineEntry[] = [
  {
    year: "1970",
    imagePosition: "left",
    body: [
      `When previous owner Masaharu Hamada was 40 years old, he retired from his job of 17 years at the Chiran Agricultural Cooperative Association, and founded Hamada Tea as an individual. He decided that he would "Sell only strictly selected domestic (produced in Kagoshima) tea", starting Kagoshima's first journey into a competitive journey with Japan's other tea growing prefectures.`,
    ],
  },
  {
    year: "1975",
    imagePosition: "right",
    body: [
      "While increasing performance, Hamada Industries Co., Ltd. is established. There are 2 employees.",
    ],
  },
  {
    year: "1980",
    imagePosition: "left",
    body: [
      "In order to accommodate the increasing amount of tea leaves being handled, a collection and tea blending facility is established at the current location (Chiran). Retail sales begin in part of the office.",
    ],
    subMilestones: [
      {
        year: "1985",
        text: "New processing facilities established in response to the expanding sales market.",
      },
    ],
  },
  {
    year: "2000",
    imagePosition: "right",
    body: [
      '"Ocha no Hamada" is constructed. Chiran being a tourist spot, in order to create a store for Chiran tea that tourists could easily visit.',
    ],
    subMilestones: [
      {
        year: "2002",
        text: "Shinichi, the eldest son of the family, assumes his role as the second president. 17 employees.",
      },
    ],
  },
  {
    year: "2016",
    imagePosition: "left",
    body: [
      "Shuhei Hamada, the 3rd generation is appointed as CEO. Studied under tea masters in Shizuoka and is a Level 6 tea master along with his father. Starts export to America, Australia and Europe.",
      "Starts his plan for the company's first oversees subsidiary. Research begins in India",
    ],
  },
  {
    year: "2022",
    imagePosition: "right",
    body: [
      "Hamada Global Trading is established, in Gurguram, India",
      "A brand new market, to start from scratch at the health and wellness sector, to introduce India to Japan's superfoods.",
      "In 3 years, we have managed to capture and build an extremely small niche market into a growing market by enabling brands to execute smoothly in building the Matcha market.",
    ],
    showBrandLogo: true,
  },
];

function ImagePlaceholder() {
  return (
    <div
      className="relative flex aspect-[5/4] min-h-[200px] w-full max-w-md flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-dashed border-zinc-300 bg-gradient-to-b from-zinc-50 to-zinc-100/90 text-center shadow-inner sm:min-h-[220px] lg:min-h-0"
      aria-label="Image placeholder"
    >
      <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
        Image
      </span>
      <span className="max-w-[13rem] px-4 text-[11px] leading-snug text-zinc-400">
        Photograph for this milestone — add in admin or replace this block later.
      </span>
    </div>
  );
}

function YearBlock({
  year,
  subMilestones,
  body,
  showBrandLogo,
  accentLineTowardSpine,
}: {
  year: string;
  subMilestones?: SubMilestone[];
  body: string[];
  showBrandLogo?: boolean;
  accentLineTowardSpine?: "left" | "right";
}) {
  return (
    <div className="space-y-5">
      <div>
        <div className="flex flex-wrap items-end gap-3">
          {accentLineTowardSpine === "left" && (
            <span
              className="mb-[0.55em] hidden h-px min-w-[1.25rem] max-w-[4.5rem] flex-1 bg-brand-red/85 lg:block"
              aria-hidden
            />
          )}
          <h3 className="font-heading text-5xl leading-none tracking-tight text-brand-red sm:text-6xl lg:text-7xl">
            {year}
          </h3>
          {accentLineTowardSpine === "right" && (
            <span
              className="mb-[0.55em] hidden h-px min-w-[1.25rem] max-w-[4.5rem] flex-1 bg-brand-red/85 lg:block"
              aria-hidden
            />
          )}
        </div>
        <span
          className="mt-3 block h-px w-14 bg-brand-red/70 sm:w-16 lg:hidden"
          aria-hidden
        />
      </div>

      <div className="space-y-4 text-sm leading-[1.75] text-zinc-800 sm:text-[15px]">
        {body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {subMilestones?.map((sub) => (
        <div key={sub.year} className="space-y-2 border-t border-zinc-200/90 pt-5">
          <p className="font-heading text-2xl text-brand-red sm:text-3xl">{sub.year}</p>
          <p className="text-sm leading-[1.75] text-zinc-800 sm:text-[15px]">{sub.text}</p>
        </div>
      ))}

      {showBrandLogo && (
        <div className="border-t border-zinc-200/90 pt-6">
          <p className="mb-4 text-sm font-medium text-zinc-700">Our brand:</p>
          <div className="inline-flex flex-col items-start gap-1">
            <div className="relative h-14 w-14 overflow-hidden rounded-full border border-zinc-200 bg-white shadow-sm">
              <Image
                src="/logo.avif"
                alt="Chiran — Premium Japanese Tea"
                fill
                className="object-contain p-2"
                sizes="56px"
              />
            </div>
            <span className="font-heading text-lg tracking-wide text-brand-brown">
              CHIRAN
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Premium Japanese Tea
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AboutStoryTimeline() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-14 text-center sm:mb-16 lg:mb-20">
          <h2 className="font-heading text-4xl text-brand-red sm:text-5xl md:text-6xl">
            Our Story
          </h2>
          <div
            className="mx-auto mt-5 h-px w-16 bg-brand-red/80 sm:mt-6"
            aria-hidden
          />
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-base">
            A timeline of Hamada Tea — from Chiran to wholesale partners across India and the world.
          </p>
        </header>

        {/* Mobile / tablet: stacked cards with rail */}
        <ul className="space-y-14 sm:space-y-16 lg:hidden">
          {timeline.map((entry, i) => (
            <li key={entry.year} className="relative pl-9">
              <span
                className="absolute left-0 top-2 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-brand-red bg-white shadow-sm ring-4 ring-white"
                aria-hidden
              />
              {i < timeline.length - 1 && (
                <span
                  className="absolute left-[6px] top-6 bottom-[-3.5rem] w-px bg-zinc-200"
                  aria-hidden
                />
              )}
              <div className="space-y-6">
                <YearBlock
                  year={entry.year}
                  subMilestones={entry.subMilestones}
                  body={entry.body}
                  showBrandLogo={entry.showBrandLogo}
                />
                <ImagePlaceholder />
              </div>
            </li>
          ))}
        </ul>

        {/* Desktop: alternating columns + continuous spine */}
        <div className="relative mx-auto hidden max-w-5xl lg:block">
          <div
            className="pointer-events-none absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-zinc-200"
            aria-hidden
          />

          <ul className="relative space-y-24 xl:space-y-28">
            {timeline.map((entry) => {
              const isImageLeft = entry.imagePosition === "left";

              return (
                <li key={entry.year} className="relative">
                  <span
                    className="pointer-events-none absolute left-1/2 top-[2.35rem] z-[2] h-3.5 w-3.5 -translate-x-1/2 rounded-full border-[3px] border-white bg-brand-red shadow-md"
                    aria-hidden
                  />

                  <div className="grid grid-cols-2 items-start gap-x-12 xl:gap-x-16">
                    {isImageLeft ? (
                      <>
                        <div className="flex justify-end">
                          <ImagePlaceholder />
                        </div>
                        <div className="pl-2">
                          <YearBlock
                            year={entry.year}
                            subMilestones={entry.subMilestones}
                            body={entry.body}
                            showBrandLogo={entry.showBrandLogo}
                            accentLineTowardSpine="left"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-end pr-2">
                          <YearBlock
                            year={entry.year}
                            subMilestones={entry.subMilestones}
                            body={entry.body}
                            showBrandLogo={entry.showBrandLogo}
                            accentLineTowardSpine="right"
                          />
                        </div>
                        <div>
                          <ImagePlaceholder />
                        </div>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
