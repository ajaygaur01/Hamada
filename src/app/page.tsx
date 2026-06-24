import Hero from "@/components/home/Hero";
import TrustedBy from "@/components/home/TrustedBy";
import Features from "@/components/home/Features";
import Teas from "@/components/home/Teas";
import USPBanner from "@/components/home/USPBanner";
import Story from "@/components/home/Story";
import StepsSection from "@/components/how-it-works/StepsSection";
import Awards from "@/components/about/Awards";
import WhyMatcha from "@/components/home/WhyMatcha";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Teas />
      <TrustedBy />
      <USPBanner />
      <Story />
      <StepsSection />
      <Awards />
      <WhyMatcha />
    </>
  );
}

