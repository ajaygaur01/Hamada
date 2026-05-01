import { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import OurStory from "@/components/about/OurStory";
import HemasStory from "@/components/about/HemasStory";
import Awards from "@/components/about/Awards";

export const metadata: Metadata = {
  title: "About Us | Kaori by Chiran",
  description:
    "40 years of Japanese tea craftsmanship. Learn about Hamada Tea Co., our origins in Kagoshima, and Hema's mission to bring authentic Japanese tea to India.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col bg-zinc-50 min-h-screen">
      <AboutHero />
      <OurStory />
      <HemasStory />
      <Awards />
    </div>
  );
}
