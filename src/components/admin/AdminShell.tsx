"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag,
  Settings, LogOut, Shield, Menu, X, ChevronRight
} from "lucide-react";
import { ToastProvider } from "./ui/Toast";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function Sidebar({ adminName, collapsed, onToggle }: { adminName: string; collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  return (
    <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-zinc-950 transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-zinc-800 h-16">
        <div className="w-8 h-8 bg-[#D04636] rounded-lg flex items-center justify-center shrink-0">
          <Shield size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm">KAORI ADMIN</p>
            <p className="text-zinc-500 text-[10px] truncate">{adminName}</p>
          </div>
        )}
        <button onClick={onToggle} className="text-zinc-500 hover:text-white transition-colors ml-auto shrink-0">
          {collapsed ? <ChevronRight size={16} /> : <X size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive ? "bg-[#D04636] text-white" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-2 border-t border-zinc-800">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Back to Site</span>}
        </Link>
      </div>
    </aside>
  );
}

function Topbar({ adminName, sidebarCollapsed, onMenuToggle }: { adminName: string; sidebarCollapsed: boolean; onMenuToggle: () => void }) {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const breadcrumbs = parts.map((part, i) => ({
    label: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " "),
    href: "/" + parts.slice(0, i + 1).join("/"),
  }));

  return (
    <header className="sticky top-0 z-40 flex items-center gap-4 h-16 px-6 bg-white border-b border-zinc-200">
      <button onClick={onMenuToggle} className="md:hidden text-zinc-500 hover:text-zinc-900">
        <Menu size={20} />
      </button>
      {/* Breadcrumbs */}
      <div className="hidden md:flex items-center gap-1 text-sm text-zinc-400">
        {breadcrumbs.map((b, i) => (
          <span key={b.href} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={14} />}
            <Link href={b.href} className={i === breadcrumbs.length - 1 ? "text-zinc-900 font-semibold" : "hover:text-zinc-600"}>
              {b.label}
            </Link>
          </span>
        ))}
      </div>
      <div className="ml-auto flex items-center gap-4">
        <div className="w-8 h-8 bg-[#D04636] rounded-full flex items-center justify-center text-white text-xs font-bold">
          {adminName.slice(0, 2).toUpperCase()}
        </div>
        <span className="hidden md:block text-sm font-medium text-zinc-700">{adminName}</span>
      </div>
    </header>
  );
}

export default function AdminShell({ children, adminName }: { children: ReactNode; adminName: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-zinc-50">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar adminName={adminName} collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
        </div>

        {/* Mobile Sidebar overlay */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div className="w-64 h-full">
              <Sidebar adminName={adminName} collapsed={false} onToggle={() => setMobileOpen(false)} />
            </div>
            <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
          </div>
        )}

        {/* Main */}
        <div className={`transition-all duration-300 ${collapsed ? "md:pl-16" : "md:pl-64"}`}>
          <Topbar adminName={adminName} sidebarCollapsed={collapsed} onMenuToggle={() => setMobileOpen(o => !o)} />
          <main className="p-6 max-w-[1600px] mx-auto">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
