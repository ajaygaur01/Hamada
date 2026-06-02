import { PrismaClient } from "@prisma/client";
import Hero from "@/components/home/Hero";
import Story from "@/components/home/Story";
import Teas from "@/components/home/Teas";
import Features from "@/components/home/Features";
import USPBanner from "@/components/home/USPBanner";
import TrustedBy from "@/components/home/TrustedBy";
import TopReviews, { type LandingReview } from "@/components/home/TopReviews";
import HowItWorksHeader from "@/components/how-it-works/HowItWorksHeader";
import StepsSection from "@/components/how-it-works/StepsSection";
import FAQSection from "@/components/how-it-works/FAQSection";
import StillHaveQuestions from "@/components/how-it-works/StillHaveQuestions";

const prisma = new PrismaClient();

function formatReviewerName(fullName: string | null): string {
  if (!fullName) return "Verified buyer";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

export default async function Home() {
  const reviewsDb = await prisma.review.findMany({
    take: 6,
    orderBy: [{ rating: "desc" }, { created_at: "desc" }],
    where: { rating: { gte: 4 } },
    include: {
      product: { select: { name: true, slug: true } },
      user: { select: { full_name: true } },
    },
  });

  const topReviews: LandingReview[] = reviewsDb.map((r) => ({
    id: r.id,
    rating: r.rating,
    reviewText: r.review_text,
    createdAt: r.created_at.toISOString(),
    productName: r.product.name,
    productSlug: r.product.slug,
    userDisplayName: formatReviewerName(r.user.full_name),
  }));

  return (
    <>
      <Hero />
      <Story />
      <USPBanner />
      <Features />
      {/* <HowItWorksHeader /> */}
      <StepsSection />
      <Teas />
      <TopReviews reviews={topReviews} />
      <FAQSection />
      <StillHaveQuestions />
      <TrustedBy />
    </>
  );
}
