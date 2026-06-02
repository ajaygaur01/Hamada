import Link from 'next/link';

interface BreadcrumbProps {
  productName: string;
  categoryName?: string;
}

export default function Breadcrumb({ productName, categoryName }: BreadcrumbProps) {
  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
      <ol className="flex items-center space-x-2 text-[11px] font-medium tracking-wide text-zinc-400">
        <li>
          <Link href="/" className="hover:text-[#4C632E] transition-colors">Home</Link>
        </li>
        <li><span className="mx-1.5 text-zinc-300">&gt;</span></li>
        {categoryName && (
          <>
            <li>
              <span className="text-zinc-400">{categoryName}</span>
            </li>
            <li><span className="mx-1.5 text-zinc-300">&gt;</span></li>
          </>
        )}
        <li className="text-zinc-800 font-bold font-serif">{productName}</li>
      </ol>
    </nav>
  );
}
