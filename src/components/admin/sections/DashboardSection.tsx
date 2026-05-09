"use client";

import { useEffect, useState } from "react";
import { Package, ShoppingCart, Users, DollarSign, Loader2, TrendingUp } from "lucide-react";

type Stats = {
  totalProducts: number;
  totalUsers: number;
  totalSampleOrders: number;
  totalBulkOrders: number;
  totalRevenue: number;
  recentSampleOrders: any[];
  recentBulkOrders: any[];
};

export default function DashboardSection() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="animate-spin text-zinc-400" size={32} />
      </div>
    );
  }

  if (!stats) return <p className="text-center text-zinc-500 py-20">Failed to load dashboard data.</p>;

  const statCards = [
    { label: "Total Products", value: stats.totalProducts, icon: Package, color: "bg-blue-500" },
    { label: "Sample Orders", value: stats.totalSampleOrders, icon: ShoppingCart, color: "bg-emerald-500" },
    { label: "Bulk Orders", value: stats.totalBulkOrders, icon: TrendingUp, color: "bg-purple-500" },
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "bg-amber-500" },
    { label: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`, icon: DollarSign, color: "bg-[#D04636]" },
  ];

  const allRecentOrders = [
    ...stats.recentSampleOrders.map(o => ({
      id: o.id, orderNumber: o.order_number, customer: o.customer_name,
      amount: o.amount, status: o.order_status, paymentStatus: o.payment_status,
      date: o.created_at, type: "Sample", productName: o.product?.name || "",
    })),
    ...stats.recentBulkOrders.map(o => ({
      id: o.id, orderNumber: o.order_number, customer: o.user?.full_name || o.user?.email,
      amount: o.total_amount, status: o.order_status, paymentStatus: o.payment_status,
      date: o.created_at, type: "Bulk",
      productName: o.items?.map((i: any) => i.product_name).join(", ") || "",
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">Dashboard</h2>
        <p className="text-zinc-500 text-sm mt-1">Overview of your store performance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl border border-zinc-200 p-5 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center text-white mb-3`}>
                <Icon size={20} />
              </div>
              <p className="text-2xl font-bold text-zinc-900">{card.value}</p>
              <p className="text-xs text-zinc-500 font-medium mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100">
          <h3 className="font-semibold text-zinc-900">Recent Orders</h3>
        </div>

        {allRecentOrders.length === 0 ? (
          <div className="p-6 text-center text-zinc-400 text-sm">No orders yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Order #</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Type</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Payment</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {allRecentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-3 font-mono text-xs text-zinc-700">{order.orderNumber}</td>
                    <td className="px-6 py-3 text-zinc-900 font-medium">{order.customer}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        order.type === "Sample" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                      }`}>
                        {order.type}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-medium text-zinc-900">₹{order.amount?.toFixed(2)}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        order.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-700" :
                        order.paymentStatus === "failed" ? "bg-red-100 text-red-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        order.status === "delivered" ? "bg-emerald-100 text-emerald-700" :
                        order.status === "dispatched" ? "bg-blue-100 text-blue-700" :
                        order.status === "cancelled" ? "bg-red-100 text-red-700" :
                        "bg-zinc-100 text-zinc-600"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-zinc-500 text-xs">
                      {new Date(order.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
