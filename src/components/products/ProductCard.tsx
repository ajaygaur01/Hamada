import Link from 'next/link';

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  categoryName: string;
  useCases: string[];
  status: "Sample Available" | "On Request";
}

export default function ProductCard({ id, slug, name, categoryName, useCases, status }: ProductCardProps) {
  return (
    <Link href={`/products/${slug}`} className="bg-white rounded-lg p-4 border border-zinc-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] flex flex-col h-full hover:shadow-md transition-shadow group">
      {/* Image Placeholder */}
      <div className="bg-zinc-100 aspect-[4/3] rounded flex items-center justify-center mb-6">
        <span className="text-zinc-400 text-[10px] font-medium tracking-widest uppercase">Image Placeholder</span>
      </div>
      
      {/* Content */}
      <div className="flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400">
            {categoryName.toUpperCase()}
          </p>
          {status === "Sample Available" ? (
            <span className="bg-zinc-900 text-white text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
              Sample Available
            </span>
          ) : (
            <span className="bg-zinc-200 text-zinc-600 text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
              On Request
            </span>
          )}
        </div>
        
        <h3 className="text-sm font-semibold text-zinc-900 mb-4 flex-grow group-hover:text-zinc-600 transition-colors">
          {name}
        </h3>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {useCases.map((tag, i) => (
            <span key={i} className="border border-zinc-200 text-zinc-500 text-[10px] px-2 py-0.5 rounded-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
