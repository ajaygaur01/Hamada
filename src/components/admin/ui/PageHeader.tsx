"use client";

import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  stats?: { label: string; value: string | number }[];
}

export function PageHeader({ title, description, actions, stats }: PageHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">{title}</h1>
          {description && <p className="mt-1.5 max-w-2xl text-sm text-zinc-500">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-zinc-200/80 bg-white px-4 py-3 shadow-sm"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">{s.label}</p>
              <p className="mt-0.5 text-lg font-bold text-zinc-900">{s.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
