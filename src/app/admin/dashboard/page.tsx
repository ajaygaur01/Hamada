"use client";

import { useEffect, useState } from "react";
import { Package, ShoppingCart, Users, TrendingUp, AlertTriangle, ArrowUpRight, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { SkeletonCard, SkeletonRow } from "@/components/admin/ui/Skeleton";
import { useToast } from "@/components/admin/ui/Toast";
import Link from "next/link";

type Stats = {
  totalProducts: number; totalUsers: number; totalSampleOrders: number; totalBulkOrders: number;
  totalRevenue: number; revenueToday: number; revenueWeek: number; revenueMonth: number;
  newUsersToday: number; newUsersMonth: number; pendingOrders: number;
  recentSampleOrders: any[]; recentBulkOrders: any[];
  lowStockVariants: { id: string; productName: string; size: string; stock: number }[];
  topProducts: { id: string; name: string; imageUrl: string | null; orders: number }[];
  revenueChart: { date: string; label: string; revenue: number }[];
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  dispatched: "bg-indigo-100 text-indigo-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};
const paymentColors: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-700",
  verified: "bg-blue-100 text-blue-700",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(() => toast("Failed to load dashboard data", "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  const allRecent = stats ? [
    ...stats.recentSampleOrders.map(o => ({
      id: o.id, orderNumber: o.order_number, customer: o.customer_name,
      amount: o.amount, status: o.order_status, paymentStatus: o.payment_status,
      date: o.created_at, type: "Sample",
    })),
    ...stats.recentBulkOrders.map(o => ({
      id: o.id, orderNumber: o.order_number, customer: o.user?.full_name || o.user?.email,
      amount: o.total_amount, status: o.order_status, paymentStatus: o.payment_status,
      date: o.created_at, type: "Bulk",
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10) : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
        <p className="text-zinc-500 text-sm mt-1">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Revenue KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading ? Array.from({length:4}).map((_,i) => <SkeletonCard key={i} />) : [
          { label: "Revenue Today", value: `₹${stats!.revenueToday.toLocaleString("en-IN")}`, icon: TrendingUp, color: "bg-[#D04636]", sub: "Paid orders" },
          { label: "Revenue (Month)", value: `₹${stats!.revenueMonth.toLocaleString("en-IN")}`, icon: TrendingUp, color: "bg-emerald-500", sub: `₹${stats!.revenueWeek.toLocaleString("en-IN")} this week` },
          { label: "Total Orders", value: (stats!.totalSampleOrders + stats!.totalBulkOrders).toString(), icon: ShoppingCart, color: "bg-blue-500", sub: `${stats!.pendingOrders} pending` },
          { label: "Total Users", value: stats!.totalUsers.toString(), icon: Users, color: "bg-purple-500", sub: `+${stats!.newUsersMonth} this month` },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl border border-zinc-200 p-5 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center text-white mb-3`}>
                <Icon size={20} />
              </div>
              <p className="text-2xl font-bold text-zinc-900">{card.value}</p>
              <p className="text-xs font-semibold text-zinc-900 mt-1">{card.label}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-zinc-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-zinc-900">Revenue (Last 30 Days)</h2>
            <span className="text-xs text-zinc-400 flex items-center gap-1"><Clock size={12} />Daily</span>
          </div>
          {loading ? <div className="h-48 bg-zinc-100 rounded-lg animate-pulse" /> : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={stats!.revenueChart} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#a1a1aa" }} interval={4} />
                <YAxis tick={{ fontSize: 10, fill: "#a1a1aa" }} />
                <Tooltip 
                  formatter={(value: any) => [
                    `₹${Number(value).toLocaleString("en-IN")}`, 
                    "Revenue"
                  ]} 
                  labelStyle={{ fontSize: 11 }} 
                />
                <Line type="monotone" dataKey="revenue" stroke="#D04636" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-amber-500" />
            <h2 className="font-semibold text-zinc-900">Low Stock Alerts</h2>
          </div>
          {loading ? <div className="space-y-2">{Array.from({length:5}).map((_,i) => <div key={i} className="h-10 bg-zinc-100 rounded animate-pulse" />)}</div> :
            stats!.lowStockVariants.length === 0 ? (
              <p className="text-sm text-zinc-400 py-4 text-center">All products are well stocked 🎉</p>
            ) : (
              <div className="space-y-2">
                {stats!.lowStockVariants.map(v => (
                  <div key={v.id} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
                    <div>
                      <p className="text-xs font-medium text-zinc-900 truncate max-w-[140px]">{v.productName}</p>
                      <p className="text-[10px] text-zinc-400">{v.size}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${v.stock === 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                      {v.stock} left
                    </span>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="font-semibold text-zinc-900 mb-4">Top Products</h2>
          {loading ? <div className="space-y-3">{Array.from({length:5}).map((_,i) => <div key={i} className="h-10 bg-zinc-100 rounded animate-pulse" />)}</div> :
            <div className="space-y-3">
              {stats!.topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-zinc-300 w-4">#{i+1}</span>
                  <div className="w-9 h-9 rounded-lg bg-zinc-100 overflow-hidden shrink-0">
                    {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" /> : <Package size={16} className="m-auto mt-2 text-zinc-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-900 truncate">{p.name}</p>
                    <p className="text-[10px] text-zinc-400">{p.orders} orders</p>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
            <h2 className="font-semibold text-zinc-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-[#D04636] hover:underline flex items-center gap-1">View all <ArrowUpRight size={12} /></Link>
          </div>
          {loading ? (
            <table className="w-full"><tbody>{Array.from({length:5}).map((_,i) => <SkeletonRow key={i} />)}</tbody></table>
          ) : allRecent.length === 0 ? (
            <p className="text-center text-sm text-zinc-400 py-10">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-zinc-100 bg-zinc-50">
                  {["Order #","Customer","Type","Amount","Payment","Status"].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr></thead>
                <tbody className="divide-y divide-zinc-100">
                  {allRecent.map(o => (
                    <tr key={o.id} className="hover:bg-zinc-50">
                      <td className="px-5 py-3 font-mono text-xs text-zinc-700">{o.orderNumber}</td>
                      <td className="px-5 py-3 font-medium text-zinc-900 text-xs">{o.customer}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${o.type === "Sample" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>{o.type}</span>
                      </td>
                      <td className="px-5 py-3 text-xs font-medium text-zinc-900">₹{Number(o.amount).toFixed(0)}</td>
                      <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${paymentColors[o.paymentStatus] || "bg-zinc-100 text-zinc-500"}`}>{o.paymentStatus}</span></td>
                      <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors[o.status] || "bg-zinc-100 text-zinc-500"}`}>{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
