"use client";
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-zinc-200 rounded-lg ${className}`} />;
}
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-3">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <Skeleton className="h-7 w-24" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}
export function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="px-5 py-4"><Skeleton className="h-4 w-full" /></td>
      ))}
    </tr>
  );
}
