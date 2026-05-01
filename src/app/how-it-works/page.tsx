import { Metadata } from "next";
import HowItWorksHeader from "@/components/how-it-works/HowItWorksHeader";
import StepsSection from "@/components/how-it-works/StepsSection";
import FAQSection from "@/components/how-it-works/FAQSection";
import StillHaveQuestions from "@/components/how-it-works/StillHaveQuestions";

export const metadata: Metadata = {
  title: "How It Works | Kaori by Chiran",
  description:
    "From sample to bulk in three simple steps. Learn how to order premium Japanese tea for your business.",
};

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col bg-zinc-50 min-h-screen">
      <HowItWorksHeader />
      <StepsSection />
      <FAQSection />
      <StillHaveQuestions />
    </div>
  );
}
