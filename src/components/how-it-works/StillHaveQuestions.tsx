import Link from "next/link";

export default function StillHaveQuestions() {
  return (
    <section className="bg-zinc-50 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#4E3D33] border border-[#3e3028] rounded-xl p-10 text-center">
          {/* Chat icon */}
          <div className="w-14 h-14 rounded-full bg-[#3e3028] border border-[#3e3028] flex items-center justify-center mx-auto mb-6">
            <svg className="w-6 h-6 text-[#E7DDC1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>

          <h3 className="text-lg font-bold text-white mb-2">Still have questions?</h3>
          <p className="text-sm text-[#E7DDC1]/80 mb-8 max-w-md mx-auto">
            Our team is here to help. Reach out and we&apos;ll get back to you within one business day.
          </p>

          <Link
            href="/contact"
            className="inline-block bg-[#D04636] text-white font-medium px-8 py-3 rounded text-sm hover:bg-[#B83C2D] transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
