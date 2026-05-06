"use client";

import { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { Search } from 'lucide-react';

interface ProductData {
  id: string;
  slug: string;
  name: string;
  categoryName: string;
  useCases: string[];
  categoryId: string;
  startingPrice?: number;
  averageRating?: number;
  reviewCount?: number;
}

interface CategoryData {
  id: string;
  name: string;
}

interface ProductGridProps {
  products: ProductData[];
  categories: CategoryData[];
}

export default function ProductGrid({ products, categories }: ProductGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeUseCase, setActiveUseCase] = useState<string | null>(null);

  // Extract top use cases for filter pills
  const allUseCases = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach(p => {
      p.useCases.forEach(uc => {
        counts[uc] = (counts[uc] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);
  }, [products]);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUseCase = activeUseCase ? product.useCases.includes(activeUseCase) : true;
    return matchesSearch && matchesUseCase;
  });

  // Group into exactly two categories as per brief:
  // 1. Premium Japanese Teas (Matcha, Sencha, Hojicha, Genmaicha)
  // 2. Instant Teas & Ready Formats (Premix, Tea Bags)
  // We'll infer this from product names/tags since we don't have these exact DB categories mapped right now.
  const premiumTeas = filteredProducts.filter(p => 
    !p.name.toLowerCase().includes("premix") && 
    !p.name.toLowerCase().includes("tea bag")
  );

  const readyFormats = filteredProducts.filter(p => 
    p.name.toLowerCase().includes("premix") || 
    p.name.toLowerCase().includes("tea bag")
  );

  const getStatus = (productName: string) => {
    if (productName.toLowerCase().includes("ingredient grade") || productName.toLowerCase().includes("genmaicha")) {
      return "On Request";
    }
    return "Sample Available";
  };

  return (
    <div className="bg-brand-cream pb-24">
      
      {/* Search & Filter Header */}
      <div className="sticky top-16 z-40 bg-brand-cream/90 backdrop-blur-md border-b border-[#d2e0c2] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
            
            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <button
                onClick={() => setActiveUseCase(null)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                  activeUseCase === null 
                    ? "bg-brand-green text-white" 
                    : "bg-transparent text-[#3E4F25]/70 hover:bg-[#d2e0c2]/50"
                }`}
              >
                All Teas
              </button>
              {allUseCases.slice(0, 6).map(uc => (
                <button
                  key={uc}
                  onClick={() => setActiveUseCase(uc)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                    activeUseCase === uc 
                      ? "bg-brand-green text-white" 
                      : "bg-transparent border border-[#d2e0c2] text-[#3E4F25]/70 hover:border-brand-green hover:text-brand-green"
                  }`}
                >
                  {uc}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64 shrink-0">
              <Search className="w-4 h-4 text-brand-sage absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search catalog..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-[#d2e0c2] text-[#3E4F25] text-sm py-2.5 pl-9 pr-4 rounded-full focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green placeholder:text-brand-sage transition-all shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-32">
            <h3 className="font-heading text-2xl text-[#3E4F25] mb-2">No products found</h3>
            <p className="text-brand-sage">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="space-y-24">
            
            {/* Category 1: Premium Japanese Teas */}
            {premiumTeas.length > 0 && (
              <section>
                <div className="mb-8 border-b border-[#d2e0c2] pb-4 flex justify-between items-baseline">
                  <h2 className="font-heading text-3xl text-[#3E4F25]">Premium Japanese Teas</h2>
                  <span className="text-sm font-medium text-brand-sage">{premiumTeas.length} items</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                  {premiumTeas.map(product => (
                    <ProductCard 
                      key={product.id}
                      id={product.id}
                      slug={product.slug}
                      name={product.name}
                      categoryName={product.categoryName}
                      useCases={product.useCases}
                      status={getStatus(product.name)}
                      startingPrice={product.startingPrice}
                      averageRating={product.averageRating}
                      reviewCount={product.reviewCount}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Category 2: Instant Teas and Ready Formats */}
            {readyFormats.length > 0 && (
              <section>
                <div className="mb-8 border-b border-[#d2e0c2] pb-4 flex justify-between items-baseline">
                  <h2 className="font-heading text-3xl text-[#3E4F25]">Instant Teas & Ready Formats</h2>
                  <span className="text-sm font-medium text-brand-sage">{readyFormats.length} items</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                  {readyFormats.map(product => (
                    <ProductCard 
                      key={product.id}
                      id={product.id}
                      slug={product.slug}
                      name={product.name}
                      categoryName={product.categoryName}
                      useCases={product.useCases}
                      status={getStatus(product.name)}
                      startingPrice={product.startingPrice}
                      averageRating={product.averageRating}
                      reviewCount={product.reviewCount}
                    />
                  ))}
                </div>
              </section>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
