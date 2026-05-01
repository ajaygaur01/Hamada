export default function ConnectInfo() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 mb-3">Let&apos;s Connect</h2>
        <p className="text-sm text-zinc-500 leading-relaxed">
          Reach out through any of the channels below. Our team typically responds
          within 24 hours on business days.
        </p>
      </div>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/916969923445"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 w-full bg-zinc-900 text-white font-medium py-4 rounded-lg text-sm hover:bg-zinc-800 transition-colors"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Chat on WhatsApp
      </a>

      <p className="text-[10px] text-zinc-400 text-center">
        Fastest response · usually replies within minutes
      </p>

      <div className="flex items-center gap-4">
        <div className="flex-1 border-t border-zinc-200" />
        <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">or reach us via</span>
        <div className="flex-1 border-t border-zinc-200" />
      </div>

      {/* Email */}
      <div className="flex items-start gap-4 bg-zinc-50 rounded-lg p-5 border border-zinc-100">
        <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 mb-1">EMAIL</p>
          <p className="text-sm font-medium text-zinc-900">sales@chirantea.in</p>
          <p className="text-[10px] text-zinc-400 mt-1">For wholesale &amp; product inquiries</p>
        </div>
      </div>

      {/* Phone */}
      <div className="flex items-start gap-4 bg-zinc-50 rounded-lg p-5 border border-zinc-100">
        <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </div>
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 mb-1">PHONE</p>
          <p className="text-sm font-medium text-zinc-900">+91 96969 23445</p>
          <p className="text-[10px] text-zinc-400 mt-1">Mon – Sat, 10 AM – 6 PM IST</p>
        </div>
      </div>

      {/* Note */}
      <div className="flex items-start gap-3 text-[10px] text-zinc-400">
        <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>
          For bulk orders above 10kg/month, please mention your monthly requirement in
          the inquiry form so we can provide the best pricing.
        </p>
      </div>
    </div>
  );
}
