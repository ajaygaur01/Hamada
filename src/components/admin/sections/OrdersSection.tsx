"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { Search, Loader2, ChevronDown, ChevronUp, Save } from "lucide-react";

const ORDER_STATUSES = ["pending", "confirmed", "processing", "dispatched", "delivered", "cancelled"];

type SampleOrder = {
  id: string; order_number: string; customer_name: string; business_name: string | null;
  email: string; phone: string; delivery_city: string; pincode: string;
  sample_size: string; amount: number; payment_method: string;
  payment_status: string; order_status: string; tracking_link: string | null;
  notes: string | null; created_at: string; type: string;
  product: { name: string }; variant: { size: string };
};

type BulkOrder = {
  id: string; order_number: string; total_amount: number; subtotal: number;
  payment_method: string; payment_status: string; order_status: string;
  tracking_link: string | null; notes: string | null; created_at: string; type: string;
  user: { full_name: string | null; email: string; phone: string | null; company_name: string | null };
  items: { product_name: string; variant_size: string; quantity: number; unit_price: number; total_price: number }[];
};

export default function OrdersSection() {
  const [tab, setTab] = useState<"sample" | "bulk">("sample");
  const [sampleOrders, setSampleOrders] = useState<SampleOrder[]>([]);
  const [bulkOrders, setBulkOrders] = useState<BulkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<Record<string, string>>({});
  const [editTracking, setEditTracking] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const fetchOrders = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const r = await fetch(`/api/admin/orders?type=${tab}&search=${encodeURIComponent(q)}`);
      const data = await r.json();
      if (tab === "sample") setSampleOrders(data.sampleOrders || []);
      else setBulkOrders(data.bulkOrders || []);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    const t = setTimeout(() => fetchOrders(search), 300);
    return () => clearTimeout(t);
  }, [search, fetchOrders]);

  const handleSaveOrder = async (id: string, type: string) => {
    setSaving(id);
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id, type,
        orderStatus: editStatus[id] || undefined,
        trackingLink: editTracking[id] !== undefined ? editTracking[id] : undefined,
      }),
    });
    await fetchOrders(search);
    setSaving(null);
    setExpandedId(null);
  };

  const orders = tab === "sample" ? sampleOrders : bulkOrders;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Orders</h2>
          <p className="text-zinc-500 text-sm mt-1">Manage sample and bulk orders.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <input type="text" placeholder="Search by order #, name, email..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:border-[#D04636] focus:ring-1 focus:ring-[#D04636] transition-all"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-100 p-1 rounded-xl w-fit">
        <button onClick={() => { setTab("sample"); setSearch(""); }}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "sample" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}>
          Sample Orders
        </button>
        <button onClick={() => { setTab("bulk"); setSearch(""); }}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "bulk" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}>
          Bulk Orders
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-zinc-400" size={28} /></div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-zinc-400">No orders found.</div>
      ) : (
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Order #</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Product</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Payment</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Date</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {orders.map((order: any) => {
                  const isExpanded = expandedId === order.id;
                  const customer = tab === "sample" ? order.customer_name : (order.user?.full_name || order.user?.email);
                  const amount = tab === "sample" ? order.amount : order.total_amount;
                  const product = tab === "sample" ? order.product?.name : order.items?.map((i: any) => i.product_name).join(", ");

                  return (
                    <Fragment key={order.id}>
                      <tr key={order.id} onClick={() => setExpandedId(isExpanded ? null : order.id)}
                        className="hover:bg-zinc-50 transition-colors cursor-pointer">
                        <td className="px-5 py-3 font-mono text-xs text-zinc-700">{order.order_number}</td>
                        <td className="px-5 py-3 text-zinc-900 font-medium">{customer}</td>
                        <td className="px-5 py-3 text-zinc-600 truncate max-w-[160px]">{product}</td>
                        <td className="px-5 py-3 font-medium text-zinc-900">₹{amount?.toFixed(2)}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            order.payment_status === "paid" ? "bg-emerald-100 text-emerald-700" :
                            order.payment_status === "failed" ? "bg-red-100 text-red-700" :
                            "bg-amber-100 text-amber-700"
                          }`}>{order.payment_status}</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            order.order_status === "delivered" ? "bg-emerald-100 text-emerald-700" :
                            order.order_status === "dispatched" ? "bg-blue-100 text-blue-700" :
                            order.order_status === "cancelled" ? "bg-red-100 text-red-700" :
                            "bg-zinc-100 text-zinc-600"
                          }`}>{order.order_status}</span>
                        </td>
                        <td className="px-5 py-3 text-zinc-500 text-xs">
                          {new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-2 py-3 text-zinc-400">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr key={`${order.id}-details`}>
                          <td colSpan={8} className="bg-zinc-50 px-6 py-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="space-y-2">
                                <p className="font-semibold text-zinc-900">Contact</p>
                                <p className="text-zinc-600">
                                  {tab === "sample" ? (
                                    <>{order.email}<br />{order.phone}<br />{order.delivery_city} – {order.pincode}</>
                                  ) : (
                                    <>{order.user?.email}<br />{order.user?.phone || "—"}<br />{order.user?.company_name || "—"}</>
                                  )}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <p className="font-semibold text-zinc-900">Update Status</p>
                                <select value={editStatus[order.id] || order.order_status}
                                  onChange={(e) => setEditStatus(prev => ({ ...prev, [order.id]: e.target.value }))}
                                  className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D04636]">
                                  {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                              </div>
                              <div className="space-y-2">
                                <p className="font-semibold text-zinc-900">Tracking Link</p>
                                <input value={editTracking[order.id] ?? order.tracking_link ?? ""}
                                  onChange={(e) => setEditTracking(prev => ({ ...prev, [order.id]: e.target.value }))}
                                  placeholder="Paste tracking URL"
                                  className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D04636]" />
                              </div>
                            </div>
                            <button onClick={() => handleSaveOrder(order.id, tab)}
                              disabled={saving === order.id}
                              className="mt-4 bg-[#D04636] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#B83C2D] transition-colors flex items-center gap-2 disabled:opacity-50">
                              {saving === order.id ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                              Save Changes
                            </button>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
