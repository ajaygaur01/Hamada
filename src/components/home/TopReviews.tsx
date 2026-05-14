import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";

export type LandingReview = {
  id: string;
  rating: number;
  reviewText: string | null;
  createdAt: string;
  productName: string;
  productSlug: string;
  userDisplayName: string;
};

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-hidden>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={13}
          className={
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-zinc-200 text-zinc-200"
          }
        />
      ))}
    </div>
  );
}

export default function TopReviews({ reviews }: { reviews: LandingReview[] }) {
  if (reviews.length === 0) return null;

  return (
    <section
      id="reviews"
      className="relative scroll-mt-20 border-y border-zinc-200/80 bg-zinc-50 py-20 sm:py-24"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-300/60 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-brand-green">
            Verified buyers
          </p>
          <h2 className="font-heading text-3xl tracking-tight text-brand-brown sm:text-4xl md:text-[2.75rem] md:leading-tight">
            What wholesale partners say
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
            Real feedback from verified accounts after sampling and ordering through Kaori.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <article
              key={review.id}
              className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-200/90 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04),0_12px_40px_rgba(62,79,37,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06),0_20px_50px_rgba(208,70,54,0.07)]"
            >
              {/* subtle top accent */}
              <div
                className="h-1 w-full bg-gradient-to-r from-brand-green via-brand-green/70 to-brand-red/80"
                aria-hidden
              />

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <div className="mb-5 flex items-start gap-4">
                  <div className="relative shrink-0">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-green to-brand-green/85 text-[15px] font-bold text-brand-cream shadow-inner ring-2 ring-white"
                      aria-hidden
                    >
                      {review.userDisplayName.charAt(0).toUpperCase()}
                    </div>
                    {index === 0 && (
                      <span className="absolute -bottom-1 -right-1 rounded-md bg-brand-red px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white shadow-sm">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="truncate text-[15px] font-semibold text-brand-brown">
                      {review.userDisplayName}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <StarRow rating={review.rating} />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-green">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative flex-1 rounded-2xl bg-zinc-50/90 px-4 py-4 ring-1 ring-inset ring-zinc-100">
                  <span
                    className="absolute left-3 top-3 font-heading text-4xl leading-none text-brand-green/15 select-none"
                    aria-hidden
                  >
                    &ldquo;
                  </span>
                  {review.reviewText ? (
                    <p className="relative z-[1] line-clamp-5 min-h-[4.5rem] pl-5 text-[13px] leading-[1.65] text-zinc-700 sm:text-sm">
                      {review.reviewText}
                    </p>
                  ) : (
                    <p className="relative z-[1] min-h-[4.5rem] pl-5 text-[13px] italic leading-relaxed text-zinc-500 sm:text-sm">
                      Left a {review.rating}-star rating for this tea.
                    </p>
                  )}
                </div>

                <div className="mt-5 flex items-end justify-between gap-3 border-t border-zinc-100 pt-5">
                  <Link
                    href={`/products/${review.productSlug}`}
                    className="group/link inline-flex min-w-0 max-w-[70%] items-center gap-1 text-left text-xs font-semibold text-brand-red transition hover:text-brand-red/90"
                  >
                    <span className="truncate">{review.productName}</span>
                    <ArrowUpRight
                      size={14}
                      className="shrink-0 opacity-70 transition group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:opacity-100"
                      aria-hidden
                    />
                  </Link>
                  <time
                    dateTime={review.createdAt}
                    className="shrink-0 text-[10px] font-medium tabular-nums text-zinc-400"
                  >
                    {new Date(review.createdAt).toLocaleDateString("en-IN", {
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-12 text-center text-xs text-zinc-500 sm:mt-14">
          <Link
            href="/products"
            className="font-semibold text-brand-red underline-offset-4 transition hover:underline"
          >
            Browse the catalogue
          </Link>{" "}
          for full reviews on every product.
        </p>
      </div>
    </section>
  );
}
