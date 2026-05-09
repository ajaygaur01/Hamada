"use client";

import { useState } from "react";
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Shield } from "lucide-react";
import Link from "next/link";
import DashboardSection from "./sections/DashboardSection";
import ProductsSection from "./sections/ProductsSection";
import OrdersSection from "./sections/OrdersSection";
import UsersSection from "./sections/UsersSection";

type ActiveSection = "dashboard" | "products" | "orders" | "users";

export default function AdminPanelClient({ adminName }: { adminName: string }) {
  const [activeSection, setActiveSection] = useState<ActiveSection>("dashboard");

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "users", label: "Users", icon: Users },
  ] as const;

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col bg-zinc-900 text-white fixed inset-y-0 left-0 z-50">
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D04636] rounded-lg flex items-center justify-center">
              <Shield size={20} />
            </div>
            <div>
              <h1 className="font-bold text-sm">KAORI ADMIN</h1>
              <p className="text-zinc-500 text-xs truncate max-w-[140px]">{adminName}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#D04636] text-white"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-zinc-800">
          <Link href="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all">
            <LogOut size={18} />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Mobile Top Nav */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-zinc-900 text-white z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#D04636] rounded-lg flex items-center justify-center">
            <Shield size={16} />
          </div>
          <span className="font-bold text-sm">ADMIN</span>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-900 z-50 px-2 py-2 flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive ? "text-[#D04636]" : "text-zinc-500"
              }`}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 pb-20 md:pb-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {activeSection === "dashboard" && <DashboardSection />}
          {activeSection === "products" && <ProductsSection />}
          {activeSection === "orders" && <OrdersSection />}
          {activeSection === "users" && <UsersSection />}
        </div>
      </main>
    </div>
  );
}
