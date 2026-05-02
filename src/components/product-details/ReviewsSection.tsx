"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export type ReviewData = {
  id: string;
  rating: number;
  reviewText: string | null;
  createdAt: string;
  user: {
    name: string;
  };
};

interface ReviewsSectionProps {
  productId: string;
  initialReviews: ReviewData[];
}

export default function ReviewsSection({ productId, initialReviews }: ReviewsSectionProps) {
  const { user, openAuthModal } = useAuth();
  const [reviews, setReviews] = useState<ReviewData[]>(initialReviews);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => r.rating === stars).length,
    percentage: totalReviews > 0 ? (reviews.filter(r => r.rating === stars).length / totalReviews) * 100 : 0
  }));

  const canReview = user?.gstin_verified;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, reviewText }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      setReviews(prev => [data.review, ...prev]);
      setRating(0);
      setReviewText("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-20 border-t border-zinc-200 pt-16">
      <h2 className="text-2xl font-bold text-zinc-900 mb-10">Customer Reviews</h2>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Left Column: Summary & Breakdown */}
        <div className="md:col-span-4">
          <div className="flex items-end gap-3 mb-6">
            <h3 className="text-5xl font-bold text-zinc-900">{averageRating.toFixed(1)}</h3>
            <div className="mb-1">
              <div className="flex text-yellow-400 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-5 h-5 ${star <= Math.round(averageRating) ? "fill-current" : "text-zinc-200"}`} 
                  />
                ))}
              </div>
              <p className="text-sm text-zinc-500">Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}</p>
            </div>
          </div>

          <div className="space-y-3">
            {ratingCounts.map(({ stars, count, percentage }) => (
              <div key={stars} className="flex items-center text-sm">
                <span className="w-12 text-zinc-600">{stars} stars</span>
                <div className="flex-1 h-2 mx-3 bg-zinc-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="w-8 text-right text-zinc-500">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Write Review & Review List */}
        <div className="md:col-span-8">
          
          {/* Write Review Section */}
          {user ? (
            canReview ? (
              <div className="bg-zinc-50 p-6 rounded-xl mb-10 border border-zinc-100">
                <h4 className="text-lg font-semibold text-zinc-900 mb-4">Write a Review</h4>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-sm text-zinc-600 font-medium mr-2">Your Rating:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none"
                      >
                        <Star 
                          className={`w-6 h-6 ${(hoverRating || rating) >= star ? "fill-yellow-400 text-yellow-400" : "text-zinc-300"} transition-colors`} 
                        />
                      </button>
                    ))}
                  </div>

                  <div className="mb-4">
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your thoughts about this tea... (Optional)"
                      className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm text-zinc-900 focus:ring-2 focus:ring-zinc-900 outline-none min-h-[100px]"
                    />
                  </div>

                  {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

                  <button
                    type="submit"
                    disabled={submitting || rating === 0}
                    className="bg-zinc-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-zinc-50 p-6 rounded-xl mb-10 border border-zinc-100 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-semibold text-zinc-900">Only Verified Buyers Can Review</h4>
                  <p className="text-sm text-zinc-500 mt-1">Please verify your GSTIN to unlock wholesale access and reviews.</p>
                </div>
                <a href="/bulk-order/verify-gstin" className="bg-zinc-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition whitespace-nowrap">
                  Verify Now
                </a>
              </div>
            )
          ) : (
            <div className="bg-zinc-50 p-6 rounded-xl mb-10 border border-zinc-100 flex items-center justify-between">
              <div>
                <h4 className="text-base font-semibold text-zinc-900">Sign in to leave a review</h4>
                <p className="text-sm text-zinc-500 mt-1">Only verified wholesale buyers can write reviews.</p>
              </div>
              <button 
                onClick={() => openAuthModal("login")}
                className="bg-white border border-zinc-300 text-zinc-900 px-5 py-2 rounded-lg text-sm font-medium hover:bg-zinc-50 transition whitespace-nowrap"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Reviews List */}
          <div>
            <h4 className="text-lg font-semibold text-zinc-900 mb-6">Recent Reviews</h4>
            {reviews.length === 0 ? (
              <p className="text-zinc-500 italic bg-zinc-50 p-8 rounded-lg text-center">No reviews yet. Be the first to review.</p>
            ) : (
              <div className="space-y-8">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-zinc-100 pb-8 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-zinc-900">{review.user.name}</span>
                        <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                          Verified Buyer
                        </span>
                      </div>
                      <span className="text-xs text-zinc-400">
                        {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    
                    <div className="flex text-yellow-400 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-4 h-4 ${star <= review.rating ? "fill-current" : "text-zinc-200"}`} 
                        />
                      ))}
                    </div>
                    
                    {review.reviewText && (
                      <p className="text-zinc-700 text-sm leading-relaxed">{review.reviewText}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
