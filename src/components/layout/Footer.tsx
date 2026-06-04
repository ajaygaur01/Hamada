import Link from 'next/link';
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link
              href="/"
              className="mb-6 inline-flex items-center rounded-md bg-white border border-[#D04636] text-[#D04636] px-3 py-2 transition-colors hover:bg-[#fdebea]"
              aria-label="Kaori by Chiran home"
            >
              <Image
                src="/logo.avif"
                alt="Kaori by Chiran logo"
                width={120}
                height={36}
                className="h-9 w-auto object-contain"
              />
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
              Premium B2B wholesale Japanese tea, directly sourced from Kagoshima, Japan to your business.
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/products" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Products</Link></li>
              <li><Link href="/#how-it-works" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">How It Works</Link></li>
              <li><Link href="/about" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 tracking-wider mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link href="/contact" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Contact</Link></li>
              <li><Link href="/#faq" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Shipping Policy</Link></li>
              <li><Link href="/returns" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Returns</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-zinc-900 tracking-wider mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Websites</span>
                <span>India: <a href="https://www.hamadaglobaltrading.in" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 underline">www.hamadaglobaltrading.in</a></span>
                <span>Japan: <a href="https://chiran-omoiire.com" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 underline">chiran-omoiire.com</a></span>
              </li>
              <li className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Phone</span>
                <a href="tel:+919899923445" className="hover:text-zinc-900">+91 98999 23445</a>
                <a href="tel:+919354262542" className="hover:text-zinc-900">+91 93542 62542</a>
              </li>
              <li className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Email</span>
                <a href="mailto:sales@chirantea.in" className="hover:text-zinc-900">sales@chirantea.in</a>
              </li>
              <li className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Registered Office</span>
                <span className="leading-snug">B1, house no 2P, Sector 31, Gurugram 122001</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-zinc-400 mb-4 md:mb-0">
            &copy; 2026 Hamada Global Trading Pvt Ltd. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-zinc-400 hover:text-zinc-600 transition-colors">
              <span className="sr-only">Instagram</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-zinc-400 hover:text-zinc-600 transition-colors">
              <span className="sr-only">LinkedIn</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-zinc-400 hover:text-zinc-600 transition-colors">
              <span className="sr-only">X / Twitter</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}


