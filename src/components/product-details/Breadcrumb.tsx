import Link from 'next/link';

interface BreadcrumbProps {
  productName: string;
}

export default function Breadcrumb({ productName }: BreadcrumbProps) {
  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <ol className="flex items-center space-x-2 text-xs text-zinc-400">
        <li>
          <Link href="/" className="hover:text-zinc-700 transition-colors">Home</Link>
        </li>
        <li><span className="mx-1">&gt;</span></li>
        <li>
          <Link href="/products" className="hover:text-zinc-700 transition-colors">Products</Link>
        </li>
        <li><span className="mx-1">&gt;</span></li>
        <li className="text-zinc-700 font-medium">{productName}</li>
      </ol>
    </nav>
  );
}
