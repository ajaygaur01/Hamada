"use client";

import { useState } from 'react';
import ProductCard from './ProductCard';
import { Search, Filter, ChevronDown } from 'lucide-react';

interface ProductData {
  id: string;
  slug: string;
  name: string;
  categoryName: string;
  useCases: string[];
  categoryId: string;
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
  const [teaTypeFilter, setTeaTypeFilter] = useState("");
  const [useCaseFilter, setUseCaseFilter] = useState("");

  // Extract all unique use cases across all products for the filter dropdown
  const allUseCases = Array.from(new Set(products.flatMap(p => p.useCases))).sort();

  // Filter logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeaType = teaTypeFilter ? product.categoryId === teaTypeFilter : true;
    const matchesUseCase = useCaseFilter ? product.useCases.includes(useCaseFilter) : true;
    return matchesSearch && matchesTeaType && matchesUseCase;
  });

  // Group by category for rendering
  const productsByCategory = categories.map(category => {
    return {
      category,
      items: filteredProducts.filter(p => p.categoryId === category.id)
    };
  }).filter(group => group.items.length > 0);

  // Helper to determine status based on wireframe logic
  const getStatus = (productName: string) => {
    if (productName.toLowerCase().includes("ingredient grade") || productName.toLowerCase().includes("genmaicha")) {
      return "On Request";
    }
    return "Sample Available";
  };

  return (
    <div className="bg-white">
      {/* Filter Bar */}
      <div className="border-b border-zinc-100 bg-white sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            
            {/* Filter by Tea Type */}
            <div className="relative w-full sm:w-auto">
              <select 
                value={teaTypeFilter}
                onChange={(e) => setTeaTypeFilter(e.target.value)}
                className="w-full sm:w-48 appearance-none bg-zinc-50 border border-zinc-200 text-zinc-700 text-xs py-2.5 pl-8 pr-8 rounded focus:outline-none focus:ring-1 focus:ring-zinc-900"
              >
                <option value="">Filter by Tea Type</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <Filter className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Filter by Use Case */}
            <div className="relative w-full sm:w-auto">
              <select 
                value={useCaseFilter}
                onChange={(e) => setUseCaseFilter(e.target.value)}
                className="w-full sm:w-48 appearance-none bg-zinc-50 border border-zinc-200 text-zinc-700 text-xs py-2.5 pl-8 pr-8 rounded focus:outline-none focus:ring-1 focus:ring-zinc-900"
              >
                <option value="">Filter by Use Case</option>
                {allUseCases.map(uc => (
                  <option key={uc} value={uc}>{uc}</option>
                ))}
              </select>
              <Filter className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Search */}
            <div className="relative w-full sm:flex-1">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 text-zinc-700 text-xs py-2.5 pl-9 pr-4 rounded focus:outline-none focus:ring-1 focus:ring-zinc-900 placeholder:text-zinc-400"
              />
            </div>

          </div>
        </div>
      </div>

      {/* Product Grid Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {productsByCategory.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            No products found matching your filters.
          </div>
        ) : (
          <div className="space-y-20">
            {productsByCategory.map(group => (
              <div key={group.category.id}>
                <div className="flex justify-between items-end mb-8">
                  <h2 className="text-xl font-bold text-zinc-900">{group.category.name}</h2>
                  <span className="text-xs text-zinc-400 font-medium">{group.items.length} products</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {group.items.map(product => (
                    <ProductCard 
                      key={product.id}
                      id={product.id}
                      slug={product.slug}
                      name={product.name}
                      categoryName={product.categoryName}
                      useCases={product.useCases}
                      status={getStatus(product.name)}
                      averageRating={product.averageRating}
                      reviewCount={product.reviewCount}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
