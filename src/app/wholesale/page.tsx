import { Metadata } from "next";
import WholesaleHero from "@/components/wholesale/WholesaleHero";
import BusinessTypes from "@/components/wholesale/BusinessTypes";
import WholesalePricing from "@/components/wholesale/WholesalePricing";
import ProgramDetails from "@/components/wholesale/ProgramDetails";
import WholesaleCTA from "@/components/wholesale/WholesaleCTA";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Wholesale | Kaori by Chiran",
  description:
    "Partner with Kaori by Chiran to bring authentic Japanese tea directly from Kagoshima to your business. Flexible MOQs, competitive pricing, and pan-India wholesale delivery.",
};

export default function WholesalePage() {
  return (
    <div className="flex flex-col bg-zinc-50 min-h-screen">
      <WholesaleHero />
      <BusinessTypes />
      <WholesalePricing />
      <ProgramDetails />
      <div className="flex justify-center py-12">
        <Link href="/bulk-order" className="bg-zinc-900 text-white px-8 py-4 rounded-lg font-medium hover:bg-zinc-800 transition shadow-md text-lg">
          Start Bulk Order
        </Link>
      </div>
      <WholesaleCTA />
    </div>
  );
}
