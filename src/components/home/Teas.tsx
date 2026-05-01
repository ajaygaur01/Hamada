import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const teas = [
  {
    category: "MATCHA",
    name: "Ceremonial Grade Matcha",
    href: "/products/ceremonial-grade-matcha",
  },
  {
    category: "SENCHA",
    name: "Fukamushi Sencha",
    href: "/products/fukamushi-sencha",
  },
  {
    category: "GYOKURO",
    name: "Premium Gyokuro",
    href: "/products/premium-gyokuro",
  },
  {
    category: "HOJICHA",
    name: "Roasted Hojicha",
    href: "/products/roasted-hojicha",
  }
];

export default function Teas() {
  return (
    <section className="bg-zinc-50 py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-zinc-900 mb-12">Our Teas</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teas.map((tea, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-zinc-100 shadow-sm hover:shadow-md transition-shadow group">
              {/* Image Placeholder */}
              <div className="bg-zinc-100 aspect-square rounded flex items-center justify-center mb-6">
                <span className="text-zinc-400 text-xs font-medium tracking-widest uppercase">Image Placeholder</span>
              </div>
              
              {/* Content */}
              <div className="px-2 pb-2">
                <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2">
                  {tea.category}
                </p>
                <h3 className="text-sm font-semibold text-zinc-900 mb-4">
                  {tea.name}
                </h3>
                <Link 
                  href={tea.href} 
                  className="inline-flex items-center text-xs font-semibold text-zinc-900 hover:text-zinc-600 transition-colors"
                >
                  Order Sample 
                  <ArrowRight className="ml-1 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
