"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export type ReviewData = {
  id: string;
  rating: number;
  reviewText: string | null;
  createdAt: string;
  user: { name: string };
};

interface ReviewsSectionProps {
  productId: string;
  initialReviews: ReviewData[];
}

function StarRow({ 
  rating, 
  size = 14 
}: { 
  rating: number; 
  size?: number 
}) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-zinc-300 text-zinc-300"
          }
        />
      ))}
    </div>
  );
}

export default function ReviewsSection({
  productId,
  initialReviews,
}: ReviewsSectionProps) {
  const { user, openAuthModal } = useAuth();
  const [reviews, setReviews] = useState<ReviewData[]>(initialReviews);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
    percentage:
      totalReviews > 0
        ? (reviews.filter((r) => r.rating === stars).length / totalReviews) * 100
        : 0,
  }));

  const canReview = user?.gstin_verified;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError("Please select a rating."); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, reviewText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      setReviews((prev) => [data.review, ...prev]);
      setRating(0);
      setReviewText("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-0 border-t border-zinc-200 bg-white py-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">

        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-end 
                        justify-between mb-16 gap-4">
          <div>
            <p className="text-[#9aa958] text-[10px] font-bold 
                          tracking-[0.25em] uppercase mb-3">
              REVIEWS
            </p>
            <h2 className="font-heading text-4xl md:text-5xl 
                           text-[#3E4F25] leading-tight">
              What Buyers Say
            </h2>
          </div>

          {totalReviews > 0 && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-heading text-5xl text-[#3E4F25] 
                                leading-none">
                  {averageRating.toFixed(1)}
                </div>
                <StarRow rating={Math.round(averageRating)} size={16} />
                <p className="text-xs text-[#3E4F25]/50 mt-1">
                  {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column */}
          <div className="lg:col-span-4 space-y-8">

            {/* Rating Breakdown */}
            {totalReviews > 0 && (
              <div className="space-y-3">
                {ratingCounts.map(({ stars, count, percentage }) => (
                  <div key={stars} 
                       className="flex items-center gap-3">
                    <span className="text-xs text-[#3E4F25]/50 w-8 
                                     text-right shrink-0">
                      {stars}★
                    </span>
                    <div className="flex-1 h-1 bg-zinc-200 rounded-full 
                                    overflow-hidden">
                      <div
                        className="h-full bg-[#4C632E] rounded-full 
                                   transition-all duration-700"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-[#3E4F25]/50 w-4 shrink-0">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Write Review / Auth */}
            <div className="border-t border-zinc-200 pt-8">
              {user ? (
                canReview ? (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.2em] 
                                    uppercase text-[#9aa958] mb-3">
                        YOUR RATING
                      </p>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="transition-transform hover:scale-110 
                                       focus:outline-none"
                          >
                            <Star
                              size={26}
                              className={
                                (hoverRating || rating) >= star
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-zinc-300 text-zinc-300"
                              }
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold tracking-[0.2em] 
                                    uppercase text-[#9aa958] mb-3">
                        YOUR THOUGHTS
                      </p>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="How did this tea perform in your menu or business?"
                        className="w-full rounded-xl border border-zinc-200 
                                   bg-white px-4 py-3 text-sm 
                                   text-[#3E4F25] placeholder-[#3E4F25]/30
                                   focus:ring-1 focus:ring-[#4C632E] 
                                   focus:border-[#4C632E] outline-none 
                                   min-h-[100px] resize-none"
                      />
                    </div>

                    {error && (
                      <p className="text-red-500 text-xs">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting || rating === 0}
                      className="w-full bg-[#D04636] text-[#E7DDC1] 
                                 py-3 rounded-xl text-sm font-semibold 
                                 tracking-wide hover:bg-[#B83C2D] 
                                 transition disabled:opacity-40 
                                 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Posting..." : "Post Review"}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-[#3E4F25]/70 leading-relaxed">
                      Verify your business GSTIN to unlock wholesale 
                      access and leave reviews.
                    </p>
                    <a
                      href="/bulk-order/verify-gstin"
                      className="inline-block w-full text-center 
                                 border border-[#4C632E] text-[#4C632E] 
                                 py-2.5 rounded-xl text-sm font-semibold 
                                 hover:bg-[#4C632E] hover:text-white 
                                 transition"
                    >
                      Verify Business
                    </a>
                  </div>
                )
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-[#3E4F25]/70 leading-relaxed">
                    Sign in as a verified wholesale buyer to share 
                    your experience.
                  </p>
                  <button
                    onClick={() => openAuthModal("login")}
                    className="w-full border border-[#4C632E] 
                               text-[#4C632E] py-2.5 rounded-xl 
                               text-sm font-semibold 
                               hover:bg-[#4C632E] hover:text-white 
                               transition"
                  >
                    Sign In to Review
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column — Reviews */}
          <div className="lg:col-span-8">
            {reviews.length === 0 ? (
              <div className="h-full flex flex-col items-center 
                              justify-center py-16 text-center">
                <div className="font-heading text-6xl text-[#3E4F25]/10 
                                mb-4">
                  一
                </div>
                <p className="text-[#3E4F25]/40 text-sm">
                  No reviews yet.
                </p>
                <p className="text-[#3E4F25]/30 text-xs mt-1">
                  Be the first to share your experience.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-200">
                {reviews.map((review) => (
                  <div key={review.id} className="py-8 first:pt-0">
                    
                    {/* Top row */}
                    <div className="flex items-start justify-between 
                                    mb-4 gap-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full 
                                        bg-[#4C632E] flex items-center 
                                        justify-center text-[#E7DDC1] 
                                        text-sm font-bold shrink-0">
                          {review.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-[#3E4F25] 
                                        text-sm leading-none mb-1.5">
                            {review.user.name}
                          </p>
                          <span className="inline-flex items-center gap-1 
                                           text-[#4C632E] text-[10px] 
                                           font-bold tracking-wider">
                            <svg className="w-2.5 h-2.5" fill="none"
                                 stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2.5"
                                    d="M5 13l4 4L19 7" />
                            </svg>
                            VERIFIED BUYER
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-[#3E4F25]/40 
                                       shrink-0 mt-1">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-IN",
                          { month: "long", year: "numeric" }
                        )}
                      </span>
                    </div>

                    {/* Stars */}
                    <div className="mb-3">
                      <StarRow rating={review.rating} size={15} />
                    </div>

                    {/* Text */}
                    {review.reviewText && (
                      <p className="text-sm text-[#3E4F25]/70 
                                    leading-relaxed">
                        {review.reviewText}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}