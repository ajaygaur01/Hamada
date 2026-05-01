import { Metadata } from "next";
import ContactHeader from "@/components/contact/ContactHeader";
import ConnectInfo from "@/components/contact/ConnectInfo";
import InquiryForm from "@/components/contact/InquiryForm";

export const metadata: Metadata = {
  title: "Contact Us | Kaori by Chiran",
  description:
    "Get in touch with us for wholesale inquiries, product questions, or partnership opportunities. We'd love to hear from you.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col bg-zinc-50 min-h-screen">
      <ContactHeader />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left: Let's Connect */}
            <ConnectInfo />

            {/* Right: Inquiry Form */}
            <InquiryForm />
          </div>
        </div>
      </section>
    </div>
  );
}
