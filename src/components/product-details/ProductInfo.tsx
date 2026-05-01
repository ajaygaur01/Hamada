interface ProductInfoProps {
  categoryTag: string;
  grade: string | null;
  name: string;
  shortDescription: string;
  fullDescription: string;
  useCases: string[];
  variantSizes: string[];
  storageInstructions: string | null;
  shelfLife: string | null;
}

export default function ProductInfo({
  categoryTag,
  grade,
  name,
  shortDescription,
  fullDescription,
  useCases,
  variantSizes,
  storageInstructions,
  shelfLife,
}: ProductInfoProps) {
  return (
    <div className="space-y-8">
      {/* Top tags */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400">
          {categoryTag}
        </span>
        {grade && (
          <span className="border border-zinc-200 text-zinc-600 text-[10px] font-medium px-2.5 py-0.5 rounded-full">
            {grade}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-zinc-900">
        {name}
      </h1>

      {/* Short description */}
      <p className="text-sm text-zinc-600 leading-relaxed">
        {shortDescription}
      </p>

      {/* Rating placeholder */}
      <div className="flex items-center gap-2">
        <div className="flex">
          {[1, 2, 3, 4, 5].map(star => (
            <svg key={star} className="w-4 h-4 text-zinc-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-[10px] text-zinc-400">Star rating placeholder</span>
      </div>

      {/* Full description block */}
      <div className="bg-zinc-50 rounded-lg p-6 border border-zinc-100">
        <p className="text-sm text-zinc-600 leading-relaxed">
          {fullDescription}
        </p>
        <p className="text-[10px] text-zinc-400 mt-4 italic">Description paragraph placeholder</p>
      </div>

      {/* Best For */}
      {useCases.length > 0 && (
        <div>
          <h3 className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 mb-3">
            BEST FOR
          </h3>
          <div className="flex flex-wrap gap-2">
            {useCases.map((uc, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 border border-zinc-200 text-zinc-600 text-xs px-3 py-1.5 rounded-full">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {uc}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Available Formats */}
      {variantSizes.length > 0 && (
        <div>
          <h3 className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 mb-3">
            AVAILABLE FORMATS
          </h3>
          <div className="flex flex-wrap gap-2">
            {variantSizes.map((size, i) => (
              <span key={i} className="bg-zinc-100 text-zinc-700 text-xs font-medium px-3 py-1.5 rounded">
                {size}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Storage & Shelf Life */}
      {(storageInstructions || shelfLife) && (
        <div className="flex flex-col sm:flex-row gap-8">
          {storageInstructions && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 mb-1">STORAGE</p>
                <p className="text-xs text-zinc-700">{storageInstructions}</p>
              </div>
            </div>
          )}
          {shelfLife && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 mb-1">SHELF LIFE</p>
                <p className="text-xs text-zinc-700">{shelfLife}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
