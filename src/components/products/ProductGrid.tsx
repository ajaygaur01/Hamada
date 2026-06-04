"use client";

import { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { Search } from 'lucide-react';

interface VariantData {
  id: string;
  size: string;
  samplePrice: number;
  bulkPrice: number;
}

interface ProductData {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  categoryName: string;
  categorySlug: string;
  useCases: string[];
  categoryId: string;
  imageUrl: string | null;
  startingPrice?: number;
  averageRating?: number;
  reviewCount?: number;
  variants: VariantData[];
}

interface CategoryData {
  id: string;
  name: string;
}

interface ProductGridProps {
  products: ProductData[];
  categories: CategoryData[];
}

const USE_CASES = ["CAFE MENU", "RETAIL", "HOTEL", "BAKERY"];
const TEA_TYPES = ["Matcha", "Loose Teas", "Latte Premix", "Samples"];

export default function ProductGrid({ products, categories }: ProductGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeUseCase, setActiveUseCase] = useState<string | null>(null);
  const [activeTeaType, setActiveTeaType] = useState<string | null>(null);

  // Filter products dynamically
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Search term match (name and description)
      const nameMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const descMatch = product.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const matchesSearch = nameMatch || descMatch;

      // 2. Use case match (case-insensitive)
      const matchesUseCase = activeUseCase
        ? product.useCases.some(uc => uc.toUpperCase() === activeUseCase.toUpperCase())
        : true;

      // 3. Tea type match
      let matchesTeaType = true;
      if (activeTeaType) {
        const nameLower = product.name.toLowerCase();
        if (activeTeaType === "Matcha") {
          matchesTeaType = nameLower.includes("matcha") && !nameLower.includes("premix");
        } else if (activeTeaType === "Loose Teas") {
          matchesTeaType = nameLower.includes("leaf") || 
                           nameLower.includes("gyokuro") || 
                           nameLower.includes("sencha") || 
                           nameLower.includes("genmaicha") || 
                           (nameLower.includes("hojicha") && !nameLower.includes("powder"));
        } else if (activeTeaType === "Latte Premix") {
          matchesTeaType = nameLower.includes("premix") || nameLower.includes("latte");
        } else if (activeTeaType === "Samples") {
          matchesTeaType = product.categorySlug === "sample-sets" || nameLower.includes("sample");
        }
      }

      return matchesSearch && matchesUseCase && matchesTeaType;
    });
  }, [products, searchTerm, activeUseCase, activeTeaType]);

  // Group into two main categories for rendering
  const premiumTeas = useMemo(() => {
    return filteredProducts.filter(p => 
      !p.name.toLowerCase().includes("premix") && 
      !p.name.toLowerCase().includes("tea bag")
    );
  }, [filteredProducts]);

  const readyFormats = useMemo(() => {
    return filteredProducts.filter(p => 
      p.name.toLowerCase().includes("premix") || 
      p.name.toLowerCase().includes("tea bag")
    );
  }, [filteredProducts]);

  const getStatus = (productName: string) => {
    if (productName.toLowerCase().includes("ingredient grade") || productName.toLowerCase().includes("genmaicha")) {
      return "On Request";
    }
    return "Sample Available";
  };

  return (
    <div className="bg-white pb-24">
      
      {/* Search & Filter Header */}
      <div className="relative bg-white border-b border-[#d2e0c2] py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-5 lg:items-center justify-between">
            
            {/* Filter Rows */}
            <div className="flex-1 space-y-3.5">
              {/* Row 1: Use Cases */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mr-2 shrink-0">
                  Use Case:
                </span>
                <button
                  onClick={() => setActiveUseCase(null)}
                  className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${
                    activeUseCase === null 
                      ? "bg-[#D04636] text-white border-[#D04636] shadow-sm" 
                      : "bg-white border-zinc-200 text-zinc-600 hover:border-[#D04636] hover:text-[#D04636]"
                  }`}
                >
                  All Teas
                </button>
                {USE_CASES.map(uc => (
                  <button
                    key={uc}
                    onClick={() => setActiveUseCase(uc)}
                    className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${
                      activeUseCase === uc 
                        ? "bg-[#D04636] text-white border-[#D04636] shadow-sm" 
                        : "bg-white border-zinc-200 text-zinc-600 hover:border-[#D04636] hover:text-[#D04636]"
                    }`}
                  >
                    {uc}
                  </button>
                ))}
              </div>

              {/* Row 2: Tea Types */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mr-2 shrink-0">
                  Tea Type:
                </span>
                <button
                  onClick={() => setActiveTeaType(null)}
                  className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${
                    activeTeaType === null 
                      ? "bg-[#4c632e] text-white border-[#4c632e] shadow-sm" 
                      : "bg-white border-zinc-200 text-zinc-600 hover:border-[#4c632e] hover:text-[#4c632e]"
                  }`}
                >
                  All Types
                </button>
                {TEA_TYPES.map(tt => (
                  <button
                    key={tt}
                    onClick={() => setActiveTeaType(tt)}
                    className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${
                      activeTeaType === tt 
                        ? "bg-[#4c632e] text-white border-[#4c632e] shadow-sm" 
                        : "bg-white border-zinc-200 text-zinc-600 hover:border-[#4c632e] hover:text-[#4c632e]"
                    }`}
                  >
                    {tt}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input on Right */}
            <div className="relative w-full lg:w-72 shrink-0 self-start lg:self-center">
              <Search className="w-4 h-4 text-brand-sage absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search by name or description..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-[#d2e0c2] text-[#3E4F25] text-sm py-2.5 pl-10 pr-4 rounded-full focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green placeholder:text-brand-sage transition-all shadow-sm"
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
                      description={product.description}
                      categoryName={product.categoryName}
                      useCases={product.useCases}
                      imageUrl={product.imageUrl}
                      status={getStatus(product.name)}
                      startingPrice={product.startingPrice}
                      averageRating={product.averageRating}
                      reviewCount={product.reviewCount}
                      variants={product.variants}
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
                      description={product.description}
                      categoryName={product.categoryName}
                      useCases={product.useCases}
                      imageUrl={product.imageUrl}
                      status={getStatus(product.name)}
                      startingPrice={product.startingPrice}
                      averageRating={product.averageRating}
                      reviewCount={product.reviewCount}
                      variants={product.variants}
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
