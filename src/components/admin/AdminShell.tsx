"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Settings,
  LogOut,
  Shield,
  Menu,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  ExternalLink,
} from "lucide-react";
import { ToastProvider } from "./ui/Toast";

const navGroups = [
  {
    label: "Overview",
    items: [{ href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Catalog",
    items: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/categories", label: "Categories", icon: Tag },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
      { href: "/admin/users", label: "Users", icon: Users },
    ],
  },
  {
    label: "System",
    items: [{ href: "/admin/settings", label: "Settings", icon: Settings }],
  },
];

function Sidebar({
  adminName,
  collapsed,
  onToggle,
}: {
  adminName: string;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-zinc-800/80 bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900 transition-all duration-300 ${collapsed ? "w-[72px]" : "w-64"
        }`}
    >
      <div className="flex h-16 items-center gap-3 border-b border-zinc-800/80 px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#D04636] shadow-lg shadow-[#D04636]/20">
          <Shield size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold tracking-wide text-white">HAMDA</p>
            <p className="truncate text-[10px] text-zinc-500">Admin · {adminName}</p>
          </div>
        )}
        <button
          type="button"
          onClick={onToggle}
          className="shrink-0 rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto p-3">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${isActive
                        ? "bg-[#D04636] text-white shadow-md shadow-[#D04636]/25"
                        : "text-zinc-400 hover:bg-zinc-800/80 hover:text-white"
                      }`}
                  >
                    <Icon size={18} className="shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="space-y-1 border-t border-zinc-800/80 p-3">
        <Link
          href="/products"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 transition-all hover:bg-zinc-800/80 hover:text-white"
        >
          <ExternalLink size={18} className="shrink-0" />
          {!collapsed && <span>View Storefront</span>}
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 transition-all hover:bg-zinc-800/80 hover:text-white"
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Exit Admin</span>}
        </Link>
      </div>
    </aside>
  );
}

function Topbar({
  adminName,
  onMenuToggle,
}: {
  adminName: string;
  onMenuToggle: () => void;
}) {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const breadcrumbs = parts.map((part, i) => ({
    label:
      part.length > 20
        ? "…"
        : part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " "),
    href: "/" + parts.slice(0, i + 1).join("/"),
    isUuid: /^[0-9a-f-]{36}$/i.test(part),
  }));

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-zinc-200/80 bg-white/90 px-4 backdrop-blur-md sm:px-6">
      <button
        type="button"
        onClick={onMenuToggle}
        className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 md:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <div className="hidden min-w-0 flex-1 items-center gap-1 text-sm md:flex">
        {breadcrumbs.map((b, i) => (
          <span key={b.href} className="flex min-w-0 items-center gap-1">
            {i > 0 && <ChevronRight size={14} className="shrink-0 text-zinc-300" />}
            {b.isUuid ? (
              <span className="truncate font-semibold text-zinc-900">Edit</span>
            ) : (
              <Link
                href={b.href}
                className={`truncate ${i === breadcrumbs.length - 1
                    ? "font-semibold text-zinc-900"
                    : "text-zinc-400 hover:text-zinc-600"
                  }`}
              >
                {b.label}
              </Link>
            )}
          </span>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-3">
        <span className="hidden rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 sm:inline">
          Admin
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D04636] text-xs font-bold text-white">
          {adminName.slice(0, 2).toUpperCase()}
        </div>
        <span className="hidden max-w-[120px] truncate text-sm font-medium text-zinc-700 md:block">
          {adminName}
        </span>
      </div>
    </header>
  );
}

export default function AdminShell({
  children,
  adminName,
}: {
  children: ReactNode;
  adminName: string;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#f6f6f7]">
        <div className="hidden md:block">
          <Sidebar
            adminName={adminName}
            collapsed={collapsed}
            onToggle={() => setCollapsed((c) => !c)}
          />
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="h-full w-64">
              <Sidebar
                adminName={adminName}
                collapsed={false}
                onToggle={() => setMobileOpen(false)}
              />
            </div>
            <button
              type="button"
              className="flex-1 bg-black/50"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            />
          </div>
        )}

        <div
          className={`transition-all duration-300 ${collapsed ? "md:pl-[72px]" : "md:pl-64"}`}
        >
          <Topbar adminName={adminName} onMenuToggle={() => setMobileOpen((o) => !o)} />
          <main className="mx-auto max-w-[1680px] p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
