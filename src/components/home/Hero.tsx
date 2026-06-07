'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  description?: string;
  ctas: {
    text: string;
    href: string;
    style: 'primary' | 'secondary' | 'green' | 'orange' | 'white-shadow';
  }[];
  image: string;
  overlayClass: string;
  theme: 'light' | 'dark';
  isMatchaSlide?: boolean;
  isKagoshimaSlide?: boolean;
}

const SLIDES: Slide[] = [
  {
    eyebrow: 'UNIT FOR HAMADA TEA CO. LTD. JAPAN',
    headline: 'Founded in Japan.\nTrusted in India.',
    subheadline: 'Since 1975.',
    description: 'For 50 years, Hamada Tea has been a pioneer in manufacturing and exporting Japanese teas to the world.',
    ctas: [
      { text: 'Order a Sample', href: '/sample-order', style: 'primary' },
      { text: 'Place a Bulk Order', href: '/bulk-order', style: 'secondary' },
    ],
    image: '/banner2.avif',
    overlayClass: 'bg-black/45',
    theme: 'dark',
  },
  {
    eyebrow: 'PREMIUM TEAS',
    headline: 'MATCHA',
    subheadline: 'The Superfood',
    description: 'Premium Japanese matcha products crafted for cafes, retailers, beverage brands, and food businesses. Perfect for cafés, retail, brands and more.',
    ctas: [
      { text: 'Explore Catalogue', href: '/products', style: 'green' },
    ],
    image: '/crousel2.avif',
    overlayClass: 'bg-black/45',
    theme: 'dark',
    isMatchaSlide: true,
  },
  {
    eyebrow: 'Single Origin',
    headline: 'Authentic\nJapanese Teas,\nFrom\nKagoshima',
    description: 'A terroir of taste, purity, and legacy.',
    ctas: [
      { text: 'Know More', href: '/about-kagoshima', style: 'orange' },
      { text: 'Learn About Kagoshima', href: '/kagoshima', style: 'white-shadow' },
    ],
    image: '/crousel3.avif',
    overlayClass: 'bg-black/45',
    theme: 'dark',
    isKagoshimaSlide: true,
  },
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % SLIDES.length);
  };

  return (
    <section
      className="relative w-full h-[85vh] lg:h-[90vh] min-h-[580px] overflow-hidden bg-zinc-900 group"
    >
      {/* Slides */}
      <div className="relative h-full w-full z-10">
        {SLIDES.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                }`}
            >
              {/* Slide Background Image */}
              <Image
                src={slide.image}
                alt="Hero slide background"
                fill
                priority={index === 0}
                className="object-cover object-center z-0"
              />
              {/* Overlay */}
              <div className={`absolute inset-0 z-10 transition-all duration-700 ${slide.overlayClass}`} />

              {/* Content Container */}
              <div className="relative z-20 h-full flex items-center">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="max-w-3xl text-left">
                    {/* Eyebrow */}
                    {slide.eyebrow && (
                      <span
                        className={`inline-block text-xs font-semibold uppercase tracking-[0.25em] mb-4 transition-all duration-700 delay-100 ease-out transform ${isActive
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-4'
                          } ${slide.theme === 'light' ? 'text-brand-red' : 'text-white/90'
                          }`}
                      >
                        {slide.eyebrow}
                      </span>
                    )}

                    {/* Headline */}
                    <div
                      className={`mb-4 transition-all duration-700 delay-200 ease-out transform ${isActive
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4'
                        }`}
                    >
                      {slide.isMatchaSlide ? (
                        <>
                          <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tight text-white leading-none drop-shadow-md">
                            {slide.headline}
                          </h1>
                          {slide.subheadline && (
                            <p className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-sage tracking-wide uppercase">
                              {slide.subheadline}
                            </p>
                          )}
                        </>
                      ) : slide.isKagoshimaSlide ? (
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-brand-brown leading-tight whitespace-pre-line">
                          {slide.headline}
                        </h1>
                      ) : (
                        <>
                          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight whitespace-pre-line drop-shadow-md">
                            {slide.headline}
                          </h1>
                          {slide.subheadline && (
                            <p className="mt-2 text-xl sm:text-2xl lg:text-3xl font-medium text-white/95">
                              {slide.subheadline}
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    {/* Description */}
                    {slide.description && (
                      <p
                        className={`mb-8 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl transition-all duration-700 delay-350 ease-out transform ${isActive
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-4'
                          } ${slide.theme === 'light' ? 'text-zinc-800' : 'text-white/85'
                          }`}
                      >
                        {slide.description}
                      </p>
                    )}

                    {/* CTAs */}
                    <div
                      className={`flex transition-all duration-700 delay-500 ease-out transform ${isActive
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4'
                        } ${slide.isKagoshimaSlide
                          ? 'flex-col items-start gap-3 sm:w-80'
                          : 'flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4'
                        }`}
                    >
                      {slide.ctas.map((cta, ctaIdx) => {
                        let btnClass = '';
                        if (cta.style === 'primary') {
                          btnClass = 'bg-brand-red text-white hover:bg-brand-red/90 shadow-lg shadow-brand-red/20 focus-visible:ring-brand-red/50 rounded-md';
                        } else if (cta.style === 'secondary') {
                          btnClass = 'border border-white bg-transparent text-white hover:bg-white/10 focus-visible:ring-white/50 rounded-md';
                        } else if (cta.style === 'green') {
                          btnClass = 'bg-brand-green text-white hover:bg-brand-green/90 shadow-lg shadow-brand-green/20 focus-visible:ring-brand-green/50 rounded-full';
                        } else if (cta.style === 'orange') {
                          btnClass = 'bg-orange-600 text-white hover:bg-orange-700 hover:scale-[1.02] shadow-md shadow-orange-600/25 focus-visible:ring-orange-500/50 rounded-full w-full';
                        } else if (cta.style === 'white-shadow') {
                          btnClass = 'bg-white text-brand-brown hover:bg-zinc-50 border border-zinc-200 shadow-md hover:scale-[1.02] focus-visible:ring-zinc-400/50 rounded-full w-full';
                        }

                        return (
                          <Link
                            key={ctaIdx}
                            href={cta.href}
                            className={`inline-flex items-center justify-center px-7 py-3 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 text-center ${btnClass} ${slide.isKagoshimaSlide ? 'sm:w-full' : 'sm:w-auto'
                              }`}
                          >
                            {cta.text}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/25 text-white hover:bg-black/50 transition-all hover:scale-105 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/25 text-white hover:bg-black/50 transition-all hover:scale-105 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${index === currentIndex ? 'w-8 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/80'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}


